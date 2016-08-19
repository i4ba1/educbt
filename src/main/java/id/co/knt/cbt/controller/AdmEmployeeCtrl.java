package id.co.knt.cbt.controller;

import id.co.knt.cbt.model.Employee;
import id.co.knt.cbt.model.User.Religion;
import id.co.knt.cbt.model.User.Sex;
import id.co.knt.cbt.model.User.UserType;
import id.co.knt.cbt.service.EmployeeService;
import id.co.knt.cbt.util.PasswordUtility;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.SecureRandom;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;

/**
 *
 * @author Muhamad Nizar Iqbal
 *
 */
@CrossOrigin(origins="http://localhost:8787")
@RestController
@RequestMapping(value = "/admin/teacher_mgmt")
public class AdmEmployeeCtrl {
	private static final Logger LOG = LoggerFactory.getLogger(AdmEmployeeCtrl.class);
	private static final String TEACHER_UN_PREF = "teacher_";

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
	 * -------------------Create a Teacher---------------
	 *
	 * @param teacher
	 * @return
	 */
	@RequestMapping(value = "/create/", method = RequestMethod.POST)
	public ResponseEntity<Void> createTeacher(@RequestBody List<Object> objects) {
		JSONArray arrayJson = new JSONArray(objects);
		JSONObject obj = arrayJson.getJSONObject(0).getJSONObject("teacher");
		HttpHeaders headers = new HttpHeaders();

		Employee teacher = new Employee();
		teacher.setNip(obj.getString("nip"));
		teacher.setEmail(obj.getString("email"));
		teacher.setFirstName(obj.getString("firstName"));
		teacher.setLastName(obj.getString("lastName"));
		teacher.setAddress(obj.getString("address"));
		teacher.setBirthPlace(obj.getString("birthPlace"));
		
		if(employeeService.findPassByNip(teacher.getNip()) != null){
			return new ResponseEntity<Void>(headers, HttpStatus.CONFLICT);
		}

		SecureRandom random = new SecureRandom();
		byte[] bytes = random.generateSeed(25);
		String saltPattr = new String(bytes);

		String pass = "";
		Long longBirthDate = obj.getLong("birthDate");
		Long longJoiningDate = obj.getLong("joiningDate");

		DateFormat gmtFormat = new SimpleDateFormat("yyyy-MM-dd");

		TimeZone timeZone = TimeZone.getTimeZone("Asia/Jakarta");
		Calendar calendar = Calendar.getInstance();
		gmtFormat.setTimeZone(timeZone);

		Date birthDate = null;
		Date joiningDate = null;

		try {
			calendar.setTimeInMillis(longBirthDate);
			String strDate = gmtFormat.format(calendar.getTime());
			String[] arr = strDate.split("-");
			pass = arr[0] + arr[1] + arr[2];
			birthDate = gmtFormat.parse(strDate);

			calendar.setTimeInMillis(longJoiningDate);
			joiningDate = gmtFormat.parse(gmtFormat.format(calendar.getTime()));
		} catch (Exception e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}

		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
		teacher.setUserName(TEACHER_UN_PREF + teacher.getNip());
		teacher.setPassword(PasswordUtility.generatePass(pass));
		teacher.setHashedPassword(PasswordUtility.generateHashPass(pass));
		teacher.setSalt(encoder.encode(saltPattr.concat(pass)));
		teacher.setBirthDate(birthDate);
		teacher.setJoiningDate(joiningDate);
		teacher.setJobTitle(obj.getString("jobTitle"));
		teacher.setPhone(obj.getString("phone"));
		teacher.setMobilePhone(obj.getString("mobilePhone"));
		teacher.setGender(Sex.valueOf(obj.getString("gender")));
		teacher.setReligion(Religion.valueOf(obj.getString("religion")));
		teacher.setEmail(obj.getString("email"));
		teacher.setUserType(UserType.EMPLOYEE);
		teacher.setAdmin(false);

		if (employeeService.isTeacherExist(teacher.getNip())) {
			System.out.println("A Teacher with name " + teacher.getFirstName() + " already exist");
			return new ResponseEntity<Void>(HttpStatus.CONFLICT);
		}

		employeeService.save(teacher);
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

		JSONArray array = new JSONArray(list);
		JSONArray data = array.getJSONObject(0).getJSONArray("teachers");
		HttpHeaders headers = new HttpHeaders();
		
		if (data.length() > 0) {

			for (int i = 0; i < data.length(); i++) {
				JSONObject obj = data.getJSONObject(i);
				LOG.info("Employee================> " + obj.getString("nip"));

				Employee newEmp = new Employee();
				newEmp.setNip(obj.getString("nip"));
				newEmp.setEmail(obj.getString("email"));
				newEmp.setFirstName(obj.getString("firstName"));
				newEmp.setLastName(obj.getString("lastName"));
				newEmp.setAddress(obj.getString("address"));
				newEmp.setBirthPlace(obj.getString("birthPlace"));
				
				if(employeeService.findPassByNip(newEmp.getNip()) != null){
					return new ResponseEntity<Void>(headers, HttpStatus.CONFLICT);
				}

				SecureRandom random = new SecureRandom();
				byte[] bytes = random.generateSeed(25);
				String saltPattr = new String(bytes);

				String pass = "";
				String strBirthDate = obj.getString("birthDate");
				String strJoiningDate = obj.getString("joiningDate");

				DateFormat gmtFormat = new SimpleDateFormat("dd/MM/yyyy");

				TimeZone timeZone = TimeZone.getTimeZone("Asia/Jakarta");
				gmtFormat.setTimeZone(timeZone);

				Date birthDate = null;
				Date joiningDate = null;

				try {
					//calendar.setTimeInMillis(longBirthDate);
					//String strDate = gmtFormat.format(calendar.getTime());
					String[] arr = strBirthDate.split("/");
					pass = arr[2] + arr[1] + arr[0];
					birthDate = gmtFormat.parse(strBirthDate);

					//calendar.setTimeInMillis(longJoiningDate);
					joiningDate = gmtFormat.parse(strJoiningDate);
				} catch (Exception e1) {
					// TODO Auto-generated catch block
					e1.printStackTrace();
				}

				BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
				newEmp.setUserName(TEACHER_UN_PREF + newEmp.getNip());
				newEmp.setPassword(PasswordUtility.generatePass(pass));
				newEmp.setHashedPassword(PasswordUtility.generateHashPass(pass));
				newEmp.setSalt(encoder.encode(saltPattr.concat(pass)));
				newEmp.setBirthDate(birthDate);
				newEmp.setJoiningDate(joiningDate);
				newEmp.setPhone(obj.getString("phone"));
				newEmp.setMobilePhone(obj.getString("mobilePhone"));
				newEmp.setGender(Sex.valueOf(obj.getString("gender")));
				newEmp.setReligion(Religion.valueOf(obj.getString("religion")));
				newEmp.setEmail(obj.getString("email"));
				newEmp.setUserType(UserType.EMPLOYEE);
				employeeService.save(newEmp);

				try {
					Thread.sleep(1000);
				} catch (Exception e) {
					e.printStackTrace();
				}

			}
		}

		LOG.info("Import Teacher Successfully");
		return new ResponseEntity<Void>(headers, HttpStatus.CREATED);
	}

	/**
	 * Update teacher data
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

		try {
			calendar.setTimeInMillis(longBirthDate);
			birthDate = gmtFormat.parse(gmtFormat.format(calendar.getTime()));

			calendar.setTimeInMillis(longJoiningDate);
			joiningDate = gmtFormat.parse(gmtFormat.format(calendar.getTime()));
		} catch (Exception e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}

		currentTeacher.setBirthDate(birthDate);
		currentTeacher.setJoiningDate(joiningDate);
		currentTeacher.setJobTitle(obj.getString("jobTitle"));
		currentTeacher.setPhone(obj.getString("phone"));
		currentTeacher.setMobilePhone(obj.getString("mobilePhone"));
		currentTeacher.setGender(Sex.valueOf(obj.getString("gender")));
		currentTeacher.setReligion(Religion.valueOf(obj.getString("religion")));
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
