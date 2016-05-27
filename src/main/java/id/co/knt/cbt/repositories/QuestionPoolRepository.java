package id.co.knt.cbt.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import id.co.knt.cbt.model.QuestionPool;

/**
 * 
 * @author MNI
 *
 */
@Repository
public interface QuestionPoolRepository extends JpaRepository<QuestionPool, Long> {
	public final static String FIND_QP_BY_ID = "select qp from QuestionPool qp where qp.id = :id";

	@Query(FIND_QP_BY_ID)
	QuestionPool findQPById(@Param("id") Long id);
	
	@Query("select qp from QuestionPool as qp where qp.employee.nip= :nip and qp.activated=true")
	List<QuestionPool> findQpByTeacher(@Param("nip") String nip);
}
