<?php
class admin extends pdoClass{
    //登录
    public function login($username, $pwd) {
        $sql = "SELECT * FROM admin WHERE admin_name='$username' AND admin_pwd='$pwd'";
        return $this->find($sql);
    }
    
    //获取课程信息
    public function getCourse($filter, $page="0,10") {
        if ($filter == "") {
            $sql = "SELECT * FROM course ORDER BY id DESC LIMIT $page";
        } else {
            $sql = "SELECT * FROM course WHERE course_term='".$filter."' ORDER BY id DESC LIMIT $page";
        }
        return $this->select($sql);
    }
    
    //获取教师信息
    public function getTeacher($page="0,10") {
        $sql = "SELECT * FROM teacher LIMIT $page";
        return $this->select($sql);
    }
    
    //获取学生信息
    public function getStudent($page="0,10") {
        $sql = "SELECT * FROM student LIMIT $page";
        return $this->select($sql);
    }
    
    //获取学期
    public function getTerms() {
        $sql = "SELECT * FROM term";
        return $this->select($sql);
    }
    
    //设置当前学期
    public function setCurrentTerm($term) {
        $tmp = "UPDATE term SET current_term=0 WHERE current_term=1";
        $this->exec($tmp);
        $sql = "UPDATE term SET current_term=1 WHERE term='$term'";
        return $this->exec($sql);
    }
    
    //添加学期
    public function addTerm() {
        $tmp = "SELECT term FROM term ORDER BY id DESC LIMIT 1";
        $term = $this->find($tmp);
        $patterns = "/\d+/";
        preg_match_all($patterns, $term[0], $arr);
        if ($arr[0][2] == 1) {
            $new = $arr[0][0]."-".$arr[0][1]." 第2学期";
        } elseif ($arr[0][2] == 2) {
            $new = $arr[0][1]."-".($arr[0][1] + 1)." 第1学期";
        }
        $sql = "INSERT INTO term (term) VALUES ('$new')";
        return $this->exec($sql);
    }
    
    //获取课程总数
    public function getTotalCourseNumber($filter="") {
        if($filter == "") {
            $sql = "SELECT count(id) FROM course";
        } else {
            $sql = "SELECT count(id) FROM course WHERE course_term='$filter'";
        }
        return $this->select($sql);
    }
    
    //获取教师总数
    public function getTotalTeacherNumber() {
        $sql = "SELECT count(id) FROM teacher";
        return $this->select($sql);
    }
    
    //获取学生总数
    public function getTotalStudentNumber() {
        $sql = "SELECT count(id) FROM student";
        return $this->select($sql);
    }
    
    //获取教师列表
    public function getTeacherList() {
        $sql = "SELECT id,teacher_name FROM teacher ORDER BY convert(teacher_name USING GBK) COLLATE gbk_chinese_ci ASC";
        return $this->select($sql);
    }
    
    //获取管理员列表
    public function getAdmin() {
        $sql = "SELECT * FROM admin";
        return $this->select($sql);
    }
    
    //获取某一课程信息
    public function getCourseInfo($id) {
        $sql = "SELECT * FROM course WHERE id=$id";
        return $this->find($sql);
    }
    
    //添加课程
    public function addCourse($course) {
        $sql = "INSERT INTO course (
                    course_name, 
                    course_teacher, 
                    course_teacher_id, 
                    course_time, 
                    course_term, 
                    course_intro, 
                    course_syllabus, 
                    course_img) 
                VALUES (
                    '{$course['course_name']}', 
                    '{$course['course_teacher']}', 
                    '{$course['course_teacher_id']}', 
                    '{$course['course_time']}', 
                    '{$course['course_term']}', 
                    '{$course['brief']}', 
                    '{$course['syllabus']}', 
                    '{$course['course_img']}'
                )";
        $this->exec($sql);
        return $this->getInsertId();
    }
    
    //添加管理员
    public function doAddAdmin($user, $pwd) {
        $sql = "INSERT INTO admin (admin_name, admin_pwd) VALUES ('$user', '$pwd')";
        return $this->exec($sql);
    }
    public function getLastAdmin() {
        $sql = "SELECT id FROM admin ORDER BY id LIMIT 1";
        return $this->find($sql);
    }
    
    //给日期做标识
    public function setDay($time) {
        switch ($time) {
            case "周一":
                $day = 1;
                break;
            case "周二":
                $day = 2;
                break;
            case "周三":
                $day = 3;
                break;
            case "周四":
                $day = 4;
                break;
            case "周五":
                $day = 5;
                break;
            case "周六":
                $day = 6;
                break;
            case "周日":
                $day = 7;
                break;
        }
        return $day;
    }
    
    //给上课时间做标识
    public function setClass($time) {
        switch ($time) {
            case "1-2节":
                $day = 1;
                break;
            case "3-5节":
                $day = 2;
                break;
            case "6-7节":
                $day = 3;
                break;
            case "8-9节":
                $day = 4;
                break;
            case "10-11节":
                $day = 5;
                break;
            case "12-13节":
                $day = 6;
                break;
            case "14-15节":
                $day = 7;
                break;
        }
        return $day;
    }
}