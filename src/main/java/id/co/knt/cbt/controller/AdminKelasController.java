package id.co.knt.cbt.controller;

import java.util.Date;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;
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

import id.co.knt.cbt.model.Kelas;
import id.co.knt.cbt.repositories.KelasRepo;

/**
 * 
 * @author MNI
 *
 */
@CrossOrigin(origins = "http://localhost:8787")
@RestController
@RequestMapping(value = "/admin/kelas_mgmt")
public class AdminKelasController {
	private static final Logger LOG = LoggerFactory.getLogger(AdminKelasController.class);

	@Autowired
	private KelasRepo kelasRepo;

	/**
	 * Get list of kelas
	 * 
	 * @param token
	 * @return
	 */
	@RequestMapping(value = { "", "/{token}" }, method = RequestMethod.GET)
	public ResponseEntity<Iterable<Kelas>> getAllKelas(@PathVariable String token) {
		Iterable<Kelas> list = kelasRepo.findAllByOrderByClassNameAsc();

		if (list == null) {
			// You many decide to return HttpStatus.NOT_FOUND
			return new ResponseEntity<Iterable<Kelas>>(HttpStatus.NOT_FOUND);
		}

		LOG.info("Successfully get all kelas " + "/list/");
		return new ResponseEntity<Iterable<Kelas>>(list, HttpStatus.OK);
	}

	/**
	 * Find kelas by id
	 * 
	 * @param token
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/find/{token}/{id}", method = RequestMethod.GET)
	public ResponseEntity<Kelas> getKelas(@PathVariable("token") String token, @PathVariable("id") Integer id) {
		LOG.info("Fetching Kelas with name " + id);
		Kelas kls = kelasRepo.findOne(id);

		if (kls == null) {
			LOG.info("Kelas with name " + id + " not found");
			return new ResponseEntity<Kelas>(HttpStatus.NOT_FOUND);
		}

		return new ResponseEntity<Kelas>(kls, HttpStatus.OK);
	}

	/**
	 * Create kelas
	 * 
	 * @param kls
	 * @param ucBuilder
	 * @return
	 */
	@RequestMapping(value = "/create/", method = RequestMethod.POST)
	public ResponseEntity<Void> createKelas(@RequestBody List<Object> objects) {
		LOG.info("Creating Kelas " + objects.size());
		JSONArray array = new JSONArray(objects);
		JSONObject obj = array.getJSONObject(0).getJSONObject("kelas");
		Kelas currKelas = kelasRepo.findByClassName(obj.getString("className"));
		HttpHeaders headers = new HttpHeaders();

		if (currKelas != null) {
			if (currKelas.getClassName().compareTo(obj.getString("className")) == 0 && currKelas.getActivated()) {
				System.out.println("A Kelas with name already exist");
				return new ResponseEntity<Void>(HttpStatus.CONFLICT);
			} else if (currKelas.getClassName().compareTo(obj.getString("className")) == 0
					&& !currKelas.getActivated()) {
				currKelas.setActivated(true);
				currKelas.setCreatedDate(new Date());
				kelasRepo.saveAndFlush(currKelas);
				return new ResponseEntity<Void>(headers, HttpStatus.OK);
			}
		}else{
			Kelas newKelas = new Kelas();
			newKelas.setClassName(obj.getString("className"));
			newKelas.setActivated(true);
			newKelas.setCreatedDate(new Date());
			kelasRepo.save(newKelas);
			return new ResponseEntity<Void>(headers, HttpStatus.OK);
		}

		return new ResponseEntity<Void>(headers, HttpStatus.INTERNAL_SERVER_ERROR);
	}

	/**
	 * Import kelas by csv
	 * 
	 * @param list
	 * @return
	 */
	@RequestMapping(value = "/import/", method = RequestMethod.POST)
	public ResponseEntity<Void> importKelas(@RequestBody List<Object> list) {

		JSONArray array = new JSONArray(list);
		JSONArray data = array.getJSONObject(0).getJSONArray("classes");
		HttpHeaders headers = new HttpHeaders();
		if (list.size() > 0) {

			for (int i = 0; i < data.length(); i++) {
				JSONObject obj = data.getJSONObject(i);
				Kelas existingKelas = kelasRepo.findByClassName(obj.getString("className"));
				if (!obj.getString("className").equals("") && existingKelas == null) {
					Kelas k = new Kelas();
					k.setClassName(obj.getString("className"));
					k.setCreatedDate(new Date());
					k.setActivated(true);
					kelasRepo.save(k);

					try {
						Thread.sleep(1000);
					} catch (Exception e) {
						return new ResponseEntity<Void>(headers, HttpStatus.CONFLICT);
					}
				}else{
					return new ResponseEntity<Void>(headers, HttpStatus.CONFLICT);
				}
			}
		}

		return new ResponseEntity<Void>(headers, HttpStatus.CREATED);
	}

	/**
	 * ------------------- Update a Kelas
	 * --------------------------------------------------------
	 * 
	 * @param id
	 * @param kls
	 * @return
	 */
	@RequestMapping(value = "/update/", method = RequestMethod.PUT)
	public ResponseEntity<Kelas> updateKelas(@RequestBody List<Object> objects) {
		LOG.info("Updating Kelas " + objects.size());
		JSONArray array = new JSONArray(objects);
		JSONObject obj = array.getJSONObject(0).getJSONObject("kelas");

		Kelas currentKelas = kelasRepo.findOne(obj.getInt("id"));
		if (currentKelas == null) {
			return new ResponseEntity<Kelas>(HttpStatus.NOT_FOUND);
		}

		currentKelas.setClassName(obj.getString("className"));
		kelasRepo.saveAndFlush(currentKelas);
		return new ResponseEntity<Kelas>(currentKelas, HttpStatus.OK);
	}

	/**
	 * Delete selected kelas
	 * 
	 * @param token
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/delete/{token}/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<Kelas> deleteKelas(@PathVariable("token") String token, @PathVariable("id") Integer id) {
		System.out.println("Fetching & Deleting Kelas with id " + id);

		Kelas kls = kelasRepo.findOne(id);
		if (kls == null) {
			System.out.println("Unable to delete. Kelas with id " + id + " not found");
			return new ResponseEntity<Kelas>(HttpStatus.NOT_FOUND);
		}

		kls.setActivated(false);
		kelasRepo.saveAndFlush(kls);
		return new ResponseEntity<Kelas>(HttpStatus.NO_CONTENT);
	}
}
