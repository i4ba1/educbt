package id.co.knt.cbt.model;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Entity
@Table(name="cbt_login")
public class Login implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -7210133046111533458L;

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Column(name="id")
	private Long id;
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="login_date")
	private Date loginDate;
	
	@Column(name="login_token")
	private String token;
	
	@Column(name="token_expired")
	private Long tokenExpired;
	
	@ManyToOne(fetch=FetchType.EAGER)
	@JoinColumn(name="user_id", referencedColumnName="id")
	private User user;

	public Date getLoginDate() {
		return loginDate;
	}

	public void setLoginDate(Date loginDate) {
		this.loginDate = loginDate;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}
	
	public Long getTokenExpired() {
		return tokenExpired;
	}

	public void setTokenExpired(Long tokenExpired) {
		this.tokenExpired = tokenExpired;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public Long getId() {
		return id;
	}
}
