<?php
class registerControl extends baseControl{
    //显示注册页面
    public function index() {
        $this->display("register.html");
    }
    
    //注册
    public function doReg() {
        $num = $_POST['num'];
        $username = $_POST['username'];
        $pwd = md5($_POST['pwd']);
        $model = $this->model("log_reg");
        if($num != "") {
            $type = "student";
            $result = $model->checkUser($type, $num);
        } else {
            $type = "teacher";
            $result = $model->checkUser($type, $username);
        }
        if ($result) {
            echo json_encode(
                array("status" => 0)
            );
        } else {
            if($num != "") {
                $type = "student";
                $row = $model->register($type, $num, $username, $pwd);
            } else {
                $type = "teacher";
                $row = $model->register($type, $num, $username, $pwd);
            }
            if ($row == 1) {
                $user = $model->getUserId($type, $num, $username, $pwd);
                echo json_encode(
                    array(
                        "status" => 1,
                        "id" => $user[0],
                        "username" => $user[1],
                        "type" => $type
                    )
                );
            }
        }
    }
}