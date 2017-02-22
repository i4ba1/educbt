 select
        questiongr0_.id as id1_10_0_,
        questionpo1_.id as id1_12_1_,
        questiongr0_.created_date as created_2_10_0_,
        questiongr0_.is_deleted as is_delet3_10_0_,
        questiongr0_.global_value as global_v4_10_0_,
        questiongr0_.question_group_type as question5_10_0_,
        questiongr0_.question_pool_id as question6_10_0_,
        questionpo1_.is_activated as is_activ2_12_1_,
        questionpo1_.created_date as created_3_12_1_,
        questionpo1_.employee_id as employee5_12_1_,
        questionpo1_.name as name4_12_1_,
        questionpo1_.subject_id as subject_6_12_1_ 
    from
        cbt_question_group questiongr0_ 
    inner join
        cbt_question_pool questionpo1_ 
            on questiongr0_.question_pool_id=questionpo1_.id 
    inner join
        cbt_question questions2_ 
            on questiongr0_.id=questions2_.question_group_id 
    inner join
        cbt_question_group_images questiongr3_ 
            on questiongr0_.id=questiongr3_.question_group_id 
    where
        questiongr0_.id=? 
        and questiongr0_.is_deleted=false
Hibernate: 
    select
        questiongr0_.id as id1_10_0_,
        questionpo1_.id as id1_12_1_,
        questiongr0_.created_date as created_2_10_0_,
        questiongr0_.is_deleted as is_delet3_10_0_,
        questiongr0_.global_value as global_v4_10_0_,
        questiongr0_.question_group_type as question5_10_0_,
        questiongr0_.question_pool_id as question6_10_0_,
        questionpo1_.is_activated as is_activ2_12_1_,
        questionpo1_.created_date as created_3_12_1_,
        questionpo1_.employee_id as employee5_12_1_,
        questionpo1_.name as name4_12_1_,
        questionpo1_.subject_id as subject_6_12_1_ 
    from
        cbt_question_group questiongr0_ 
    inner join
        cbt_question_pool questionpo1_ 
            on questiongr0_.question_pool_id=questionpo1_.id 
    inner join
        cbt_question questions2_ 
            on questiongr0_.id=questions2_.question_group_id 
    inner join
        cbt_question_group_images questiongr3_ 
            on questiongr0_.id=questiongr3_.question_group_id 
    where
        questiongr0_.id=? 
        and questiongr0_.is_deleted=false
