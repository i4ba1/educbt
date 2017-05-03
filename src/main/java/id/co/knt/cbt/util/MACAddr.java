package id.co.knt.cbt.util;

import java.net.NetworkInterface;
import java.util.Enumeration;

public class MACAddr {
	public static byte[] getMacAddress(){
		byte[] mac = null;
		
		try {
			Enumeration<NetworkInterface> enumeration = NetworkInterface.getNetworkInterfaces();
			//String name = enumeration.nextElement().getName();
			while(enumeration.hasMoreElements() && mac == null){
				NetworkInterface net = (NetworkInterface)enumeration.nextElement();
				byte[] hw = net.getHardwareAddress();
				if(hw != null){
					mac = hw;
				}
				//System.out.println(mac);
			}
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		
        return mac;
	}
}