package id.co.knt.cbt.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import id.co.knt.cbt.model.Employee;
import id.co.knt.cbt.model.Student;
import id.co.knt.cbt.service.EmployeeService;
import id.co.knt.cbt.service.StudentService;
import id.co.knt.cbt.util.PasswordUtility;

@CrossOrigin(origins="http://localhost:8787")
@RestController
@RequestMapping(value="/forgotPass")
public class AdmForgotPassCtrl {
	
	@Autowired
	private StudentService studentService;
	
	@Autowired
	private EmployeeService employeeService;
	
	@RequestMapping(value="/forgot/{token}/{identity}", method=RequestMethod.GET)
	public ResponseEntity<String> getUserPass(@PathVariable("token") String token, @PathVariable("identity") String identity){
		HttpStatus status = HttpStatus.NOT_FOUND;
		
		if (studentService.findPassByNis(identity) != null) {
			Student s = studentService.findPassByNis(identity);
			status = HttpStatus.OK;
			return new ResponseEntity<String>(PasswordUtility.decodePass(s.getPassword()), status);
		}
		
		if (employeeService.findPassByNip(identity) != null) {
			Employee e = employeeService.findPassByNip(identity);
			status = HttpStatus.OK;
			return new ResponseEntity<String>(PasswordUtility.decodePass(e.getPassword()), status);
		}
		
		return new ResponseEntity<String>("", status);
	}
}
