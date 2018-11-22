package id.co.knt.cbt.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import id.co.knt.cbt.model.User;
import id.co.knt.cbt.model.User.UserType;
import id.co.knt.cbt.repositories.UserRepo;
import id.co.knt.cbt.util.PasswordUtility;

@RestController
//@CrossOrigin(origins="http://localhost:8787")
@RequestMapping(value="/admin/adminMgmt")
public class AdminMgmtController {

	private static final Logger LOG = LoggerFactory.getLogger(AdminMgmtController.class);

	@Autowired
	private UserRepo userRepo;

	@RequestMapping(value = "/createAdmin/", method = RequestMethod.POST)
	public ResponseEntity<Boolean> createAdmin() {
		LOG.info("ResponseEntity<Boolean> createAdmin /createAdmin/");
		User adminUser = userRepo.findUserByUserName("admin");
		User u = null;

		try {
			if (adminUser == null) {
				User newUser = new User();
				newUser.setUserName("admin");
				newUser.setUserType(UserType.ADMIN);

				String pass = "aDmin123!";
				String saltPass = BCrypt.hashpw(pass, BCrypt.gensalt(15));

				newUser.setPassword(PasswordUtility.generatePass(pass));
				newUser.setHashedPassword(PasswordUtility.generateHashPass(pass));
				newUser.setSalt(saltPass);
				newUser.setAdmin(true);
				u = userRepo.save(newUser);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		return u != null ? new ResponseEntity<Boolean>(true, HttpStatus.OK)
				: new ResponseEntity<Boolean>(false, HttpStatus.NOT_FOUND);
	}
}
