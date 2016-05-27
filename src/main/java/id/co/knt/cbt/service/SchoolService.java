package id.co.knt.cbt.service;

import id.co.knt.cbt.model.School;

public interface SchoolService {
	School saveNewSchool(School school);
	
	School updateNewSchool(School school);
	
	School findShoolById(Long id);
	
	School findSchool();
}
