package id.co.knt.cbt.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import id.co.knt.cbt.model.School;
import id.co.knt.cbt.service.SchoolService;

/**
 * @author Muhamad Nizar Iqbal
 */
@CrossOrigin(origins="http://localhost:8787")
@RestController
@RequestMapping(value = "/admin/schoolMgmt")
public class AdmSchoolCtrl {

	private static final Logger LOG = LoggerFactory.getLogger(AdmSchoolCtrl.class);

	@Value("${path.school.image}")
	private String PATH = "";

	@Autowired
	private SchoolService schoolService;

	/**
	 * Create new school profile
	 * 
	 * @TODO change to blob, currently use path
	 * @param file
	 * @param schoolName
	 * @param shoolDescription
	 * @return
	 */
	@RequestMapping(value = "/saveSchoolProfile/", method = RequestMethod.POST)
	public ResponseEntity<Void> saveSchoolProfile(@RequestParam("token") String token,
			@RequestParam("file") MultipartFile file, @RequestParam("schoolName") String schoolName,
			@RequestParam("schoolDescription") String shoolDescription) {
		LOG.info("Save new school Profile /saveSchoolProfile/ ");

		String fileName = "";
		School newSchool = null;
		if (!file.isEmpty()) {
			try {
				fileName = file.getOriginalFilename();
				/*byte[] bytes = file.getBytes();
				String dir = System.getProperty("user.home") + PATH;
				File serverDirFile = new File(dir);
				if(!serverDirFile.exists()){
					serverDirFile.mkdirs();
				}

				// Create the file on server
				String imagePath = System.getProperty("user.home") + PATH + fileName;
				File serverFile = new File(imagePath);
				BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(serverFile));
				stream.write(bytes);
				stream.close();
				*/

				newSchool = new School();
				newSchool.setFileName(fileName);
				newSchool.setContentType(file.getContentType());
				newSchool.setFileData(file.getBytes());
				newSchool.setSchoolName(schoolName);
				newSchool.setSchoolDescription(shoolDescription);
				schoolService.saveNewSchool(newSchool);

			} catch (Exception e) {
				// TODO: handle exception
				e.printStackTrace();
			}
		}

		return newSchool != null ? new ResponseEntity<Void>(HttpStatus.OK)
				: new ResponseEntity<Void>(HttpStatus.NOT_FOUND);
	}

	/**
	 * Find school profile
	 * 
	 * @return
	 */
	@RequestMapping(value = "/findSchoolProfile/{token}", method = RequestMethod.GET)
	public ResponseEntity<School> findSchool(@PathVariable("token") String token) {
		LOG.info("Find school profile /findSchool/");
		School school = schoolService.findSchool();

		return school != null ? new ResponseEntity<School>(school, HttpStatus.OK)
				: new ResponseEntity<School>(school, HttpStatus.NOT_FOUND);
	}

	/**
	 * Update school profile
	 * 
	 * @param file
	 * @param schoolName
	 * @param shoolDescription
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/updateSchoolProfile/", method = RequestMethod.POST)
	public ResponseEntity<School> updateSchoolProfile(@RequestParam("token") String token,
			@RequestParam("file") MultipartFile file, @RequestParam("schoolName") String schoolName,
			@RequestParam("schoolDescription") String shoolDescription, @RequestParam("id") Long id) {
		LOG.info("Update school profile /updateSchoolProfile/");
		School existSchool = schoolService.findShoolById(id);

		String fileName = "";
		if (!file.isEmpty()) {
			try {
				fileName = file.getOriginalFilename();

				/*byte[] bytes = file.getBytes();
				String dir = System.getProperty("user.home") + PATH;
				File serverDirFile = new File(dir);
				if(!serverDirFile.exists()){
					serverDirFile.mkdirs();
				}

				// Create the file on server
				String imagePath = System.getProperty("user.home") + PATH + fileName;
				File serverFile = new File(imagePath);
				BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(serverFile));
				stream.write(bytes);
				stream.close();
				*/

				existSchool.setFileName(fileName);
				existSchool.setContentType(file.getContentType());
				existSchool.setFileData(file.getBytes());
				existSchool.setSchoolName(schoolName);
				existSchool.setSchoolDescription(shoolDescription);
				schoolService.updateNewSchool(existSchool);

			} catch (Exception e) {
				e.printStackTrace();
			}
		}

		return existSchool != null ? new ResponseEntity<School>(existSchool, HttpStatus.OK)
				: new ResponseEntity<School>(existSchool, HttpStatus.NOT_FOUND);
	}
}
