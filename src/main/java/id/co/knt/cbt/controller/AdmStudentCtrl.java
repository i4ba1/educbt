package id.co.knt.cbt.controller;

import java.security.SecureRandom;
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
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import id.co.knt.cbt.model.Kelas;
import id.co.knt.cbt.model.Student;
import id.co.knt.cbt.model.User.Religion;
import id.co.knt.cbt.model.User.Sex;
import id.co.knt.cbt.model.User.UserType;
import id.co.knt.cbt.service.KelasService;
import id.co.knt.cbt.service.StudentService;
import id.co.knt.cbt.util.PasswordUtility;

/**
 * 
 * @author MNI
 *
 */
@CrossOrigin(origins="http://localhost:8787")
@RestController
@RequestMapping(value = "/admin/student_mgmt")
public class AdmStudentCtrl {
	private static final Logger LOG = LoggerFactory.getLogger(AdmStudentCtrl.class);
	private static final String STUDENT_UN_PREF = "student_";

	@Autowired
	private StudentService studentService;

	@Autowired
	private KelasService kelasService;

	/**
	 * Get All list student
	 * 
	 * @return
	 */
	@RequestMapping(value = { "", "/{token}" }, method = RequestMethod.GET)
	public ResponseEntity<Iterable<Student>> getAllStudent(@PathVariable("token") String token) {
		Iterable<Student> list = studentService.getAllStudent();

		if (list == null) {
			// You many decide to return HttpStatus.NOT_FOUND
			return new ResponseEntity<Iterable<Student>>(HttpStatus.NOT_FOUND);
		}

		LOG.info("Successfully get all kelas " + "/list/");
		return new ResponseEntity<Iterable<Student>>(list, HttpStatus.OK);
	}

	/**
	 * Retrieve Single Student
	 * 
	 * @param nis
	 * @return
	 */
	@RequestMapping(value = "/find/{token}/{nis}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Student> getStudent(@PathVariable("token") String token, @PathVariable("nis") String nis) {
		LOG.info("Fetching Student with name " + nis);
		Student student = studentService.getStudentByNis(nis);

		if (student == null) {
			LOG.info("Student with name " + nis + " not found");
			return new ResponseEntity<Student>(HttpStatus.NOT_FOUND);
		}

		return new ResponseEntity<Student>(student, HttpStatus.OK);
	}

	/**
	 * Create a student
	 * 
	 * @param student
	 * @return
	 */
	@RequestMapping(value = "/create/", method = RequestMethod.POST)
	public ResponseEntity<Void> createStudent(@RequestBody List<Object> objects) {
		LOG.info("Creating Student " + objects.size());

		HttpHeaders headers = new HttpHeaders();
		JSONArray arrayJson = new JSONArray(objects);
		JSONObject obj = arrayJson.getJSONObject(0).getJSONObject("student");
		JSONObject objKelas = obj.getJSONObject("kelas");
		Kelas k = kelasService.findKelasById(objKelas.getInt("id"));

		Student student = new Student();
		student.setNis(obj.getString("nis"));
		student.setEmail(obj.getString("email"));
		student.setFirstName(obj.getString("firstName"));
		student.setLastName(obj.getString("lastName"));
		student.setAddress(obj.getString("address"));
		student.setBirthPlace(obj.getString("birthPlace"));
		student.setKelas(k);
		
		if(studentService.findPassByNis(student.getNis()) != null){
			return new ResponseEntity<Void>(headers, HttpStatus.CONFLICT);
		}

		SecureRandom random = new SecureRandom();
		byte[] bytes = random.generateSeed(25);
		String saltPattr = new String(bytes);

		Long longBirthDate = obj.getLong("birthDate");

		DateFormat gmtFormat = new SimpleDateFormat("yyyy-MM-dd");
		TimeZone timeZone = TimeZone.getTimeZone("Asia/Jakarta");
		Calendar calendar = Calendar.getInstance();
		gmtFormat.setTimeZone(timeZone);

		Date birthDate = null;
		String pass = "";
		try {
			calendar.setTimeInMillis(longBirthDate);
			String[] arr = gmtFormat.format(calendar.getTime()).split("-");
			pass = arr[0] + arr[1] + arr[2];
			birthDate = gmtFormat.parse(gmtFormat.format(calendar.getTime()));
		} catch (Exception e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}

		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
		student.setUserName(STUDENT_UN_PREF + student.getNis());
		student.setPassword(PasswordUtility.generatePass(pass));
		student.setHashedPassword(PasswordUtility.generateHashPass(pass));
		student.setSalt(encoder.encode(saltPattr.concat(pass)));
		student.setBirthDate(birthDate);
		student.setPhone(obj.getString("phone"));
		student.setMobilePhone(obj.getString("mobilePhone"));
		student.setGender(Sex.valueOf(obj.getString("gender")));
		student.setReligion(Religion.valueOf(obj.getString("religion")));
		student.setEmail(obj.getString("email"));
		student.setUserType(UserType.STUDENT);
		student.setAdmin(false);

		if (studentService.isStudentExist(student.getNis())) {
			System.out.println("A Student with name " + student.getFirstName() + " already exist");
			return new ResponseEntity<Void>(HttpStatus.CONFLICT);
		}

		studentService.save(student);
		return new ResponseEntity<Void>(headers, HttpStatus.CREATED);
	}

	/**
	 * Save import data of student from csv. With json array format
	 * 
	 * @param list
	 * @return
	 */
	@RequestMapping(value = "/import/", method = RequestMethod.POST)
	public ResponseEntity<Void> importStudent(@RequestBody List<Object> list) {

		JSONArray array = new JSONArray(list);
		JSONArray data = array.getJSONObject(0).getJSONArray("students");
		HttpHeaders headers = new HttpHeaders();
		
		if (data.length() > 0) {

			for (int i = 0; i < data.length(); i++) {
				JSONObject obj = data.getJSONObject(i);
				LOG.info("Student================> " + obj.getString("nis"));

				Student newStudent = new Student();
				newStudent.setNis(obj.getString("nis"));
				newStudent.setFirstName(obj.getString("firstName"));
				newStudent.setLastName(obj.getString("lastName"));
				newStudent.setAddress(obj.getString("address"));
				newStudent.setBirthPlace(obj.getString("birthPlace"));
				
				if(studentService.findPassByNis(newStudent.getNis()) != null){
					return new ResponseEntity<Void>(headers, HttpStatus.CONFLICT);
				}

				SecureRandom random = new SecureRandom();
				byte[] bytes = random.generateSeed(25);
				String saltPattr = new String(bytes);

				String pass = "";
				String strBirthDate = obj.getString("birthDate");
				DateFormat gmtFormat = null;
				TimeZone timeZone = TimeZone.getTimeZone("Asia/Jakarta");
				

				Date birthDate = null;
				try {
					String[] arr = null;
					if(strBirthDate.indexOf("/") == -1){
						arr = strBirthDate.split("-");
						gmtFormat = new SimpleDateFormat("yyyy-MM-dd");
						birthDate = gmtFormat.parse(strBirthDate);
						pass = arr[0] + arr[1] + arr[2];
						
					}else{
						arr = strBirthDate.split("/");
						gmtFormat = new SimpleDateFormat("dd/MM/yyyy");
						birthDate = gmtFormat.parse(strBirthDate);
						pass = arr[2] + arr[1] + arr[0];
					}
					
					gmtFormat.setTimeZone(timeZone);
				} catch (Exception e1) {
					// TODO Auto-generated catch block
					e1.printStackTrace();
				}

				BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
				newStudent.setUserName(STUDENT_UN_PREF + newStudent.getNis());
				newStudent.setPassword(PasswordUtility.generatePass(pass));
				newStudent.setHashedPassword(PasswordUtility.generateHashPass(pass));
				newStudent.setSalt(encoder.encode(saltPattr.concat(pass)));
				newStudent.setBirthDate(birthDate);
				newStudent.setPhone(obj.getString("phone"));
				newStudent.setMobilePhone(obj.getString("mobilePhone"));
				newStudent.setGender(Sex.valueOf(obj.getString("gender")));
				newStudent.setReligion(Religion.valueOf(obj.getString("religion")));
				newStudent.setEmail(obj.getString("email"));
				newStudent.setUserType(UserType.STUDENT);

				Kelas kelas = kelasService.findKelasByName(obj.getString("kelas"));
				if(kelas == null){
					kelas = new Kelas(obj.getString("kelas"), new Date());
					kelas = kelasService.save(kelas);
				}
				
				newStudent.setKelas(kelas);
				studentService.importStudent(newStudent);

				try {
					Thread.sleep(1000);
				} catch (Exception e) {
					e.printStackTrace();
				}

			}
		}

		return new ResponseEntity<Void>(headers, HttpStatus.CREATED);
	}

	/**
	 * Update student
	 * 
	 * @param objects
	 * @return
	 */
	@RequestMapping(value = "/update/", method = RequestMethod.PUT)
	public ResponseEntity<Student> updateStudent(@RequestBody List<Object> objects) {
		JSONArray array = new JSONArray(objects);
		JSONObject obj = array.getJSONObject(0).getJSONObject("student");
		JSONObject objKelas = obj.getJSONObject("kelas");
		Kelas k = kelasService.findKelasById(objKelas.getInt("id"));
		
		System.out.println("Updating Teacher " + obj.getString("nis"));
		Student currentStudent = studentService.getStudentByNis(obj.getString("nis"));

		if (currentStudent == null) {
			System.out.println("Teacher with nip " + obj.getString("nip") + " not found");
			return new ResponseEntity<Student>(HttpStatus.NOT_FOUND);
		}

		currentStudent.setNis(obj.getString("nis"));
		currentStudent.setEmail(obj.getString("email"));
		currentStudent.setFirstName(obj.getString("firstName"));
		currentStudent.setLastName(obj.getString("lastName"));
		currentStudent.setAddress(obj.getString("address"));
		currentStudent.setBirthPlace(obj.getString("birthPlace"));
		currentStudent.setKelas(k);

		Long longBirthDate = obj.getLong("birthDate");

		DateFormat gmtFormat = new SimpleDateFormat("yyyy-MM-dd");
		TimeZone timeZone = TimeZone.getTimeZone("Asia/Jakarta");
		Calendar calendar = Calendar.getInstance();
		gmtFormat.setTimeZone(timeZone);

		Date birthDate = null;
		try {
			calendar.setTimeInMillis(longBirthDate);
			birthDate = gmtFormat.parse(gmtFormat.format(calendar.getTime()));
		} catch (Exception e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}

		currentStudent.setBirthDate(birthDate);
		currentStudent.setPhone(obj.getString("phone"));
		currentStudent.setMobilePhone(obj.getString("mobilePhone"));
		currentStudent.setGender(Sex.valueOf(obj.getString("gender")));
		currentStudent.setReligion(Religion.valueOf(obj.getString("religion")));
		currentStudent.setEmail(obj.getString("email"));

		studentService.updateStudent(currentStudent);
		return new ResponseEntity<Student>(currentStudent, HttpStatus.OK);
	}

	/**
	 * Delete student
	 * 
	 * @param token
	 * @param nis
	 * @return
	 */
	@RequestMapping(value = "/delete/{token}/{nis}", method = RequestMethod.DELETE)
	public ResponseEntity<Student> deleteStudent(@PathVariable("token") String token, @PathVariable("nis") String nis) {
		System.out.println("Fetching & Deleting Student with nis " + nis);

		Student student = studentService.getStudentByNis(nis);
		if (student == null) {
			System.out.println("Unable to delete. Student with nip " + nis + " not found");
			return new ResponseEntity<Student>(HttpStatus.NOT_FOUND);
		}

		student.setDeleted(true);
		studentService.delete(student);
		return new ResponseEntity<Student>(HttpStatus.NO_CONTENT);
	}
}
