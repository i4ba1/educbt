package id.co.knt.cbt.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import id.co.knt.cbt.model.License;

@Repository
public interface LicenseRepository extends JpaRepository<License, Integer> {
	
	@Query("select ls from License as ls where ls.license= :license")
	License findLicenseByLicenseKey(@Param("license") String license);
}
