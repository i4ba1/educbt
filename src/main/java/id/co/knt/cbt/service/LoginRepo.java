package id.co.knt.cbt.service;

import java.util.List;

import id.co.knt.cbt.model.Login;
import id.co.knt.cbt.model.User;

public interface LoginRepo {
	Login saveLogin(Login login);

	Boolean validateToken(String token, Long today);

	Login findByUser(User u);

	Login updateToken(Login login);

	void deleteToken(Login login);

	Login findByToken(String token);

	Login findById(Long id);

	List<Login> listOnlineUser();
}
