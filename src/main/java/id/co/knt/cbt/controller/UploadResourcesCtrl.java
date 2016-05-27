package id.co.knt.cbt.controller;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.util.Date;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import id.co.knt.cbt.model.Employee;
import id.co.knt.cbt.model.Gallery;
import id.co.knt.cbt.service.EmployeeService;
import id.co.knt.cbt.service.GalleryService;

@CrossOrigin(origins="http://localhost:8787")
@RestController
@RequestMapping(value = "/user/upload")
public class UploadResourcesCtrl {

	@Value("${path.question.image}")
	private String Q_IMG_PATH = "";
	private static final Logger LOG = LoggerFactory.getLogger(AdmSchoolCtrl.class);

	@Autowired
	private GalleryService resourceService;

	@Autowired
	private EmployeeService empService;

	/**
	 * Upload the image from gallery+
	 * 
	 * @param token
	 * @param file
	 * @return
	 */
	@RequestMapping(value = "/uploadImgQuestion/", method = RequestMethod.POST)
	public ResponseEntity<Void> uploadImgQuestion(@RequestParam("token") String token,
			@RequestParam("file") MultipartFile file, @RequestParam("teacherNip") String teacherNip) {
		LOG.info("/uploadImgQuestion/ ");
		HttpHeaders header = new HttpHeaders();

		String fileName = "";
		Gallery resources = null;
		if (!file.isEmpty()) {
			try {
				Employee emp = empService.findPassByNip(teacherNip);
				fileName = file.getOriginalFilename();
				String filePath = System.getProperty("user.home") + File.separator + Q_IMG_PATH + File.separator + fileName;
				fileName = file.getOriginalFilename();
				
				byte[] bytes = file.getBytes();
				String dir = System.getProperty("user.home") + File.separator + Q_IMG_PATH;
				File serverDirFile = new File(dir);
				if(!serverDirFile.exists()){
					serverDirFile.mkdirs();
				}

				// Create the file on server
				File serverFile = new File(filePath);
				BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(serverFile));
				stream.write(bytes);
				stream.close();

				resources = new Gallery(fileName, filePath, file.getContentType(), new Date().getTime(), emp);
				resourceService.addNew(resources);
			} catch (Exception e) {
				e.printStackTrace();
				return new ResponseEntity<Void>(header, HttpStatus.INTERNAL_SERVER_ERROR);
			}
		}

		return new ResponseEntity<Void>(header, HttpStatus.OK);
	}

	/**
	 * 
	 * @param token
	 * @return
	 */
	@RequestMapping(value = "/findAllTeacherGallery/{token}/{teacherNip}", method = RequestMethod.GET)
	public ResponseEntity<List<Gallery>> findSchool(@PathVariable("token") String token,
			@PathVariable("teacherNip") String teacherNip) {
		LOG.info("Find all gallery /findAllGallery");
		List<Gallery> gallery = resourceService.findGalleryByEmp(teacherNip);

		return gallery != null ? new ResponseEntity<List<Gallery>>(gallery, HttpStatus.OK)
				: new ResponseEntity<List<Gallery>>(gallery, HttpStatus.NOT_FOUND);
	}
}
