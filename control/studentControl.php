<?php
class studentControl extends baseControl{
    //进入学生首页
    public function index() {
        $student_id = $_GET['id'];
        $model = $this->model("log_reg");
        $student = $model->getPersonal($student_id, "student");
        $this->assign("student", $student);
        $this->display("student.html");
    }
    
    //获取学生介绍
    public function getAbout() {
        $student_id = $_GET['id'];
        $studentModel = $this->model("log_reg");
        $model = $this->model("student");
        $student = $studentModel->getPersonal($student_id, "student");
        $courseId = $model->getCourseId($student_id);
        $courses = $model->getCourse($courseId);
        $this->assign("student", $student);
        $this->assign("courses", $courses);
        $html = $this->fetch("student_about.html");
        echo json_encode(
            array("html" => $html, "course" => $courses)
        );
    }
    
    //获取课程表
    public function getNotices() {
        $student_id = $_GET["id"];
        $studentModel = $this->model("student");
        $courseId = $studentModel->getCourseId($student_id);
        $notice = $studentModel->getNotice($courseId);
        $this->assign("notice", $notice);
        $html = $this->fetch("student_notice.html");
        echo json_encode(
            array("html" => $html, "notice" => $notice)
        );
    }
    
    //获取作业列表
    public function getHomework() {
        $student_id = $_GET["id"];
        $studentModel = $this->model("student");
        $courseId = $studentModel->getCourseId($student_id);
        $homework = $studentModel->getHomework($courseId);
        for ($i = 0; $i < count($homework); $i ++) {
            if (!!($tmp = $studentModel->checkProgress($homework[$i]["id"], $student_id))) {
                $homework[$i]["progress"] = $tmp;
            }
        }
        $this->assign("homework", $homework);
        $html = $this->fetch("student_homework.html");
        echo json_encode(
            array("html" => $html, "homework" => $homework)
        );
    }
    
    //获取资源列表
    public function getResources() {
        $student_id = $_GET["id"];
        $studentModel = $this->model("student");
        $courseId = $studentModel->getCourseId($student_id);
        $resource = $studentModel->getResource($courseId);
        $this->assign("resource", $resource);
        $html = $this->fetch("student_resources.html");
        echo json_encode(
            array("html" => $html, "resource" => $resource)
        );
    }
    
    //检查是否已经完成作业
    public function checkHomework() {
        $user_id = $_GET["user_id"];
        $homework_id = $_GET["homework_id"];
        $time = $_GET["time"];
        $courseModel = $this->model("course");
        $studentModel = $this->model("student");
        $personalModel = $this->model("log_reg");
        $homework = $courseModel->getHomework($time);
        //判断是否为教师
        if ($homework["homework_sender"] == $user_id) {
            $list = $studentModel->getHomeworkList($homework_id);
            for ($i = 0; $i < count($list); $i ++) {
                $list[$i]["student"] = $personalModel->getPersonal($list[$i]["homework_stu_id"], "student");
                $tmp = explode("/", $list[$i]["homework_doc"]);
                $list[$i]["filename"] = substr($tmp[count($tmp) - 1], 10);
            }
            $this->assign("teacher", 1);
            $this->assign("homework", $homework);
            $this->assign("list", $list);
            $html = $this->fetch("homework_list.html");
            echo json_encode(
                array(
                    "status" => 1,
                    "html" => $html
                )
            );
        } else {
            $progress = $studentModel->checkProgress($homework_id, $user_id);
            if($progress || $progress[0] == 1) {
                $list = $studentModel->getHomeworkList($homework_id);
                for ($i = 0; $i < count($list); $i ++) {
                    $list[$i]["student"] = $personalModel->getPersonal($list[$i]["homework_stu_id"], "student");
                    $tmp = explode("/", $list[$i]["homework_doc"]);
                    $list[$i]["filename"] = substr($tmp[count($tmp) - 1], 10);
                    $list[$i]["score"] = $studentModel->getScore($homework_id, $list[$i]["homework_stu_id"], $user_id);
                }
                $this->assign("student", 1);
                $this->assign("homework", $homework);
                $this->assign("list", $list);
                $html = $this->fetch("homework_list.html");
                echo json_encode(
                    array(
                        "status" => 1,
                        "html" => $html,
                        "list" => $list
                    )
                );
            } else {
                echo json_encode(
                    array(
                        "status" => 0
                    )
                );
            }
        }  
    }
    
    //提交作业
    public function handInHomework() {
        $fileNameStr = "";
        $time = time();
        if(sizeof($_FILES) > 0) {
            $dir = iconv("UTF-8", "GBK", "upload/homework/".$_POST['uid'].'/'.$_POST['homework_id']."/");
            if(!file_exists($dir)) {
                mkdir($dir, 0777, true);
            }
            for ($i = 0; $i < sizeof($_FILES); $i++) {
                $tmp = $dir.$time.mb_convert_encoding($_FILES['file'.$i]['name'], "gbk");
                move_uploaded_file($_FILES['file'.$i]['tmp_name'], $tmp);
                if ($i > 0) {
                    $fileNameStr .= ",upload/homework/".$_POST['uid'].'/'.$_POST['homework_id']."/".$time.$_FILES['file'.$i]['name'];
                } else {
                    $fileNameStr .= "upload/homework/".$_POST['uid'].'/'.$_POST['homework_id']."/".$time.$_FILES['file'.$i]['name'];
                }
            }
        }
        $homework['id'] = $_POST['uid'];
        $homework['homework_id'] = $_POST['homework_id'];
        $homework['file'] = $fileNameStr;
        $model = $this->model("student");
        $result = $model->sentHomework($homework);
        if($result) {
            echo json_encode(
                array(
                    "status" => 1
                )
            );
        }
    }
    
    //学生互评
    public function studentGrade() {
        $score = $_POST["score"];
        $stu_id = $_POST["stu_id"];
        $grader_id = $_POST["grader_id"];
        $homework_id = $_POST["homework_id"];
        $studentModel = $this->model("student");
        $result = $studentModel->grade($homework_id, $stu_id, $grader_id, $score);
        if ($result) {
            echo json_encode(
                array(
                    "status" => 1,
                    "result" => $result
                )
            );
        }
    }
}