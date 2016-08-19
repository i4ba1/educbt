package id.co.knt.cbt.model;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Entity
@Table(name = "cbt_user")
public class User implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 7807607721774198021L;

	public enum Religion {
		ISLAM, CHRISTIAN, PROTESTANT, HINDU, BUDDHA, OTHER;
	}

	public enum Sex {
		MALE, FEMALE
	}

	public enum UserType {
		ADMIN, STUDENT, EMPLOYEE
	}

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "id")
	private Long id;

	@Column(name = "username")
	private String userName;

	@Column(name = "password")
	private String password;

	@Column(name = "first_name")
	private String firstName;

	@Column(name = "last_name")
	private String lastName;

	@Column(name = "email")
	private String email;

	@Column(name = "hashed_password")
	private String hashedPassword;

	@Column(name = "SALT")
	private String salt;

	@Column(name = "RESET_PASSWORD_CODE")
	private String resetPasswordCode;

	@Column(name = "RESET_PASSWORD_CODE_UNTIL")
	@Temporal(TemporalType.TIMESTAMP)
	private Date resetPasswordCodeUntil;

	@Column(name = "school")
	protected String school;

	@Column(name = "address")
	private String address;

	@Column(name = "birth_place")
	private String birthPlace;

	@Column(name = "birth_date")
	private Long birthDate;

	@Column(name = "mobile_phone")
	private String mobilePhone;

	@Column(name = "phone")
	private String phone;

	@Column(name = "gender")
	@Enumerated(EnumType.STRING)
	private Sex gender;

	@Column(name = "religion")
	@Enumerated(EnumType.STRING)
	protected Religion religion = Religion.ISLAM;

	@Column(name = "is_deleted")
	private Boolean deleted = false;

	@Column(name = "is_admin")
	private Boolean admin = false;

	@Column(name = "user_type")
	private UserType userType;

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getHashedPassword() {
		return hashedPassword;
	}

	public void setHashedPassword(String hashedPassword) {
		this.hashedPassword = hashedPassword;
	}

	public String getSalt() {
		return salt;
	}

	public void setSalt(String salt) {
		this.salt = salt;
	}

	public String getResetPasswordCode() {
		return resetPasswordCode;
	}

	public void setResetPasswordCode(String resetPasswordCode) {
		this.resetPasswordCode = resetPasswordCode;
	}

	public Date getResetPasswordCodeUntil() {
		return resetPasswordCodeUntil;
	}

	public void setResetPasswordCodeUntil(Date resetPasswordCodeUntil) {
		this.resetPasswordCodeUntil = resetPasswordCodeUntil;
	}

	public String getSchool() {
		return school;
	}

	public void setSchool(String school) {
		this.school = school;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getBirthPlace() {
		return birthPlace;
	}

	public void setBirthPlace(String birthPlace) {
		this.birthPlace = birthPlace;
	}

	public Long getBirthDate() {
		return birthDate;
	}

	public void setBirthDate(Long birthDate) {
		this.birthDate = birthDate;
	}

	public String getMobilePhone() {
		return mobilePhone;
	}

	public void setMobilePhone(String mobilePhone) {
		this.mobilePhone = mobilePhone;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public Sex getGender() {
		return gender;
	}

	public void setGender(Sex gender) {
		this.gender = gender;
	}

	public Religion getReligion() {
		return religion;
	}

	public void setReligion(Religion religion) {
		this.religion = religion;
	}

	public Long getId() {
		return id;
	}

	public Boolean getDeleted() {
		return deleted;
	}

	public void setDeleted(Boolean deleted) {
		this.deleted = deleted;
	}

	public Boolean isAdmin() {
		return admin;
	}

	public void setAdmin(Boolean admin) {
		this.admin = admin;
	}

	public UserType getUserType() {
		return userType;
	}

	public void setUserType(UserType userType) {
		this.userType = userType;
	}
}