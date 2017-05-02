package id.co.knt.cbt.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import id.co.knt.cbt.model.License;
import id.co.knt.cbt.repositories.LicenseRepository;
import id.co.knt.cbt.service.LicenseService;

@Service("licenseService")
public class LicenseServiceImpl implements LicenseService {

	@Autowired
	private LicenseRepository licenseRepo;
	
	@Override
	public License createNewLicense(License license) {
		License newLicense = licenseRepo.save(license);
		
		return newLicense;
	}

	@Override
	public License readLicense(Integer id) {
		License currentLicense = licenseRepo.findOne(id);
		return currentLicense;
	}

	@Override
	public List<License> licenses() {
		List<License> licenses = licenseRepo.findAll();
		return licenses;
	}

	@Override
	public void deleteLicense(Integer id) {
		licenseRepo.delete(id);;
	}

	@Override
	public boolean readLicense(String licenseKey) {
		License l = licenseRepo.findLicenseByLicenseKey(licenseKey);
		return l == null? true:false;
	}

	@Override
	public License update(License license){
		License updatedLicense = licenseRepo.saveAndFlush(license);
		return updatedLicense;
	}
}
