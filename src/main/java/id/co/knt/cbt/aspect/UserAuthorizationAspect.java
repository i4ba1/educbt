package id.co.knt.cbt.aspect;

import id.co.knt.cbt.service.LoginService;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.json.JSONArray;
import org.json.JSONException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Date;

@Aspect
@Component
public class UserAuthorizationAspect {
    private static final Logger LOG = LoggerFactory.getLogger(UserAuthorizationAspect.class);

    @Autowired
    private LoginService loginService;

    @Around("execution(* id.co.knt.cbt.controller.AdmEmployeeController.*(..)) || execution(* id.co.knt.cbt.controller.AdmKelasController.*(..)) || execution(* id.co.knt.cbt.controller.AdmLicenseController.*(..)) || execution(* id.co.knt.cbt.controller.AdmSchoolController.*(..)) || execution(* id.co.knt.cbt.controller.AdmStudentController.*(..)) || execution(* id.co.knt.cbt.controller.AdmSubjectController.*(..)) || execution(* id.co.knt.cbt.controller.AdmActiveUserController.*(..)) || execution(* id.co.knt.cbt.controller.StudentController.*(..)) || execution(* id.co.knt.cbt.controller.TeacherEventManagementController.*(..)) || execution(* id.co.knt.cbt.controller.TeacherQuestionMgmtController.*(..)) || execution(* id.co.knt.cbt.controller.UploadResourcesController.*(..))")
    public Object admTeacher(ProceedingJoinPoint joinPoint) throws Throwable {
        Object[] objects = joinPoint.getArgs();
        HttpHeaders headers = new HttpHeaders();
        Object result = null;
        if (authorizing(objects) > 0) {
            result = new ResponseEntity<Void>(headers, HttpStatus.UNAUTHORIZED);
        } else {
            result = joinPoint.proceed();
        }

        return result;
    }

    private int authorizing(Object[] obj) {
        int result = 0;
        JSONArray array = null;
        String token = "";

        try {
            if (obj.length == 0) {
                array = new JSONArray(Arrays.asList(obj));
                token = array.getJSONArray(0).getJSONObject(0).get("authorization").toString();
                LOG.info("Token: " + token);

                if (token.equals("") || !loginService.validateToken(token, new Date().getTime())) {
                    result = 1;
                }
            } else {
                array = new JSONArray(Arrays.asList(obj[0]));
                token = array.getJSONArray(0).getJSONObject(0).get("authorization").toString();
                if (token.equals("") || !loginService.validateToken(token, new Date().getTime())) {
                    result = 1;
                }
            }
        } catch (JSONException e) {
            if (obj.length == 0 || obj[0].equals("")
                    || !loginService.validateToken(obj[0].toString(), new Date().getTime())) {
                result = 1;
            }
        }

        return result;
    }
}
