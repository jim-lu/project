<?php
class teacher extends pdoClass{
    //获取部分教师的信息
    public function getTeacher($limit="0,6") {
        $tmp = "SELECT DISTINCT course_teacher_id,count(*) AS count FROM course GROUP BY course_teacher_id ORDER BY count DESC LIMIT $limit";
        $most = $this->select($tmp);
        if(count($most) < 6) {
            $sql = "SELECT id,teacher_name,teacher_image FROM teacher ORDER BY id DESC LIMIT 6";
            return $this->select($sql);
        } else {
            $arr = array();
            foreach ($most as $value) {
                $sql = "SELECT id,teacher_name,teacher_image FROM teacher WHERE id={$value['course_teacher_id']}";
                array_push($arr, $this->find($sql));
            }
            return $arr;
        }
    }
    
    //发布作业
    public function sentHomework($homework) {
        $sql = "INSERT INTO homework (
                    homework_title, 
                    homework_content, 
                    homework_course, 
                    homework_course_id, 
                    homework_resource, 
                    homework_sender, 
                    homework_time
                ) VALUES (
                    '{$homework['title']}', 
                    '{$homework['content']}', 
                    '{$homework['course']}', 
                    {$homework['course_id']}, 
                    '{$homework['file']}', 
                    {$homework['id']}, 
                    {$homework['time']}
                )";
        return $this->exec($sql);
    }
    
    //上传资源
    public function uploadResource($resource) {
        $sql = "INSERT INTO resource (
                    resource_first,
                    resource_names,
                    resource_course,
                    resource_course_id,
                    resource_sender,
                    resource_time
                ) VALUES (
                    '{$resource['title']}',
                    '{$resource['file']}',
                    '{$resource['course']}',
                    {$resource['course_id']},
                    {$resource['id']},
                    {$resource['time']}
                )";
        return $this->exec($sql);
    }
    
    //发布公告
    public function sentNotice($notice) {
        $sql = "INSERT INTO notice (
                    notice_title,
                    notice_content,
                    notice_course,
                    notice_course_id,
                    notice_sender,
                    notice_time
                ) VALUES (
                    '{$notice['title']}',
                    '{$notice['content']}',
                    '{$notice['course']}',
                    {$notice['course_id']},
                    {$notice['id']},
                    {$notice['time']}
                )";
        return $this->exec($sql);
    }
    
    //获取某位教师发布的作业
    public function getTeacherHomework($teacher_id, $limit="0,10") {
        $sql = "SELECT * FROM homework WHERE homework_sender=$teacher_id ORDER BY homework_time DESC LIMIT $limit";
        return $this->select($sql);
    }
    
    //获取某位教师上传的资源
    public function getTeacherResource($teacher_id, $limit="0,10") {
        $sql = "SELECT * FROM resource WHERE resource_sender=$teacher_id ORDER BY resource_time DESC LIMIT $limit";
        return $this->select($sql);
    }
    
    //获取某位教师发布的公告
    public function getTeacherNotice($teacher_id, $limit="0,10") {
        $sql = "SELECT * FROM notice WHERE notice_sender=$teacher_id ORDER BY notice_time DESC LIMIT $limit";
        return $this->select($sql);
    }
    
    //作业评分
    public function grade($homework_id, $stu_id, $score) {
        $sql = "UPDATE home_progress SET homework_grade_teacher=$score WHERE homework_id=$homework_id AND homework_stu_id='$stu_id'";
        return $this->exec($sql);
    }
    
    //教师身份验证
    public function checkId($homework_id) {
        $sql = "SELECT homework_sender FROM homework WHERE id=$homework_id";
        return $this->find($sql);
    }
    
    //获取某次作业的教师评分
    public function getScore($homework_id, $stu_id) {
        $sql = "SELECT homework_grade_teacher FROM home_progress WHERE homework_id=$homework_id AND homework_stu_id='$stu_id'";
        return $this->find($sql);
    }
    
    //获取作业所在的课程id
    public function getCourseId($homework_id) {
        $sql = "SELECT homework_course_id FROM homework WHERE id=$homework_id";
        return $this->find($sql);
    }
    
    //获取作业名称
    public function getHomeworkName($homework_id) {
        $sql = "SELECT homework_title FROM homework WHERE id=$homework_id";
        return $this->find($sql);
    }
    
    //修改评分
    public function modifyScore($homework_id, $stu_id, $score) {
        $sql = "UPDATE home_progress SET homework_grade_teacher=$score WHERE homework_id=$homework_id AND homework_stu_id='$stu_id'";
        return $this->exec($sql);
    }
}