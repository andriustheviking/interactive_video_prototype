//Prototype 2 JavaScript

//GLOBALS
var autoPlay = false, //video will autoplay when true
	playing = false; //status of video player

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
	var viewport = $('#viewport')
		video = $('#video')[0],
		overlayContainer = $('#overlay-container'),
		playButton = $('#btn-play'),
		textField = $('#textfield'),
		clearButton = $('#btn-clear'),
		glContainer = $('#webgl-container');

	//storing height and width of viewport
	var	viewHeight = viewport.height(),
		viewWidth = viewport.width();
	
	//vars to store user submitted info
	var userImage;
	var userName = "";

	//TIMING VARIABLES
	var vt = video.currentTime,
		date = new Date(), //tracks the start time of video play
		now = new Date(), //tracks current time of video
		deltaTime = 0,
		dateTime = 0,
		renderTime = 0,
		renderLoops = 0,
		vTimeElem = $('#v-time'),
		dTimeElem = $('#d-time'),
		rTimeElem = $('#r-time');


	//WEBGL GLOBALS
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(75, viewWidth/viewHeight, 0.1, 1000);
	var renderer = new THREE.WebGLRenderer( { alpha: true } );

	initGL();

	//create objects to add to canvas
	var geometry = new THREE.PlaneGeometry( 5,5 );
	var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	var greenplane = new THREE.Mesh( geometry, material );
		greenplane.position.y = 8;

	geometry = new THREE.PlaneGeometry( 5,5 );
	material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
	var redplane = new THREE.Mesh( geometry, material );
		redplane.position.y = 0;

	geometry = new THREE.PlaneGeometry( 5,5 );
	material = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
	var blueplane = new THREE.Mesh( geometry, material );
		blueplane.position.y = -8;
		
	scene.add( greenplane, redplane, blueplane);

	camera.position.z = 20; //move back camera to see plane

	//array of plane Keyframes in seconds
	var keyframes = [0,5,15]; 


	//render  animation loop
	function render() {

		if(!playing)
			return;
		
			setTimeout( function () { 

			requestAnimationFrame( render );	

			//calculate rendertime
			renderLoops++;
			
			getDeltaTime();

			getVideoTime();
			
			animatePlane();

			renderer.render( scene, camera );

		}, 40); //setTimout to every 40ms means even 25 fps

	}

	function getVideoTime(){
		//update video timecode
		vt = video.currentTime;		
	};

	function getDeltaTime(){
		//get exact time elapsed in seconds
		now = new Date();
		deltaTime = (now.getTime() - date.getTime()) / 1000;		
	};

	function animatePlane(){

		greenplane.position.x = 20 * Math.cos( vt * Math.PI / 5);

		redplane.position.x = 20 * Math.cos( (dateTime + deltaTime) * Math.PI / 5);

		blueplane.position.x = 20 * Math.cos( renderLoops * Math.PI / 125); // 25 fps * 5s = 125

	};


	//get time when video starts
	video.onplay = function() {
		//set playing to true
		playing = true;		
		//get start time
		date = new Date();
		//update render time based on video (to avoid drift)
		dateTime = video.currentTime;

		render();
	};

	video.onpause = function (){
		playing = false;
		//update render time based on video (to avoid drift)
		dateTime = video.currentTime;
	}


	//define dropzone and handlers
	var	dragDrop = $('#dragzone')[0];
		dragDrop.addEventListener('dragenter', dragenter, false);
		dragDrop.addEventListener('dragover', dragover, false);
		dragDrop.addEventListener('drop', drop, false);

	//if user manually uploads image
	imageInput.change(function(){
		handleFiles(this.files[0]);
	});

	//if auto play, set playPause btn to Pause, else play
	autoPlay ? playButton.html("Pause") : playButton.html("Play")

	//when button is pressed, fire playPause
	playButton.click( function(){
		playPause()
	});

	//when user hits 'Create Video', hide input, show video and play
	createBtn.click( function(){
		//get username
		userName = nameInput.val();		
		inputContainer.hide();
		ivideoContainer.show();				
		createVideo();
	});	

	function initGL(){
		renderer.setSize( viewWidth, viewHeight ); //setting the renderer to the viewport size

		renderer.domElement.classList.add('canvas');
		renderer.domElement.id = 'webgl';
		glContainer.append(renderer.domElement); //insert into glContainer		
	};
	
	//function to be called when Play/Pause button is pressed
	function playPause(){
	    if (video.paused) {
	        video.play();
	        playButton.html("Pause");
	    } else {
	        video.pause();
	        playButton.html("Play");
	    }
	};

	function createVideo(){

		//creates a span for text overlay, inserts sanitized userName and appends to overlayContainer
		$('<span></span>').addClass("overlay-text").text(userName).appendTo(overlayContainer);

		if(autoPlay)
			video.play();
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

function initWebGL(canvas){
	gl = null;
	// Try to grab the standard context. If it fails, fallback to experimental.
	gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
	// If we don't have a GL context, give up now
	if (!gl) {
	   alert("Unable to initialize WebGL. Your browser may not support it.");
	}
  	return gl;
}


