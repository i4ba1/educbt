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

import id.co.knt.cbt.model.Kelas;
import id.co.knt.cbt.model.Student;
import id.co.knt.cbt.model.User.Religion;
import id.co.knt.cbt.model.User.Sex;
import id.co.knt.cbt.model.User.UserType;
import id.co.knt.cbt.repositories.KelasRepo;
import id.co.knt.cbt.repositories.StudentRepo;
import id.co.knt.cbt.service.StudentService;
import id.co.knt.cbt.util.Constant;
import id.co.knt.cbt.util.PasswordUtility;

/**
 * 
 * @author MNI
 *
 */
@Transactional
@Service("studentService")
public class StudentServiceImpl implements StudentService {

	@Autowired
	private StudentRepo studentRepo;
	
	@Autowired
	private KelasRepo kelasRepo;

	public StudentServiceImpl() {

	}

	public StudentServiceImpl(StudentRepo studentRepo) {
		super();
		this.studentRepo = studentRepo;
	}

	@Override
	public Iterable<Student> getAllStudent() {
		Iterable<Student> students = studentRepo.findAllStudNotDeleted(false);
		return students;
	}

	@Override
	public int save(List<Object> objects) {
		JSONArray arrayJson = new JSONArray(objects);
		JSONObject obj = arrayJson.getJSONObject(0).getJSONObject("student");
		JSONObject objKelas = obj.getJSONObject("kelas");
		Kelas k = kelasRepo.findOne(objKelas.getInt("id"));

		Student newStudent = new Student();
		newStudent.setNis(obj.getString("nis"));
		newStudent.setEmail(obj.getString("email"));
		newStudent.setFirstName(obj.getString("firstName"));
		newStudent.setLastName(obj.getString("lastName"));
		newStudent.setAddress(obj.getString("address"));
		newStudent.setBirthPlace(obj.getString("birthPlace"));
		newStudent.setKelas(k);
		
		if(studentRepo.findPassByNis(newStudent.getNis()) != null){
			return 2;
		}

		SecureRandom random = new SecureRandom();
		byte[] bytes = random.generateSeed(25);
		String saltPattr = new String(bytes);

		Long longBirthDate = obj.getLong("birthDate");

		DateFormat gmtFormat = new SimpleDateFormat("yyyy-MM-dd");
		TimeZone timeZone = TimeZone.getTimeZone("Asia/Jakarta");
		Calendar calendar = Calendar.getInstance();
		gmtFormat.setTimeZone(timeZone);

		String pass = "";
		try {
			calendar.setTimeInMillis(longBirthDate);
			String[] arr = gmtFormat.format(calendar.getTime()).split("-");
			pass = arr[0] + arr[1] + arr[2];
		} catch (Exception e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}

		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
		newStudent.setUserName(Constant.STUDENT_UN_PREF + newStudent.getNis());
		newStudent.setPassword(PasswordUtility.generatePass(pass));
		newStudent.setHashedPassword(PasswordUtility.generateHashPass(pass));
		newStudent.setSalt(encoder.encode(saltPattr.concat(pass)));
		newStudent.setBirthDate(longBirthDate);
		newStudent.setPhone(obj.getString("phone"));
		newStudent.setMobilePhone(obj.getString("mobilePhone"));
		newStudent.setGender(Sex.valueOf(obj.getString("gender")));
		newStudent.setReligion(Religion.valueOf(obj.getString("religion")));
		newStudent.setEmail(obj.getString("email"));
		newStudent.setUserType(UserType.STUDENT);
		newStudent.setAdmin(false);

		if(studentRepo.save(newStudent) == null){
			return 1;
		}
		
		return 0;
	}

	@Override
	public String getByNis(String nis) {
		Student student = studentRepo.findByNis(nis);
		return student.getFirstName() + " " + student.getLastName();
	}

	@Override
	public Student getStudentByNis(String nis) {
		Student student = studentRepo.findByNis(nis);
		return student;
	}

	@Override
	public int updateStudent(List<Object> objects) {
		JSONArray array = new JSONArray(objects);
		JSONObject obj = array.getJSONObject(0).getJSONObject("student");
		JSONObject objKelas = obj.getJSONObject("kelas");
		Kelas k = kelasRepo.findOne(objKelas.getInt("id"));
		
		Student currentStudent = studentRepo.findByNis(obj.getString("nis"));
		if (currentStudent == null) {
			return 1;
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
		long bodTimeMillis = 0;
		try {
			calendar.setTimeInMillis(longBirthDate);
			birthDate = gmtFormat.parse(gmtFormat.format(calendar.getTime()));
			bodTimeMillis = birthDate.getTime();
		} catch (Exception e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}

		currentStudent.setBirthDate(bodTimeMillis);
		currentStudent.setPhone(obj.getString("phone"));
		currentStudent.setMobilePhone(obj.getString("mobilePhone"));
		currentStudent.setGender(Sex.valueOf(obj.getString("gender")));
		currentStudent.setReligion(Religion.valueOf(obj.getString("religion")));
		currentStudent.setEmail(obj.getString("email"));
		Student updatedStudent = studentRepo.saveAndFlush(currentStudent);
		if (updatedStudent == null) {
			return 1;
		}
		
		return 0;
	}

	@Override
	public void delete(Student student) {
		studentRepo.saveAndFlush(student);
	}

	@Override
	public Boolean isStudentExist(String nis) {
		Student existStudent = studentRepo.findByNis(nis);
		return existStudent != null;
	}

	@Override
	public int importStudent(List<Object> objects) {
		JSONArray array = new JSONArray(objects);
		JSONArray data = array.getJSONObject(0).getJSONArray("students");
		
		if (data.length() > 0) {

			for (int i = 0; i < data.length(); i++) {
				JSONObject obj = data.getJSONObject(i);

				Student newStudent = new Student();
				newStudent.setNis(obj.getString("nis"));
				newStudent.setFirstName(obj.getString("firstName"));
				newStudent.setLastName(obj.getString("lastName"));
				newStudent.setAddress(obj.getString("address"));
				newStudent.setBirthPlace(obj.getString("birthPlace"));
				
				if(studentRepo.findPassByNis(newStudent.getNis()) != null){
					return 2;
				}

				SecureRandom random = new SecureRandom();
				byte[] bytes = random.generateSeed(25);
				String saltPattr = new String(bytes);

				String pass = "";
				String strBirthDate = obj.getString("birthDate");
				DateFormat gmtFormat = null;
				TimeZone timeZone = TimeZone.getTimeZone("Asia/Jakarta");
				

				Date birthDate = null;
				long bodTimeMillis = 0;
				try {
					String[] arr = null;
					if(!strBirthDate.contains("/")){
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
					bodTimeMillis = birthDate.getTime();
				} catch (Exception e1) {
					// TODO Auto-generated catch block
					e1.printStackTrace();
				}

				BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
				newStudent.setUserName(Constant.STUDENT_UN_PREF + newStudent.getNis());
				newStudent.setPassword(PasswordUtility.generatePass(pass));
				newStudent.setHashedPassword(PasswordUtility.generateHashPass(pass));
				newStudent.setSalt(encoder.encode(saltPattr.concat(pass)));
				newStudent.setBirthDate(bodTimeMillis);
				newStudent.setPhone(obj.getString("phone"));
				newStudent.setMobilePhone(obj.getString("mobilePhone"));
				newStudent.setGender(Sex.valueOf(obj.getString("gender")));
				newStudent.setReligion(Religion.valueOf(obj.getString("religion")));
				newStudent.setEmail(obj.getString("email"));
				newStudent.setUserType(UserType.STUDENT);

				Kelas kelas = kelasRepo.findByClassName(obj.getString("kelas"));
				if(kelas == null){
					kelas = new Kelas(obj.getString("kelas"), new Date());
					kelas = kelasRepo.save(kelas);
				}
				
				newStudent.setKelas(kelas);
				if(studentRepo.save(newStudent) == null){
					return 1;
				}
			}
			
			return 1;
		}
		
		return 0;
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
	public Student findPassByNis(String nis) {
		Student s = studentRepo.findPassByNis(nis);
		
		return s;
	}
	
}