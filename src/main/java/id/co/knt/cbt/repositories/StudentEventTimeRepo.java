package id.co.knt.cbt.repositories;

import id.co.knt.cbt.model.StudentEventTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Created by MNI on 8/22/2016.
 */
@Repository
public interface StudentEventTimeRepo extends JpaRepository<StudentEventTime, Long> {

}
