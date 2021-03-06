package id.co.knt.cbt.service;

import id.co.knt.cbt.model.StudentEventTime;

/**
 * Created by MNI on 8/22/2016.
 */
public interface StudentEventTimeService {
    StudentEventTime saveTime(StudentEventTime studentEventTime);

    StudentEventTime updateTime(StudentEventTime studentEventTime);

    StudentEventTime findStudentEventTime(Long eventId, String studentId);

    StudentEventTime findOne(Long id);
}
