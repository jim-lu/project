/**
 * 
 */

$(function() {
	$(".choose").on("click", function() {
		if(!$("#teacher").attr("checked")) {
			$(".student_num").eq(0).fadeOut();
			$(".num").eq(0).fadeOut();
			$("#teacher").attr("checked", "checked");
			$("#student").attr("checked", false);
			$("#num").val("");
		} else {
			$(".student_num").eq(0).fadeIn();
			$(".num").eq(0).fadeIn();
			$("#student").attr("checked", "checked");
			$("#teacher").attr("checked", false);
		}
	})
	
	$(".reg").on("submit", function() {
		var num = $("#num").val();
		var username = $("#username").val();
		var pwd = $("#pwd").val();
		var confirm = $("#confirm_pwd").val();
		if($("#student").attr("checked")) {
			//判断学号格式
			if(num.length != 11 || num.indexOf("2") != 0) {
				$(".num").text("学号格式不正确");
				return false;
			}else{
				$(".num").text("");
			}
		}
		//判断用户名
		if(username.length == 0) {
			$(".username").text("请输入姓名");
			return false;
		}
		//判断密码长度
		if(pwd.length < 6 || pwd.length > 15) {
			$(".pwd").text("密码长度不正确");
			return false;
		}else{
			$(".pwd").text("");
		}
		//验证输入密码
		if(pwd != confirm) {
			$(".confirm").text("两次密码输入不相同");
			return false;
		}else{
			$(".confirm").text("");
		}
		$.ajax({
			type: "POST",
			url: "index.php?control=register&action=doReg",
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
					}).fadeIn();
					localStorage.setItem("uid", rtnObj.id);
					localStorage.setItem("username", rtnObj.username);
					localStorage.setItem("type", rtnObj.type);
					setTimeout(function() {
						window.location = "index.php?control=personal";
					}, 1000);
				}
			}
		})
		return false;
	})
})