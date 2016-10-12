//Prototype 2 JavaScript

//GLOBALS
var autoPlay = false;

$(document).ready(function(){
	

	//element vars
	var nameInput = $('#name-input'),
		imageInput = $('#image-input'),
		preview = $('#preview-container'),
		createBtn = $('#btn-create'),
		imageName = $('#img-name'),
		inputContainer = $('#initial-user-input'),
		ivideoContainer = $('#i-video-container');

	//interactive video elements
	var video = $('#video')[0],
		overlayContainer = $('#overlay-container'),
		playButton = $('#btn-play'),
		textField = $('#textfield'),
		clearButton = $('#btn-clear');


	//vars to store user submitted info
	var userImage;
	var userName = "";

	//if auto play, set playPause btn to Pause, else playe
	autoPlay ? playButton.html("Pause") : playButton.html("Play")

	//define dropzone and handlers
	var	dragDrop = $('#dragzone')[0];
		dragDrop.addEventListener('dragenter', dragenter, false);
		dragDrop.addEventListener('dragover', dragover, false);
		dragDrop.addEventListener('drop', drop, false);

	//if user manually uploads input
	imageInput.change(function(){
		handleFiles(this.files[0]);
	});

	//when button is pressed, fire playPause
	playButton.click( function(){
		playPause()
	});
	//function to be called when Play/Pause button is pressed
	function playPause(){
	    video.paused ? (
	        video.play(),
	        playButton.html("Pause")
	    ) : (
	        video.pause(),
	        playButton.html("Play")
	    );};

	//when user hits 'Create Video', hide input, show video and play
	createBtn.click( function(){
		//get username
		userName = nameInput.val();
		
		inputContainer.hide();
		ivideoContainer.show();		
		
		createVideo();
	});	

	function createVideo(){

		//creates a span for text overlay, inserts sanitized userName and appends to overlayContainer
		$('<span class="overlay-text"></span>').text(userName).appendTo(overlayContainer);

		if(autoPlay)
			video.play();

		//fires functions on timeupdate
		video.addEventListener("timeupdate", function(){

		});

	};


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

	//create image preview, returns image variable
	function handleFiles(file){
		//make sure file is an image
		var imageType = /^image\//;
		if (!imageType.test(file.type)){
			alert('Uploade image');
			return false;
		}

		var img = document.createElement('img');
		img.classList.add('image-preview');

		//insert img element to preview div
		preview.html(img);

		imageName.html(file.name);

		var reader = new FileReader();
		
		//tells reader to read file (firing onload)
		reader.readAsDataURL(file);

		//tells the reader what to do when onload is fired
		reader.onload = (function(aImg) { 
			return function (e) { 
				aImg.src = e.target.result; 
			};
		})(img);
		
		//stores userImage as $object		
		userImage = $('.image-preview');	
		
		//adds alt tag
		userImage.attr('alt',file.name);
		
		return true;
	}
});