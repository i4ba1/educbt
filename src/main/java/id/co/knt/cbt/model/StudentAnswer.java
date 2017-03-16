package id.co.knt.cbt.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name="cbt_student_answer")
public class StudentAnswer implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 5875724808409807919L;
	
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Column(name="id")
	private Long id;

	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="student_id", referencedColumnName="id")
	private Student student;
	
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="question_id", referencedColumnName="id")
	private Question question;
	
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="event_id", referencedColumnName="id")
	private Event event;
	
	@Column(name="answer")
	private String answered;
	
	@Column(name="is_correct")
	private Boolean correct;
	
	public StudentAnswer() {
		super();
	}

	public StudentAnswer(Student student, Question question, Event e, String answered, Boolean correct) {
		super();
		this.student = student;
		this.question = question;
		this.answered = answered;
		this.correct = correct;
		this.event = e;
	}
	
	public Long getId() {
		return id;
	}

	public Student getStudent() {
		return student;
	}

	public void setStudent(Student student) {
		this.student = student;
	}

	public Question getQuestion() {
		return question;
	}

	public void setQuestion(Question question) {
		this.question = question;
	}
	
	public Event getEvent() {
		return event;
	}

	public void setEvent(Event event) {
		this.event = event;
	}

	public String getAnswered() {
		return answered;
	}

	public void setAnswered(String answered) {
		this.answered = answered;
	}

	public Boolean getCorrect() {
		return correct;
	}

	public void setCorrect(Boolean correct) {
		this.correct = correct;
	}
}