/**
 * 
 */

$(function() {
	var course_id = GetQueryString("id");
	if(localStorage.getItem("type") == "student") {
		$(".join").css("opacity", 1).attr("disabled", false);
	}
	
	//进入该页时加载首页内容
	$.get("index.php?control=course&action=checkMember", {course_id: course_id, student_id: localStorage.getItem("uid")}, function(rtn) {
		var rtnObj = JSON.parse(rtn);
		if(rtnObj.status == 1) {
			$(".join").css("opacity", 0.5).attr("disabled", true);
		}
	}).then(function() {
		var content = $(".course_content").val();
		switch(content) {
			//切换到课程简介
			case "brief_intro": 
				getIntroAjax();
				$("span.underline").css("left", "190px");
				commentShow = 0;
				break;
			//切换到课程成员
			case "member": 
				getMemberAjax();
				$("span.underline").css("left", "350px");
				commentShow = 0;
				break;
			//切换到公告
			case "notice": 
				getNoticeAjax();
				$("span.underline").css("left", "510px");
				commentShow = 0;
				break;
			//切换到资源
			case "resource": 
				getResourceAjax();
				$("span.underline").css("left", "670px");
				commentShow = 0;
				break;
			//切换到作业
			case "homework":
				getHomeworkAjax();
				$("span.underline").css("left", "830px");
				commentShow = 0;
				break;
			//切换到首页
			default: 
				getIndexAjax();
				$("span.underline").css("left", "30px");
			}
	})
	
	var scrollTimer = null;  //设定计时器防止滚动条事件多次触发
	var scrollTop;  //滚动条距离顶部的距离
	var offsetTop;  //元素在页面中的位置
	var winHeight = $(window).height();  //页面高度
	var commentShow = 0;  //判断评论是否已经加载，0为未加载，1为已加载
	$(window).on("scroll", function() {
		if($(".course_content").val() == "index") {
			clearTimeout(scrollTimer);
			scrollTop = $(window).scrollTop();
			offsetTop = $("ul.comment").offset().top;
			if(offsetTop < scrollTop + winHeight) {
				scrollTimer = setTimeout(function() {
					if(commentShow == 0) {
						$.get("index.php?control=course&action=getComment", {course_id: course_id}, function(rtn) {
							var rtnObj = JSON.parse(rtn);
							$("ul.comment").html(rtnObj.html);
							$("ul.comment li").fadeIn("slow");
						})
						commentShow = 1;
					}
				}, 1000);
			}
		}
	})
	
	//课程首页菜单栏
	$(".menu ul li a").on("click", function() {
		var pos = $(this).parent().position().left;
		var linePos = $("span.underline").position().left;
		setInterval(function() {
			if(linePos < pos + 30) {
				linePos += 5;
				$("span.underline").css("left", linePos + "px");
			}else if(linePos > pos + 30) {
				linePos -= 5;
				$("span.underline").css("left", linePos + "px");
			}
		}, 1);
	})
	
	//课程首页内容切换
	$(".menu").on("click", "a", function(e) {
		//标记已经显示的分页，避免重复请求
		var id = $(e.target).attr("id");
		switch(id) {
			//切换到课程简介
			case "brief_intro": 
				if($(".course_content").val() != "brief_intro") {
					getIntroAjax();
					commentShow = 0;
				}
				break;
			//切换到课程成员
			case "member": 
				if($(".course_content").val() != "member") {
					getMemberAjax();
					commentShow = 0;
				}
				break;
			//切换到公告
			case "notice": 
				if($(".course_content").val() != "notice") {
					getNoticeAjax();
					commentShow = 0;
				}
				break;
			//切换到资源
			case "resource": 
				if($(".course_content").val() != "resource") {
					getResourceAjax();
					commentShow = 0;
				}
				break;
			//切换到作业
			case "homework":
				if($(".course_content").val() != "homework") {
					getHomeworkAjax();
					commentShow = 0;
				}
				break;
			//切换到首页
			default: 
				if($(".course_content").val() != "index") {
					getIndexAjax();
				}
		}
		$(".course_content").val(id);
	})
	
	//发布评论
	$(".main_container").on("submit", "#sent_comment", function(e) {
		var text = $("#comment_text").val();
		var uid = localStorage.getItem("uid");
		var type = localStorage.getItem("type");
		var this_elm = $(e.target);
		if(uid === undefined || uid == "") {
			$('.alert_box').css({ 
				position:'absolute', 
				left: ($(window).width() - $('.alert_box').outerWidth())/2, 
				top: ($(window).height() - $('.alert_box').outerHeight())/2 + $(document).scrollTop() 
			}).html("请先登录").fadeIn();
			setTimeout(function() {
				window.location.href = "index.php?control=login";
			}, 1000);
		} else {
			if(text.length > 200) {
				$('.alert_box').css({ 
					position:'absolute', 
					left: ($(window).width() - $('.alert_box').outerWidth())/2, 
					top: ($(window).height() - $('.alert_box').outerHeight())/2 + $(document).scrollTop() 
				}).html("评论最多输入200字").fadeIn();
				setTimeout(function() {
					$('.alert_box').fadeOut();
				}, 1000);
			}else{
				$.ajax({
					type: "POST",
					url: "index.php?control=course&action=sentComment",
					data: {
						text: text,
						course_id: course_id,
						sender: uid,
						type: type
					},
					success: function(data) {
						var rtnObj = JSON.parse(data);
						if(rtnObj.status == 1) {
							this_elm.siblings("ul.comment").prepend(rtnObj.html);
							this_elm.children("#comment_text").val("");
							$("ul.comment li").eq(0).fadeIn("slow");
						}
					}
				});
			}
		}
		return false;
	})
	
	//课程成员分页切换
	$(".main_container").on("click", "li", function(e) {
		var this_elm = $(e.target);
		if(this_elm.parent().hasClass("page") && $(".course_content").val() == "member") {
			if(!this_elm.hasClass("active")) {
				var page = this_elm.text();
				$.ajax({
					type: "POST",
    	    		url: "index.php?control=course&action=getPage",
    	    		data: {page: page},
    	    		success: function(data) {
    	    			var rtnObj = JSON.parse(data);
    	    			$(".student_list").html(rtnObj.html);
    	    			for(var i = 0; i < $(".page li").length; i ++) {
    	    				$(".page li").eq(i).removeClass("active");
    	    			}
    	    			this_elm.addClass("active");
    	    		}
				})
			}
		}
	})
	
	//公告分页切换
	$(".main_container").on("click", "li", function(e) {
		var this_elm = $(e.target);
		if(this_elm.parent().hasClass("page") && $(".course_content").val() == "notice") {
			if(!this_elm.hasClass("active")) {
				var page = this_elm.text();
				$.ajax({
					type: "POST",
    	    		url: "index.php?control=course&action=getNoticePage&id=" + course_id,
    	    		data: {page: page},
    	    		success: function(data) {
    	    			var rtnObj = JSON.parse(data);
    	    			$(".notice_list").html(rtnObj.html);
    	    			for(var i = 0; i < $(".page li").length; i ++) {
    	    				$(".page li").eq(i).removeClass("active");
    	    			}
    	    			this_elm.addClass("active");
    	    		}
				})
			}
		}
	})
	
	//资源分页切换
	$(".main_container").on("click", "li", function(e) {
		var this_elm = $(e.target);
		if(this_elm.parent().hasClass("page") && $(".course_content").val() == "resource") {
			if(!this_elm.hasClass("active")) {
				var page = this_elm.text();
				$.ajax({
					type: "POST",
    	    		url: "index.php?control=course&action=getResourcePage&id=" + course_id,
    	    		data: {page: page},
    	    		success: function(data) {
    	    			var rtnObj = JSON.parse(data);
    	    			$(".resource_list").html(rtnObj.html);
    	    			for(var i = 0; i < $(".page li").length; i ++) {
    	    				$(".page li").eq(i).removeClass("active");
    	    			}
    	    			this_elm.addClass("active");
    	    		}
				})
			}
		}
	})
	
	//作业分页切换
	$(".main_container").on("click", "li", function(e) {
		var this_elm = $(e.target);
		if(this_elm.parent().hasClass("page") && $(".course_content").val() == "homework") {
			if(!this_elm.hasClass("active")) {
				var page = this_elm.text();
				$.ajax({
					type: "POST",
    	    		url: "index.php?control=course&action=getHomeworkPage&id=" + course_id,
    	    		data: {page: page},
    	    		success: function(data) {
    	    			var rtnObj = JSON.parse(data);
    	    			$(".homework_list").html(rtnObj.html);
    	    			for(var i = 0; i < $(".page li").length; i ++) {
    	    				$(".page li").eq(i).removeClass("active");
    	    			}
    	    			this_elm.addClass("active");
    	    		}
				})
			}
		}
	})
	
	//加入课程
	$(".join").on("click", function() {
		var student_id = localStorage.getItem("uid");
		var student_name = localStorage.getItem("username");
		$.ajax({
			type: "POST", 
			url: "index.php?control=course&action=addMember", 
			data: {
				course_id: course_id, 
				student_id: student_id, 
				student_name: student_name
			},
			success: function(data) {
				var rtnObj = JSON.parse(data);
				if(rtnObj.status == 1) {
					$('.alert_box').css({ 
						position:'absolute', 
						left: ($(window).width() - $('.alert_box').outerWidth())/2, 
						top: ($(window).height() - $('.alert_box').outerHeight())/2 + $(document).scrollTop() 
					}).html("加入成功<img src='public/img/finish.png' />").fadeIn();
					$(".join").css("opacity", 0.5).attr("disabled", true);
					setTimeout(function() {
						$('.alert_box').fadeOut();
					}, 1000);
				}
			}
		})
	})
	
	function getIndexAjax() {
		$.get("index.php?control=course&action=getIndex&id=" + course_id, function(rtn) {
			var rtnObj = JSON.parse(rtn);
			$(".main_container").html(rtnObj.html);
			for(var i = 0; i < $(".lists li a").length; i ++) {
				$(".lists li a").eq(i).text(limit($(".lists li a").eq(i).text(), 15));
			}
		})
	}
	
	function getHomeworkAjax() {
		$.get("index.php?control=course&action=getHomework&id=" + course_id, function(rtn) {
			var rtnObj = JSON.parse(rtn);
			$(".main_container").html(rtnObj.html);
		}).then(function() {
			$.ajax({
				type: "POST",
	    		url: "index.php?control=course&action=getHomeworkPage&id=" + course_id,
	    		data: {page: 1},
	    		success: function(data) {
	    			var rtnObj = JSON.parse(data);
	    			$(".homework_list").html(rtnObj.html);
	    			$(".page li").eq(0).addClass("active");
	    		}
			})
		})
	}
	
	function getResourceAjax() {
		$.get("index.php?control=course&action=getResource&id=" + course_id, function(rtn) {
			var rtnObj = JSON.parse(rtn);
			$(".main_container").html(rtnObj.html);
		}).then(function() {
			$.ajax({
				type: "POST",
	    		url: "index.php?control=course&action=getResourcePage&id=" + course_id,
	    		data: {page: 1},
	    		success: function(data) {
	    			var rtnObj = JSON.parse(data);
	    			$(".resource_list").html(rtnObj.html);
	    			$(".page li").eq(0).addClass("active");
	    		}
			})
		})
	}
	
	function getNoticeAjax() {
		$.get("index.php?control=course&action=getNotice&id=" + course_id, function(rtn) {
			var rtnObj = JSON.parse(rtn);
			$(".main_container").html(rtnObj.html);
		}).then(function() {
			$.ajax({
				type: "POST",
	    		url: "index.php?control=course&action=getNoticePage&id=" + course_id,
	    		data: {page: 1},
	    		success: function(data) {
	    			var rtnObj = JSON.parse(data);
	    			$(".notice_list").html(rtnObj.html);
	    			$(".page li").eq(0).addClass("active");
	    		}
			})
		})
	}
	
	function getMemberAjax() {
		$.get("index.php?control=course&action=getMember&id=" + course_id, function(rtn) {
			var rtnObj = JSON.parse(rtn);
			$(".main_container").html(rtnObj.html);
		}).then(function() {
			$.ajax({
				type: "POST",
	    		url: "index.php?control=course&action=getPage&id=" + course_id,
	    		data: {page: 1},
	    		success: function(data) {
	    			var rtnObj = JSON.parse(data);
	    			$(".student_list").html(rtnObj.html);
	    			$(".student_container .page li").eq(0).addClass("active");
	    		}
			})
		})
	}
	
	function getIntroAjax() {
		$.get("index.php?control=course&action=getIntro&id=" + course_id, function(rtn) {
			var rtnObj = JSON.parse(rtn);
			$(".main_container").html(rtnObj.html);
		})
	}
	
	function GetQueryString(name) {
		var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if(r!=null) {
			return unescape(r[2]);
		}
		return null;
	}
	
	function limit(str, len) {
		if(str.length > len) {
			str = str.substring(0, len) + "...";
		}
		return str
	}
})
