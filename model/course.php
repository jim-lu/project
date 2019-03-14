<?php 
class course extends pdoClass{
    //获取最新的几个课程
    public function getCourse($limit="0,10") {
        $sql = "SELECT id,course_name,course_teacher,course_img FROM course ORDER BY id DESC LIMIT $limit";
        return $this->select($sql);
    }
    
    //获取课程信息
    public function getCourseInfo($id) {
        $sql = "SELECT * FROM course WHERE id=$id";
        return $this->find($sql);
    }
    
    //获取学生一页信息
    public function getStudentInfo($page="0,14", $id) {
        $sql = "SELECT * FROM course_member WHERE course_id=$id LIMIT $page";
        return $this->select($sql);
    }
    
    //获取学生总数
    public function getTotalNumber($id) {
        $sql = "SELECT count(id) FROM course_member WHERE course_id=$id";
        return $this->select($sql);
    }
    
    //获取公告总数
    public function getTotalNotice($id) {
        $sql = "SELECT count(id) FROM notice WHERE notice_course_id=$id";
        return $this->select($sql);
    }
    
    //获取资源总数
    public function getTotalResource($id) {
        $sql = "SELECT count(id) FROM resource WHERE resource_course_id=$id";
        return $this->select($sql);
    }
    
    //获取作业总数
    public function getTotalHomework($id) {
        $sql = "SELECT count(id) FROM homework WHERE homework_course_id=$id";
        return $this->select($sql);
    }
    
    //获取某教师的课程
    public function getTeacherCourse($teacher_id) {
        $term = $this->getTerm();
        $sql = "SELECT id,course_name,course_time FROM course WHERE course_teacher_id=$teacher_id AND course_term='{$term[0]}'";
        return $this->select($sql);
    }
    
    //根据时间戳获取单条作业
    public function getHomework($time) {
        $sql = "SELECT * FROM homework WHERE homework_time=$time";
        return $this->find($sql);
    }
    
    //根据时间戳获取单条资源
    public function getResource($time) {
        $sql = "SELECT * FROM resource WHERE resource_time=$time";
        return $this->find($sql);
    }
    
    //根据时间戳获取单条公告
    public function getNotice($time) {
        $sql = "SELECT * FROM notice WHERE notice_time=$time";
        return $this->find($sql);
    }
    
    //获取多条公告
    public function getCourseNotice($course_id, $limit="0,10") {
        $sql = "SELECT * FROM notice WHERE notice_course_id=$course_id ORDER BY notice_time DESC LIMIT $limit";
        return $this->select($sql);
    }
    
    //获取多条资源
    public function getCourseResource($course_id, $limit="0,10") {
        $sql = "SELECT * FROM resource WHERE resource_course_id=$course_id ORDER BY resource_time DESC LIMIT $limit";
        return $this->select($sql);
    }
    
    //获取作业列表
    public function getCourseHomework($course_id, $limit = "0,10") {
        $sql = "SELECT * FROM homework WHERE homework_course_id=$course_id ORDER BY homework_time DESC LIMIT $limit";
        return $this->select($sql);
    }
    
    //通过名称和时间获取课程
    public function getCourseByTime($arr) {
        $name = $arr[0];
        $time = $arr[1];
        $tmp = "SELECT term FROM term WHERE current_term=1";
        $term = $this->find($tmp);
        $sql = "SELECT * FROM course WHERE course_name='$name' AND course_time='$time' AND course_term='{$term[0]}' ORDER BY id DESC";
        return $this->find($sql);
    }
    
    //添加课程成员
    public function addMember($cid, $name, $uid) {
        $sql = "INSERT INTO course_member (course_id,course_member_name,course_member_id) VALUES ($cid, '$name', '$uid')";
        return $this->exec($sql);
    }
    
    //判断是否已经加入课程
    public function checkMember($cid, $uid) {
        $sql = "SELECT course_member_id FROM course_member WHERE course_id=$cid AND course_member_id='$uid'";
        return $this->find($sql);
    }
    
    //获取某课程所有成员
    public function getAllMember($course_id) {
        $sql = "SELECT * FROM course_member WHERE course_id=$course_id";
        return $this->select($sql);
    }
    
    //发送评论
    public function sentComment($comment) {
        if($comment["type"] == "student") {
            $sql = "INSERT INTO comment (
                        comment_content,
                        comment_course_id, 
                        comment_stu_id
                    ) VALUES (
                        '{$comment["text"]}', 
                        {$comment["course_id"]}, 
                        '{$comment["sender"]}'
                    )";
        } elseif ($comment["type"] == "teacher") {
            $sql = "INSERT INTO comment (
                        comment_content,
                        comment_course_id,
                        comment_teacher_id
                    ) VALUES (
                        '{$comment["text"]}',
                        {$comment["course_id"]},
                        {$comment["sender"]}
                    )";
        }
        return $this->exec($sql);
    }
    
    //获取评论
    public function getComment($course_id) {
        $sql = "SELECT * FROM comment WHERE comment_course_id=$course_id ORDER BY comment_time DESC";
        return $this->select($sql);
    }
    
    public function getTerm() {
        $sql = "SELECT term FROM term WHERE current_term=1";
        return $this->find($sql);
    }
}