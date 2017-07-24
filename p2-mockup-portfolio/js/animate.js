$(document).ready(function() {
	$('.project-desc').hide().first().show("slow", function showNext() {
		$(this).next("div").show("slow", showNext);
	});

	$('.progress-section').hide().first().show("fast", function showNext() {
		$(this).next("section").show("fast", showNext);
	});
});
