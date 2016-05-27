package id.co.knt.cbt.repositories;

import java.util.List;

import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import id.co.knt.cbt.model.Gallery;

@Repository
public interface GalleryRepo extends JpaRepository<Gallery, Long> {

	@Query("select g from Gallery g where g.employee.nip= :nip")
	List<Gallery> findGalleryByEmployeeNip(@Param("nip") String nip);
}
