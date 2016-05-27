package id.co.knt.cbt.util;

import java.io.UnsupportedEncodingException;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

public class PasswordUtility {

	public static String generatePass(String pass) {

		String base64encodedString = null;
		try {
			base64encodedString = Base64.getEncoder().encodeToString(pass.getBytes("utf-8"));
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return base64encodedString;
	}
	
	public static String decodePass(String pass) {

		String base64encodedString = null;
		try {
			byte[] bs = Base64.getDecoder().decode(pass);
			base64encodedString = new String(bs, "utf-8");
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return base64encodedString;
	}

	public static String generateHashPass(String pass) {
		MessageDigest m = null;
		try {
			m = MessageDigest.getInstance("MD5");
		} catch (NoSuchAlgorithmException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		m.update(pass.getBytes(), 0, pass.length());

		return new BigInteger(1, m.digest()).toString(25);
	}
}
