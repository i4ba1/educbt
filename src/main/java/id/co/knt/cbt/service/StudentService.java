package id.co.knt.cbt.service;

import java.util.List;

import id.co.knt.cbt.model.Student;

public interface StudentService {
	Iterable<Student> getAllStudent();

	int save(List<Object> objects);

	String getByNis(String nip);

	Student getStudentByNis(String nis);

	int updateStudent(List<Object> objects);

	void delete(Student student);

	Boolean isStudentExist(String nis);

	int importStudent(List<Object> objects);

	String createHashPassword(String value);

	String passwordPattern(String value);
	
	Student findPassByNis(String nis);
}
