package id.co.knt.cbt.service;

import java.util.List;

import id.co.knt.cbt.model.License;

public interface LicenseService {
	License createNewLicense(License license);
	
	License readLicense(Integer id);
	
	boolean readLicense(String licenseKey);
	
	List<License> licenses();
	
	void deleteLicense(Integer id);
}
