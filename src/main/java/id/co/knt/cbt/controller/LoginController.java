package id.co.knt.cbt.controller;

import id.co.knt.cbt.model.License;
import id.co.knt.cbt.model.Login;
import id.co.knt.cbt.model.User;
import id.co.knt.cbt.model.User.UserType;
import id.co.knt.cbt.service.LicenseService;
import id.co.knt.cbt.service.LoginService;
import id.co.knt.cbt.service.UserService;
import id.web.pos.integra.gawl.Gawl;
import org.apache.log4j.Logger;
import org.joda.time.DateTime;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.math.BigInteger;
import java.security.SecureRandom;
import java.util.*;

/**
 * @author Muhamad Nizar Iqbal
 */
@CrossOrigin(origins = "http://localhost:8787")
@RestController
@RequestMapping(value = "/user/authorization")
public class LoginController {

    @Value("${path.question.image}")
    private static final String QUESTION_IMAGE_DIRECTORY = "";
    private static final Logger LOG = Logger.getLogger(LoginController.class);
    @Autowired
    LoginService loginService;
    @Autowired
    UserService userService;
    @Autowired
    LicenseService licenseService;

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
        List<Login> logins = loginService.listOnlineUser();
        /**
         * First check if the username and password are valid
         */
        User user = userService.validateUser(obj.getString("un"),
                Base64.getEncoder().encodeToString(obj.getString("ps").getBytes()));
        Boolean isValid = user == null ? false : true;

        if (isValid) {
            Login login = loginService.findByUser(user);

            /**
             * Get number of licenses in database
             */
            List<License> licenses = licenseService.licenses();

           /* if (licenses.size() <= 0 && user.getUserType() != UserType.ADMIN && user.getUserType() != UserType.EMPLOYEE) {
                return new ResponseEntity<>(new ArrayList<>(), HttpStatus.FORBIDDEN);
            }*/

            Date dt = new Date();
            DateTime dateTime = new DateTime(dt);
            dateTime = dateTime.plusHours(6);
            SecureRandom rand = new SecureRandom();

            int numberOfUser = 0;

            /**
             * If licenses is zero it mean DEMO version
             */
            for (License value : licenses) {
                Gawl gawl = new Gawl();
                try {
                    Map<String, Byte> map = gawl.extract(value.getLicense());
                    int module = map.get(Gawl.MODULE);
                    numberOfUser += module;
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

            /**
             * Check if the userType is STUDENT or 1
             */
            if (user.getUserType() == UserType.STUDENT) {
                /**
                 * One license is represent the number of user
                 * Check if the student has slot to get logging in. It check the
                 * login student size <= number of user
                 * @If Number of user is below equal 1 and the login size is below equal 1 then only one student can login
                 */
                if (numberOfUser <= 1 && logins.size() < 1) {
                    if (login == null) {
                        return firstLogin(dt, rand, dateTime, user);
                    } else {
                        return reLogin(login, dt, rand, dateTime);
                    }
                } else {
                    if (logins.size() < numberOfUser) {
                        if (login == null) {
                            return firstLogin(dt, rand, dateTime, user);
                        } else {
                            return reLogin(login, dt, rand, dateTime);
                        }
                    } else {
                        return new ResponseEntity<List<Map<String, Object>>>(new ArrayList<>(), HttpStatus.FORBIDDEN);
                    }
                }
            } else {
                if (login == null) {
                    return firstLogin(dt, rand, dateTime, user);
                } else {
                    return reLogin(login, dt, rand, dateTime);
                }
            }
        }

        return new ResponseEntity<List<Map<String, Object>>>(new ArrayList<>(), HttpStatus.NOT_FOUND);
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

        return loginService.saveLogin(newLogin) != null
                ? new ResponseEntity<List<Map<String, Object>>>(data, HttpStatus.OK)
                : new ResponseEntity<List<Map<String, Object>>>(data, HttpStatus.NOT_FOUND);
    }

    private ResponseEntity<List<Map<String, Object>>> reLogin(Login login, Date dt, SecureRandom rand,
                                                              DateTime dateTime) {
        login.setLoginDate(dt);
        login.setToken(new BigInteger(130, rand).toString(50));
        login.setTokenExpired(dateTime.getMillis());

        Map<String, Object> mapObj = new HashMap<String, Object>();
        mapObj.put("token", login.getToken());
        mapObj.put("user", login.getUser());
        mapObj.put("type", "full-version");
        List<Map<String, Object>> data = new ArrayList<Map<String, Object>>();
        data.add(mapObj);

        return loginService.updateToken(login) != null
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

        Login login = loginService.findByToken(obj.getString("token"));
        if (login == null) {
            return new ResponseEntity<Void>(headers, HttpStatus.UNAUTHORIZED);
        }

        loginService.deleteToken(login);

        return new ResponseEntity<>(headers, HttpStatus.OK);
    }
}
