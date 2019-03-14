/**
 * 
 */

$(function() {
	//进入该页获取课程信息
	var keyword = getUrlParam("keyword");
	$.ajax({
		type: "POST",
		url: "index.php?control=search&action=getTeacher",
		data: {
			page: 1, 
			keyword: keyword
		},
		success: function(data) {
			var rtnObj = JSON.parse(data);
			$(".list").html(rtnObj.html);
		}
	}).then(function() {
		$.get("index.php?control=search&action=getPage", {cur_ten: 1, info: "teacher", keyword: keyword}, function(rtn) {
			var rtnObj = JSON.parse(rtn);
			$(".page").html(rtnObj.html);
			$("#cur_ten").val(rtnObj.cur_ten);
			$(".page li").eq(0).addClass("active");
		})
	})
	
	//课程分页切换
	$(".page").on("click", "li", function(e) {
		var this_elm = $(e.target);
		if(!this_elm.hasClass("active")) {
			var page = this_elm.text();
			$.ajax({
				type: "POST",
	    		url: "index.php?control=search&action=getTeacher",
	    		data: {
	    			page: page, 
	    			keyword: keyword
	    		},
	    		success: function(data) {
	    			var rtnObj = JSON.parse(data);
	    			$(".list").html(rtnObj.html);
	    			for(var i = 0; i < $(".page li").length; i ++) {
	    				$(".page li").eq(i).removeClass("active");
	    			}
	    			this_elm.addClass("active");
	    		}
			})
		}
	})
	
	//点击进入下一个十页
	$(".page").on("click", ".next", function(e) {
		var this_elm = $(e.target);
		var page = Number($("#cur_ten").val()) * 10 * 4 + 1;
		var cur_ten = Number($("#cur_ten").val()) + 1;
		$.ajax({
			type: "POST",
			url: "index.php?control=search&action=getTeacher",
			data: {
				page: page, 
				keyword: keyword
			},
			success: function(data) {
				var rtnObj = JSON.parse(data);
				$(".list").html(rtnObj.html);
			}
		}).then(function() {
			$.get("index.php?control=search&action=getPage", {cur_ten: cur_ten, info: "teacher", keyword: keyword}, function(rtn) {
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
		var page = (Number($("#cur_ten").val()) - 2) * 10 * 4 + 1;
		var cur_ten = Number($("#cur_ten").val()) - 1;
		$.ajax({
			type: "POST",
			url: "index.php?control=search&action=getTeacher",
			data: {
				page: page, 
				keyword: keyword
			},
			success: function(data) {
				var rtnObj = JSON.parse(data);
				$(".list").html(rtnObj.html);
			}
		}).then(function() {
			$.get("index.php?control=search&action=getPage", {cur_ten: cur_ten, info: "teacher", keyword: keyword}, function(rtn) {
				var rtnObj = JSON.parse(rtn);
				$(".page").html(rtnObj.html);
				$("#cur_ten").val(rtnObj.cur_ten);
				$(".page li").eq(0).addClass("active");
			})
		})
	})
	
	function getUrlParam(key) {
	    var url = window.location.search;
	    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
	    var result = url.substr(1).match(reg);
	    return result ? decodeURIComponent(result[2]) : null;
	}
})