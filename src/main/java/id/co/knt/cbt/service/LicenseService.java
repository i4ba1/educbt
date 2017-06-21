package id.co.knt.cbt.service;

import java.util.List;

import org.springframework.http.ResponseEntity;

import id.co.knt.cbt.model.License;

public interface LicenseService {
	License createNewLicense(List<Object> objects);

	License update(License license);
	
	License readLicense(Integer id);
	
	boolean readLicense(String licenseKey);
	
	List<License> licenses();
	
	void deleteLicense(Integer id);
	
	public ResponseEntity<License> createDummy(List<Object> objects);
}
