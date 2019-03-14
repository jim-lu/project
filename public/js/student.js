/**
 * 
 */

$(function() {
	var student_id = GetQueryString("id");  //获取教师id
	
	//进入该页时加载首页内容
	var content = $(".student_content").val();
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
	
	$(".menu").on("click", "a", function(e) {
		var id = $(e.target).attr("id");
		$(".student_content").val(id);
		switch(id) {
			case "notices":
				if($(".student_content") != "notices") {
					getNoticeAjax();
				}
				break
			case "homework": 
				if($(".student_content") != "homework") {
					getHomeworkAjax();
				}
				break;
			case "resources":
				if($(".student_content") != "resources") {
					getResourcesAjax();
				}
				break;
			default: 
				if($(".student_content").val() != "about") {
					getAboutAjax();
				}
		}
		$(".student_content").val(id);
	})
	
	function getAboutAjax() {
		$.get("index.php?control=student&action=getAbout&id=" + student_id, function(rtn) {
			var rtnObj = JSON.parse(rtn);
			$(".content").html(rtnObj.html);
		})
	}
	
	function getResourcesAjax() {
		$.get("index.php?control=student&action=getResources&id=" + student_id, function(rtn) {
			var rtnObj = JSON.parse(rtn);
			$(".content").html(rtnObj.html);
		})
	}
	
	function getHomeworkAjax() {
		$.get("index.php?control=student&action=getHomework&id=" + student_id, function(rtn) {
			var rtnObj = JSON.parse(rtn);
			$(".content").html(rtnObj.html);
		})
	}
	
	function getNoticeAjax() {
		$.get("index.php?control=student&action=getNotices&id=" + student_id, function(rtn) {
			var rtnObj = JSON.parse(rtn);
			$(".content").html(rtnObj.html);
		})
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