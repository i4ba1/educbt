package id.co.knt.cbt.service;

import java.util.List;

import id.co.knt.cbt.model.Employee;

/**
 * 
 * @author MNI
 *
 */
public interface EmployeeService {
	Iterable<Employee> getAllTeacher();

	int save(List<Object> list);

	String getByNip(String nip);

	Employee getTeacherByNip(String nip);

	String updateTeacher(Employee teacher);

	void delete(Employee teacher);

	Boolean isTeacherExist(String nip);

	int importTeacher(List<Object> list);
	
	String createHashPassword(String value);
	
	String passwordPattern(String value);
	
	Employee findById(Long id);
	
	Employee findPassByNip(String nip);
}
