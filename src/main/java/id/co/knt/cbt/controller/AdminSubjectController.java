
package id.co.knt.cbt.controller;

import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import id.co.knt.cbt.model.Subject;
import id.co.knt.cbt.model.Tag;
import id.co.knt.cbt.service.SubjectService;
import id.co.knt.cbt.service.TagService;

/**
 * 
 * @author MNI
 */
@CrossOrigin(origins="http://localhost:8787")
@RestController
@RequestMapping(value = "/admin/subject_mgmt")
public class AdminSubjectController {
	private static final Logger LOG = LoggerFactory.getLogger(AdminSubjectController.class);

	@Autowired
	private SubjectService subjectService;

	@Autowired
	private TagService tagService;

	/**
	 * get All list subject
	 * 
	 * @return List
	 */
	@RequestMapping(value = { "", "/{token}" }, method = RequestMethod.GET)
	public ResponseEntity<Iterable<Subject>> getAllSubject(@PathVariable("token") String token) {
		Iterable<Subject> list = subjectService.getAllSubject();

		if (list == null) {
			// You many decide to return HttpStatus.NOT_FOUND
			return new ResponseEntity<Iterable<Subject>>(HttpStatus.NOT_FOUND);
		}

		LOG.info("Successfully get all kelas " + "/list/");
		return new ResponseEntity<Iterable<Subject>>(list, HttpStatus.OK);
	}

	/**
	 * Retrieve Single Subject
	 * 
	 * @param nip
	 * @return
	 */
	@RequestMapping(value = "/find/{token}/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Subject> getSubject(@PathVariable("token") String token, @PathVariable("id") Integer id) {
		LOG.info("Fetching Subject with id " + id);
		Subject subject = subjectService.findSubjectById(id);

		if (subject == null) {
			LOG.info("Subject with name " + id + " not found");
			return new ResponseEntity<Subject>(HttpStatus.NOT_FOUND);
		}

		return new ResponseEntity<Subject>(subject, HttpStatus.OK);
	}

	@RequestMapping(value = "/findThemeBySubject/{token}/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<Tag>> getThemeBySubject(@PathVariable("token") String token,
			@PathVariable("id") Integer id) {
		LOG.info("Fetching Subject with id " + id);
		List<Tag> tags = tagService.findThemeBySubject(id);

		if (tags == null) {
			LOG.info("Subject with name " + id + " not found");
			return new ResponseEntity<List<Tag>>(tags, HttpStatus.NOT_FOUND);
		}

		return new ResponseEntity<List<Tag>>(tags, HttpStatus.OK);
	}

	/**
	 * Create a Subject
	 * 
	 * @param subject
	 * @return
	 */
	@RequestMapping(value = "/create/", method = RequestMethod.POST)
	public ResponseEntity<Void> createSubject(@RequestBody List<Object> objects) {
		LOG.info("Creating Subject " + objects.size());
		HttpHeaders headers = new HttpHeaders();
		int result = subjectService.save(objects);

		if(result == 1){
			return new ResponseEntity<Void>(headers, HttpStatus.INTERNAL_SERVER_ERROR);
		}else if(result == 2){
			return new ResponseEntity<Void>(headers, HttpStatus.CONFLICT);
		}else{
			return new ResponseEntity<Void>(headers, HttpStatus.OK);
		}
	}

	/**
	 * Save import data of subject from csv. With json array format
	 * 
	 * @param objects
	 * @return
	 */
	@RequestMapping(value = "/import/", method = RequestMethod.POST)
	public ResponseEntity<Void> importSubject(@RequestBody List<Object> objects) {
		HttpHeaders headers = new HttpHeaders();
		int result = subjectService.importSubject(objects);

		if(result == 1){
			return new ResponseEntity<Void>(headers, HttpStatus.INTERNAL_SERVER_ERROR);
		}else if(result == 2){
			return new ResponseEntity<Void>(headers, HttpStatus.CONFLICT);
		}else{
			return new ResponseEntity<Void>(headers, HttpStatus.OK);
		}
	}

	/**
	 * Update a Subject
	 * 
	 * @param id
	 * @param subject
	 * @return
	 */
	@RequestMapping(value = "/update/", method = RequestMethod.PUT)
	public ResponseEntity<Subject> updateSubject(@RequestBody List<Object> objects) {
		JSONArray array = new JSONArray(objects);
		JSONObject obj = array.getJSONObject(0).getJSONObject("subject");
		Subject currentSubject = subjectService.findSubjectById(obj.getInt("id"));

		if (currentSubject == null) {
			return new ResponseEntity<Subject>(HttpStatus.NOT_FOUND);
		}

		currentSubject.setSubjectName(obj.getString("subjectName"));
		subjectService.updateSubject(currentSubject);

		return new ResponseEntity<Subject>(currentSubject, HttpStatus.OK);
	}

	/**
	 * Delete a Subject
	 * 
	 * @param nip
	 * @return
	 */
	@RequestMapping(value = "/delete/{token}/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<Subject> deleteSubject(@PathVariable("token") String token, @PathVariable("id") Integer id) {
		System.out.println("Fetching & Deleting Subject with id " + id);

		Subject subject = subjectService.findSubjectById(id);
		if (subject == null) {
			System.out.println("Unable to delete. Subject with id " + id + " not found");
			return new ResponseEntity<Subject>(HttpStatus.NOT_FOUND);
		}

		subject.setDeleted(true);
		subjectService.delete(subject);
		return new ResponseEntity<Subject>(HttpStatus.OK);
	}

	@RequestMapping(value = "/deleteTheme/{token}/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<Void> deleteTheme(@PathVariable("token") String token, @PathVariable("id") Long id) {
		System.out.println("Fetching & Deleting theme with id " + id);
		HttpHeaders headers = new HttpHeaders();

		Tag th = tagService.findTagById(id);
		if (th == null) {
			System.out.println("Unable to delete. Subject with id " + id + " not found");
			return new ResponseEntity<Void>(headers, HttpStatus.NOT_FOUND);
		}

		return new ResponseEntity<Void>(headers, HttpStatus.OK);
	}
}