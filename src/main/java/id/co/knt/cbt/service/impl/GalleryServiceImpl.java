package id.co.knt.cbt.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import id.co.knt.cbt.model.Gallery;
import id.co.knt.cbt.repositories.GalleryRepo;
import id.co.knt.cbt.service.GalleryService;

@Service("resourcesService")
public class GalleryServiceImpl implements GalleryService {
	
	@Autowired
	private GalleryRepo galleryRepo;

	@Override
	public Gallery addNew(Gallery r) {
		Gallery newR = galleryRepo.save(r);
		return newR;
	}

	@Override
	public Gallery update(Gallery r) {
		Gallery updatedR = galleryRepo.saveAndFlush(r);
		return updatedR;
	}

	@Override
	public void delete(Gallery r) {
		galleryRepo.delete(r);
	}

	@Override
	public List<Gallery> findGalleryByEmp(String nip) {
		List<Gallery> resources = galleryRepo.findGalleryByEmployeeNip(nip);
		return resources;
	}

	@Override
	public Gallery findById(Long id) {
		Gallery r = galleryRepo.findOne(id);
		return r;
	}
}
