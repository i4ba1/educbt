package id.co.knt.cbt.controller;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import id.co.knt.cbt.model.QuestionGroupImages;
import id.co.knt.cbt.service.QuestionService;

//@CrossOrigin(origins="http://localhost:8787")
@RestController
@RequestMapping(value = "/user/upload")
public class UploadResourcesController {

	@Value("${path.question.image}")
	private String Q_IMG_PATH = "";
	private static final Logger LOG = LoggerFactory.getLogger(UploadResourcesController.class);

	@Autowired
	private QuestionService questionService;

	/**
	 * Upload the image from gallery+
	 * 
	 * @param token
	 * @param teacherId
	 * @param questionId
	 * @param List of images(fileName, base64)
	 * @return
	 */
	@RequestMapping(value = "/uploadImgQuestion/", method = RequestMethod.POST)
	public ResponseEntity<Void> uploadImgQuestion(@RequestBody List<Object> objects) {
		LOG.info("/uploadImgQuestion/ ");
		HttpHeaders header = new HttpHeaders();
		
		try {
				questionService.addNewQuestionImage(objects);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<Void>(header, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		return new ResponseEntity<Void>(header, HttpStatus.OK);
	}
	
	@RequestMapping(value = "/findImages/{id}", method = RequestMethod.GET)
	public ResponseEntity<List<QuestionGroupImages>> findImages(@PathVariable("token") String token, @PathVariable("id") Long id) {
		LOG.info("/findImages/ ");
		List<QuestionGroupImages> images = new ArrayList<>();
		
		try {
				images = questionService.findQGImages(id);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<List<QuestionGroupImages>>(images, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		return new ResponseEntity<List<QuestionGroupImages>>(images, HttpStatus.OK);
	}

	@RequestMapping(value = "/deleteImgQuestion/{token}/{questionGroupImageId}", method = RequestMethod.DELETE)
	public ResponseEntity<Void> uploadImgQuestion(@PathVariable("token") String token,
			@PathVariable("questionGroupImageId") Long questionGroupImageId) {
		LOG.info("/deleteImgQuestion/ ");
		HttpHeaders header = new HttpHeaders();

		try {
			QuestionGroupImages groupImages = questionService.findQGImage(questionGroupImageId);
			questionService.deleteQuestionImage(groupImages);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<Void>(header, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		return new ResponseEntity<Void>(header, HttpStatus.OK);
	}
}
