<?php
class loginControl extends baseControl{
    //进入登录页面
    public function index() {
        $this->display("login.html");
    }
    
    //登录
    public function doLog() {
        $num = $_POST['num'];
        $username = $_POST['username'];
        $pwd = md5($_POST['pwd']);
        $model = $this->model("log_reg");
        if($num != "") {
            $type = "student";
            $row = $model->login($type, $num, $username, $pwd);
        } else {
            $type = "teacher";
            $row = $model->login($type, $num, $username, $pwd);
        }
        if ($row) {
            $user = $model->getUserId($type, $num, $username, $pwd);
            echo json_encode(
                array(
                    "status" => 1,
                    "id" => $user[0],
                    "username" => $user[1],
                    "type" => $type
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
    
    public function getPwd() {
        $this->display("get_password.html");
    }
    
    public function sendEmail() {
        $email = stripcslashes(trim($_POST['email']));
        $type = $_POST['type'];
        $model = $this->model("log_reg");
        $id = $model->checkEmail($email, $type);
        if(!$id) {
            echo json_encode(
                array("status" => 0)
            );
        } else {
            $time = time();
            $uid = $id[0];
            $token = md5($uid);
            $url = "index.php?control=login&action=resetPwd?email=".$email."&token=".$token;
            $result = $model->sendEmail(date('Y-m-d H:i'), $email, $url);
        }
    }
    
    //退出登录
    public function logout() {
        header("location:index.php?control=login");
    }
}