<?php
class indexControl extends baseControl{
    //进入首页
    public function index() {
        $courseModel = $this->model("course");
        $teacherModel = $this->model("teacher");
        $courses = $courseModel->getCourse();
        $teachers = $teacherModel->getTeacher();
        $this->assign("courses", $courses);
        $this->assign("teachers", $teachers);
        $this->display("index.html");
    }
}