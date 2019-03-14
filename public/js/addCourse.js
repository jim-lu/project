/**
 * 
 */

$(function() {
	var _day = $("#day").val();
	var _class = $("#class").val();
	for(var i = 1; i < $("tr").length; i ++) {
		for(var j = 0; j < 7; j ++) {
			if(i == _day && j == _class) {
				$("tr").eq(i).children("td").eq(j).addClass("active");
			}
		}
	}
	
	$('#edit_1').editable({
		inlineMode: false, 
		alwaysBlank: true, 
		allowedImageTypes: ["jpeg", "jpg", "png", "gif"], 
		height: '120px', 
		imageUploadURL: 'index.php?control=admin&action=doUrl',//上传到本地服务器
        imageDeleteURL: 'index.php?control=admin&action=deleteImage',//删除图片
    }).on('editable.afterRemoveImage', function (e, editor, $img) {      
        editor.options.imageDeleteParams = {src: $img.attr('src')};
        editor.deleteImage($img);
    });
	
    $('#edit_2').editable({
    	inlineMode: false, 
    	alwaysBlank: true, 
    	allowedImageTypes: ["jpeg", "jpg", "png", "gif"], 
    	height: '120px', 
    	imageUploadURL: 'index.php?control=admin&action=doUrl',//上传到本地服务器
        imageDeleteURL: 'index.php?control=admin&action=deleteImage',//删除图片
    }).on('editable.afterRemoveImage', function (e, editor, $img) {     
        editor.options.imageDeleteParams = {src: $img.attr('src')};
        editor.deleteImage($img);
    });
    
    $("#course_img").on("change", handleFileSelect);
    
    function handleFileSelect() {
		var item = $("#course_img")[0].files[0];
		if(item) {
			var reader = new FileReader();
			reader.readAsDataURL(item);
			reader.onload = function(evt) {
				$(".line_2 .square").html('<img src="' + evt.target.result + '" width="80px" height="80px" />');
			}
			
		}
	}
    
    $(".line_8 td").on("click", function() {
    	$(this).addClass("active").siblings().removeClass("active");
    	$(this).parent().siblings().children().removeClass("active");
    	var day = $(this).attr("name");
    	var time = $(this).text();
    	var str = "";
    	switch(day) {
    		case "1": 
    			str = "周一 ";
    			break;
    		case "2": 
    			str = "周二 ";
    			break;
    		case "3": 
    			str = "周三 ";
    			break;
    		case "4": 
    			str = "周四 ";
    			break;
    		case "5": 
    			str = "周五 ";
    			break;
    		case "6": 
    			str = "周六 ";
    			break;
    		case "7": 
    			str = "周日 ";
    			break;
    	}
    	$("#course_time").val(str + time);
    })
    
    $("#add").on("submit", function() {
    	if(localStorage.getItem("type") != "teacher" && localStorage.getItem("type") != "admin") {
    		$('.alert_box').css({ 
				position:'absolute', 
				left: ($(window).width() - $('.alert_box').outerWidth())/2, 
				top: ($(window).height() - $('.alert_box').outerHeight())/2 + $(document).scrollTop() 
			}).text("你不是教师或管理员").fadeIn();
    		return false;
    	}
    	var course_name = $("#course_name").val();
    	var course_img = $("#course_img")[0].files[0];
    	var course_teacher = $("#course_teacher option:selected").val();
    	var course_teacher_id = $("#course_teacher option:selected").attr("name");
    	var course_term = $("#course_term option:selected").val();
    	var course_time = $("#course_time").val();
    	var brief = $("#edit_1").children().eq(1).html();
    	var syllabus = $("#edit_2").children().eq(1).html();
    	if(course_name == "") {
    		$(".line_1 .warn").fadeIn();
    		return false;
    	} else {
    		$(".line_1 .warn").fadeOut();
    	}
    	if(course_teacher != localStorage.getItem("username") && localStorage.getItem("type") != "admin") {
    		$(".line_3 .warn").fadeIn();
    		return false;
    	} else {
    		$(".line_3 .warn").fadeOut();
    	}
    	var formData = new FormData();
    	formData.append("course_name", course_name);
    	formData.append("course_img", course_img);
    	formData.append("course_teacher", course_teacher);
    	formData.append("course_teacher_id", course_teacher_id);
    	formData.append("course_term", course_term);
    	formData.append("course_time", course_time);
    	formData.append("brief", brief);
    	formData.append("syllabus", syllabus);
    	$.ajax({
			type: "POST",
			url: "index.php?control=admin&action=doAddCourse",
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
					}).html("新增成功<img src='public/img/finish.png' />").fadeIn();
					setTimeout(() => {
						window.location = "index.php?control=course&id=" + rtnObj.id;
					}, 1000);
				}
			}
		});
		return false;
    })
    
    $("#edit").on("submit", function() {
    	if(localStorage.getItem("type") != "teacher" && localStorage.getItem("type") != "admin") {
    		$('.alert_box').css({ 
				position:'absolute', 
				left: ($(window).width() - $('.alert_box').outerWidth())/2, 
				top: ($(window).height() - $('.alert_box').outerHeight())/2 + $(document).scrollTop() 
			}).text("你不是教师或管理员").fadeIn();
    		return false;
    	}
    	var course_name = $("#course_name").val();
    	var course_img = $("#course_img")[0].files[0];
    	var course_teacher = $("#course_teacher option:selected").val();
    	var course_teacher_id = $("#course_teacher option:selected").attr("name");
    	var course_term = $("#course_term option:selected").val();
    	var course_time = $("#course_time").val();
    	var brief = $("#edit_1").children().eq(1).html();
    	var syllabus = $("#edit_2").children().eq(1).html();
    	if(course_name == "") {
    		$(".line_1 .warn").fadeIn();
    		return false;
    	} else {
    		$(".line_1 .warn").fadeOut();
    	}
    	if(course_teacher != localStorage.getItem("username") && localStorage.getItem("type") != "admin") {
    		$(".line_3 .warn").fadeIn();
    		return false;
    	} else {
    		$(".line_3 .warn").fadeOut();
    	}
    	var formData = new FormData();
    	formData.append("course_name", course_name);
    	formData.append("course_img", course_img);
    	formData.append("course_teacher", course_teacher);
    	formData.append("course_teacher_id", course_teacher_id);
    	formData.append("course_term", course_term);
    	formData.append("course_time", course_time);
    	formData.append("brief", brief);
    	formData.append("syllabus", syllabus);
    	$.ajax({
			type: "POST",
			url: "index.php?control=admin&action=doEditCourse",
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
					setTimeout(() => {
						window.location = "index.php?control=course&id=" + rtnObj.id;
					}, 1000);
				}
			}
		});
		return false;
    })
})