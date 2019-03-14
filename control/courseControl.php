<?php
class courseControl extends baseControl{
    //进入课程页
    public function index() {
        $id = $_GET['id'];
        $model = $this->model("course");
        $result = $model->getCourseInfo($id);
        $this->assign("course", $result);
        $this->display("course.html");
    }
    
    //获取课程首页内容
    public function getIndex() {
        $id = $_GET['id'];
        $courseModel = $this->model("course");
        $teacherModel = $this->model("log_reg");
        $result = $courseModel->getCourseInfo($id);
        $notice = $courseModel->getCourseNotice($id);
        $resource = $courseModel->getCourseResource($id);
        $teacher = $teacherModel->getPersonal($result["course_teacher_id"], "teacher");
        $this->assign("course", $result);
        $this->assign("notice", $notice);
        $this->assign("resource", $resource);
        $this->assign("teacher", $teacher);
        $html = $this->fetch("course_index.html");
        echo json_encode(
            array("html" => $html)
        );
    }
    
    //获取课程介绍内容
    public function getIntro() {
        $id = $_GET['id'];
        $model = $this->model("course");
        $result = $model->getCourseInfo($id);
        $this->assign("course", $result);
        $html = $this->fetch("course_intro.html");
        echo json_encode(
            array("html" => $html)
        );
    }
    
    //获取课程成员内容
    public function getMember() {
        $id = $_GET['id'];
        $courseModel = $this->model("course");
        $teacherModel = $this->model("log_reg");
        $total = $courseModel->getTotalNumber($id);
        $result = $courseModel->getCourseInfo($id);
        $teacher = $teacherModel->getPersonal($result['course_teacher_id'], "teacher");
        $this->assign("course", $result);
        $this->assign("total", $total[0][0]);
        $this->assign('cur_page', 1);
        $html = $this->fetch("course_member.html");
        echo json_encode(
            array("html" => $html)
        );
    }
    //获取课程成员学生分页内容
    public function getPage() {
        $id = $_GET['id'];
        $page = (((int)$_POST['page'] - 1) * 14).",14";
        $courseModel = $this->model("course");
        $infoModel = $this->model("log_reg");
        $student_list = $courseModel->getStudentInfo($page, $id);
        for ($i = 0; $i < count($student_list); $i ++) {
            $student_list[$i]['student_img'] = $infoModel->getPersonal($student_list[$i]['course_member_id'], "student")['student_image'];
        }
        $this->assign('student_list', $student_list);
        $this->assign('cur_page', $page);
        $html = $this->fetch("course_member_li.html");
        echo json_encode(
            array(
                "html" => $html,
                "student" => $student_list
            )
        );
    }
    
    //获取课程公告内容
    public function getNotice() {
        $id = $_GET['id'];
        $courseModel = $this->model("course");
        $total = $courseModel->getTotalNotice($id);
        $this->assign("total", $total[0][0]);
        $this->assign('cur_page', 1);
        $html = $this->fetch("course_notice.html");
        echo json_encode(
            array("html" => $html)
        );
    }
    //获取课程公告分页
    public function getNoticePage() {
        $id = $_GET['id'];
        $page = (((int)$_POST['page'] - 1) * 10).",10";
        $courseModel = $this->model("course");
        $notice_list = $courseModel->getCourseNotice($id, $page);
        $this->assign('notices', $notice_list);
        $this->assign('cur_page', $page);
        $html = $this->fetch("course_notice_li.html");
        echo json_encode(
            array(
                "html" => $html,
                "notices" => $notice_list
            )
        );
    }
    
    //获取课程资源内容
    public function getResource() {
        $id = $_GET["id"];
        $courseModel = $this->model("course");
        $total = $courseModel->getTotalResource($id);
        $this->assign("total", $total[0][0]);
        $this->assign('cur_page', 1);
        $html = $this->fetch("course_resource.html");
        echo json_encode(
            array("html" => $html)
        );
    }
    //获取课程资源分页
    public function getResourcePage() {
        $id = $_GET['id'];
        $page = (((int)$_POST['page'] - 1) * 10).",10";
        $courseModel = $this->model("course");
        $resource_list = $courseModel->getCourseResource($id, $page);
        $this->assign('resources', $resource_list);
        $this->assign('cur_page', $page);
        $html = $this->fetch("course_resource_li.html");
        echo json_encode(
            array(
                "html" => $html,
                "resources" => $resource_list
            )
        );
    }
    
    //获取作业内容
    public function getHomework() {
        $id = $_GET["id"];
        $courseModel = $this->model("course");
        $total = $courseModel->getTotalHomework($id);
        $this->assign("total", $total[0][0]);
        $this->assign('cur_page', 1);
        $html = $this->fetch("course_homework.html");
        echo json_encode(
            array("html" => $html)
        );
    }
    //获取作业分页
    public function getHomeworkPage() {
        $id = $_GET['id'];
        $page = (((int)$_POST['page'] - 1) * 10).",10";
        $courseModel = $this->model("course");
        $homework_list = $courseModel->getCourseHomework($id, $page);
        $this->assign('homework', $homework_list);
        $this->assign('cur_page', $page);
        $html = $this->fetch("course_homework_li.html");
        echo json_encode(
            array(
                "html" => $html,
                "homework" => $homework_list
            )
        );
    }
    
    //获取评论
    public function getComment() {
        $course_id = $_GET["course_id"];
        $courseModel = $this->model("course");
        $personalModel = $this->model("log_reg");
        $comment = $courseModel->getComment($course_id);
        for ($i = 0; $i < count($comment); $i ++) {
            if($comment[$i]["comment_teacher_id"] != 0) {
                $comment[$i]["personal"] = $personalModel->getPersonal($comment[$i]["comment_teacher_id"], "teacher");
                $comment[$i]["type"] = "teacher";
            } else {
                $comment[$i]["personal"] = $personalModel->getPersonal($comment[$i]["comment_stu_id"], "student");
                $comment[$i]["type"] = "student";
            }
        }
        $this->assign("comment", $comment);
        $html = $this->fetch("comment.html");
        echo json_encode(
            array("html" => $html)
        );
    }
    
    //发评论
    public function sentComment() {
        $comment['text'] = $_POST['text'];
        $comment['course_id'] = $_POST['course_id'];
        $comment['sender'] = $_POST['sender'];
        $comment['type'] = $_POST['type'];
        $courseModel = $this->model("course");
        $result = $courseModel->sentComment($comment);
        if($result) {
            $this->assign("item", $comment);
            $html = $this->fetch("comment.html");
            echo json_encode(
                array(
                    "status" => 1,
                    "html" => $html,
                    "comment" => $comment
                )
            );
        }
    }
    
    //显示公告详情页
    public function noticeDetail() {
        $time = $_GET["time"];
        $model = $this->model("course");
        $notice = $model->getNotice($time);
        $course = explode(" ", $notice["notice_course"], 2);
        $notice["course"] = $model->getCourseByTime($course);
        $this->assign("notice", $notice);
        $this->display("noticeDetail.html");
    }
    
    //显示资源详情页
    public function resourceDetail() {
        $time = $_GET["time"];
        $model = $this->model("course");
        $resource = $model->getResource($time);
        $resource["files"] = explode(",", $resource["resource_names"]);
        for ($i = 0; $i < count($resource["files"]); $i ++) {
            $tmp = explode("/", $resource["files"][$i]);
            $resource["filenames"][$i] = substr($tmp[count($tmp) - 1], 10);
        }
        $course = explode(" ", $resource["resource_course"], 2);
        $resource["course"] = $model->getCourseByTime($course);
        $this->assign("resource", $resource);
        $this->display("resourceDetail.html");
    }
    
    //显示作业详情页
    public function homeworkDetail() {
        $time = $_GET["time"];
        $model = $this->model("course");
        $homework = $model->getHomework($time);
        if ($homework["homework_resource"] != null) {
            $homework["files"] = explode(",", $homework["homework_resource"]);
            for ($i = 0; $i < count($homework["files"]); $i ++) {
                $tmp = explode("/", $homework["files"][$i]);
                $homework["filenames"][$i] = substr($tmp[count($tmp) - 1], 10);
            }
        }
        $course = explode(" ", $homework["homework_course"], 2);
        $homework["course"] = $model->getCourseByTime($course);
        $this->assign("homework", $homework);
        $this->display("homeworkDetail.html");
    }
    
    //添加课程成员
    public function addMember() {
        $courseId = $_POST["course_id"];
        $memberId = $_POST["student_id"];
        $memberName = $_POST["student_name"];
        $model = $this->model("course");
        $check = $model->checkMember($courseId, $memberId);
        if (!$check) {
            $result = $model->addMember($courseId, $memberName, $memberId);
            if ($result) {
                echo json_encode(
                    array(
                        "status" => 1
                    )
                );
            }
        } else {
            echo json_encode(
                array(
                    "status" => 0
                )
            );
        }    
    }
    
    //判断是否已经加入过课程
    public function checkMember() {
        $courseId = $_GET["course_id"];
        $memberId = $_GET["student_id"];
        $model = $this->model("course");
        $check = $model->checkMember($courseId, $memberId);
        if ($check) {
            echo json_encode(
                array(
                    "status" => 1
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