package id.co.knt.cbt.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "cbt_question_group")
public class QuestionGroup implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public enum QG_TYPE {
		MC, TF, MTCH, PASSAGE
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;

	@Column(name = "created_date")
	private Long createdDate;

	@Column(name = "question_group_type")
	@Enumerated(EnumType.STRING)
	private QG_TYPE qgType;

	@Column(name = "question_group_name")
	private String questionGroupName;

	@Column(name = "global_value", columnDefinition="TEXT")
	private String globalValue;

	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name = "question_pool_id", referencedColumnName = "id")
	private QuestionPool questionPool;
	
	@Column(name="is_deleted")
	private boolean deleted = false;

	@JsonProperty("questions")
	@OneToMany(mappedBy = "questionGroup", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
	private List<Question> questions;

	public Long getId() {
		return id;
	}

	public Long getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(Long createdDate) {
		this.createdDate = createdDate;
	}

	public QG_TYPE getQgType() {
		return qgType;
	}

	public void setQgType(QG_TYPE qgType) {
		this.qgType = qgType;
	}

	public void setQuestionGroupName(String questionGroupName){
		this.questionGroupName = questionGroupName;
	}

	public String getQuestionGroupName(){
		return this.questionGroupName;
	}

	public String getGlobalValue() {
		return globalValue;
	}

	public void setGlobalValue(String globalValue) {
		this.globalValue = globalValue;
	}
	
	public boolean isDeleted() {
		return deleted;
	}

	public void setDeleted(boolean deleted) {
		this.deleted = deleted;
	}

	public QuestionPool getQuestionPool() {
		return questionPool;
	}

	public void setQuestionPool(QuestionPool questionPool) {
		this.questionPool = questionPool;
	}

	public List<Question> getQuestions() {
		return questions;
	}

	public void setQuestions(Question q) {
		if (questions == null) {
			questions = new ArrayList<Question>();
		}

		questions.add(q);
	}
}
