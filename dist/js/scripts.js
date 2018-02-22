'use strict';

var openModal = function openModal(canvas, dataURL) {

	$('.modal').show();
	$('.modal .preview').append(canvas);

	$('.modal button').click(function (evt) {

		var message = $('.modal textarea').val();

		var formData = new FormData();

		formData.append('image', dataURL);
		formData.append('message', message);

		$.ajax({
			type: 'POST',
			url: 'http://anniewarenghien.student.artsaucarre.be/capture/datas.php',
			data: formData,
			contentType: false,
			processData: false,
			success: function success(data) {
				console.log(data);
			},
			error: function error(data) {
				//alert('There was an error uploading your file!');
			}
		});

		return false;
	});
};

var rotateContext = function rotateContext(context, degrees, canvas, newWidth, newHeight, image) {

	canvas.width = newHeight;
	canvas.height = newWidth;

	context.save();

	context.translate(canvas.width / 2, canvas.height / 2);
	context.rotate(degrees * Math.PI / 180);
	context.drawImage(image, -newWidth / 2, -newHeight / 2, newWidth, newHeight);

	context.restore();
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

		EXIF.getData(image, function () {
			var orientation = EXIF.getTag(image, "Orientation");

			switch (orientation) {
				case 3:
					rotateContext(context, 180, canvas, newHeight, newWidth, image);
					break;

				case 6:
					rotateContext(context, 90, canvas, newWidth, newHeight, image);
					break;

				case 8:
					rotateContext(context, -90, canvas, newWidth, newHeight, image);
					break;

				default:
					context.drawImage(image, 0, 0, newWidth, newHeight);
			}

			dataURL = canvas.toDataURL(fileType);

			openModal(canvas, dataURL);
		});
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