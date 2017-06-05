package id.co.knt.cbt.controller;

import id.co.knt.cbt.model.License;
import id.co.knt.cbt.service.LicenseService;
import id.co.knt.cbt.util.MACAddr;
import id.web.pos.integra.gawl.Gawl;
import id.web.pos.integra.gawl.Gawl.UnknownCharacterException;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins="http://localhost:8080")
@RestController
@RequestMapping(value = "/admin/license")
public class AdmLicenseController {

	@Autowired
	private LicenseService licenseService;

	private static final byte TYPE = 3;

	/**
	 * Find all token
	 *
	 * @param token
	 * @return
	 */
	@RequestMapping(value = { "", "/{token}" }, method = RequestMethod.GET)
	public ResponseEntity<List<License>> findAllLicense(@PathVariable("token") String token) {
		List<License> licenses = licenseService.licenses();

		return licenses.size() > 0 ? new ResponseEntity<List<License>>(licenses, HttpStatus.OK)
				: new ResponseEntity<List<License>>(licenses, HttpStatus.NOT_FOUND);
	}

	@RequestMapping(value = "/dummyCreate/", method = RequestMethod.POST)
	public ResponseEntity<License> dummyCreate(@RequestBody List<Object> objects) {
		JSONArray arrayJson = new JSONArray(objects);
		JSONObject obj = arrayJson.getJSONObject(0);
		String licenseKey = obj.getString("license");
		String activationKey = obj.getString("activationKey");
		long registerDate = obj.getLong("registerDate");

		Gawl gawl = new Gawl();
		License license = null;

		if (licenseService.readLicense(licenseKey)) {
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

						if (Type == TYPE) {
							//get passkey and put into textbox
							if (extractResult.get(Gawl.SEED1) == seed1) {
								int numberOfClient = extractResult.get(Gawl.MODULE);
								license = new License(licenseKey, passKey, activationKey, registerDate, xlock,  macAddr, numberOfClient);
							}else{
								return new ResponseEntity<License>(license, HttpStatus.NOT_FOUND);
							}
						}else{
							return new ResponseEntity<License>(license, HttpStatus.NOT_FOUND);
						}

					}else{
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

	/**
	 * Create new token
	 *
	 * @param objects
	 * @return
	 */
	@RequestMapping(value = "/create/", method = RequestMethod.POST)
	public ResponseEntity<Void> addNewLicense(@RequestBody List<Object> objects) throws Exception {
		HttpHeaders headers = new HttpHeaders();
		JSONArray arrayJson = new JSONArray(objects);
		JSONObject obj = arrayJson.getJSONObject(0);
		ObjectMapper mapper = new ObjectMapper();
		License license = mapper.readValue(obj.get("license").toString(), License.class);

		license = licenseService.createNewLicense(license);
		if(license == null){
			return new ResponseEntity<Void>(headers, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		return new ResponseEntity<Void >(headers, HttpStatus.OK);
	}

	@RequestMapping(value = "/activate/", method = RequestMethod.POST)
	public ResponseEntity<License> activate(@RequestBody List<Object> objects){
		JSONArray arrayJson = new JSONArray(objects);
		JSONObject obj = arrayJson.getJSONObject(0);
		ObjectMapper mapper = new ObjectMapper();
		License license = null;

		try{
			license = mapper.readValue(obj.get("license").toString(), License.class);
			Gawl gawl = new Gawl();
			if(!license.getActivationKey().equals(gawl.activate(license.getPassKey()))) {
				return new ResponseEntity<License>(license, HttpStatus.EXPECTATION_FAILED);
			}
		}catch(Exception e){
			e.printStackTrace();
		}
		
		License updatedLicense = licenseService.update(license);
		if(updatedLicense == null) {
			return new ResponseEntity<License>(updatedLicense, HttpStatus.NO_CONTENT);
		}else{
			return new ResponseEntity<License>(updatedLicense, HttpStatus.OK) ;
		} 
	}

	/**
	 * Delete selected license
	 *
	 * @param token
	 * @param license
	 * @return
	 */
	@RequestMapping(value = "/delete/{token}/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<Void> deleteLicense(@PathVariable("token") String token, @PathVariable("id") Integer id) {
		HttpHeaders headers = new HttpHeaders();
		License currentLicense = licenseService.readLicense(id);

		if (currentLicense != null) {
			licenseService.deleteLicense(currentLicense.getId());
			return new ResponseEntity<Void>(headers, HttpStatus.OK);
		}

		return new ResponseEntity<Void>(headers, HttpStatus.NOT_FOUND);
	}
}
