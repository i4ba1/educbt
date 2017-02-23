package id.co.knt.cbt.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name="cbt_question_group_images")
public class QuestionGroupImages implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = -7358715092532048219L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;

	@Column(name = "base64_image", columnDefinition="text")
	private String base64Image;

	@Column(name="image_name")
	private String imageName;

	@Column(name = "created_date")
	private Long createdDate;

	@ManyToOne
	@JoinColumn(name="question_group_id", nullable=false)
	private QuestionGroup questionGroup;

	public Long getId() {
		return id;
	}

	public String getBase64Image(){
		return this.base64Image;
	}

	public void setBase64Image(String base64Image){
		this.base64Image = base64Image;
	}

	public String getImageName(){
		return this.imageName;
	}

	public void setImageName(String imageName){
		this.imageName = imageName;
	}

	public Long getCreatedDate(){
		return this.createdDate;
	}

	public void setCreatedDate(Long createdDate){
		this.createdDate = createdDate;
	}

	public QuestionGroup getQuestionGroup(){
		return this.questionGroup;
	}

	public void setQuestionGroup(QuestionGroup questionGroup){
		this.questionGroup = questionGroup;
	}	
}