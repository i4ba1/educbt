package id.co.knt.cbt.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import id.co.knt.cbt.model.Employee;
import id.co.knt.cbt.repositories.EmployeeRepo;
import id.co.knt.cbt.service.EmployeeService;

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
	
	public EmployeeServiceImpl(EmployeeRepo teacherRepo) {
		this.teacherRepo = teacherRepo;
	}

	@Override
	public Iterable<Employee> getAllTeacher() {
		Iterable<Employee> teachers = teacherRepo.findAllEmpNotDeleted(false);
		return teachers;
	}

	@Override
	public Employee save(Employee teacher) {
		Employee result = teacherRepo.save(teacher);
		return result;
	}

	@Override
	public String getByNip(String nip) {
		Employee teacher = teacherRepo.findByNip(nip);
		return teacher.getFirstName()+" "+teacher.getLastName();
	}

	@Override
	public String updateTeacher(Employee teacher) {
		Employee result = teacherRepo.saveAndFlush(teacher);
		return result.getFirstName()+" "+result.getLastName();
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
	public Employee importTeacher(Employee teacher) {
		Employee newTeacher = teacherRepo.save(teacher);
		return newTeacher;
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
		Employee e = teacherRepo.findPassByNip(nip);
		
		return e;
	}
}
