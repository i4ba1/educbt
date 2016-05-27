package id.co.knt.cbt.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import id.co.knt.cbt.model.Student;
import id.co.knt.cbt.repositories.StudentRepo;
import id.co.knt.cbt.service.StudentService;

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
	public Student save(Student student) {
		Student newStudent = studentRepo.save(student);
		return newStudent;
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
	public String updateStudent(Student student) {
		Student updatedStudent = studentRepo.saveAndFlush(student);
		return updatedStudent.getFirstName();
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
	public Student importStudent(Student student) {
		Student newStudent = studentRepo.save(student);
		return newStudent;
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