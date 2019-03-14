<?php
class student extends pdoClass{
    //获取学生所在课程id
    public function getCourseId($memberId) {
        $sql = "SELECT course_id FROM course_member WHERE course_member_id='$memberId'";
        return $this->select($sql);
    }
    
    //获取学生所在课程
    public function getCourse($courseIds) {
        $term = $this->getTerm();
        for ($i = 0; $i < count($courseIds); $i ++) {
            $sql = "SELECT * FROM course WHERE id={$courseIds[$i][0]} AND course_term='{$term[0]}' ORDER BY id DESC";
            $course[$i] = $this->find($sql);
        }
        return $course;
    }
    
    //获取作业
    public function getHomework($courseIds) {
        $homeworks = array();
        for ($i = 0; $i < count($courseIds); $i ++) {
            $sql = "SELECT * FROM homework WHERE homework_course_id={$courseIds[$i][0]} ORDER BY homework_time DESC";
            $homework[$i] = $this->select($sql);
            for ($j = 0; $j < count($homework[$i]); $j ++) {
                array_push($homeworks, $homework[$i][$j]);
            }
        }
        return $homeworks;
    }
    
    //获取资源
    public function getResource($courseIds) {
        $resources = array();
        for ($i = 0; $i < count($courseIds); $i ++) {
            $sql = "SELECT * FROM resource WHERE resource_course_id={$courseIds[$i][0]} ORDER BY resource_time DESC";
            $resource[$i] = $this->select($sql);
            for ($j = 0; $j < count($resource[$i]); $j ++) {
                array_push($resources, $resource[$i][$j]);
            }
        }
        return $resources;
    }
    
    //获取公告
    public function getNotice($courseIds) {
        $notices = array();
        for ($i = 0; $i < count($courseIds); $i ++) {
            $sql = "SELECT * FROM notice WHERE notice_course_id={$courseIds[$i][0]} ORDER BY notice_time DESC";
            $notice[$i] = $this->select($sql);
            for ($j = 0; $j < count($notice[$i]); $j ++) {
                array_push($notices, $notice[$i][$j]);
            }
        }
        return $notices;
    }
    
    //上交作业
    public function sentHomework($homework) {
        $sql = "INSERT INTO home_progress (
                    homework_id, 
                    homework_stu_id, 
                    homework_doc
                ) VALUES (
                    {$homework["homework_id"]}, 
                    '{$homework["id"]}', 
                    '{$homework["file"]}'
                )";
        return $this->exec($sql);
    }
    
    //检查作业是否已经完成
    public function checkProgress($homework, $uid) {
        $sql = "SELECT homework_progress FROM home_progress WHERE homework_id=$homework AND homework_stu_id='$uid'";
        return $this->find($sql);
    }
    
    //获取已上交的作业列表
    public function getHomeworkList($homework) {
        $sql = "SELECT * FROM home_progress WHERE homework_id=$homework";
        return $this->select($sql);
    }
    
    //学生互评
    public function grade($homework_id, $stu_id, $grader_id, $score) {
        $sql = "INSERT INTO homework_grade_student (
                    homework_id, 
                    homework_stu_id, 
                    homework_grader_id, 
                    score
                ) VALUES (
                    $homework_id, 
                    '$stu_id', 
                    '$grader_id', 
                    $score
                )";
        return $this->exec($sql);
    }
    
    //获取学生打分
    public function getScore($homework_id, $stu_id, $grader_id) {
        $sql = "SELECT score FROM homework_grade_student WHERE homework_id=$homework_id AND homework_stu_id='$stu_id' AND homework_grader_id='$grader_id'";
        return $this->find($sql);
    }
    
    public function getTerm() {
        $sql = "SELECT term FROM term WHERE current_term=1";
        return $this->find($sql);
    }
}