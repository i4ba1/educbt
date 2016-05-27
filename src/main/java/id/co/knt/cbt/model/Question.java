package id.co.knt.cbt.model;

import java.io.Serializable;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name="cbt_question")
public class Question implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = -7823542438707459455L;
	
	public enum Difficulty {
		EASY, MEDIUM, HARD, VERY_HARD;
	}
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="id")
	private Long id;
	
	@Column(name="question", columnDefinition="LONGTEXT")
	private String question;
	
	@Column(name="option_a", columnDefinition="LONGTEXT", nullable=true)
	private String optionA;
	
	@Column(name="option_b", columnDefinition="LONGTEXT", nullable=true)
	private String optionB;
	
	@Column(name="option_c", columnDefinition="LONGTEXT", nullable=true)
	private String optionC;
	
	@Column(name="option_d", columnDefinition="LONGTEXT", nullable=true)
	private String optionD;
	
	@Column(name="option_e", columnDefinition="LONGTEXT", nullable=true)
	private String optionE;
	
	@Column(name="key")
	private String key;
	
	@Column(name="difficulty")
	private Difficulty difficulty;
	
	@Column(name="explanation", columnDefinition="LONGTEXT")
	private String explanation;
	
	@Column(name="disabled")
	private Boolean disabled = false;
	
	@Column(name="type_question")
	private String typeQuestion;
	
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="question_group_id", referencedColumnName="id")
	private QuestionGroup questionGroup;
	
	@JsonIgnore
	@OneToMany(mappedBy="question", cascade=CascadeType.ALL, orphanRemoval=true, fetch=FetchType.LAZY)
	private List<StudentAnswer> studentAnswers;

	public String getQuestion() {
		return question;
	}

	public void setQuestion(String question) {
		this.question = question;
	}

	public String getOptionA() {
		return optionA;
	}

	public void setOptionA(String optionA) {
		this.optionA = optionA;
	}

	public String getOptionB() {
		return optionB;
	}

	public void setOptionB(String optionB) {
		this.optionB = optionB;
	}

	public String getOptionC() {
		return optionC;
	}

	public void setOptionC(String optionC) {
		this.optionC = optionC;
	}

	public String getOptionD() {
		return optionD;
	}

	public void setOptionD(String optionD) {
		this.optionD = optionD;
	}
	
	public String getOptionE() {
		return optionE;
	}

	public void setOptionE(String optionE) {
		this.optionE = optionE;
	}

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public Difficulty getDifficulty() {
		return difficulty;
	}

	public void setDifficulty(Difficulty weight) {
		this.difficulty = weight;
	}

	public String getExplanation() {
		return explanation;
	}

	public void setExplanation(String explanation) {
		this.explanation = explanation;
	}
	
	public String getTypeQuestion() {
		return typeQuestion;
	}

	public void setTypeQuestion(String typeQuestion) {
		this.typeQuestion = typeQuestion;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

	public Long getId() {
		return id;
	}

	public QuestionGroup getQuestionGroup() {
		return questionGroup;
	}

	public void setQuestionGroup(QuestionGroup questionGroup) {
		this.questionGroup = questionGroup;
	}

	public Boolean getDisabled() {
		return disabled;
	}

	public void setDisabled(Boolean disabled) {
		this.disabled = disabled;
	}

	public List<StudentAnswer> getStudentAnswers() {
		return studentAnswers;
	}

	public void setStudentAnswers(List<StudentAnswer> studentAnswers) {
		this.studentAnswers = studentAnswers;
	}
}
