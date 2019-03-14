<?php
class personalControl extends baseControl{
    //进入登录页面
    public function index() {
        $this->display("personal.html");
    }
    
    //获取个人资料
    public function getPersonal() {
        $uid = $_POST['uid'];
        $type = $_POST['user_type'];
        $model = $this->model("log_reg");
        $result = $model->getPersonal($uid, $type);
        if($type == "student") {
            $studentModel = $this->model("student");
            $courseId = $studentModel->getCourseId($uid);
            $course = $studentModel->getCourse($courseId);
        } elseif ($type == "teacher") {
            $courseModel = $this->model("course");
            $course = $courseModel->getTeacherCourse($uid);
        }
        echo json_encode(
            array(
                "status" => 1,
                "result" => $result,
                "course" => $course
            )
        );
    }
    
    //更改个人信息
    public function changePersonal() {
        $fileNameStr = "";
        $time = time();
        if(sizeof($_FILES) > 0) {
            $dir = iconv("UTF-8", "GBK", "upload/avatar/".$_POST['uid'].$_POST['username']."/");
            if(!file_exists($dir)) {
                mkdir($dir, 0777, true);
            }
            $tmp = $dir.$time.mb_convert_encoding($_FILES['avatar']['name'], "gbk");
            move_uploaded_file($_FILES['avatar']['tmp_name'], $tmp);
            $fileNameStr .= "upload/avatar/".$_POST['uid'].$_POST['username']."/".$time.$_FILES['avatar']['name'];
        }
        $personal['uid'] = $_POST['uid'];
        $personal['type'] = $_POST['type'];
        $personal['username'] = $_POST['username'];
        if($_POST['pwd'] != "") {
            $personal['pwd'] = md5($_POST['pwd']);
        } else {
            $personal['pwd'] = "";
        }
        if ($fileNameStr != "" && $_POST['avatar'] == "") {
            $personal['avatar'] = $fileNameStr;
        } elseif ($fileNameStr == "" && $_POST['avatar'] != "") {
            $personal['avatar'] = $_POST['avatar'];
        }else {
            $personal['avatar'] = NULL;
        }
        $personal['info'] = $_POST['info'];
        $personal['email'] = $_POST['email'];
        $model = $this->model("log_reg");
        $result = $model->changePersonal($personal);
        if ($result) {
            echo json_encode(
                array(
                    "status" => 1,
                    "personal" => $personal
                )
            );
        }
    }
}