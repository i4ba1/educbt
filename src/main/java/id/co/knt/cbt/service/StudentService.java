package id.co.knt.cbt.service;

import id.co.knt.cbt.model.Student;

public interface StudentService {
	Iterable<Student> getAllStudent();

	Student save(Student student);

	String getByNis(String nip);

	Student getStudentByNis(String nis);

	String updateStudent(Student student);

	void delete(Student student);

	Boolean isStudentExist(String nis);

	Student importStudent(Student student);

	String createHashPassword(String value);

	String passwordPattern(String value);
	
	Student findPassByNis(String nis);
}
