package id.co.knt.cbt.service;

import id.co.knt.cbt.model.Course;

public interface CourseService {
	Iterable<Course> getAllCourse();

	Course save(Course course);

	String getCourseById(Integer id);

	Course findCourseById(Integer id);

	String updateCourse(Course course);

	void delete(Course course);

	Boolean isCourseExist(Course course);

	Course importCourse(Course course);
}
