<?php
class search extends pdoClass{
    //获取课程一页信息
    public function getCourseInfo($page="0,10", $key) {
        $sql = "SELECT * FROM course WHERE course_name LIKE '%$key%' LIMIT $page";
        return $this->select($sql);
    }

    //获取课程总数
    public function getTotalCourseNumber($key) {
        $sql = "SELECT count(id) FROM course WHERE course_name LIKE '%$key%'";
        return $this->select($sql);
    }
    
    //获取教师一页信息
    public function getTeacherInfo($page="0,10", $key) {
        $sql = "SELECT * FROM teacher WHERE teacher_name LIKE '%$key%' LIMIT $page";
        return $this->select($sql);
    }
    
    //获取教师总数
    public function getTotalTeacherNumber($key) {
        $sql = "SELECT count(id) FROM teacher WHERE teacher_name LIKE '%$key%'";
        return $this->select($sql);
    }
}