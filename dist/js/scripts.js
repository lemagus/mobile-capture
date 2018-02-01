'use strict';

var openModal = function openModal(canvas) {

	$('.modal').show();
	$('.modal .preview').append(canvas);
};

var processFile = function processFile(dataURL, fileType) {

	var maxWidth = Math.round($(window).width() * 0.8);
	var maxHeight = Math.round($(window).height() / 2);

	var image = new Image();
	image.src = dataURL;

	image.onload = function () {

		var width = image.width;
		var height = image.height;
		var shouldResize = width > maxWidth || height > maxHeight;

		var newWidth;
		var newHeight;

		if (width > height) {
			newHeight = height * (maxWidth / width);
			newWidth = maxWidth;
		} else {
			newWidth = width * (maxHeight / height);
			newHeight = maxHeight;
		}

		var canvas = document.createElement('canvas');

		canvas.width = newWidth;
		canvas.height = newHeight;

		var context = canvas.getContext('2d');

		context.drawImage(image, 0, 0, newWidth, newHeight);

		dataURL = canvas.toDataURL(fileType);

		openModal(canvas);
	};

	image.onerror = function () {
		alert('There was an error processing your file!');
	};
};

$(document).ready(function (evt) {
	if (window.File && window.FileReader && window.FormData) {

		$('.home input[type=file]').on('change', function (e) {
			var file = e.target.files[0];

			if (file) {
				if (/^image\//i.test(file.type)) {

					var reader = new FileReader();
					reader.onloadend = function () {
						processFile(reader.result, file.type);
					};

					reader.readAsDataURL(file);
				} else {
					alert('Not a valid image!');
				}
			}
		});
	}
});