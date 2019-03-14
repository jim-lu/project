/**
 * 
 */

$(function() {
	$(".sub_email").on("submit", function() {
		var email = $("#email").val();
		var type = $("input[type='radio']:checked").val();
		var preg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
		if(email == "" || !preg.test(email)) {
			$(".email").text("邮箱格式不正确");
		} else {
			$.ajax({
				type: "POST",
				url: "index.php?control=login&action=sendEmail",
				data: {
					email: email,
					type: type
				},
				success: function(data) {
					
				}
			})
		}
		return false;
	})
})