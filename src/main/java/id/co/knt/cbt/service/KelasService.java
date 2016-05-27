package id.co.knt.cbt.service;

import id.co.knt.cbt.model.Kelas;

/**
 * 
 * @author MNI
 *
 */
public interface KelasService {
	Iterable<Kelas> getAllKelas();

	Kelas save(Kelas kelas);

	String getKelasById(Integer id);

	Kelas findKelasById(Integer id);
	
	Kelas findKelasByName(String className);
	
	String updateKelas(Kelas kelas);

	Boolean isKelasExist(Kelas kelas);

	Kelas importKelas(Kelas kelas);
}
