package id.co.knt.cbt.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import id.co.knt.cbt.model.Login;
import id.co.knt.cbt.model.User;

public interface LoginRepository extends JpaRepository<Login, Long> {
	
	@Query("select l from Login as l where l.user= :user")
	Login findByUser(@Param("user") User user);
	
	@Query("select l from Login as l where l.token= :token")
	Login findByToken(@Param("token") String token);
	
	@Query("select l from Login as l where l.token= :token and l.tokenExpired > :today")
	Login validateToken(@Param("token") String token, @Param("today") Long today);
	
	@Query("select l from Login as l where l.token is not null and l.user.userType=1")
	List<Login> findOnlineUsers();
}
