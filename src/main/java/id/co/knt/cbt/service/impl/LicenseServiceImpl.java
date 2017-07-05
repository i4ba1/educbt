package id.co.knt.cbt.service.impl;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;

import id.co.knt.cbt.model.License;
import id.co.knt.cbt.repositories.LicenseRepo;
import id.co.knt.cbt.service.LicenseService;
import id.co.knt.cbt.util.Constant;
import id.co.knt.cbt.util.MACAddr;
import id.web.pos.integra.gawl.Gawl;
import id.web.pos.integra.gawl.Gawl.UnknownCharacterException;

@Service("licenseService")
public class LicenseServiceImpl implements LicenseService {

	@Autowired
	private LicenseRepo licenseRepo;

	private RestTemplate helpDeskApi = new RestTemplate();

	@Override
	public License createNewLicense(List<Object> objects) {
		License newLicense = null;
		JSONArray arrayJson = new JSONArray(objects);
		JSONObject obj = arrayJson.getJSONObject(0);
		String licenseKey = obj.get("license").toString();

		Gawl gawl = new Gawl();
		License license = null;

		if (licenseRepo.findLicenseByLicenseKey(licenseKey) == null) {
			if (gawl.validate(licenseKey)) {
				try {
					Map<String, Byte> extractResult = gawl.extract(licenseKey);
					if (extractResult.containsKey(Gawl.TYPE) && extractResult.containsKey(Gawl.MODULE)) {
						byte Type = extractResult.get(Gawl.TYPE);
						byte seed1 = extractResult.get(Gawl.SEED1);
						byte seed2 = extractResult.get(Gawl.SEED2);
						String passKey = gawl.pass(seed1, seed2);
						String xlock = gawl.xlock(licenseKey);
						byte[] macAddr = MACAddr.getMacAddress();

						if (Type == Constant.TYPE) {
							// get passkey and put into textbox
							if (extractResult.get(Gawl.SEED1) == seed1) {
								int numberOfClient = extractResult.get(Gawl.MODULE);
								License response = helpDeskApi.postForObject(Constant.REGISTER, license, License.class);
								if (!response.equals(null)) {
									license = new License(licenseKey, passKey, "", System.currentTimeMillis(), xlock,
											macAddr, numberOfClient);
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
		License l = licenseRepo.findLicenseByLicenseKey(licenseKey);
		return l == null ? true : false;
	}

	@Override
	public ResponseEntity<License> activate(List<Object> objects) {
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

		if (licenseRepo.findLicenseByLicenseKey(licenseKey) == null) {
			if (gawl.validate(licenseKey)) {
				try {
					Map<String, Byte> extractResult = gawl.extract(licenseKey);
					if (extractResult.containsKey(Gawl.TYPE) && extractResult.containsKey(Gawl.MODULE)) {
						byte Type = extractResult.get(Gawl.TYPE);
						byte seed1 = extractResult.get(Gawl.SEED1);
						byte seed2 = extractResult.get(Gawl.SEED2);
						String passKey = gawl.pass(seed1, seed2);
						String xlock = gawl.xlock(licenseKey);
						byte[] macAddr = MACAddr.getMacAddress();

						if (Type == Constant.TYPE) {
							// get passkey and put into textbox
							if (extractResult.get(Gawl.SEED1) == seed1) {
								int numberOfClient = extractResult.get(Gawl.MODULE);
								license = new License(licenseKey, passKey, activationKey, registerDate, xlock, macAddr,
										numberOfClient);
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
	public License activateByInternet(List<Object> objects) {
		JSONArray arrayJson = new JSONArray(objects);
		JSONObject obj = arrayJson.getJSONObject(0);
		ObjectMapper mapper = new ObjectMapper();
		License license = null;

		try {
			license = mapper.readValue(obj.get("license").toString(), License.class);
			License response = helpDeskApi.postForObject(Constant.ACTIVATE_BY_INTERNET, license, License.class);
			if (response != null) {
				license = licenseRepo.saveAndFlush(license);
			}
		} catch (JSONException | IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return license;
	}
}
