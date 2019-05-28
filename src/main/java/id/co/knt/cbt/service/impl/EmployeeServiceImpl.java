package id.co.knt.cbt.service.impl;

import java.security.SecureRandom;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import id.co.knt.cbt.model.Employee;
import id.co.knt.cbt.model.Employee.Marital;
import id.co.knt.cbt.model.User.Religion;
import id.co.knt.cbt.model.User.Sex;
import id.co.knt.cbt.model.User.UserType;
import id.co.knt.cbt.repositories.EmployeeRepo;
import id.co.knt.cbt.service.EmployeeService;
import id.co.knt.cbt.util.Constant;
import id.co.knt.cbt.util.PasswordUtility;

/**
 * 
 * @author MNI
 *
 */
@Transactional
@Service("teacherService")
public class EmployeeServiceImpl implements EmployeeService {
	
	@Autowired
	EmployeeRepo teacherRepo;
	
	public EmployeeServiceImpl() {
		// TODO Auto-generated constructor stub
	}

	@Override
	public Iterable<Employee> getAllTeacher() {
		Iterable<Employee> teachers = teacherRepo.findAllEmpNotDeleted(false);
		return teachers;
	}

	@Override
	public int save(List<Object> list) {
		JSONArray arrayJson = new JSONArray(list);
		JSONObject obj = arrayJson.getJSONObject(0).getJSONObject("teacher");

		int result = 0;
		Employee teacher = new Employee();
		teacher.setNip(obj.getString("nip"));
		teacher.setEmail(obj.getString("email"));
		teacher.setFirstName(obj.getString("firstName"));
		teacher.setLastName(obj.getString("lastName"));
		teacher.setAddress(obj.getString("address"));
		teacher.setBirthPlace(obj.getString("birthPlace"));
		
		if(teacherRepo.findByNip(teacher.getNip()) != null){
			//Teacher already exist
			result = 2;
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

		try {
			calendar.setTimeInMillis(longBirthDate);
			String strDate = gmtFormat.format(calendar.getTime());
			String[] arr = strDate.split("-");
			/**
			 * Generated password with format YYYYMMDD
			 */
			pass = arr[0] + arr[1] + arr[2];
		} catch (Exception e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}

		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
		teacher.setUserName(Constant.TEACHER_UN_PREF + teacher.getNip());
		teacher.setPassword(PasswordUtility.generatePass(pass));
		teacher.setHashedPassword(PasswordUtility.generateHashPass(pass));
		teacher.setSalt(encoder.encode(saltPattr.concat(pass)));
		teacher.setBirthDate(longBirthDate);
		teacher.setJoiningDate(longJoiningDate);
		teacher.setJobTitle(obj.getString("jobTitle"));
		teacher.setPhone(obj.getString("phone"));
		teacher.setMobilePhone(obj.getString("mobilePhone"));
		teacher.setGender(Sex.valueOf(obj.getString("gender")));
		teacher.setReligion(Religion.valueOf(obj.getString("religion")));
		teacher.setMaritalStatus(Marital.valueOf(obj.getString("maritalStatus")));
		teacher.setEmail(obj.getString("email"));
		teacher.setUserType(UserType.EMPLOYEE);
		teacher.setAdmin(false);
		if(teacherRepo.save(teacher) == null){
			//Mean failed to save
			return 1;
		}

		return result;
	}

	@Override
	public String getByNip(String nip) {
		Employee teacher = teacherRepo.findByNip(nip);
		return teacher.getFirstName()+" "+teacher.getLastName();
	}

	@Override
	public int updateTeacher(List<Object> objects) {
		JSONArray array = new JSONArray(objects);
		JSONObject obj = array.getJSONObject(0).getJSONObject("teacher");
		System.out.println("Updating Teacher " + obj.getString("nip"));

		Employee currentTeacher = teacherRepo.findByNip(obj.getString("nip"));
		if (currentTeacher == null) {
			//The current Teacher not found
			return 1;
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

		if(teacherRepo.saveAndFlush(currentTeacher) == null){
			//Failed to update
			return 2;
		}
		
		return 0;
	}

	@Override
	public Employee getTeacherByNip(String nip) {
		Employee teacher = teacherRepo.findByNip(nip);
		return teacher;
	}

	@Override
	public void delete(Employee teacher) {
		teacherRepo.saveAndFlush(teacher);
	}

	@Override
	public Boolean isTeacherExist(String nip) {
		return getTeacherByNip(nip) != null;
	}

	@Override
	public int importTeacher(List<Object> list) {
		JSONArray array = new JSONArray(list);
		JSONArray data = array.getJSONObject(0).getJSONArray("teachers");
		int result = 0;
		
		if (data.length() > 0) {

			for (int i = 0; i < data.length(); i++) {
				JSONObject obj = data.getJSONObject(i);

				Employee newEmp = new Employee();
				newEmp.setNip(obj.getString("nip"));
				newEmp.setEmail(obj.getString("email"));
				newEmp.setFirstName(obj.getString("firstName"));
				newEmp.setLastName(obj.getString("lastName"));
				newEmp.setJobTitle(obj.getString("jobTitle"));
				newEmp.setAddress(obj.getString("address"));
				newEmp.setBirthPlace(obj.getString("birthPlace"));
				
				if(teacherRepo.findByNip(newEmp.getNip()) != null){
					//Mean it conflict
					result++;
					break;
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
				long bodTimeMillis = 0;
				long jodTimeMillis = 0;

				try {
					String[] arr = strBirthDate.split("/");
					pass = arr[2] + arr[1] + arr[0];
					birthDate = gmtFormat.parse(strBirthDate);
					bodTimeMillis = birthDate.getTime();

					joiningDate = gmtFormat.parse(strJoiningDate);
					jodTimeMillis = joiningDate.getTime();
				} catch (Exception e1) {
					// TODO Auto-generated catch block
					e1.printStackTrace();
				}

				BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
				newEmp.setUserName(Constant.TEACHER_UN_PREF + newEmp.getNip());
				newEmp.setPassword(PasswordUtility.generatePass(pass));
				newEmp.setHashedPassword(PasswordUtility.generateHashPass(pass));
				newEmp.setSalt(encoder.encode(saltPattr.concat(pass)));
				newEmp.setBirthDate(bodTimeMillis);
				newEmp.setJoiningDate(jodTimeMillis);
				newEmp.setPhone(obj.getString("phone"));
				newEmp.setMobilePhone(obj.getString("mobilePhone"));
				newEmp.setGender(Sex.valueOf(obj.getString("gender")));
				newEmp.setReligion(Religion.valueOf(obj.getString("religion")));
				newEmp.setMaritalStatus(Marital.valueOf(obj.getString("maritalStatus")));
				newEmp.setEmail(obj.getString("email"));
				newEmp.setUserType(UserType.EMPLOYEE);
				if(teacherRepo.save(newEmp) == null){
					//Failed to update
					result++;
				}

			}
		}
		
		return result;
	}

	@Override
	public String createHashPassword(String value) {
		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
		return encoder.encode(value);
	}

	private String pattern;
	
	@Override
	public String passwordPattern(String value) {
		long time = System.currentTimeMillis();
    	String strTime = String.valueOf(time).substring(0, 3);
    	pattern = value+strTime;
		return pattern;
	}

	@Override
	public Employee findById(Long id) {
		Employee e = teacherRepo.findOne(id);
		return e;
	}

	@Override
	public Employee findPassByNip(String nip) {
		Employee e = teacherRepo.findByNip(nip);
		
		return e;
	}
}
