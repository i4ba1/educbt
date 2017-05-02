package id.co.knt.cbt.util;

import java.net.InetAddress;
import java.net.NetworkInterface;

public class MACAddr {
	public static byte[] getMacAddress(){
        try{
            InetAddress address = InetAddress.getLocalHost();
            NetworkInterface nwi = NetworkInterface.getByInetAddress(address);
            byte mac[] = nwi.getHardwareAddress();
            return mac;
        }catch(Exception e){
            e.printStackTrace();
        }
		
        return null;
	}
}