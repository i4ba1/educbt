package id.co.knt.cbt.controller;

import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import id.co.knt.cbt.model.Gallery;
import id.co.knt.cbt.model.QuestionGroup;
import id.co.knt.cbt.model.QuestionGroupImages;
import id.co.knt.cbt.model.QuestionGroupImages.ImageExtention;
import id.co.knt.cbt.service.GalleryService;
import id.co.knt.cbt.service.QuestionService;

@CrossOrigin(origins="http://localhost:8787")
@RestController
@RequestMapping(value = "/user/upload")
public class UploadResourcesCtrl {

	@Value("${path.question.image}")
	private String Q_IMG_PATH = "";
	private static final Logger LOG = LoggerFactory.getLogger(UploadResourcesCtrl.class);

	@Autowired
	private GalleryService resourceService;

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
				JSONArray arrayObj = new JSONArray(objects);
				Long id = arrayObj.getLong(1);
				JSONArray arrayImages = arrayObj.getJSONObject(0).getJSONArray("images");
				QuestionGroup qGroup = questionService.findQGById(id);
				QuestionGroupImages questionGroupImages = null;
				
				for(int i=0; i<arrayImages.length(); i++){
					JSONObject obj = arrayImages.getJSONObject(i);
					questionGroupImages = new QuestionGroupImages();
					questionGroupImages.setImageName(obj.getString("imageName"));
					String imageName = obj.getString("imageName");
					questionGroupImages.setBase64Image(obj.getString("base64"));
					questionGroupImages.setImageExtention(ImageExtention.valueOf(imageName.substring(imageName.lastIndexOf("."), imageName.length()-1)));
					questionGroupImages.setCreatedDate(System.currentTimeMillis());
					questionGroupImages.setQuestionGroup(qGroup);
					questionService.addNewQuestionImage(questionGroupImages);
				}
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<Void>(header, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		return new ResponseEntity<Void>(header, HttpStatus.OK);
	}

	@RequestMapping(value = "/deleteImgQuestion/", method = RequestMethod.POST)
	public ResponseEntity<Void> uploadImgQuestion(@RequestParam("token") String token,
			@RequestParam("questionGroupImageId") Long questionGroupId) {
		LOG.info("/uploadImgQuestion/ ");
		HttpHeaders header = new HttpHeaders();

		try {
			QuestionGroupImages groupImages = questionService.findQGImages(questionGroupId);
			questionService.deleteQuestionImage(groupImages);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<Void>(header, HttpStatus.INTERNAL_SERVER_ERROR);
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
