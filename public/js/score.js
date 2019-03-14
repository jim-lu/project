/**
 * 
 */

$(function() {
	var homework_id = GetQueryString("homework_id");  //获取地址栏中的作业编号
	var stu_id = GetQueryString("stu_id");  //获取地址栏中的学生编号
	
	$(".modify").on("click", function() {
		var score = $("#score").val();
		$.ajax({
			type: "POST",
			url: "index.php?control=teacher&action=changeScore",
			data: {
				score: score,
				homework_id: homework_id,
				stu_id: stu_id
			},
			success: function(data) {
				var rtnObj = JSON.parse(data);
				if(rtnObj.status == 1) {
					$("#score").val(rtnObj.score);
					$('.alert_box').css({ 
						position:'absolute', 
						left: ($(window).width() - $('.alert_box').outerWidth())/2, 
						top: ($(window).height() - $('.alert_box').outerHeight())/2 + $(document).scrollTop() 
					}).html("修改成功<img src='public/img/finish.png' />").fadeIn();
					setTimeout(function() {
						$('.alert_box').fadeOut();
					}, 1000);
				}
			}
		})
	})
	
	function GetQueryString(name) {
		var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if(r!=null) {
			return unescape(r[2]);
		}
		return null;
	}
})