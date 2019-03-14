<?php
class searchControl extends baseControl{
    //进入课程搜索页
    public function couseSearch() {
        $this->display("courseSearch.html");
    }
    
    //进入教师搜索页
    public function teacherSearch() {
        $this->display("teacherSearch.html");
    }
    
    //课程搜索页分页
    public function getCourse() {
        $keyword = $_POST['keyword'];
        $page = (((int)$_POST['page'] - 1) * 10).",10";
        $model = $this->model("search");
        $course_list = $model->getCourseInfo($page, $keyword);
        $this->assign('course_list', $course_list);
        $this->assign('cur_page', $page);
        $html = $this->fetch("courseSearch_li.html");
        echo json_encode(
            array(
                "html" => $html
            )
        );
    }
    
    //教师搜索页分页
    public function getTeacher() {
        $keyword = $_POST['keyword'];
        $page = (((int)$_POST['page'] - 1) * 10).",10";
        $model = $this->model("search");
        $teacher_list = $model->getTeacherInfo($page, $keyword);
        $this->assign('teacher_list', $teacher_list);
        $this->assign('cur_page', $page);
        $html = $this->fetch("teacherSearch_li.html");
        echo json_encode(
            array(
                "html" => $html
            )
        );
    }
    
    //获取分页页脚
    public function getPage() {
        $key = $_GET['keyword'];
        $cur_ten = (int)$_GET['cur_ten'];
        $info = $_GET['info'];
        $model = $this->model("search");
        if ($info == "teacher") {
            $total = $model->getTotalTeacherNumber($key);
            $this->assign("per", 10);
        } elseif ($info == "course") {
            $total = $model->getTotalCourseNumber($key);
            $this->assign("per", 10);
        }
        $this->assign("total", $total[0][0]);
        $this->assign("cur_ten", $cur_ten);
        $html = $this->fetch("page.html");
        echo json_encode(
            array(
                "html" => $html,
                "cur_ten" => $cur_ten
            )
        );
    }
}