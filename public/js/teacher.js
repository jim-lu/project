/**
 * 
 */

$(function() {
	var teacher_id = GetQueryString("id");  //获取教师id
	var lock = true;  //获取所有记录后进行上锁避免重复请求, true为可以继续请求，false为不再请求
	var user_id = localStorage.getItem("uid");  //获取用户id
	
	//进入该页时加载首页内容
	var content = $(".teacher_content").val();
	switch(content) {
		case "homework": 
			getHomeworkAjax();
			break;
		case "resources": 
			getResourceAjax();
			break;
		case "notices": 
			getNoticeAjax();
			break;
		default: 
			getAboutAjax();
	}
	
	limit($(".homework_list li a").text(), 30);
	
	//教师信息切换
	$(".menu").on("click", "a", function(e) {
		var id = $(e.target).attr("id");
		switch(id) {
			case "homework": 
				if($(".teacher_content").val() != "homework") {
					getHomeworkAjax();
					lock = true;
				}
				break;
			case "resources": 
				if($(".teacher_content").val() != "resources") {
					getResourceAjax();
					lock = true;
				}
				break;
			case "notices": 
				if($(".teacher_content").val() != "notices") {
					getNoticeAjax();
					lock = true;
				}
				break;
			default: 
				if($(".teacher_content").val() != "about") {
					getAboutAjax();
					lock = true;
				}
		}
		$(".teacher_content").val(id);
	})
	
	//上传文件
	$(".content").on("change", "#file", handleFileSelect);
	$(".content").on("submit", "#dropzone", function(e) {
		var tg = $(e.target);
		var course = tg.find(".course_selected").val();
		var course_id = tg.find(".course_id").val();
		if(course == "") {
			tg.children(".course_box").find("span").css("display", "block");
			return false;
		}
		var formData = new FormData();
		formData.append("uid", localStorage.getItem('uid'));
		formData.append("course", course);
		formData.append("course_id", course_id);
		var items = $("#file")[0].files;
		for(var i = 0; i < items.length; i ++) {
			formData.append("file" + i, items[i]);
		}
		$.ajax({
			url: "index.php?control=teacher&action=uploadResource",
	        type: "POST",
	        contentType: false,
	        processData: false,
	        data: formData,
	        success: function(data) {
	            data = $.parseJSON(data);
	            if (data['status'] == 1) {
	            	tg.parent().siblings("ul.resource_list").prepend(data.html);
					$("ul.resource_list li").eq(0).fadeIn("slow");
					$('.alert_box').css({ 
						position:'absolute', 
						left: ($(window).width() - $('.alert_box').outerWidth())/2, 
						top: ($(window).height() - $('.alert_box').outerHeight())/2 + $(document).scrollTop() 
					}).html("发布成功<img src='public/img/finish.png' />").fadeIn();
					$(".preview").html("");
					$(".sub_resourses").attr("disabled", "disabled").css({
						"opacity": 0.5,
						"cursor": "auto"
					});
					setTimeout(function() {
						$('.alert_box').fadeOut();
					}, 1000);
	            }
	        }
		})
		return false;
	});
	
	//课程选择下拉框
	$(".content").on("click", ".course_select", function(e) {
		var tg = $(e.target);
		if(tg.is("h4")) {
			tg.siblings("ul").slideToggle();
		}else{
			var _text = tg.text();
			tg.parent().siblings("h4").html(_text + "&nbsp;<i class='fa fa-caret-down'></i>");
		}
	})
	$(document).on("click", function(e) {
		if($(".course_select_list").css("display") == "block" && !$(e.target).is("h4")) {
			$(".course_select_list").slideToggle();
		}
	})
	
	//课程选择
	$(".content").on("click", ".course_select_list li", function(e) {
		var tg = $(e.target);
		tg.parent().siblings(".course_selected").val(tg.text());
		tg.parent().siblings(".course_id").val(tg.attr("name"));
		tg.parent().parent().siblings("span").css("display", "none");
	})
	
	//发布作业
	$(".content").on("submit", "#sent_homework", function(e) {
		var tg = $(e.target);
		tg.find("span").css("display", "none");
		var title = tg.find(".homework_title").val();
		var content = tg.find(".homework_content").val();
		var course = tg.find(".course_selected").val();
		var course_id = tg.find(".course_id").val();
		if(title == "") {
			tg.children(".text_box").find("span").fadeIn();
			return false;
		} else {
			tg.children(".text_box").find("span").fadeOut();
		}
		if(course == "") {
			tg.children(".course_box").find("span").fadeIn();
			return false;
		} else {
			tg.children(".course_box").find("span").fadeOut();
		}
		var formData = new FormData();
		formData.append("uid", user_id);
		formData.append("title", title);
		formData.append("content", content);
		formData.append("course", course);
		formData.append("course_id", course_id);
		var items = $("#file")[0].files;
		for(var i = 0; i < items.length; i ++) {
			formData.append("file" + i, items[i]);
		}
		$.ajax({
			type: "POST",
			url: "index.php?control=teacher&action=sentHomework",
			contentType: false,
	        processData: false,
			data: formData,
			success: function(data) {
				data = $.parseJSON(data);
				if(data["status"] == 1) {
					tg.parent().siblings("ul.homework_list").prepend(data.html);
					$("ul.homework_list li").eq(0).fadeIn("slow");
					$('.alert_box').css({ 
						position:'absolute', 
						left: ($(window).width() - $('.alert_box').outerWidth())/2, 
						top: ($(window).height() - $('.alert_box').outerHeight())/2 + $(document).scrollTop() 
					}).html("发布成功<img src='public/img/finish.png' />").fadeIn();
					$(".preview").html("");
					setTimeout(function() {
						$('.alert_box').fadeOut();
					}, 1000);
				}
			}
		});
		return false;
	})
	
	//发布公告
	$(".content").on("submit", "#sent_notice", function(e) {
		var tg = $(e.target);
		tg.find("span").css("display", "none");
		var uid = user_id;
		var title = tg.find(".notice_title").val();
		var course = tg.find(".course_selected").val();
		var content = tg.find(".notice_content").val();
		var course_id = tg.find(".course_id").val();
		if(title == "") {
			tg.children(".title_box").find("span").css("display", "block");
			return false;
		} else if(course == "") {
			tg.children(".course_box").find("span").css("display", "block");
			return false;
		} else if(content == "") {
			tg.children(".content_box").find("span").css("display", "block");
			return false;
		} else {
			$.ajax({
				type: "POST",
				url: "index.php?control=teacher&action=sentNotice",
				data: {
					title: title, 
					course: course, 
					content: content, 
					uid: uid,
					course_id: course_id
				},
				success: function(data) {
					data = $.parseJSON(data);
					if(data["status"] == 1) {
						tg.parent().siblings("ul.notice_list").prepend(data.html);
						$("ul.notice_list li").eq(0).fadeIn("slow");
						$('.alert_box').css({ 
							position:'absolute', 
							left: ($(window).width() - $('.alert_box').outerWidth())/2, 
							top: ($(window).height() - $('.alert_box').outerHeight())/2 + $(document).scrollTop() 
						}).html("发布成功<img src='public/img/finish.png' />").fadeIn();
						setTimeout(function() {
							$('.alert_box').fadeOut();
						}, 1000);
					}
				}
			});
		}
		return false;
	})
	
	$(window).scroll(function() {
		if($(window).scrollTop() == $(document).height() - $(window).height()) {
			var content = $(".teacher_content").val();
			var action, list;
			switch(content) {
				case "notices": 
					action = "nextPageNotice";
					list = ".notice_list";
					break;
				case "resources":
					action = "nextPageResource";
					list = ".resource_list"
					break;
				case "homework":
					action = "nextPageHomework";
					list = ".homework_list"
					break;
				default:
					action = false;
			}
			var pageStart = $("#page-mark").attr("data-page") * 10;
			if(lock && action) {
				$.get("index.php?control=teacher&action=" + action + "&id=" + teacher_id, {page: pageStart}, function(rtn) {
					var rtnObj = JSON.parse(rtn);
					if(rtnObj.status == 1) {
						$(list).append(rtnObj.html);
						$(list + " li").fadeIn();
						var currentPage = parseInt($("#page-mark").attr("data-page")) + 1;
						$("#page-mark").attr("data-page", currentPage);
					} else {
						lock = false;
					}
				})
			}
		}
	});
	
	function getAboutAjax() {
		$.get("index.php?control=teacher&action=getAbout&id=" + teacher_id, function(rtn) {
			var rtnObj = JSON.parse(rtn);
			$(".content").html(rtnObj.html);
		})
	}
	
	function getHomeworkAjax() {
		$.get("index.php?control=teacher&action=getHomework&id=" + teacher_id, function(rtn) {
			var rtnObj = JSON.parse(rtn);
			$(".content").html(rtnObj.html);
			if(user_id == teacher_id) {
				$("h3").fadeIn();
				$(".upload_box").fadeIn();
			}
		})
	}
	
	function getResourceAjax() {
		$.get("index.php?control=teacher&action=getResources&id=" + teacher_id, function(rtn) {
			var rtnObj = JSON.parse(rtn);
			$(".content").html(rtnObj.html);
			if(user_id == teacher_id) {
				$("h3").fadeIn();
				$(".upload_box").fadeIn();
			}
		})
	}
	
	function getNoticeAjax() {
		$.get("index.php?control=teacher&action=getNotices&id=" + teacher_id, function(rtn) {
			var rtnObj = JSON.parse(rtn);
			$(".content").html(rtnObj.html);
			if(user_id == teacher_id) {
				$("h3").fadeIn();
				$(".sent_box").fadeIn();
			}
		})
	}
	
	function handleFileSelect() {
		$(".preview").html("");
		var items = $("#file")[0].files;
		var filesLength = items.length;
		var template = "";
		if(filesLength > 0) {
			for(var i = 0; i < filesLength; i ++) {
				template += "<div class='file file--" + i + " clearfix'><div class='name'>" + limit(items[i].name, 15) + "</div><div class='progress'><div class='progressBar'></div></div><div class='done'><img src='public/img/finish.png' /></div></div>"
			}
			$(".preview").append(template);
			setTimeout(function() {
				$(".submit_button").attr("disabled", false).css("opacity", 1).css("cursor", "pointer");
			}, 2000);
		}
	}
	
	function limit(str, len) {
		if(str.length > len) {
			str = str.substring(0, len) + "...";
		}
		return str
	}
	
	function GetQueryString(name) {
		var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if(r!=null) {
			return unescape(r[2]);
		}
		return null;
	}
})