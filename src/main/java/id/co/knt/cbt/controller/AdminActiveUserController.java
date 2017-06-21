package id.co.knt.cbt.controller;

import java.util.Collection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import id.co.knt.cbt.model.Login;
import id.co.knt.cbt.service.LoginService;

@CrossOrigin(origins="http://localhost:8787")
@RestController
@RequestMapping(value="/admin/activeUser/")
public class AdminActiveUserController {
	
	@Autowired
	private LoginService loginRepo;
	
	/**
	 * List on active users based on token
	 * @return
	 */
	@RequestMapping(value = { "", "/{token}" }, method = RequestMethod.GET)
	public ResponseEntity<Collection<Login>> listOnlineUser(@PathVariable("token") String token){
		Collection<Login> onlineUsers = loginRepo.listOnlineUser();
		
		if(onlineUsers.size() <= 0){
			return new ResponseEntity<Collection<Login>>(onlineUsers, HttpStatus.NOT_FOUND);
		}
		
		return new ResponseEntity<Collection<Login>>(onlineUsers, HttpStatus.OK);
	}
	
	/**
	 * Delete the active user token
	 * @param id
	 * @return
	 */
	@RequestMapping(value="/delete/{token}/{id}", method=RequestMethod.DELETE)
	public ResponseEntity<Void> forcedDeleteActiveUser(@PathVariable("token") String token, @PathVariable("id") Long id){
		Login l = loginRepo.findById(id);
		HttpHeaders headers = new HttpHeaders();
		
		if(l == null){
			return new ResponseEntity<>(headers, HttpStatus.NOT_FOUND);
		}
		loginRepo.deleteToken(l);
		
		return new ResponseEntity<>(headers, HttpStatus.OK);
	}
}
