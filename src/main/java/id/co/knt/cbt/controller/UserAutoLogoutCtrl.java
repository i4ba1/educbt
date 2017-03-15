package id.co.knt.cbt.controller;

import java.util.List;
import java.util.concurrent.BlockingQueue;

import org.json.JSONArray;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import id.co.knt.cbt.model.Login;
import id.co.knt.cbt.service.LoginService;
import id.co.knt.cbt.util.UserLoginQueue;

@CrossOrigin(origins="http://localhost:8787")
@RestController
@RequestMapping(value = "/user/closeHandle")
public class UserAutoLogoutCtrl {

	private static final Logger LOG = LoggerFactory.getLogger(UserAutoLogoutCtrl.class);

	@Autowired
	private LoginService loginService;

	@RequestMapping(value = "/forcedLogOut/", method = RequestMethod.POST)
	public ResponseEntity<Void> autoLogout(@RequestBody List<Object> objects) {
		LOG.info("/forcedLogOut/ autoLogout method");
		JSONArray array = new JSONArray(objects);
		boolean deleted = array.getJSONObject(0).getBoolean("deleted");
		HttpHeaders headers = new HttpHeaders();
		
		if(!array.getJSONObject(0).has("authorization")){
			return new ResponseEntity<Void>(headers, HttpStatus.GONE);
		}
		
		String token = array.getJSONObject(0).getString("authorization");
		Login l = loginService.findByToken(token);
		UserLoginQueue loginQueue = UserLoginQueue.getInstance();
		
		if (deleted) {
			if (l != null) {
				BlockingQueue<Login> blockingQueue = loginQueue.getQueue();
				if (blockingQueue == null || blockingQueue.size() <= 0) {
					loginQueue.setQueue(l);
				}else{
					while (blockingQueue.peek() != null && !token.equals(null)) {
						if(!blockingQueue.peek().getToken().equals(token)){
							loginQueue.setQueue(l);
							break;
						}
					}
				}
			}
		} else {
			loginQueue = UserLoginQueue.getInstance();
			BlockingQueue<Login> queue = loginQueue.getQueue();

			if (queue != null && queue.size() > 0) {
				while (queue.peek() != null) {
					if (queue.peek().getToken().equals(token)) {
						queue.poll();
						break;
					}
				}
			}

			return new ResponseEntity<Void>(headers, HttpStatus.OK);
		}

		return new ResponseEntity<Void>(headers, HttpStatus.OK);
	}
}
