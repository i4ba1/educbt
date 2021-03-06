package id.co.knt.cbt.service.impl;

import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;

import com.fasterxml.jackson.databind.ObjectMapper;

import id.co.knt.cbt.model.License;
import id.co.knt.cbt.repositories.LicenseRepo;
import id.co.knt.cbt.service.LicenseService;
import id.co.knt.cbt.util.Constant;
import id.co.knt.cbt.util.MACAddr;
import id.co.knt.cbt.util.RestTemplateUtility;
import id.web.pos.integra.gawl.Gawl;
import id.web.pos.integra.gawl.Gawl.UnknownCharacterException;

@Service("licenseService")
public class LicenseServiceImpl implements LicenseService {

	@Autowired
	private LicenseRepo licenseRepo;

	private RestTemplateUtility rest = new RestTemplateUtility();

	@Value("${helpdesk.url}")
	String baseUrl;

	@Override
	public License createNewLicense(List<Object> objects) {
		License newLicense = null;
		JSONArray arrayJson = new JSONArray(objects);
		JSONObject obj = arrayJson.getJSONObject(0);
		String licenseKey = obj.get("license").toString();

		Gawl gawl = new Gawl();
		License license = null;

		if (licenseRepo.findLicenseByLicenseKey(licenseKey.toLowerCase()) == null) {
			if (gawl.validate(licenseKey.toLowerCase())) {
				try {
					Map<String, Byte> extractResult = gawl.extract(licenseKey.toLowerCase());
					if (extractResult.containsKey(Gawl.TYPE) && extractResult.containsKey(Gawl.MODULE)) {
						byte Type = extractResult.get(Gawl.TYPE);
						Byte seed1 = extractResult.get(Gawl.SEED1);
						Byte seed2 = extractResult.get(Gawl.SEED2);
						String passKey = gawl.pass(seed1, seed2);
						String xlock = gawl.xlock(licenseKey.toLowerCase());
						byte[] macAddr = MACAddr.getMacAddress();

						if (Type == Constant.TYPE) {
							// get passkey and put into textbox
							if (extractResult.get(Gawl.SEED1) == seed1) {
								int numberOfClient = extractResult.get(Gawl.MODULE);
								license = new License(licenseKey.toLowerCase(), passKey, "", System.currentTimeMillis(),
										xlock, macAddr, numberOfClient, 0);

								Map<String, Object> objLicense = rest.serializeLicenseObject(license);

								if (rest.isInternet()) {
									license.setRegisterStatus(1);
									int response = rest.helpDeskAPI().postForObject(baseUrl + Constant.REGISTER,
											objLicense, Integer.class);

									if (response <= 0) {
										newLicense = licenseRepo.save(license);
									}
								} else {// this mean no Internet connection so we save to the local DB
									license.setRegisterStatus(2);
									newLicense = licenseRepo.save(license);
								}

							} else {
								return null;
							}
						} else {
							return null;
						}

					}
				} catch (Exception e) {
					e.printStackTrace();
				}

			}
		}

		return newLicense;
	}

	@Override
	public License readLicense(Integer id) {
		License currentLicense = licenseRepo.findOne(id);
		return currentLicense;
	}

	@Override
	public List<License> licenses() {
		List<License> licenses = licenseRepo.findAll();
		return licenses;
	}

	@Override
	public void deleteLicense(Integer id) {
		licenseRepo.delete(id);
	}

	@Override
	public boolean readLicense(String licenseKey) {
		License l = licenseRepo.findLicenseByLicenseKey(licenseKey.toLowerCase());
		return l == null ? true : false;
	}

	@Override
	public ResponseEntity<License> activateByPhone(List<Object> objects) {
		JSONArray arrayJson = new JSONArray(objects);
		JSONObject obj = arrayJson.getJSONObject(0);
		ObjectMapper mapper = new ObjectMapper();
		License license = null;

		try {
			license = mapper.readValue(obj.get("license").toString(), License.class);
			Gawl gawl = new Gawl();
			if (!license.getActivationKey().equals(gawl.activate(license.getPassKey()))) {
				return new ResponseEntity<License>(license, HttpStatus.EXPECTATION_FAILED);
			}

			license = licenseRepo.saveAndFlush(license);
			if (license == null) {
				return new ResponseEntity<License>(license, HttpStatus.NO_CONTENT);
			} else {
				return new ResponseEntity<License>(license, HttpStatus.OK);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		return new ResponseEntity<License>(license, HttpStatus.NOT_FOUND);
	}

	@Override
	public ResponseEntity<License> createDummy(List<Object> objects) {
		JSONArray arrayJson = new JSONArray(objects);
		JSONObject obj = arrayJson.getJSONObject(0);
		String licenseKey = obj.getString("license");
		String activationKey = obj.getString("activationKey");
		long registerDate = obj.getLong("registerDate");

		Gawl gawl = new Gawl();
		License license = null;

		if (licenseRepo.findLicenseByLicenseKey(licenseKey.toLowerCase()) == null) {
			if (gawl.validate(licenseKey.toLowerCase())) {
				try {
					Map<String, Byte> extractResult = gawl.extract(licenseKey.toLowerCase());
					if (extractResult.containsKey(Gawl.TYPE) && extractResult.containsKey(Gawl.MODULE)) {
						byte Type = extractResult.get(Gawl.TYPE);
						byte seed1 = extractResult.get(Gawl.SEED1);
						byte seed2 = extractResult.get(Gawl.SEED2);
						String passKey = gawl.pass(seed1, seed2);
						String xlock = gawl.xlock(licenseKey.toLowerCase());
						byte[] macAddr = MACAddr.getMacAddress();

						if (Type == Constant.TYPE) {
							// get passkey and put into textbox
							if (extractResult.get(Gawl.SEED1) == seed1) {
								int numberOfClient = extractResult.get(Gawl.MODULE);
								license = new License(licenseKey.toLowerCase(), passKey, activationKey, registerDate,
										xlock, macAddr, numberOfClient, 0);
							} else {
								return new ResponseEntity<License>(license, HttpStatus.NOT_FOUND);
							}
						} else {
							return new ResponseEntity<License>(license, HttpStatus.NOT_FOUND);
						}

					} else {
						return new ResponseEntity<License>(license, HttpStatus.NOT_FOUND);
					}
				} catch (UnknownCharacterException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}

				return new ResponseEntity<License>(license, HttpStatus.OK);

			} else {
				return new ResponseEntity<License>(license, HttpStatus.NOT_FOUND);
			}
		} else {
			return new ResponseEntity<License>(license, HttpStatus.CONFLICT);
		}
	}

	@Override
	public ResponseEntity<License> activateByInternet(List<Object> objects) {
		JSONArray arrayJson = new JSONArray(objects);
		JSONObject obj = arrayJson.getJSONObject(0);
		ObjectMapper mapper = new ObjectMapper();
		License license = null;
		ResponseEntity<License> response = null;
		int registerResponse = 0;

		try {
			license = mapper.readValue(obj.get("license").toString(), License.class);
			License currentLicense = licenseRepo.findOne(license.getId());

			try {
				Map<String, Object> objLicense = rest.serializeLicenseObject(license);

				if (rest.isInternet()) {

					/**
					 * If the SN registered by internet than do activation online, If status is
					 * offline than do registration online
					 */
					if (currentLicense.getRegisterStatus() == 1) {
						response = rest.helpDeskAPI().postForEntity(baseUrl + Constant.ACTIVATE_BY_INTERNET,
								objLicense, License.class);

					} else {
						registerResponse = rest.helpDeskAPI().postForObject(baseUrl + Constant.REGISTER, objLicense,
								Integer.class);

						if (registerResponse <= 0) {
							response = rest.helpDeskAPI()
									.postForEntity(baseUrl + Constant.ACTIVATE_BY_INTERNET, objLicense, License.class);
							
							if (response != null && response.getStatusCode() == HttpStatus.OK) {
								currentLicense.setRegisterStatus(1);
							}
						}
					}
				} else {
					return new ResponseEntity<License>(HttpStatus.SERVICE_UNAVAILABLE);
				}

			} catch (HttpStatusCodeException e) {
				int statusCode = e.getStatusCode().value();
				if (statusCode == HttpStatus.EXPECTATION_FAILED.value()) {
					return new ResponseEntity<License>(license, HttpStatus.EXPECTATION_FAILED);
				} else if (statusCode == HttpStatus.FORBIDDEN.value()) {
					return new ResponseEntity<License>(license, HttpStatus.FORBIDDEN);
				} else if (statusCode == HttpStatus.NOT_ACCEPTABLE.value()) {
					return new ResponseEntity<License>(HttpStatus.NOT_ACCEPTABLE);
				}

			}
			
			if (response != null && response.getStatusCode() == HttpStatus.OK) {
				currentLicense.setActivationKey(response.getBody().getActivationKey());
				currentLicense.setLicenseStatus(true);
				licenseRepo.saveAndFlush(currentLicense);
			}

		} catch (Exception ce) {
			ce.printStackTrace();
			return new ResponseEntity<License>(license, HttpStatus.EXPECTATION_FAILED);
		}

		return response;
	}

	@Override
	public License removeActivationKey(Integer id) {
		License currentLicense = licenseRepo.findOne(id);
		currentLicense.setActivationKey(null);
		licenseRepo.saveAndFlush(currentLicense);

		return null;
	}
}
