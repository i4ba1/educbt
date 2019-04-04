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

	@Query("from StudentAnswer sa inner join fetch sa.student s inner join fetch sa.event inner join fetch sa.question q where sa.event.id =:eventId and sa.student.nis =:nis")
	List<StudentAnswer> fetchDetailStudentAnswer(@Param("eventId") Long eventId, @Param("nis") String nis);

	/*
	 * from Preference p where p in (select pd.preference from PreferenceDateETL pd
	 * where pd.corporation.id=:corporationId and pd.deleted=false and
	 * pd.dateETL.localDate>=:startDM and pd.dateETL.localDate<=:endDM) and
	 * p.employee.deleted=false and p.deleted=false and p.approvalStatus !=
	 * :approvalStatus order by p.dateCreated
	 */
	@Query("select s.firstName, s.lastName, s.nis from Student s where s in (select sa.student from StudentAnswer sa where sa.event.id= :eventId) order by s.firstName")
	List<Object[]> findStudentAttendToEvent(@Param("eventId") Long eventId);
}
