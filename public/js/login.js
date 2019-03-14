/**
 * 
 */

$(function() {
	$(".choose").on("click", function() {
		if(!$("#teacher").attr("checked")) {
			$(".student_num").fadeOut();
			$(".num").fadeOut();
			$(".teacher_name").fadeIn();
			$(".user").fadeIn();
			$("#teacher").attr("checked", "checked");
			$("#student").attr("checked", false);
			$("#num").val("");
			$(".num").val("");
		} else {
			$(".teacher_name").fadeOut();
			$(".user").fadeOut();
			$(".student_num").fadeIn();
			$(".num").eq(0).fadeIn();
			$("#student").attr("checked", "checked");
			$("#teacher").attr("checked", false);
			$("#user").val("");
			$(".user").val("");
		}
		$(".pwd").val("");
	})
	
	$(".log").on("submit", function() {
		var num = $("#num").val();
		var username = $("#user").val();
		var pwd = $("#pwd").val();
		//判断学号或者用户名
		if(!$("#teacher").attr("checked")) {
			if(num.length != 11 || num.indexOf("2") != 0) {
				$(".num").text("学号格式不正确");
				return false;
			}else{
				$(".num").text("");
			}
		} else {
			if(username.length == 0) {
				$(".user").text("请输入姓名");
				return false;
			}
		}
		//判断密码格式
		if(pwd.length < 6 || pwd.length > 15) {
			$(".pwd").text("密码长度不正确");
			return false;
		}else{
			$(".pwd").text("");
		}
		$.ajax({
			type: "POST",
			url: "index.php?control=login&action=doLog",
			data: {
				num: num, 
				username: username, 
				pwd: pwd
			},
			success: function(data) {
				var rtnObj = JSON.parse(data);
				if(rtnObj.status == 1) {
					$('.alert_box').css({ 
						position:'absolute', 
						left: ($(window).width() - $('.alert_box').outerWidth())/2, 
						top: ($(window).height() - $('.alert_box').outerHeight())/2 + $(document).scrollTop() 
					}).html("登录成功<img src='public/img/finish.png' />").fadeIn();
					localStorage.setItem("uid", rtnObj.id);
					localStorage.setItem("username", rtnObj.username);
					localStorage.setItem("type", rtnObj.type);
					setTimeout(function() {
						window.location = "index.php?control=personal";
					}, 1000);
				} else {
					$('.alert_box').css({ 
						position:'absolute', 
						left: ($(window).width() - $('.alert_box').outerWidth())/2, 
						top: ($(window).height() - $('.alert_box').outerHeight())/2 + $(document).scrollTop() 
					}).text("用户名或密码不正确").fadeIn();
					setTimeout(function(){
						$('.alert_box').fadeOut();
					}, 1000);
				}
			}
		})
		return false;
	})
})