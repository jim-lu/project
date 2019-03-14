<?php
class teacherControl extends baseControl{
    //进入教师首页
    public function index() {
        $teacher_id = $_GET['id'];
        $model = $this->model("log_reg");
        $teacher = $model->getPersonal($teacher_id, "teacher");
        $this->assign("teacher", $teacher);
        $this->display("teacher.html");
    }
    
    //获取教师信息
    public function getAbout() {
        $teacher_id = $_GET['id'];
        $teacherModel = $this->model("log_reg");
        $courseModel = $this->model("course");
        $teacher = $teacherModel->getPersonal($teacher_id, "teacher");
        $courses = $courseModel->getTeacherCourse($teacher_id);
        $this->assign("teacher", $teacher);
        $this->assign("courses", $courses);
        $html = $this->fetch("teacher_about.html");
        echo json_encode(
            array("html" => $html)
        );
    }
    
    //获取作业分页
    public function getHomework() {
        $teacher_id = $_GET['id'];
        $courseModel = $this->model("course");
        $teacherModel = $this->model("teacher");
        $courses = $courseModel->getTeacherCourse($teacher_id);
        $homeworks = $teacherModel->getTeacherHomework($teacher_id);
        $this->assign("courses", $courses);
        $this->assign("homeworks", $homeworks);
        $html = $this->fetch("teacher_homework.html");
        echo json_encode(
            array("html" => $html)
        );
    }
    
    //获取资源页
    public function getResources() {
        $teacher_id = $_GET['id'];
        $courseModel = $this->model("course");
        $teacherModel = $this->model("teacher");
        $courses = $courseModel->getTeacherCourse($teacher_id);
        $resources = $teacherModel->getTeacherResource($teacher_id);
        $this->assign("courses", $courses);
        $this->assign("resources", $resources);
        $html = $this->fetch("teacher_resource.html");
        echo json_encode(
            array("html" => $html)
        );
    }
    
    //获取公告页
    public function getNotices() {
        $teacher_id = $_GET['id'];
        $courseModel = $this->model("course");
        $teacherModel = $this->model("teacher");
        $courses = $courseModel->getTeacherCourse($teacher_id);
        $notices = $teacherModel->getTeacherNotice($teacher_id);
        $this->assign("courses", $courses);
        $this->assign("notices", $notices);
        $html = $this->fetch("teacher_notice.html");
        echo json_encode(
            array("html" => $html)
        );
    }
    
    //发送公告
    public function sentNotice() {
        $notice['title'] = $_POST['title'];
        $notice['course'] = $_POST['course'];
        $notice['content'] = $_POST['content'];
        $notice['id'] = $_POST['uid'];
        $notice['time'] = time();
        $notice['course_id'] = $_POST['course_id'];
        $model = $this->model("teacher");
        $result = $model->sentNotice($notice);
        if ($result) {
            $this->assign("item", $notice);
            $html = $this->fetch("notice.html");
            echo json_encode(
                array(
                    "status" => 1,
                    "html" => $html
                )
            );
        }
    }
    
    //上传文件
    public function uploadResource() {
        $fileNameStr = "";
        $dir = iconv("UTF-8", "GBK", "upload/resource/".$_POST['uid'].'/'.$_POST['course']."/");
        if(!file_exists($dir)) {
            mkdir($dir, 0777, true);
        }
        $time = time();
        for ($i = 0; $i < sizeof($_FILES); $i++) {
            $tmp = $dir.$time.mb_convert_encoding($_FILES['file'.$i]['name'], "gbk");
            move_uploaded_file($_FILES['file'.$i]['tmp_name'], $tmp);
            if ($i > 0) {
                $fileNameStr .= ",upload/resource/".$_POST['uid'].'/'.$_POST['course']."/".$time.$_FILES['file'.$i]['name'];
            } else {
                $fileNameStr .= "upload/resource/".$_POST['uid'].'/'.$_POST['course']."/".$time.$_FILES['file'.$i]['name'];
            }
        }
        $resource['title'] = $_FILES['file0']['name'];
        $resource['file'] = $fileNameStr;
        $resource['course'] = $_POST['course'];
        $resource['id'] = $_POST['uid'];
        $resource['time'] = $time;
        $resource['course_id'] = $_POST['course_id'];
        $model = $this->model("teacher");
        $result = $model->uploadResource($resource);
        if($result) {
            $this->assign("item", $resource);
            $html = $this->fetch("resource.html");
            echo json_encode(
                array(
                    "status" => 1,
                    "html" => $html
                )
            );
        }
    }
    
    //上传作业
    public function sentHomework() {
        $fileNameStr = "";
        $time = time();
        if(sizeof($_FILES) > 0) {
            $dir = iconv("UTF-8", "GBK", "upload/homework/".$_POST['uid'].'/'.$_POST['course']."/");
            if(!file_exists($dir)) {
                mkdir($dir, 0777, true);
            }
            for ($i = 0; $i < sizeof($_FILES); $i++) {
                $tmp = $dir.$time.mb_convert_encoding($_FILES['file'.$i]['name'], "gbk");
                move_uploaded_file($_FILES['file'.$i]['tmp_name'], $tmp);
                if ($i > 0) {
                    $fileNameStr .= ",upload/homework/".$_POST['uid'].'/'.$_POST['course']."/".$time.$_FILES['file'.$i]['name'];
                } else {
                    $fileNameStr .= "upload/homework/".$_POST['uid'].'/'.$_POST['course']."/".$time.$_FILES['file'.$i]['name'];
                }
            }
        }
        $homework['title'] = $_POST['title'];
        $homework['content'] = $_POST['content'];
        $homework['course'] = $_POST['course'];
        $homework['file'] = $fileNameStr;
        $homework['id'] = $_POST['uid'];
        $homework['time'] = $time;
        $homework['course_id'] = $_POST['course_id'];
        $model = $this->model("teacher");
        $result = $model->sentHomework($homework);
        if ($result) {
            $this->assign("item", $homework);
            $html = $this->fetch("homework.html");
            echo json_encode(
                array(
                    "status" => 1,
                    "html" => $html
                )
            );
        }
    }
    
    //获取下一页公告
    public function nextPageNotice() {
        $teacher_id = $_GET["id"];
        $page = $_GET["page"];
        $limit = $page.",10";
        $model = $this->model("teacher");
        $result = $model->getTeacherNotice($teacher_id, $limit);
        $this->assign("result", $result);
        if (count($result) > 0) {
            $html = $this->fetch("notice.html");
            echo json_encode(
                array(
                    "status" => 1,
                    "html" => $html
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
    
    //获取下一页资源
    public function nextPageResource() {
        $teacher_id = $_GET["id"];
        $page = $_GET["page"];
        $limit = $page.",10";
        $model = $this->model("teacher");
        $result = $model->getTeacherResource($teacher_id, $limit);
        $this->assign("result", $result);
        if (count($result) > 0) {
            $html = $this->fetch("resource.html");
            echo json_encode(
                array(
                    "status" => 1,
                    "html" => $html
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
    
    //获取下一页作业
    public function nextPageHomework() {
        $teacher_id = $_GET["id"];
        $page = $_GET["page"];
        $limit = $page.",10";
        $model = $this->model("teacher");
        $result = $model->getTeacherHomework($teacher_id, $limit);
        $this->assign("result", $result);
        if (count($result) > 0) {
            $html = $this->fetch("homework.html");
            echo json_encode(
                array(
                    "status" => 1,
                    "html" => $html
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
    
    //作业评分
    public function teacherGrade() {
        $score = $_POST["score"];
        $stu_id = $_POST["stu_id"];
        $homework_id = $_POST["homework_id"];
        $teacherModel = $this->model("teacher");
        $result = $teacherModel->grade($homework_id, $stu_id, $score);
        if($result) {
            echo json_encode(
                array(
                    "status" => 1
                )
            );
        }
    }
    
    //查看评分情况
    public function scorePage() {
        $stu_id = $_GET["stu_id"];
        $homework_id = $_GET["homework_id"];
        $sender = $_GET["sender"];
        //查看是否为负责该课程的教师
        $teacherModel = $this->model("teacher");
        $check = $teacherModel->checkId($homework_id);
        if ($check[0] == $sender) {
            $courseModel = $this->model("course");
            $studentModel = $this->model("student");
            $personalModel = $this->model("log_reg");
            $teacherGrade = $teacherModel->getScore($homework_id, $stu_id);
            $course_id = $teacherModel->getCourseId($homework_id);
            $title = $teacherModel->getHomeworkName($homework_id);
            $studentName = $personalModel->getPersonal($stu_id, "student");
            $member = $courseModel->getAllMember($course_id[0]);
            for ($i = 0; $i < count($member); $i++) {
                $member[$i]["score"] = $studentModel->getScore($homework_id, $stu_id, $member[$i]["course_member_id"]);
                if($member[$i]["score"]) {
                    $score += $member[$i]["score"][0];
                    $total += 1;
                }
            }
            $this->assign("average", $score / $total);
            $this->assign("student", $studentName);
            $this->assign("title", $title);
            $this->assign("member", $member);
            $this->assign("teacher_grade", $teacherGrade);
            $this->display("homework_score.html");
        } else {
            echo "只有该课程教师能查看该页";
        }
    }
    
    public function changeScore() {
        $stu_id = $_POST["stu_id"];
        $homework_id = $_POST["homework_id"];
        $score = $_POST["score"];
        $model = $this->model("teacher");
        $result = $model->modifyScore($homework_id, $stu_id, $score);
        if($result) {
            echo json_encode(
                array(
                    "status" => 1,
                    "score" => $score
                )
            );
        }
    }
}