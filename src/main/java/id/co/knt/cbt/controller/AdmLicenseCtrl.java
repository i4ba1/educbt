package id.co.knt.cbt.controller;

import id.co.knt.cbt.model.License;
import id.co.knt.cbt.service.LicenseService;
import id.web.pos.integra.gawl.Gawl;
import id.web.pos.integra.gawl.Gawl.UnknownCharacterException;
import org.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins="http://localhost:8787")
@RestController
@RequestMapping(value = "/admin/license")
public class AdmLicenseCtrl {

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

	/**
	 * Create new token
	 * 
	 * @param objects
	 * @return
	 */
	@RequestMapping(value = "/create/", method = RequestMethod.POST)
	public ResponseEntity<Void> addNewLicense(@RequestBody List<Object> objects) {
		HttpHeaders headers = new HttpHeaders();
		JSONArray arrayJson = new JSONArray(objects);
		String licenseKey = arrayJson.getJSONObject(0).getString("license");

		Gawl gawl = new Gawl();
		License license = null;

		if (licenseService.readLicense(licenseKey)) {
			if (gawl.validate(licenseKey)) {
				try {
					Map<String, Byte> extractResult = gawl.extract(licenseKey);
					if (extractResult.containsKey(Gawl.TYPE) && extractResult.containsKey(Gawl.MODULE)) {
						byte Type = extractResult.get(Gawl.TYPE);
						byte seed1 = extractResult.get(Gawl.SEED1);
						
						if (Type == TYPE) {
							//get passkey and put into textbox
							if (extractResult.get(Gawl.SEED1) == seed1) {
								int numberOfLicense = extractResult.get(Gawl.MODULE);
								license = new License(licenseKey, new Date().getTime(), numberOfLicense);
 								licenseService.createNewLicense(license);
							}else{
								return new ResponseEntity<Void>(headers, HttpStatus.NOT_FOUND);
							}
						}else{
							return new ResponseEntity<Void>(headers, HttpStatus.NOT_FOUND);
						}
						
					}else{
						return new ResponseEntity<Void>(headers, HttpStatus.NOT_FOUND);
					}
				} catch (UnknownCharacterException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				
				return new ResponseEntity<Void>(headers, HttpStatus.OK);
				
			} else {
				return new ResponseEntity<Void>(headers, HttpStatus.NOT_FOUND);
			}
		} else {
			return new ResponseEntity<Void>(headers, HttpStatus.CONFLICT);
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
