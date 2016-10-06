//Prototype 2 JavaScript

$(document).ready(function(){
	//element vars
	var nameInput = $('#name-input'),
		imageInput = $('#image-input'),
		preview = $('#preview-container');
	
	var	dragDrop = $('#dragzone')[0];
		dragDrop.addEventListener('dragenter', dragenter, false);
		dragDrop.addEventListener('dragover', dragover, false);
		dragDrop.addEventListener('drop', drop, false);

	//handles when users drag object into dropzone
	function dragenter(e) {
		  e.stopPropagation();
		  e.preventDefault();
		}

	//handles when users drag object over dropzone
	function dragover(e) {
	  e.stopPropagation();
	  e.preventDefault();
	}

	//handles when users drop file into dropzone
	function drop(e) {
	  e.stopPropagation();
	  e.preventDefault();

	  var dt = e.dataTransfer;
	  var files = dt.files		

	  handleFiles(files[0]);
	}

	//if user manually uploads input
	imageInput.change(function(){
		handleFiles(this.files[0]);
	});

	//create image preview
	function handleFiles(file){
		console.log(file);
		var imageType = /^image\//;
		//make sure file is an image
		if (!imageType.test(file.type)){
			alert('Uploade image');
			return false;
		}

		var img = document.createElement('img');
		img.classList.add('image-preview');
		img.file = file;
		
		preview.append(img);

		var reader = new FileReader();
		//tells the reader what to do when onload is fired
		reader.onload = (function(aImg) { 
			return function (e) { 
				aImg.src = e.target.result; 
			};
		})(img);

		//tells reader to read file (firing onload)
		reader.readAsDataURL(file);
						
		return true;	
	}
});