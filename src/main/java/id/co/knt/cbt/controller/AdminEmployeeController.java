package id.co.knt.cbt.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import id.co.knt.cbt.model.Employee;
import id.co.knt.cbt.service.EmployeeService;

/**
 *
 * @author Muhamad Nizar Iqbal
 *
 */
//@CrossOrigin(origins = "http://localhost:8787")
@RestController
@RequestMapping(value = "/admin/teacher_mgmt")
public class AdminEmployeeController {
	private static final Logger LOG = LoggerFactory.getLogger(AdminEmployeeController.class);

	@Autowired
	private EmployeeService employeeService;

	/**
	 * get All list teacher
	 *
	 * @return
	 */
	@RequestMapping(value = { "", "/{token}" }, method = RequestMethod.GET)
	public ResponseEntity<Iterable<Employee>> getAllTeacher(@PathVariable("token") String token) {
		Iterable<Employee> list = employeeService.getAllTeacher();

		if (list == null) {
			// You many decide to return HttpStatus.NOT_FOUND
			return new ResponseEntity<Iterable<Employee>>(HttpStatus.NOT_FOUND);
		}

		LOG.info("Successfully get all kelas " + "/list/");
		return new ResponseEntity<Iterable<Employee>>(list, HttpStatus.OK);
	}

	/**
	 * Retrieve single teacher
	 * 
	 * @param nip
	 * @return
	 */
	@RequestMapping(value = "/find/{token}/{nip}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Employee> getTeacher(@PathVariable("token") String token, @PathVariable("nip") String nip) {
		LOG.info("Fetching Teacher with name " + nip);
		Employee teacher = employeeService.getTeacherByNip(nip);

		if (teacher == null) {
			LOG.info("Teacher with name " + nip + " not found");
			return new ResponseEntity<Employee>(HttpStatus.NOT_FOUND);
		}

		return new ResponseEntity<Employee>(teacher, HttpStatus.OK);
	}

	/**
	 * Create new teacher
	 * 
	 * @param objects
	 * @return
	 */
	@RequestMapping(value = "/create/", method = RequestMethod.POST)
	public ResponseEntity<Void> createTeacher(@RequestBody List<Object> objects) {
		HttpHeaders headers = new HttpHeaders();
		ResponseEntity<Void> response;
		try {
			int result = employeeService.save(objects);
			if (result == 1) {
				response = new ResponseEntity<Void>(headers, HttpStatus.NOT_FOUND);
			} else {
				response = new ResponseEntity<Void>(headers, HttpStatus.CREATED);
			}
		} catch (DataIntegrityViolationException e) {
			response = new ResponseEntity<Void>(headers, HttpStatus.CONFLICT);
		}

		return response;
	}

	/**
	 * Save import data of teacher from csv. With json array format
	 *
	 * @param list
	 * @return
	 */
	@RequestMapping(value = "/import/", method = RequestMethod.POST)
	public ResponseEntity<Void> importTeacher(@RequestBody List<Object> list) {
		LOG.info("Import Teacher " + list.size());

		HttpHeaders headers = new HttpHeaders();
		if (employeeService.importTeacher(list) > 0) {
			return new ResponseEntity<Void>(headers, HttpStatus.CONFLICT);
		}

		LOG.info("Import Teacher Successfully");
		return new ResponseEntity<Void>(headers, HttpStatus.CREATED);
	}

	/**
	 * Update teacher data
	 * 
	 * @param objects
	 * @return
	 */
	@RequestMapping(value = "/update/", method = RequestMethod.PUT)
	public ResponseEntity<Void> updateTeacher(@RequestBody List<Object> objects) {
		int result = employeeService.updateTeacher(objects);
		HttpHeaders header = new HttpHeaders();

		if (result == 1) {
			return new ResponseEntity<Void>(header, HttpStatus.NOT_FOUND);
		} else if (result == 2) {
			return new ResponseEntity<Void>(header, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		return new ResponseEntity<Void>(header, HttpStatus.OK);
	}

	/**
	 * ------------------- Delete a Teacher---------------------
	 *
	 * @param nip
	 * @return
	 */
	@RequestMapping(value = "/delete/{token}/{nip}", method = RequestMethod.DELETE)
	public ResponseEntity<Employee> deleteTeacher(@PathVariable("token") String token,
			@PathVariable("nip") String nip) {
		System.out.println("Fetching & Deleting Teacher with nip " + nip);

		Employee teacher = employeeService.getTeacherByNip(nip);
		if (teacher == null) {
			System.out.println("Unable to delete. Teacher with nip " + nip + " not found");
			return new ResponseEntity<Employee>(HttpStatus.NOT_FOUND);
		}

		teacher.setDeleted(true);
		employeeService.delete(teacher);
		return new ResponseEntity<Employee>(HttpStatus.NO_CONTENT);
	}
}
