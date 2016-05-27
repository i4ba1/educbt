package id.co.knt.cbt.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import id.co.knt.cbt.model.Course;

@Repository
public interface CourseRepo extends CrudRepository<Course, Integer> {

}
