package id.co.knt.cbt.repositories;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import id.co.knt.cbt.model.User;

public interface UserRepo extends CrudRepository<User, Long> {

	@Query("select u from User as u where u.userName= :userName and u.password= :pass")
	User validateUser(@Param("userName") String userName, @Param("pass") String pass);
	
	@Query("select u from User as u where u.userName= :userName")
	User findUserByUserName(@Param("userName") String userName);
}
