/**
 * 
 */

$(function() {
	//进入该页面获取所有课程信息
	$.get("index.php?control=admin&action=getCourse", {filter: "", page: 1}, function(rtn) {
		var rtnObj = JSON.parse(rtn);
		$(".main_table").html(rtnObj.html);
	}).then(function() {
		var content = $("#page_info").val();
		switch(content) {
			case "teacher":
				getTeacherAjax();
				break;
			case "student":
				getStudentAjax();
				break;
			case "admin": 
				getAdminAjax();
				break;
			default: 
				getCourseAjax();
				
		}
	})
	
	//课程信息学期选择
	$(".main_table").on("click", ".filter", function(e) {
		var tg = $(e.target);
		if(tg.is("p") || tg.is("i")) {
			tg.parent().siblings("ul").slideToggle();
		}else{
			if(!tg.is("label")) {
				var _text = tg.text();
				$("h3 p").text(_text);
				$("#term").val(_text);
				$.get("index.php?control=admin&action=getCourse", {filter: _text, page: 1}, function(rtn) {
					var rtnObj = JSON.parse(rtn);
					$(".main_table").html(rtnObj.html);
					$("h3 p").text(_text);
				}).then(function() {
					$.get("index.php?control=admin&action=getPage", {filter: _text, cur_ten: 1, info: "course"}, function(rtn) {
						var rtnObj = JSON.parse(rtn);
						$(".page").html(rtnObj.html);
						$("#cur_ten").val(rtnObj.cur_ten);
						$(".page li").eq(0).addClass("active");
					})
				})
			}
		}
	})
	$(".main_table").on("click", ".term_box", function(e) {
		var this_elm = $(e.target);
		var text = this_elm.text();
		$("h4").html(text + " <i class='fa fa-caret-down'></i>");
		this_elm.siblings("ul").slideToggle();
		if(this_elm.is("li")) {
			$.get("index.php?control=admin&action=setTerm", {text: text}, function(rtn) {
				var rtnObj = JSON.parse(rtn);
				if(rtnObj.status == 1) {
					$('.alert_box').css({ 
						position:'absolute', 
						left: ($(window).width() - $('.alert_box').outerWidth())/2, 
						top: ($(window).height() - $('.alert_box').outerHeight())/2 + $(document).scrollTop() 
					}).html("选择成功<img src='public/img/finish.png' />").fadeIn();
					setTimeout(() => {
						$('.alert_box').fadeOut();
					}, 1000);
				}
			})
		} else if(this_elm.is("h4") && this_elm.siblings("ul").css("display") == "block") {
			$.get("index.php?control=admin&action=getTerm", function(rtn) {
				var rtnObj = JSON.parse(rtn);
				var str = "";
				for(var i = 0; i < rtnObj.terms.length; i ++) {
					str += "<li>" + rtnObj.terms[i]["term"] + "</li>"
				}
				$(".current_term").html(str);
			})
		}
	})
	$(document).on("click", function(e) {
		var tg = $(e.target);
		if($(".filter ul").css("display") == "block" && !tg.is("p") && !tg.is("i")) {
			$(".filter ul").slideToggle();
		} else if($(".current_term").css("display") == "block" && !tg.is("h4")) {
			$(".current_term").slideToggle();
		}
	})
	
	$(".main_table").on("click", "#add_term", function() {
		$.get("index.php?control=admin&action=addTerm", function(rtn) {
			var rtnObj = JSON.parse(rtn);
			if(rtnObj.status == 1) {
				$('.alert_box').css({ 
					position:'absolute', 
					left: ($(window).width() - $('.alert_box').outerWidth())/2, 
					top: ($(window).height() - $('.alert_box').outerHeight())/2 + $(document).scrollTop() 
				}).html("添加成功<img src='public/img/finish.png' />").fadeIn();
				setTimeout(() => {
					$('.alert_box').fadeOut();
				}, 1000);
			}
		})
	})
	
	//添加管理员
	$(".main_table").on("submit", "#add_admin", function() {
		var username = $("#username").val();
		var pwd = $("#pwd").val();
		var confirm = $("#confirm").val();
		//判断用户名
		if(username.length == 0) {
			$(".user_warn").css("display", "block");
			return false;
		} else {
			$(".user_warn").css("display", "none");
		}
		//判断密码长度
		if(pwd.length < 6 || pwd.length > 15) {
			$(".pwd_warn").css("display", "block");
			return false;
		}else{
			$(".pwd_warn").css("display", "none");
		}
		//验证输入密码
		if(pwd != confirm) {
			$(".confirm_warn").css("display", "block");
			return false;
		}else{
			$(".confirm_warn").css("display", "none");
		}
		$.ajax({
			type: "POST",
			url: "index.php?control=admin&action=addAdmin",
			data: {
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
					}).html("添加成功<img src='public/img/finish.png' />").fadeIn();
					var str = "<tr><td>" + rtnObj.last_id + "</td><td>" + username + "</td></tr>";
					$(".admin_table").append(str);
					setTimeout(() => {
						$('.alert_box').fadeOut();
					}, 1000);
				}
			}
		})
		return false;
	})
	
	$(".side_box li").on("click", function(e) {
		var id = $(e.target).attr("id");
		for(var i = 0; i < $(".side_box li").length; i ++) {
			$(".side_box li").eq(i).removeClass("active");
		}
		$(e.target).addClass("active");
		switch(id) {
			case "teacher":
				if($("#page_info").val() != "teacher") {
					getTeacherAjax();
				}
				break;
			case "student":
				if($("#page_info").val() != "student") {
					getStudentAjax();
				}
				break;
			case "admin":
				if($("#page_info").val() != "admin") {
					getAdminAjax();
				}
				break;
			default:
				if($("#page_info").val() != "course") {
					getCourseAjax();
				}
		}
		$("#page_info").val(id);
	})
	
	//课程分页切换
	$(".page").on("click", "li", function(e) {
		var this_elm = $(e.target);
		var info = $("#page_info").val();
		var filter = $("#term").val();
		var url = "";
		switch(info) {
			case "teacher":
				url = "index.php?control=admin&action=getTeacher";
				break;
			case "student":
				url = "index.php?control=admin&action=getStudent";
				break;
			default:
				url = "index.php?control=admin&action=getCourse";
		}
		if(!this_elm.hasClass("active")) {
			var page = this_elm.text();
			$.get(url, {filter, page}, function(rtn) {
				var rtnObj = JSON.parse(rtn);
    			$(".main_table").html(rtnObj.html);
    			if(info == "course") {
					$("h3 p").text(filter);
				}
    			for(var i = 0; i < $(".page li").length; i ++) {
    				$(".page li").eq(i).removeClass("active");
    			}
    			this_elm.addClass("active");
			})
		}
	})
	
	//点击进入下一个十页
	$(".page").on("click", ".next", function(e) {
		var this_elm = $(e.target);
		var page = Number($("#cur_ten").val()) * 10 * 10 + 1;
		var cur_ten = Number($("#cur_ten").val()) + 1;
		var info = $("#page_info").val();
		var filter = $("#term").val();
		var url = "";
		switch(info) {
			case "teacher":
				url = "index.php?control=admin&action=getTeacher";
				break;
			case "student":
				url = "index.php?control=admin&action=getStudent";
				break;
			default:
				url = "index.php?control=admin&action=getCourse";
		}
		$.get(url, {filter, page}, function(rtn) {
			var rtnObj = JSON.parse(rtn);
			$(".main_table").html(rtnObj.html);
			if(info == "course") {
				$("h3 p").text(filter);
			}
		}).then(() => {
			$.get("index.php?control=search&action=getPage", {cur_ten, info}, function(rtn) {
				var rtnObj = JSON.parse(rtn);
				$(".page").html(rtnObj.html);
				$("#cur_ten").val(rtnObj.cur_ten);
				$(".page li").eq(1).addClass("active");
			})
		})
	})
	
	//点击返回上一个十页
	$(".page").on("click", ".prev", function(e) {
		var this_elm = $(e.target);
		var page = (Number($("#cur_ten").val()) - 2) * 10 * 10 + 1;
		var cur_ten = Number($("#cur_ten").val()) - 1;
		var info = $("#page_info").val();
		var filter = $("#term").val();
		var url = "";
		switch(info) {
			case "teacher":
				url = "index.php?control=admin&action=getTeacher";
				break;
			case "student":
				url = "index.php?control=admin&action=getStudent";
				break;
			default:
				url = "index.php?control=admin&action=getCourse";
		}
		$.get(url, {filter, page}, function(rtn) {
			var rtnObj = JSON.parse(rtn);
			$(".main_table").html(rtnObj.html);
			if(info == "course") {
				$("h3 p").text(filter);
			}
		}).then(() => {
			$.get("index.php?control=search&action=getPage", {cur_ten, info}, function(rtn) {
				var rtnObj = JSON.parse(rtn);
				$(".page").html(rtnObj.html);
				$("#cur_ten").val(rtnObj.cur_ten);
				$(".page li").eq(0).addClass("active");
			})
		})
	})
	
	//管理员登录
	$(".login_form").on("submit", function() {
		var username = $("#username").val();
		var pwd = $("#pwd").val();
		//判断用户名
		if(username.length == 0) {
			$(".username").text("请输入用户名");
			return false;
		}
		//判断密码长度
		if(pwd.length < 6 || pwd.length > 15) {
			$(".pwd").text("密码长度不正确");
			return false;
		}else{
			$(".pwd").text("");
		}
		$.ajax({
			type: "POST",
			url: "index.php?control=admin&action=doLog",
			data: {
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
					localStorage.removeItem("uid");
					localStorage.removeItem("type");
					localStorage.removeItem("username");
					localStorage.setItem("type", "admin");
					setTimeout(() => {
						window.location = "index.php?control=admin";
					}, 1000);
				}
			}
		})
		return false;
	})
	
	function getCourseAjax() {
		$.get("index.php?control=admin&action=getCourse", {filter: "", page: 1}, function(rtn) {
			var rtnObj = JSON.parse(rtn);
			$(".main_table").html(rtnObj.html);
		}).then(() => {
			$.get("index.php?control=admin&action=getPage", {cur_ten: 1, info: "course"}, function(rtn) {
				var rtnObj = JSON.parse(rtn);
				$(".page").html(rtnObj.html);
				$("#cur_ten").val(rtnObj.cur_ten);
				$(".page li").eq(0).addClass("active");
			})
		})
	}
	
	function getTeacherAjax() {
		$.get("index.php?control=admin&action=getTeacher", {page: 1}, function(rtn) {
			var rtnObj = JSON.parse(rtn);
			$(".main_table").html(rtnObj.html);
		}).then(() => {
			$.get("index.php?control=admin&action=getPage", {cur_ten: 1, info: "teacher"}, function(rtn) {
				var rtnObj = JSON.parse(rtn);
				$(".page").html(rtnObj.html);
				$("#cur_ten").val(rtnObj.cur_ten);
				$(".page li").eq(0).addClass("active");
			})
		})
	}
	
	function getStudentAjax() {
		$.get("index.php?control=admin&action=getStudent", {page: 1}, function(rtn) {
			var rtnObj = JSON.parse(rtn);
			$(".main_table").html(rtnObj.html);
		}).then(() => {
			$.get("index.php?control=admin&action=getPage", {cur_ten: 1, info: "student"}, function(rtn) {
				var rtnObj = JSON.parse(rtn);
				$(".page").html(rtnObj.html);
				$("#cur_ten").val(rtnObj.cur_ten);
				$(".page li").eq(0).addClass("active");
			})
		})
	}
	
	function getAdminAjax() {
		$.get("index.php?control=admin&action=getAdmin", function(rtn) {
			var rtnObj = JSON.parse(rtn);
			$(".main_table").html(rtnObj.html);
		})
	}
})