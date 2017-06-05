package id.co.knt.cbt.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import id.co.knt.cbt.model.Employee;

@Repository
public interface EmployeeRepo extends JpaRepository<Employee, Long> {
	
	@Query("select t from Employee t where t.nip= :nip")
	Employee findByNip(@Param("nip") String nip);
	
	@Query("select t from Employee t where t.deleted= :deleted order by t.firstName asc")
	Iterable<Employee> findAllEmpNotDeleted(@Param("deleted") Boolean deleted);
	
	@Query("select e from Employee as e where e.nip= :nip")
	Employee findPassByNip(@Param("nip") String nip);
}
