package id.co.knt.cbt.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import id.co.knt.cbt.model.StudentAnswer;

@Repository
public interface StudentAnswerRepo extends JpaRepository<StudentAnswer, Long> {
	@Query("select sa from StudentAnswer sa inner join fetch sa.question q inner join fetch q.questionGroup qg where sa.event.id= :eventId and sa.student.nis= :nis order by sa.id asc")
	List<StudentAnswer> findSAByEvent(@Param("eventId") Long eventId, @Param("nis") String nis);

	@Query("select count(sa) from StudentAnswer sa where sa.event.id= :eventId and sa.student.nis= :nis")
	Integer checkStudentIsWorkingOn(@Param("eventId") Long eventId, @Param("nis") String nis);
}
