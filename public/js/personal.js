/**
 * 
 */

$(function() {
	$.ajax({
		type: "POST",
		url: "index.php?control=personal&action=getPersonal",
		data: {
			uid: localStorage.getItem("uid"),
			user_type: localStorage.getItem("type")
		},
		success: function(data) {
			var rtnObj = JSON.parse(data);
			if(rtnObj.status == 1) {
				$("#username").val(rtnObj.result[1]);
				$("#info").val(rtnObj.result[4]);
				$("#email").val(rtnObj.result[5]);
				if(localStorage.getItem("type") == "teacher") {
					$(".top a").attr("href", "?control=teacher&id=" + rtnObj.result[0]);
				} else {
					$(".top a").attr("href", "?control=student&id=" + rtnObj.result[0]);
				}
				if(rtnObj.result[3] != null) {
					$(".preview_box").html("<img src='" + rtnObj.result[3] + "'>");
				} else {
					$(".preview_box").html("<img src='public/img/default.png'>");
				}
				if(rtnObj.course != null) {
					var str = "";
					for(var i = 0; i < rtnObj.course.length; i ++) {
						str += "<tr><td>" + rtnObj.course[i].course_name + "</td><td>" + rtnObj.course[i].course_time + "</td></tr>"
					}
					$(".table").append(str);
				}
			}
		}
	})
	
	if(localStorage.getItem("type") == "teacher") {
		$("#addCourse").css("display", "block");
	} else {
		$("#addCourse").css("display", "none");
	}
	
	//修改信息提交
	$("#personal_form").on("submit", function() {
		var username = $("#username").val();
		var pwd = $("#pwd").val();
		var confirm = $("#confirm").val();
		var info = $("#info").val();
		var avatar = $("#avatar")[0].files[0];
		var email = $("#email").val();
		if(username.length == 0) {
			$("#username").siblings("b").fadeIn();
			return false;
		} else {
			$("#username").siblings("b").fadeOut();
		}
		if(pwd != confirm) {
			$("#confirm").siblings("b").fadeIn();
			return false;
		} else {
			$("#confirm").siblings("b").fadeOut();
		}
		if(!checkEmail(email)) {
			$("#email").siblings("b").fadeIn();
			return false;
		} else {
			$("#email").siblings("b").fadeOut();
		}
		var formData = new FormData();
		formData.append("uid", localStorage.getItem('uid'));
		formData.append("type", localStorage.getItem("type"));
		formData.append("username", username);
		formData.append("pwd", pwd);
		if(avatar == undefined) {
			formData.append("avatar", $(".preview_box img").attr("src"));
		} else {
			formData.append("avatar", avatar);
		}
		formData.append("email", email);
		formData.append("info", info);
		$.ajax({
			type: "POST",
			url: "index.php?control=personal&action=changePersonal",
			contentType: false,
	        processData: false,
			data: formData,
			success: function(data) {
				var rtnObj = JSON.parse(data);
				if(rtnObj.status == 1) {
					$('.alert_box').css({ 
						position:'absolute', 
						left: ($(window).width() - $('.alert_box').outerWidth())/2, 
						top: ($(window).height() - $('.alert_box').outerHeight())/2 + $(document).scrollTop() 
					}).html("修改成功<img src='public/img/finish.png' />").fadeIn();
					localStorage.setItem("username", username);
					setTimeout(() => {
						window.location.reload();
					}, 1000);
				}
			}
		});
		return false;
	})
	
	//限制textarea字数为200
	$(document).on("input propertychange", "#info", function() {
		var _this = $(this);
		var content = _this.val();
		if(content.length > 200) {
			_this.val(content.substring(0, 200));
		}
		_this.siblings("span").text(_this.val().length + "/200")
	})
	
	$("#avatar").on("change", handleFileSelect);
	function handleFileSelect() {
		var item = $("#avatar")[0].files[0];
		if(item) {
			var reader = new FileReader();
			reader.readAsDataURL(item);
			reader.onload = function(evt) {
				$(".preview_box").html('<img src="' + evt.target.result + '" width="100px" height="100px" />');
			}
			
		}
	}
	
	function checkEmail(mail) {
		var preg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
		if(mail == "" || mail == null) {
			return true;
		} else {
			if(!preg.test(mail)) {
				return false;
			}
		}
		return true;
	}
})