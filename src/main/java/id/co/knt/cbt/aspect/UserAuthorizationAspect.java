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

    @Around("execution(* id.co.knt.cbt.controller.AdmEmployeeCtrl.*(..)) || execution(* id.co.knt.cbt.controller.AdmKelasCtrl.*(..)) || execution(* id.co.knt.cbt.controller.AdmLicenseCtrl.*(..)) || execution(* id.co.knt.cbt.controller.AdmSchoolCtrl.*(..)) || execution(* id.co.knt.cbt.controller.AdmStudentCtrl.*(..)) || execution(* id.co.knt.cbt.controller.AdmSubjectCtrl.*(..)) || execution(* id.co.knt.cbt.controller.AdmActiveUserCtrl.*(..)) || execution(* id.co.knt.cbt.controller.StudentCtrl.*(..)) || execution(* id.co.knt.cbt.controller.TeacherEventManagementCtrl.*(..)) || execution(* id.co.knt.cbt.controller.TeacherQuestionMgmtCtrl.*(..)) || execution(* id.co.knt.cbt.controller.UploadResourcesCtrl.*(..))")
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
        String str = "";
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
                str = obj[0].toString();
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
