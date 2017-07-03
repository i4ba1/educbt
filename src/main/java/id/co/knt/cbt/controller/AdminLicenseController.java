package id.co.knt.cbt.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import id.co.knt.cbt.model.License;
import id.co.knt.cbt.service.LicenseService;

@CrossOrigin(origins = "http://localhost:8080")
@RestController
@RequestMapping(value = "/admin/license")
public class AdminLicenseController {

	private static final Logger LOG = LoggerFactory.getLogger(AdminLicenseController.class);

	@Autowired
	private LicenseService licenseService;

	/**
	 * Find all token
	 *
	 * @param token
	 * @return
	 */
	@RequestMapping(value = { "", "/{token}" }, method = RequestMethod.GET)
	public ResponseEntity<List<License>> findAllLicense(@PathVariable("token") String token) {
		LOG.info("/token findAllLicense");
		List<License> licenses = licenseService.licenses();

		return licenses.size() > 0 ? new ResponseEntity<List<License>>(licenses, HttpStatus.OK)
				: new ResponseEntity<List<License>>(licenses, HttpStatus.NOT_FOUND);
	}

	@RequestMapping(value = "/dummyCreate/", method = RequestMethod.POST)
	public ResponseEntity<License> dummyCreate(@RequestBody List<Object> objects) {
		LOG.info("/dummyCreate/ RequestMethod.POST dummyCreate");
		return licenseService.createDummy(objects);
	}

	/**
	 * Create new token
	 *
	 * @param objects
	 * @return
	 */
	@RequestMapping(value = "/create/", method = RequestMethod.POST)
	public ResponseEntity<Void> addNewLicense(@RequestBody List<Object> objects) throws Exception {
		LOG.info("/create/ addNewLicense");
		HttpHeaders headers = new HttpHeaders();
		License license = licenseService.createNewLicense(objects);

		if (license == null) {
			return new ResponseEntity<Void>(headers, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		return new ResponseEntity<Void>(headers, HttpStatus.OK);
	}

	/**
	 * Activation by Phone
	 * 
	 * @param objects
	 * @return
	 */
	@RequestMapping(value = "/activate/", method = RequestMethod.POST)
	public ResponseEntity<License> activate(@RequestBody List<Object> objects) {
		LOG.info("/activate/ activate");
		return licenseService.activate(objects);
	}

	/**
	 * Activation by Phone
	 * 
	 * @param objects
	 * @return
	 */
	@RequestMapping(value = "/activateByInternet/", method = RequestMethod.POST)
	public ResponseEntity<License> activateByInternet(@RequestBody List<Object> objects) {
		LOG.info("/activateByInternet/ activateByInternet");
		License license = licenseService.activateByInternet(objects);
		if (license != null) {
			return new ResponseEntity<License>(license, HttpStatus.NOT_FOUND);
		} else {
			return new ResponseEntity<License>(license, HttpStatus.OK);
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
