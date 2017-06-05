package id.co.knt.cbt.controller;

import id.co.knt.cbt.model.User;
import id.co.knt.cbt.service.UserService;
import id.co.knt.cbt.util.PasswordUtility;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.SecureRandom;
import java.util.List;

@CrossOrigin(origins="http://localhost:8787")
@RestController
@RequestMapping(value = "/user/changePass")
public class UserChangePassController {
	
	@Autowired
	private UserService userService;
	
	@RequestMapping(value = "/update/", method = RequestMethod.POST)
	public ResponseEntity<Void> addNewLicense(@RequestBody List<Object> objects) {
		HttpHeaders headers = new HttpHeaders();
		
		JSONArray arrayJson = new JSONArray(objects);
		JSONObject obj = arrayJson.getJSONObject(0).getJSONObject("password");
		String userName = arrayJson.getJSONObject(0).getString("userName");
		
		String oldPass = obj.getString("oldPass");
		String confirmPass = obj.getString("confirmPass");
		String newPass = obj.getString("newPass");
		User u = userService.findUserByUsername(userName);
		
		if(!u.getPassword().equals(PasswordUtility.generatePass(oldPass))){
			return new ResponseEntity<Void>(headers, HttpStatus.NOT_FOUND);
		}else if(!confirmPass.equals(newPass)){
			return new ResponseEntity<Void>(headers, HttpStatus.EXPECTATION_FAILED);
		}else if(PasswordUtility.decodePass(u.getPassword()).equals(newPass)){
			return new ResponseEntity<Void>(headers, HttpStatus.CONFLICT);
		}
		
		SecureRandom random = new SecureRandom();
		byte[] bytes = random.generateSeed(25);
		String saltPattr = new String(bytes);
		
		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
		u.setPassword(PasswordUtility.generatePass(newPass));
		u.setHashedPassword(PasswordUtility.generateHashPass(newPass));
		u.setSalt(encoder.encode(saltPattr.concat(newPass)));
		User updatedUser = userService.addNewUser(u);

		return updatedUser != null ? new ResponseEntity<Void>(headers, HttpStatus.OK)
				: new ResponseEntity<Void>(headers, HttpStatus.NOT_FOUND);
	}
}
