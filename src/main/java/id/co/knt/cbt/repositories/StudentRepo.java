package id.co.knt.cbt.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import id.co.knt.cbt.model.Student;

@Repository
public interface StudentRepo extends JpaRepository<Student, Long> {
	@Query("select s from Student s where s.nis = :nis")
	Student findByNis(@Param("nis") String nis);
	
	@Query("select s from Student s where s.deleted= :deleted order by s.firstName asc")
	Iterable<Student> findAllStudNotDeleted(@Param("deleted") Boolean deleted);
	
	@Query("select s from Student as s where s.nis= :nis")
	Student findPassByNis(@Param("nis") String nis);
}
