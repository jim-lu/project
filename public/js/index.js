/**
 * 
 */

$(function() {
	var move;
	var top = 118;
	$(".course_list li").on("mouseenter", function() {
		var _this = $(this);
		_this.find(".filter").stop().animate({top: 0, speed: "fast", easing: "swing"});
	})
	$(".course_list li").on("mouseleave", function() {
		var _this = $(this);
		_this.find(".filter").stop().animate({top: 118, speed: "fast", easing: "swing"});
	})
})