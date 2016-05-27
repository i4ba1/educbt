package id.co.knt.cbt.model;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Entity
@Table(name="cbt_event_result")
public class EventResult implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = -6593921866110937715L;
	
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Column(name="id")
	private Long id;
	
	@ManyToOne
	@JoinColumn(name="student_id", referencedColumnName="id")
	private Student student;
	
	@ManyToOne
	@JoinColumn(name="event_id", referencedColumnName="id")
	private Event event;
	
	@Column(name="correct")
	private Double correct;
	
	@Column(name="incorrect")
	private Double incorrect;
	
	@Column(name="total")
	private Double total;
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="created_date")
	private Date createdDate;

	public Long getId() {
		return id;
	}

	public Student getStudent() {
		return student;
	}

	public void setStudent(Student student) {
		this.student = student;
	}

	public Event getEvent() {
		return event;
	}

	public void setEvent(Event event) {
		this.event = event;
	}
	
	public Double getCorrect() {
		return correct;
	}

	public void setCorrect(Double correct) {
		this.correct = correct;
	}

	public Double getIncorrect() {
		return incorrect;
	}

	public void setIncorrect(Double incorrect) {
		this.incorrect = incorrect;
	}

	public Double getTotal() {
		return total;
	}

	public void setTotal(Double total) {
		this.total = total;
	}

	public Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}
}
