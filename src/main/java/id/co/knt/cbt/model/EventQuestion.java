
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
@Table(name="cbt_event_question")
public class EventQuestion implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 2893578839373994157L;

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Column(name="id")
	private Long id;
	
	@ManyToOne(fetch= FetchType.LAZY)
	@JoinColumn(name="event_id", referencedColumnName="id")
	private Event event;
	
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="question_id", referencedColumnName="id")
	private Question question;
	
	public EventQuestion() {
		// TODO Auto-generated constructor stub
	}
	
	public EventQuestion(Event event, Question question) {
		super();
		this.event = event;
		this.question = question;
	}

	public Event getEvent() {
		return event;
	}

	public void setEvent(Event event) {
		this.event = event;
	}

	public Question getQuestion() {
		return question;
	}

	public void setQuestion(Question question) {
		this.question = question;
	}

	public Long getId() {
		return id;
	}
}
