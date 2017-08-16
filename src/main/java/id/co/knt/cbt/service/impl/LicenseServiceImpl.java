package id.co.knt.cbt.service.impl;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
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

	private RestTemplate helpDeskApi = new RestTemplate(getClientHttpRequestFactory());
	
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
								license = new License(licenseKey, passKey, "", System.currentTimeMillis(), xlock,
										macAddr, numberOfClient);
								
								String mapper = serializeLicenseObject(license);

								int response = helpDeskApi.postForObject(baseUrl+Constant.REGISTER, mapper, Integer.class);
								if (response <= 0) {
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
	public Object activateByInternet(List<Object> objects) {
		JSONArray arrayJson = new JSONArray(objects);
		JSONObject obj = arrayJson.getJSONObject(0);
		ObjectMapper mapper = new ObjectMapper();
		License license = null;

		try {
			license = mapper.readValue(obj.get("license").toString(), License.class);
			int count = 0;
			License response = null;

			/**
			 * To hit the helpdesk api activationByInternet 3 times, and if failed it will
			 * hit again until raise of the limit
			 */
			while (count <= 3) {
				try {
					String licenseMapper = serializeLicenseObject(license);
					response = helpDeskApi.postForObject(baseUrl+Constant.ACTIVATE_BY_INTERNET, licenseMapper, License.class);
				} catch (RestClientException e) {
					count++;
				}

				if (count == 0)
					break;
			}

			if (response != null) {
				license.setActivationKey(response.getActivationKey());
				license.setLicenseStatus(true);
				license = licenseRepo.saveAndFlush(license);
			}else {
				return 1;
			}
		} catch (JSONException | IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return license;
	}

	private ClientHttpRequestFactory getClientHttpRequestFactory() {
		int timeout = 7000;
		HttpComponentsClientHttpRequestFactory clientHttpRequestFactory = new HttpComponentsClientHttpRequestFactory();
		clientHttpRequestFactory.setConnectionRequestTimeout(timeout);
		clientHttpRequestFactory.setReadTimeout(timeout);

		return clientHttpRequestFactory;
	}
	
	private String serializeLicenseObject(License license) {
		Map<String, Object> nodeLicense = new HashMap<>();
		nodeLicense.put("id", null);
		nodeLicense.put("license", license.getLicense());
		nodeLicense.put("passkey", license.getPassKey());
		nodeLicense.put("activationKey", null);
		nodeLicense.put("activationLimit", 3);
		nodeLicense.put("numberOfActivation", 0);
		nodeLicense.put("createdDate", license.getCreatedDate());
		nodeLicense.put("xlock", license.getXLock());
		nodeLicense.put("numberOfClient", license.getNumberOfClient());
		nodeLicense.put("schoolName", null);
		nodeLicense.put("product", null);
		ObjectMapper mapper = new ObjectMapper();
		String result = "";
		try {
			result = mapper.writeValueAsString(nodeLicense);
		} catch (JsonProcessingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return result;
	}
}
