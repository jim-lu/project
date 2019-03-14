<?php
class log_reg extends pdoClass{
    //注册
    public function register($type, $num, $username, $pwd) {
        if($type == "teacher") {
            $sql = "INSERT INTO teacher (
                        teacher_name, 
                        teacher_pwd) 
                    VALUES (
                        '$username', 
                        '$pwd'
                    )";
        } elseif ($type == "student") {
            $sql = "INSERT INTO student (
                        id, 
                        student_name, 
                        student_pwd) 
                    VALUES (
                        '$num', 
                        '$username', 
                        '$pwd'
                    )";
        }
        return $this->exec($sql);
    }
    
    //登录
    public function login($type, $num, $username, $pwd) {
        if($type == "teacher") {
            $sql = "SELECT 
                        id, teacher_name 
                    FROM 
                        teacher 
                    WHERE 
                        teacher_name='$username' AND teacher_pwd='$pwd'";
        } elseif ($type == "student") {
            $sql = "SELECT 
                        id, student_name 
                    FROM 
                        student 
                    WHERE 
                        id='$num' AND student_pwd='$pwd'";
        }
        return $this->find($sql);
    }
    
    //判断用户是否存在
    public function checkUser($type, $user) {
        if($type == "teacher") {
            $sql = "SELECT teacher_name FROM teacher WHERE teacher_name='$user'";
        } elseif ($type == "student") {
            $sql = "SELECT id FROM student WHERE id=$user"; 
        }
        return $this->find($sql);
    }
    
    //获取用户id
    public function getUserId($type, $num, $username, $pwd) {
        if($type == "teacher") {
            $sql = "SELECT id, teacher_name FROM teacher WHERE teacher_name='$username'";
        } elseif ($type == "student") {
            $sql = "SELECT id, student_name FROM student WHERE id='$num'"; 
        }
        return $this->find($sql);
    }
    
    //获取个人信息
    public function getPersonal($id, $type) {
        if($type == "teacher") {
            $sql = "SELECT * FROM teacher WHERE id=$id";
        } elseif ($type == "student") {
            $sql = "SELECT * FROM student WHERE id='$id'";
        }
        return $this->find($sql);
    }
    
    //修改个人信息
    public function changePersonal($personal) {
        $uid = $personal['uid'];
        $type = $personal['type'];
        $username = $personal['username'];
        if ($personal['pwd'] != "") {
            $pwd = $personal['pwd'];
        } else {
            $result = $this->getPwd($type, $uid);
            $pwd = $result[0];
        }
        $avatar = $personal['avatar'];
        $info = $personal['info'];
        $email = $personal['email'];
        if($type == "teacher") {
            $sql = "UPDATE 
                        teacher 
                    SET 
                        teacher_name='$username', 
                        teacher_pwd='$pwd', 
                        teacher_image='$avatar', 
                        teacher_info='$info', 
                        teacher_email='$email' 
                    WHERE 
                        id='$uid'";
        } elseif ($type == "student") {
            $sql = "UPDATE 
                        student 
                    SET 
                        student_name='$username', 
                        student_pwd='$pwd', 
                        student_image='$avatar', 
                        student_info='$info', 
                        student_email='$email' 
                    WHERE 
                        id='$uid'";
        }
        return $this->exec($sql);
    }
    
    //获取密码
    public function getPwd($type, $uid) {
        if($type == "teacher") {
            $sql = "SELECT teacher_pwd FROM teacher WHERE id='$uid'";
        } elseif ($type == "student") {
            $sql = "SELECT student_pwd FROM student WHERE id='$uid'"; 
        }
        return $this->find($sql);
    }
    
    //判断邮箱是否已经注册
    public function checkEmail($type, $email) {
        if($type == "teacher") {
            $sql = "SELECT id FROM teacher WHERE teacher_email='$email'";
        } elseif ($type == "student") {
            $sql = "SELECT id FROM student WHERE student_email='$email'"; 
        }
        return $this->find($sql);
    }
    
    //发送邮件
    public function sendEmail($time, $email, $url) {
        include_once("smtp.class.php");
        $smtpserver = ""; //SMTP服务器，如smtp.163.com
        $smtpserverport = 25; //SMTP服务器端口
        $smtpusermail = ""; //SMTP服务器的用户邮箱
        $smtpuser = ""; //SMTP服务器的用户帐号
        $smtppass = ""; //SMTP服务器的用户密码
        $smtp = new Smtp($smtpserver, $smtpserverport, true, $smtpuser, $smtppass);
        //这里面的一个true是表示使用身份验证,否则不使用身份验证.
        $emailtype = "HTML"; //信件类型，文本:text；网页：HTML
        $smtpemailto = $email;
        $smtpemailfrom = $smtpusermail;
        $emailsubject = "Helloweba.com - 找回密码";
        $emailbody = "亲爱的".$email."：<br/>您在".$time."提交了找回密码请求。请点击下面的链接重置密码
（按钮24小时内有效）。<br/><a href='".$url."'target='_blank'>".$url."</a>";
        $rs = $smtp->sendmail($smtpemailto, $smtpemailfrom, $emailsubject, $emailbody, $emailtype);
        
        return $rs;
    }
}