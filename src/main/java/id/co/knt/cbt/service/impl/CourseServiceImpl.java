package id.co.knt.cbt.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import id.co.knt.cbt.model.Course;
import id.co.knt.cbt.repositories.CourseRepo;
import id.co.knt.cbt.service.CourseService;

@Service("courseService")
@Transactional
public class CourseServiceImpl implements CourseService{

	@Autowired
	private CourseRepo courseRepo;
	
	public CourseServiceImpl() {
		super();
	}
	
	public CourseServiceImpl(CourseRepo courseRepo) {
		super();
		this.courseRepo = courseRepo;
	}

	@Override
	public Iterable<Course> getAllCourse() {
		return courseRepo.findAll(); 
	}

	@Override
	public Course save(Course course) {
		return courseRepo.save(course);
	}

	@Override
	public String getCourseById(Integer id) {
		return courseRepo.findOne(id).getCourseName();
	}

	@Override
	public Course findCourseById(Integer id) {
		// TODO Auto-generated method stub
		return courseRepo.findOne(id);
	}

	@Override
	public String updateCourse(Course course) {
		return courseRepo.save(course).getCourseName();
	}

	@Override
	public void delete(Course course) {
		courseRepo.delete(course);
	}

	@Override
	public Boolean isCourseExist(Course course) {
		Course crs = courseRepo.findOne(course.getId());
		return crs != null;
	}

	@Override
	public Course importCourse(Course course) {
		return courseRepo.save(course);
	}
	
}
