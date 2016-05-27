package id.co.knt.cbt.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import id.co.knt.cbt.model.User;
import id.co.knt.cbt.repositories.UserRepo;
import id.co.knt.cbt.service.UserService;

@Transactional
@Service("userService")
public class UserServiceImpl implements UserService {

	@Autowired
	private UserRepo userRepo;

	@Override
	public User addNewUser(User user) {
		User newUser = userRepo.save(user);
		return newUser;
	}

	@Override
	public User updateCurrentUser(User user) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void deleteUser(User user) {
		// TODO Auto-generated method stub

	}

	@Override
	public User findUserByUsername(String userName) {
		User currentUser = userRepo.findUserByUserName(userName);
		
		return currentUser;
	}

	@Override
	public List<User> searchUser(String name) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public User validateUser(String userName, String pass) {
		return userRepo.validateUser(userName, pass);
	}
}
