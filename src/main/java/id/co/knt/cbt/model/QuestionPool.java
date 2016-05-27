package id.co.knt.cbt.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * 
 * @author MNI
 *
 */
@Entity
@Table(name = "cbt_question_pool")
public class QuestionPool implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 3445184834215879999L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;

	@Column(name = "created_date")
	private Date createdDate;

	@Column(name = "is_activated")
	private Boolean activated = true;

	@Column(name = "name")
	private String questionPoolName;

	@JsonProperty("subject")
	@ManyToOne
	@JoinColumn(name = "subject_id", referencedColumnName = "id")
	private Subject subject;

	@JsonProperty("questionGroups")
	@OneToMany(mappedBy = "questionPool", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
	private List<QuestionGroup> questionGroups;

	@JsonProperty("employee")
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name = "employee_id", referencedColumnName = "id")
	private Employee employee;

	public Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}

	public Long getId() {
		return id;
	}

	public Subject getSubject() {
		return subject;
	}

	public void setSubject(Subject subject) {
		this.subject = subject;
	}

	public Boolean getActivated() {
		return activated;
	}

	public String getQuestionPoolName() {
		return questionPoolName;
	}

	public void setQuestionPoolName(String questionPoolName) {
		this.questionPoolName = questionPoolName;
	}

	public void setActivated(Boolean activated) {
		this.activated = activated;
	}

	public Employee getEmployee() {
		return employee;
	}

	public void setEmployee(Employee employee) {
		this.employee = employee;
	}

	public List<QuestionGroup> getQuestionGroups() {
		return questionGroups;
	}

	public void setQuestionGroups(QuestionGroup questionGroup) {
		if (questionGroups == null) {
			questionGroups = new ArrayList<QuestionGroup>();
		}
		
		questionGroups.add(questionGroup);
	}
}