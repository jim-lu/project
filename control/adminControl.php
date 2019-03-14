<?php
class adminControl extends baseControl{
    //进入管理员页面
    public function index() {
        if(!isset($_SESSION['admin'])) {
            $this->login();
        } else {
            $this->display("admin.html");
        }
    }
    
    //进入管理员登录页面
    public function login() {
        $this->display("admin_log.html");
    }
    
    //管理员登录
    public function doLog() {
        $username = $_POST['username'];
        $pwd = md5($_POST['pwd']);
        $model = $this->model("admin");
        $result = $model->login($username, $pwd);
        if ($result) {
            $_SESSION['admin'] = $username;
            echo json_encode(
                array(
                    "status" => 1,
                    "admin" => $username
                )
            );
        }
    }
    
    //获取课程信息
    public function getCourse() {
        $cur_page = (int)$_GET['page'];
        $page = (((int)$_GET['page'] - 1) * 10).",10";
        $filter = $_GET['filter'];
        $model = $this->model("admin");
        $courses = $model->getCourse($filter, $page);
        $terms = $model->getTerms();
        foreach ($terms as $value) {
            if ($value["current_term"] == 1) {
                $current = $value["term"];
            }
        }
        $this->assign("terms", $terms);
        $this->assign("current", $current);
        $this->assign("courses", $courses);
        $this->assign('cur_page', $cur_page);
        $html = $this->fetch("admin_course.html");
        echo json_encode(
            array("html" => $html)
        );
    }
    
    //获取教师页面
    public function getTeacher() {
        $cur_page = (int)$_GET['page'];
        $page = (((int)$_GET['page'] - 1) * 10).",10";
        $model = $this->model("admin");
        $teachers = $model->getTeacher($page);
        $this->assign("teachers", $teachers);
        $this->assign('cur_page', $cur_page);
        $html = $this->fetch("admin_teacher.html");
        echo json_encode(
            array("html" => $html)
        );
    }
    
    //获取学生页面
    public function getStudent() {
        $cur_page = (int)$_GET['page'];
        $page = (((int)$_GET['page'] - 1) * 10).",10";
        $model = $this->model("admin");
        $students = $model->getStudent($page);
        $this->assign("students", $students);
        $this->assign('cur_page', $cur_page);
        $html = $this->fetch("admin_student.html");
        echo json_encode(
            array("html" => $html)
        );
    }
    
    //新增管理员页面
    public function getAdmin() {
        $model = $this->model("admin");
        $admin = $model->getAdmin();
        $this->assign("admin", $admin);
        $html = $this->fetch("admin_new.html");
        echo json_encode(
            array("html" => $html)
        );
    }
    
    public function addAdmin() {
        $username = $_POST['username'];
        $pwd = md5($_POST['pwd']);
        $model = $this->model("admin");
        $result = $model->doAddAdmin($username, $pwd);
        if($result) {
            $lastId = $model->getLastAdmin();
            echo json_encode(
                array(
                    "status" => 1,
                    "last_id" => $lastId[0]
                )
            );
        }
    }
    
    //获取分页页脚
    public function getPage() {
        $cur_ten = (int)$_GET['cur_ten'];
        $info = $_GET['info'];
        $model = $this->model("admin");
        switch ($info) {
            case "teacher": 
                $total = $model->getTotalTeacherNumber();
                break;
            case "student":
                $total = $model->getTotalStudentNumber();
                break;
            default:
                $total = $model->getTotalCourseNumber();
        }
        $this->assign("total", $total[0][0]);
        $this->assign("per", 10);
        $this->assign("cur_ten", $cur_ten);
        $html = $this->fetch("page.html");
        echo json_encode(
            array(
                "html" => $html,
                "cur_ten" => $cur_ten
            )
        );
    }
    
    //进入添加课程页面
    public function addCourse() {
        $model = $this->model("admin");
        $termModel = $this->model("admin");
        $list = $model->getTeacherList();
        $terms = $termModel->getTerms();
        $this->assign("list", $list);
        $this->assign("terms", $terms);
        $this->display("addCourse.html");
    }
    
    //进入修改课程页面
    public function editCourse() {
        $cid = $_GET["id"];
        $model = $this->model("admin");
        $info = $model->getCourseInfo($cid);
        $list = $model->getTeacherList();
        $term = $model->getTerms();
        $time = explode(" ", $info["course_time"]);
        $day = $model->setDay($time[0]);
        $class = $model->setClass($time[1]);
        $this->assign("day", $day);
        $this->assign("class", $class);
        $this->assign("term", $term);
        $this->assign("list", $list);
        $this->assign("info", $info);
        $this->display("editCourse.html");
    }
    
    //添加课程
    public function doAddCourse() {
        $fileNameStr = "";
        $time = time();
        if(sizeof($_FILES) > 0) {
            $dir = iconv("UTF-8", "GBK", "upload/course/".$_POST['course_term'].$_POST['course_time'].'/'.$_POST['course_name']."/");
            if(!file_exists($dir)) {
                mkdir($dir, 0777, true);
            }
            $tmp = $dir.$time.mb_convert_encoding($_FILES['course_img']['name'], "gbk");
            move_uploaded_file($_FILES['course_img']['tmp_name'], $tmp);
            $fileNameStr .= "upload/course/".$_POST['course_term'].$_POST['course_time']."/".$_POST['course_name']."/".$time.$_FILES['course_img']['name'];
        }
        $course['course_name'] = $_POST['course_name'];
        $course['course_img'] = $fileNameStr;
        $course['course_teacher'] = $_POST['course_teacher'];
        $course['course_teacher_id'] = $_POST['course_teacher_id'];
        $course['course_term'] = $_POST['course_term'];
        $course['course_time'] = $_POST['course_time'];
        $course['brief'] = $_POST['brief'];
        $course['syllabus'] = $_POST['syllabus'];
        $model = $this->model("admin");
        $lastId = $model->addCourse($course);
        if($lastId) {
            echo json_encode(
                array(
                    "status" => 1, 
                    "id" => $lastId
                )
            );
        }
    }
    
    //修改课程
    public function doEditCourse() {
        $fileNameStr = "";
        $time = time();
        if(sizeof($_FILES) > 0) {
            $dir = iconv("UTF-8", "GBK", "upload/course/".$_POST['course_term'].$_POST['course_time'].'/'.$_POST['course_name']."/");
            if(!file_exists($dir)) {
                mkdir($dir, 0777, true);
            }
            $tmp = $dir.$time.mb_convert_encoding($_FILES['course_img']['name'], "gbk");
            move_uploaded_file($_FILES['course_img']['tmp_name'], $tmp);
            $fileNameStr .= "upload/course/".$_POST['course_term'].$_POST['course_time']."/".$_POST['course_name']."/".$time.$_FILES['course_img']['name'];
        }
        $course['course_name'] = $_POST['course_name'];
        $course['course_img'] = $fileNameStr;
        $course['course_teacher'] = $_POST['course_teacher'];
        $course['course_teacher_id'] = $_POST['course_teacher_id'];
        $course['course_term'] = $_POST['course_term'];
        $course['course_time'] = $_POST['course_time'];
        $course['brief'] = $_POST['brief'];
        $course['syllabus'] = $_POST['syllabus'];
        $model = $this->model("admin");
        $lastId = $model->addCourse($course);
        if($lastId) {
            echo json_encode(
                array(
                    "status" => 1,
                    "id" => $lastId
                )
            );
        }
    }
    
    //处理富文本获取到的图片
    public function doUrl() {
        $allowExt = array("jpeg", "jpg", "png", "gif");
        $tmp = explode(".", $_FILES['file']['name']);
        $ext = end($tmp);
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mime = $finfo->file($_FILES["file"]["tmp_name"]);
        if ((($mime == "image/gif")||($mime == "image/jpeg")||($mime == "image/pjpeg")||($mime == "image/x-png")||($mime == "image/png")) && in_array($ext, $allowExt)) {
            $name = sha1(microtime()).".".$ext;
            move_uploaded_file($_FILES["file"]["tmp_name"], "upload/course/".$name);
            $response = new StdClass;
            $response->link = "upload/course/".$name;
            echo stripslashes(json_encode($response));
        }
    }
    
    //删除富文本的图片
    public function deleteImage() {
        unlink($_POST['src']);
    }
    
    //获取学期
    public function getTerm() {
        $model = $this->model("admin");
        $terms = $model->getTerms();
        echo json_encode(
            array(
                "terms" => $terms
            )
        );
    }
    
    //设置当前学期
    public function setTerm() {
        $term = $_GET["text"];
        $model = $this->model("admin");
        $result = $model->setCurrentTerm($term);
        if ($result) {
            echo json_encode(
                array(
                    "status" => 1
                )
            );
        }
    }
    
    //添加学期
    public function addTerm() {
        $model = $this->model("admin");
        $result = $model->addTerm();
        if ($result) {
            echo json_encode(
                array(
                    "status" => 1
                )
            );
        }
    }
}