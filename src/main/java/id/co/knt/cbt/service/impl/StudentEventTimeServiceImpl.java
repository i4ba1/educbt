package id.co.knt.cbt.service.impl;

import id.co.knt.cbt.model.StudentEventTime;
import id.co.knt.cbt.repositories.StudentEventTimeRepo;
import id.co.knt.cbt.service.StudentEventTimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created by MNI on 8/22/2016.
 */
@Service("studentEventService")
public class StudentEventTimeServiceImpl implements StudentEventTimeService{

    @Autowired
    private StudentEventTimeRepo studentEventTimeRepo;

    @Override
    public StudentEventTime saveTime(StudentEventTime studentEventTime) {
        return studentEventTimeRepo.save(studentEventTime);
    }

    @Override
    public StudentEventTime updateTime(StudentEventTime studentEventTime) {
        return studentEventTimeRepo.saveAndFlush(studentEventTime);
    }

    @Override
    public Long findStudentEventTime(Long id) {
        return studentEventTimeRepo.findOne(id) == null? 0:studentEventTimeRepo.findOne(id).getLastUpdatedTime();
    }
}
