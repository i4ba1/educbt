package id.co.knt.cbt.service;

import id.co.knt.cbt.model.Employee;
import id.co.knt.cbt.model.Student;

/**
 * 
 * @author MNI
 *
 */
public interface EmployeeService {
	Iterable<Employee> getAllTeacher();

	Employee save(Employee teacher);

	String getByNip(String nip);

	Employee getTeacherByNip(String nip);

	String updateTeacher(Employee teacher);

	void delete(Employee teacher);

	Boolean isTeacherExist(String nip);

	Employee importTeacher(Employee teacher);
	
	String createHashPassword(String value);
	
	String passwordPattern(String value);
	
	Employee findById(Long id);
	
	Employee findPassByNip(String nip);
}
