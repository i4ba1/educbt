package id.co.knt.cbt.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import id.co.knt.cbt.model.Kelas;

@Repository
public interface KelasRepo extends JpaRepository<Kelas, Integer>{
	
	@Query("select k from Kelas k where k.className= :className")
	Kelas findByClassName(@Param("className") String className);
	
	@Query("select k from Kelas k where k.activated=true")
	Iterable<Kelas> findAllByOrderByClassNameAsc();
}
