package id.co.knt.cbt.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import id.co.knt.cbt.model.Subject;

@Repository
public interface SubjectRepo extends JpaRepository<Subject, Integer> {
	Subject findBySubjectName(String subjectName);

	@Query("select s from Subject s where s.deleted= :deleted order by s.subjectName asc")
	Iterable<Subject> fetchSubjectNotDeleted(@Param("deleted") Boolean deleted);
}
