package id.co.knt.cbt.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import id.co.knt.cbt.model.School;
import id.co.knt.cbt.repositories.SchoolRepo;
import id.co.knt.cbt.service.SchoolService;

@Service("schoolService")
public class SchoolServiceImpl implements SchoolService {

	@Autowired
	private SchoolRepo schoolRepo;

	@Override
	public School saveNewSchool(School school) {
		School newSchool = schoolRepo.save(school);

		return newSchool;
	}

	@Override
	public School updateNewSchool(School school) {
		School updatedSchool = schoolRepo.saveAndFlush(school);

		return updatedSchool;
	}

	@Override
	public School findShoolById(Long id) {
		School currentSchool = schoolRepo.findOne(id);

		return currentSchool;
	}

	@Override
	public School findSchool() {
		List<School> schools = schoolRepo.findAll();
		if (schools != null && !schools.isEmpty()) {
			return schools.get(0);
		}

		return null;
	}
}
