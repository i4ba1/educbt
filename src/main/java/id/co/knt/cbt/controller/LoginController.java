package id.co.knt.cbt.controller;

import java.io.File;
import java.math.BigInteger;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.joda.time.DateTime;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.datasource.init.ScriptUtils;
import org.springframework.util.Base64Utils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import id.co.knt.cbt.model.License;
import id.co.knt.cbt.model.Login;
import id.co.knt.cbt.model.User;
import id.co.knt.cbt.model.User.UserType;
import id.co.knt.cbt.repositories.LicenseRepo;
import id.co.knt.cbt.repositories.UserRepo;
import id.co.knt.cbt.service.LoginService;
import id.web.pos.integra.gawl.Gawl;

/**
 * @author Muhamad Nizar Iqbal
 */
@CrossOrigin(origins = "http://localhost:8787")
@RestController
@RequestMapping(value = "/user/authorization")
public class LoginController {

	@Value("${path.question.image}")
	private static final String QUESTION_IMAGE_DIRECTORY = "";
	private static final Logger LOG = LoggerFactory.getLogger(LoginController.class);

	@Autowired
	LoginService loginRepo;

	@Autowired
	UserRepo userRepo;

	@Autowired
	LicenseRepo licenseRepo;

	@Autowired
	private DataSource dataSource;

	@RequestMapping(value = "/isImport/", method = RequestMethod.POST)
	public ResponseEntity<Boolean> isImport() {
		/**
		 * If the user data is null then import data
		 */
		if (userRepo.findUserByUserName("teacher_SD") == null) {
			return new ResponseEntity<Boolean>(false, HttpStatus.OK);
		}

		return new ResponseEntity<Boolean>(true, HttpStatus.OK);
	}

	@RequestMapping(value = "/import/", method = RequestMethod.POST)
	public ResponseEntity<Integer> importData() {
		int status = 0;
		try {
			ScriptUtils.executeSqlScript(dataSource.getConnection(), new ClassPathResource("final_sql_data_only.sql"));
			status = 1;
		} catch (Exception e) {
			status = -1;
			e.printStackTrace();
		}
		
		return new ResponseEntity<Integer>(status,HttpStatus.OK);
	}

	/**
	 * Logging In and create new token for user
	 *
	 * @param objects
	 * @return
	 */
	@RequestMapping(value = "/loggingIn/", method = RequestMethod.POST)
	public ResponseEntity<List<Map<String, Object>>> login(@RequestBody List<Object> objects) {
		JSONArray array = new JSONArray(objects);
		JSONObject obj = array.getJSONObject(0);

		/**
		 * Get number of online users
		 */
		List<Login> logins = loginRepo.listOnlineUser();
		/**
		 * First check if the username and password are valid
		 */
		User user = userRepo.validateUser(obj.getString("un"),
				Base64Utils.encodeToString(obj.getString("ps").getBytes()));
		Boolean isValid = false;
		//Only not deleted user can be login
		if(user != null && !user.getDeleted()){
			isValid = true;
		}

		//Boolean isValid = user == null ? false : true;
		Login login = loginRepo.findByUser(user);

		if (isValid) {

			/**
			 * Get number of licenses in database
			 */
			List<License> licenses = licenseRepo.findAll();

			Date dt = new Date();
			DateTime dateTime = new DateTime(dt);
			dateTime = dateTime.plusHours(3);
			SecureRandom rand = new SecureRandom();

			int numberOfUser = 0;

			/**
			 * If licenses is zero it mean DEMO version
			 */
			if (licenses.size() > 0) {
				for (License sn : licenses) {
					Gawl gawl = new Gawl();

					if (sn.getActivationKey() != null) {
						if (sn.getActivationKey().length() > 0 && !sn.getActivationKey().equals(null)) {
							try {
								Map<String, Byte> map = gawl.extract(sn.getLicense());
								int module = map.get(Gawl.MODULE);
								numberOfUser += module;
							} catch (Exception e) {
								e.printStackTrace();
							}
						}
					}
				}
			}

			/**
			 * Check if the userType is STUDENT or 1
			 */
			if (user.getUserType() == UserType.STUDENT) {
				/**
				 * One license is represent the number of user Check if the student has slot to
				 * get logging in. It check the login student size <= number of user
				 * 
				 * @If Number of user is below equal 1 and the login size is below equal 1 then
				 *     only one student can login
				 */
				if (numberOfUser <= 1 && logins.size() < 1) {
					if (login == null) {
						return firstLogin(dt, rand, dateTime, user);
					} else {
						return new ResponseEntity<List<Map<String, Object>>>(new ArrayList<Map<String, Object>>(),
								HttpStatus.FORBIDDEN);
					}
				} else {
					if (logins.size() < numberOfUser) {
						if (login == null) {
							return firstLogin(dt, rand, dateTime, user);
						} else {
							return new ResponseEntity<List<Map<String, Object>>>(new ArrayList<Map<String, Object>>(),
									HttpStatus.FORBIDDEN);
						}
					} else {
						return new ResponseEntity<List<Map<String, Object>>>(new ArrayList<Map<String, Object>>(),
								HttpStatus.FORBIDDEN);
					}
				}
			} else {
				if (login == null) {
					return firstLogin(dt, rand, dateTime, user);
				} else {
					return new ResponseEntity<List<Map<String, Object>>>(new ArrayList<Map<String, Object>>(),
							HttpStatus.EXPECTATION_FAILED);
				}
			}
		}

		return new ResponseEntity<List<Map<String, Object>>>(new ArrayList<Map<String, Object>>(),
				HttpStatus.NOT_FOUND);
	}

	private ResponseEntity<List<Map<String, Object>>> firstLogin(Date dt, SecureRandom rand, DateTime dateTime,
			User user) {
		Login newLogin = new Login();
		newLogin.setLoginDate(dt);
		newLogin.setToken(new BigInteger(130, rand).toString(50));
		newLogin.setTokenExpired(dateTime.getMillis());
		newLogin.setUser(user);

		Map<String, Object> mapObj = new HashMap<String, Object>();
		mapObj.put("token", newLogin.getToken());
		mapObj.put("user", user);
		mapObj.put("type", "full-version");
		List<Map<String, Object>> data = new ArrayList<Map<String, Object>>();
		data.add(mapObj);

		File dir = new File(LoginController.QUESTION_IMAGE_DIRECTORY);
		boolean successfully = false;
		if (!dir.exists()) {
			successfully = dir.mkdir();
		}

		if (successfully) {
			LOG.info("successfully create directory");
		}

		return loginRepo.saveLogin(newLogin) != null
				? new ResponseEntity<List<Map<String, Object>>>(data, HttpStatus.OK)
				: new ResponseEntity<List<Map<String, Object>>>(data, HttpStatus.NOT_FOUND);
	}

	/**
	 * Logged out user
	 *
	 * @param objects
	 * @return
	 */
	@RequestMapping(value = "/loggedOut/", method = RequestMethod.POST)
	public ResponseEntity<Void> logout(@RequestBody List<Object> objects) {
		JSONArray array = new JSONArray(objects);
		JSONObject obj = array.getJSONObject(0);
		HttpHeaders headers = new HttpHeaders();

		Login login = loginRepo.findByToken(obj.getString("token"));
		if (login == null) {
			return new ResponseEntity<Void>(headers, HttpStatus.UNAUTHORIZED);
		}

		loginRepo.deleteToken(login);

		return new ResponseEntity<>(headers, HttpStatus.OK);
	}
}
