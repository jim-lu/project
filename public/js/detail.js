/**
 * 
 */

$(function() {
	var user_id = localStorage.getItem("uid");  //获取用户id
	var homework_id = $("#homework_id").val();  //获取作业id
	var time = GetQueryString("time");  //获取作业标识
	
	//检查是否已经完成作业
	$.get("index.php?control=student&action=checkHomework", {user_id: user_id, homework_id: homework_id, time: time}, function(rtn) {
		var rtnObj = JSON.parse(rtn);
		if(rtnObj.status == 1) {
			$(".upload_box").css("display", "none");
			$(".homework_list").html(rtnObj.html);
			for(var i = 0; i < $(".stu_id").length; i ++) {
				if(user_id == $(".stu_id").eq(i).val()) {
					$(".stu_id").eq(i).siblings(".stu_score").attr("disabled", true);
					$(".stu_id").eq(i).siblings(".stu_submit").attr("disabled", true).css("opacity", 0.5);
				}
			}
		}
	})
	
	//提交作业
	$("#upload_homework").on("submit", function() {
		var formData = new FormData();
		formData.append("uid", user_id);
		formData.append("homework_id", homework_id);
		var items = $("#file")[0].files;
		for(var i = 0; i < items.length; i ++) {
			formData.append("file" + i, items[i]);
		}
		$.ajax({
			type: "POST",
			url: "index.php?control=student&action=handInHomework",
			contentType: false,
	        processData: false,
			data: formData,
			success: function(data) {
				var rtnObj = JSON.parse(data);
				if (rtnObj.status == 1) {
					$('.alert_box').css({ 
						position:'absolute', 
						left: ($(window).width() - $('.alert_box').outerWidth())/2, 
						top: ($(window).height() - $('.alert_box').outerHeight())/2 + $(document).scrollTop() 
					}).html("提交成功<img src='public/img/finish.png' />").fadeIn();
					setTimeout(function() {
						window.location.reload();
					}, 1000);
				}
			}
		})
		return false;
	})
	
	//上传作业
	$("#file").on("change", handleFileSelect);
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
	
	//学生互评
	$(".homework_list").on("click", ".stu_submit", function(e) {
		var target = $(e.target);
		var score = parseInt(target.parent().siblings().find(".stu_score").val());
		var stu_id = target.siblings(".stu_id").val();
		if(score > 100 || score < 0 || isNaN(score)) {
			$('.alert_box').css({ 
				position:'absolute', 
				left: ($(window).width() - $('.alert_box').outerWidth())/2, 
				top: ($(window).height() - $('.alert_box').outerHeight())/2 + $(document).scrollTop() 
			}).html("请输入正确分数格式！").fadeIn();
			setTimeout(function() {
				$('.alert_box').fadeOut();
			}, 1000);
		} else {
			$.ajax({
				type: "POST",
				url: "index.php?control=student&action=studentGrade",
				data: {
					score: score,
					stu_id: stu_id,
					grader_id: user_id,
					homework_id: homework_id
				},
				success: function(data) {
					var rtnObj = JSON.parse(data);
					if(rtnObj.status == 1) {
						$('.alert_box').css({ 
							position:'absolute', 
							left: ($(window).width() - $('.alert_box').outerWidth())/2, 
							top: ($(window).height() - $('.alert_box').outerHeight())/2 + $(document).scrollTop() 
						}).html("评分成功<img src='public/img/finish.png' />").fadeIn();
						setTimeout(function() {
							$('.alert_box').fadeOut();
							target.parent().siblings(".score").text(score + "分");
							target.attr("disabled", true).css("opacity", 0.5);
						}, 1000);
					}
				}
			})
		}
	});
	
	//教师评分
	$(".homework_list").on("click", ".teacher_submit", function(e) {
		var target = $(e.target);
		var score = parseInt(target.parent().siblings().find(".stu_score").val());
		var stu_id = target.siblings(".stu_id").val();
		if(score > 100 || score < 0 || isNaN(score)) {
			$('.alert_box').css({ 
				position:'absolute', 
				left: ($(window).width() - $('.alert_box').outerWidth())/2, 
				top: ($(window).height() - $('.alert_box').outerHeight())/2 + $(document).scrollTop() 
			}).html("请输入正确分数格式！").fadeIn();
			setTimeout(function() {
				$('.alert_box').fadeOut();
			}, 1000);
		} else {
			$.ajax({
				type: "POST",
				url: "index.php?control=teacher&action=teacherGrade",
				data: {
					score: score,
					stu_id: stu_id,
					homework_id: homework_id
				},
				success: function(data) {
					var rtnObj = JSON.parse(data);
					if(rtnObj.status == 1) {
						$('.alert_box').css({ 
							position:'absolute', 
							left: ($(window).width() - $('.alert_box').outerWidth())/2, 
							top: ($(window).height() - $('.alert_box').outerHeight())/2 + $(document).scrollTop() 
						}).html("评分成功<img src='public/img/finish.png' />").fadeIn();
						setTimeout(function() {
							window.location.reload();
						}, 1000);
					}
				}
			})
		}
	})
	
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