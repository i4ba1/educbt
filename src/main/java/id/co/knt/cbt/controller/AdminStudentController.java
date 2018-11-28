package id.co.knt.cbt.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import id.co.knt.cbt.model.Student;
import id.co.knt.cbt.service.StudentService;

/**
 * 
 * @author MNI
 *
 */
//@CrossOrigin(origins="http://localhost:8787")
@RestController
@RequestMapping(value = "/admin/student_mgmt")
public class AdminStudentController {
	private static final Logger LOG = LoggerFactory.getLogger(AdminStudentController.class);

	@Autowired
	private StudentService studentService;

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
	 * Create student
	 * @param objects
	 * @return
	 */
	@RequestMapping(value = "/create/", method = RequestMethod.POST)
	public ResponseEntity<Void> createStudent(@RequestBody List<Object> objects) {
		LOG.info("Creating Student " + objects.size());

		HttpHeaders headers = new HttpHeaders();
		int result = studentService.save(objects);
		if (result == 1) {
			return new ResponseEntity<Void>(headers, HttpStatus.NOT_FOUND);
		}else if(result == 2){
			return new ResponseEntity<Void>(headers, HttpStatus.CONFLICT);
		}
		
		return new ResponseEntity<Void>(headers, HttpStatus.CREATED);
	}

	/**
	 * Save import data of student from csv. With json array format
	 * 
	 * @param list
	 * @return
	 */
	@RequestMapping(value = "/import/", method = RequestMethod.POST)
	public ResponseEntity<Void> importStudent(@RequestBody List<Object> objects) {
		HttpHeaders headers = new HttpHeaders();
		int result = studentService.importStudent(objects);
		if (result == 1) {
			return new ResponseEntity<Void>(headers, HttpStatus.NOT_FOUND);
		}else if(result == 2){
			return new ResponseEntity<Void>(headers, HttpStatus.CONFLICT);
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
		int result = studentService.updateStudent(objects);
		if (result == 1) {
			return new ResponseEntity<Student>(HttpStatus.NOT_FOUND);
		}

		return new ResponseEntity<Student>(HttpStatus.OK);
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
