package id.co.knt.cbt.service;

import java.util.List;

import id.co.knt.cbt.model.Gallery;

public interface GalleryService {
	Gallery addNew(Gallery r);
	
	Gallery update(Gallery r);
	
	void delete(Gallery r);
	
	List<Gallery> findGalleryByEmp(String nip);
	
	Gallery findById(Long id);
}
