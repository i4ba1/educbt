package id.co.knt.cbt.controller;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;

import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import id.co.knt.cbt.model.Employee;
import id.co.knt.cbt.model.Employee.Marital;
import id.co.knt.cbt.model.User.Religion;
import id.co.knt.cbt.model.User.Sex;
import id.co.knt.cbt.service.EmployeeService;

/**
 *
 * @author Muhamad Nizar Iqbal
 *
 */
@CrossOrigin(origins = "http://localhost:8787")
@RestController
@RequestMapping(value = "/admin/teacher_mgmt")
public class AdmEmployeeController {
	private static final Logger LOG = LoggerFactory.getLogger(AdmEmployeeController.class);

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
		if (employeeService.save(objects) > 0) {
			return new ResponseEntity<Void>(headers, HttpStatus.CONFLICT);
		}

		return new ResponseEntity<Void>(headers, HttpStatus.CREATED);
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
	public ResponseEntity<Employee> updateTeacher(@RequestBody List<Object> objects) {
		JSONArray array = new JSONArray(objects);
		JSONObject obj = array.getJSONObject(0).getJSONObject("teacher");
		System.out.println("Updating Teacher " + obj.getString("nip"));

		Employee currentTeacher = employeeService.getTeacherByNip(obj.getString("nip"));

		if (currentTeacher == null) {
			System.out.println("Teacher with nip " + obj.getString("nip") + " not found");
			return new ResponseEntity<Employee>(HttpStatus.NOT_FOUND);
		}

		currentTeacher.setNip(obj.getString("nip"));
		currentTeacher.setEmail(obj.getString("email"));
		currentTeacher.setFirstName(obj.getString("firstName"));
		currentTeacher.setLastName(obj.getString("lastName"));
		currentTeacher.setAddress(obj.getString("address"));
		currentTeacher.setBirthPlace(obj.getString("birthPlace"));
		currentTeacher.setActive(obj.getBoolean("active"));

		Long longBirthDate = obj.getLong("birthDate");
		Long longJoiningDate = obj.getLong("joiningDate");

		DateFormat gmtFormat = new SimpleDateFormat("yyyy-MM-dd");

		TimeZone timeZone = TimeZone.getTimeZone("Asia/Jakarta");
		Calendar calendar = Calendar.getInstance();
		gmtFormat.setTimeZone(timeZone);

		Date birthDate = null;
		Date joiningDate = null;

		long bodTimeMillis = 0;
		long jodTimeMillis = 0;

		try {
			calendar.setTimeInMillis(longBirthDate);
			birthDate = gmtFormat.parse(gmtFormat.format(calendar.getTime()));
			bodTimeMillis = birthDate.getTime();

			calendar.setTimeInMillis(longJoiningDate);
			joiningDate = gmtFormat.parse(gmtFormat.format(calendar.getTime()));
			jodTimeMillis = joiningDate.getTime();
		} catch (Exception e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}

		currentTeacher.setBirthDate(bodTimeMillis);
		currentTeacher.setJoiningDate(jodTimeMillis);
		currentTeacher.setJobTitle(obj.getString("jobTitle"));
		currentTeacher.setPhone(obj.getString("phone"));
		currentTeacher.setMobilePhone(obj.getString("mobilePhone"));
		currentTeacher.setGender(Sex.valueOf(obj.getString("gender")));
		currentTeacher.setReligion(Religion.valueOf(obj.getString("religion")));
		currentTeacher.setMaritalStatus(Marital.valueOf(obj.getString("maritalStatus")));
		currentTeacher.setEmail(obj.getString("email"));

		employeeService.updateTeacher(currentTeacher);
		return new ResponseEntity<Employee>(currentTeacher, HttpStatus.OK);
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
