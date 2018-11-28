package id.co.knt.cbt.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import id.co.knt.cbt.model.Login;

public interface LoginRepo extends JpaRepository<Login, Long> {

	@Query("select l from Login as l where l.user.id = :id")
	Login findByUser(@Param("id") Long id);

	@Query("select l from Login as l where l.token= :token")
	Login findByToken(@Param("token") String token);

	@Query("select l from Login as l where l.token= :token and l.tokenExpired > :today")
	Login validateToken(@Param("token") String token, @Param("today") Long today);

	@Query("select l from Login as l where l.user.userType=1 or l.user.userType=2")
	List<Login> findOnlineUsers();
}
