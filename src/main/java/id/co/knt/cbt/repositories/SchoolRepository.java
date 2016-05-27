package id.co.knt.cbt.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import id.co.knt.cbt.model.School;

public interface SchoolRepository extends JpaRepository<School, Long>{
	
}
