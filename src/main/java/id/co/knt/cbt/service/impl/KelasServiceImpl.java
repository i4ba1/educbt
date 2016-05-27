package id.co.knt.cbt.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import id.co.knt.cbt.model.Kelas;
import id.co.knt.cbt.repositories.KelasRepo;
import id.co.knt.cbt.service.KelasService;

/**
 * 
 * @author MNI
 *
 */
@Transactional
@Service("kelasService")
public class KelasServiceImpl implements KelasService{
	
	@Autowired
	public KelasRepo kelasRepo;
	
	public KelasServiceImpl() {
		// TODO Auto-generated constructor stub
	}
	
	public KelasServiceImpl(KelasRepo kelasRepo) {
		this.kelasRepo = kelasRepo;
	}

	@Override
	public Iterable<Kelas> getAllKelas() {
		Iterable<Kelas> classes = kelasRepo.findAllByOrderByClassNameAsc();
		return classes;
	}

	@Override
	public Kelas save(Kelas kelas) {
		return kelasRepo.save(kelas);
	}

	@Override
	public String updateKelas(Kelas kls) {
		Kelas result = kelasRepo.saveAndFlush(kls);
		return result.getClassName();
	}

	@Override
	public String getKelasById(Integer id) {
		Kelas kelas = kelasRepo.findOne(id);
		return kelas.getClassName();
	}

	@Override
	public Kelas findKelasById(Integer id) {
		Kelas kelas = kelasRepo.findOne(id);
		return kelas;
	}

	@Override
	public Boolean isKelasExist(Kelas kelas) {
		Kelas kls = findKelasByName(kelas.getClassName());
		return kls != null;
	}

	@Override
	public Kelas importKelas(Kelas kelas) {
		Kelas newKelas = kelasRepo.save(kelas);
		return newKelas;
	}

	@Override
	public Kelas findKelasByName(String className) {
		Kelas kelas = kelasRepo.findByClassName(className);
		return kelas;
	}
}
