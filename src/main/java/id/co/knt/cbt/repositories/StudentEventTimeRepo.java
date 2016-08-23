package id.co.knt.cbt.repositories;

import id.co.knt.cbt.model.StudentEventTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Created by MNI on 8/22/2016.
 */
@Repository
public interface StudentEventTimeRepo extends JpaRepository<StudentEventTime, Long> {

    @Query("select s From StudentEventTime s where s.event.id= :eventId and s.student.nis= :studentId")
    StudentEventTime getLastExamTime(@Param("eventId") Long eventId, @Param("studentId") String studentId);
}
