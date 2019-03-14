/**
 * 
 */

$(function() {
	$(".select").on("click", function(e) {
		$(".slide_box").slideToggle();
		stopPropagation(e);
	})
	$(".slide_box li").on("click", function() {
		var _text = $(this).text();
		$(".select span").text(_text);
	})
	$(document).on("click", function() {
		if($(".slide_box").css("display") == "block") {
			$(".slide_box").slideToggle();
		}
	})
	
	function stopPropagation(e) {
		if(e.stopPropagation) {
			e.stopPropagation();
		}else{
			e.cancelBubble = true;
		}
	}
	
	//判断是否已经登录
	if(localStorage.getItem("username")) {
		var user = localStorage.getItem("username");
		$(".unlog").css("display", "none");
		$(".logged").css("display", "block");
		$(".logged a").eq(0).text(user);
	}
	
	//退出登录状态
	$(".logout").on("click", function() {
		localStorage.removeItem("uid");
		localStorage.removeItem("username");
		localStorage.removeItem("type");
		$(".logged").css("display", "none");
		$(".unlog").css("display", "block");
	})
	
	//搜索
	$("#search_button").on("click", function() {
		var text = $("#search_text").val();
		var type = $(".select span").text();
		if(type == "课程") {
			window.location.href="index.php?control=search&action=couseSearch&keyword=" + text;
		} else if (type == "教师") {
			window.location.href="index.php?control=search&action=teacherSearch&keyword=" + text;
		}
	})
})