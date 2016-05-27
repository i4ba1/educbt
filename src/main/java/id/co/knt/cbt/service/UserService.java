package id.co.knt.cbt.service;

import java.util.List;

import id.co.knt.cbt.model.User;

public interface UserService {
	User addNewUser(User user);

	User updateCurrentUser(User user);

	void deleteUser(User user);

	User findUserByUsername(String username);

	List<User> searchUser(String name);
	
	User validateUser(String userName, String pass);
}
