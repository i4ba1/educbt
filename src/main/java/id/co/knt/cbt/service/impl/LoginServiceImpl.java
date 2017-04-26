package id.co.knt.cbt.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import id.co.knt.cbt.model.Login;
import id.co.knt.cbt.model.User;
import id.co.knt.cbt.repositories.LoginRepository;
import id.co.knt.cbt.service.LoginService;

@Service("loginService")
public class LoginServiceImpl implements LoginService {

	@Autowired
	private LoginRepository loginRepo;

	@Override
	public Login saveLogin(Login login) {
		Login newLogin = loginRepo.save(login);

		return newLogin;
	}

	@Override
	public Boolean validateToken(String token, Long today) {
		Login l = loginRepo.validateToken(token, today);
		return l == null?false:true;
	}

	@Override
	public Login findByUser(User u) {
		Login l =loginRepo.findByUser(u);
		return l;
	}

	@Override
	public Login updateToken(Login login) {
		return loginRepo.saveAndFlush(login);
	}

	@Override
	public void deleteToken(Login login) {
		loginRepo.delete(login.getId());
	}

	@Override
	public Login findByToken(String token) {
		Login l = loginRepo.findByToken(token);

		return l;
	}

	@Override
	public List<Login> listOnlineUser() {
		List<Login> logins = loginRepo.findOnlineUsers();
		return logins;
	}

	@Override
	public Login findById(Long id) {
		Login l = loginRepo.findOne(id);
		return l;
	}
}
