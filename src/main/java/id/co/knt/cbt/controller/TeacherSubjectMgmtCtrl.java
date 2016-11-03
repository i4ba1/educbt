package id.co.knt.cbt.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import id.co.knt.cbt.model.Tag;
import id.co.knt.cbt.service.TagService;

@CrossOrigin(origins = "http://localhost:8787")
@RestController
@RequestMapping(value = "/teacher/subMateriMgmt")
public class TeacherSubjectMgmtCtrl {

	private static final Logger LOG = LoggerFactory.getLogger(AdmSubjectCtrl.class);

	@Autowired
	private TagService tagService;

	/**
	 * Create tag
	 * 
	 * @param objects
	 * @return
	 */
	@RequestMapping(value = "/create/", method = RequestMethod.POST)
	public ResponseEntity<Void> createSubject(@RequestBody List<Object> objects) {
		LOG.info("Creating Tag " + objects.size());
		HttpHeaders headers = new HttpHeaders();

		if (tagService.addNewTag(objects) == null) {
			return new ResponseEntity<Void>(headers, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		return new ResponseEntity<Void>(headers, HttpStatus.OK);

	}

	/**
	 * Update tag
	 * 
	 * @param objects
	 * @return
	 */
	@RequestMapping(value = "/update/", method = RequestMethod.PUT)
	public ResponseEntity<Void> updateSubject(@RequestBody List<Object> objects) {
		LOG.info("Update Tag " + objects.size());
		HttpHeaders headers = new HttpHeaders();

		if (tagService.updateTag(objects) == null) {
			return new ResponseEntity<Void>(headers, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		return new ResponseEntity<Void>(headers, HttpStatus.OK);
	}

	/**
	 * Deleted tag with set deleted=true
	 * 
	 * @param token
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/delete/{token}/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<Void> deleteSubject(@PathVariable("token") String token, @PathVariable("id") Long id) {
		LOG.info("Deleted Tag /delete ");
		HttpHeaders headers = new HttpHeaders();

		tagService.deleteTag(id);

		return new ResponseEntity<Void>(headers, HttpStatus.OK);
	}

	/**
	 * Get all tag
	 * 
	 * @param token
	 * @return
	 */
	@RequestMapping(value = { "", "/{token}/{teacherId}" }, method = RequestMethod.GET)
	public ResponseEntity<List<Tag>> findAll(@PathVariable("token") String token, @PathVariable("teacherId") Long id) {
		LOG.info("Get all Tag / ");
		List<Tag> tags = tagService.findAll(id);

		if (tags == null) {
			return new ResponseEntity<List<Tag>>(tags, HttpStatus.INTERNAL_SERVER_ERROR);
		} else if (tags.size() == 0) {
			return new ResponseEntity<List<Tag>>(tags, HttpStatus.NOT_FOUND);
		}

		return new ResponseEntity<List<Tag>>(tags, HttpStatus.OK);
	}

	@RequestMapping(value = { "/findTagBySubject/{token}/{teacherId}/{subjectId}" }, method = RequestMethod.GET)
	public ResponseEntity<List<Tag>> findTagsBySubject(@PathVariable("token") String token,
			@PathVariable("teacherId") Long id, @PathVariable("subjectId") Integer subjectId) {
		LOG.info("Get all Tag / ");
		List<Tag> tags = tagService.findTagBySubject(id, subjectId);

		if (tags == null) {
			return new ResponseEntity<List<Tag>>(tags, HttpStatus.INTERNAL_SERVER_ERROR);
		} else if (tags.size() == 0) {
			return new ResponseEntity<List<Tag>>(tags, HttpStatus.NOT_FOUND);
		}

		return new ResponseEntity<List<Tag>>(tags, HttpStatus.OK);
	}

	/**
	 * Get tag by id
	 * 
	 * @param token
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/findTagById/{token}/{id}", method = RequestMethod.GET)
	public ResponseEntity<Tag> findById(@PathVariable("token") String token, @PathVariable("id") Long id) {
		LOG.info("Get tag by id / ");
		Tag tag = tagService.findTagById(id);

		if (tag == null) {
			return new ResponseEntity<Tag>(tag, HttpStatus.NOT_FOUND);
		}

		return new ResponseEntity<Tag>(tag, HttpStatus.OK);
	}
}
