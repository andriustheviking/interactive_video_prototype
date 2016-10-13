//Prototype 2 JavaScript

//GLOBALS
var autoPlay = false, //video will autoplay when true
	gl;	//webgl global

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
		clearButton = $('#btn-clear');
	
	//setup webgl canvas
	var	canvas3d = document.getElementById('canvas-3d');
		canvas3d.height = viewport.height();
		canvas3d.width = viewport.width();  //change webgl viewport with: gl.viewport(0, 0, canvas.width, canvas.height);

		gl = initWebGL(canvas3d);

		//NEED ERROR HANDLING
		if(!gl)
			console.log("WebGL not supported");

		gl.clearColor(0.0, 0.0, 0.0, 0.0); //set clear to  black
		gl.enable(gl.DEPTH_TEST); //enable depth testing
		gl.depthFunc(gl.LEQUAL); //near things obscure far things
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); //Clear the color as well as the depth buffer

		initShaders();//initialize shaders


	//vars to store user submitted info
	var userImage;
	var userName = "";



	//define dropzone and handlers
	var	dragDrop = $('#dragzone')[0];
		dragDrop.addEventListener('dragenter', dragenter, false);
		dragDrop.addEventListener('dragover', dragover, false);
		dragDrop.addEventListener('drop', drop, false);

	//if user manually uploads input
	imageInput.change(function(){
		handleFiles(this.files[0]);
	});

	//if auto play, set playPause btn to Pause, else play
	autoPlay ? playButton.html("Pause") : playButton.html("Play")

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
		$('<span></span>').addClass("overlay-text").text(userName).appendTo(overlayContainer);

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

function initShaders(){
	var fragmentShader = getShader(gl, "shader-fs"),
		vertexShader = getShader(gl, "shader-vs");

	//create shader program
	shaderprogram = gl.createProgram();
	gl.attachShader(shaderprogram, vertexShader);
	gl.attachShader(shaderprogram, fragmentShader);
	gl.linkProgram(shaderprogram);

	// If creating the shader program failed, alert
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert("Unable to initialize the shader program: " + gl.getProgramInfoLog(shader));
	}

	gl.useProgram(shaderprogram);

	vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(vertexPositionAttribute);
}

function getShader(gl, id, type) {
	
	var shaderScript, theSource, currentChild, shader;

	shaderScript = document.getElementById(id);

	if (!shaderScript) {
	return null;
	}
  
	theSource = shaderScript.text;

	if (!type) {
		if (shaderScript.type == "x-shader/x-fragment") {
			type = gl.FRAGMENT_SHADER;
		} else if (shaderScript.type == "x-shader/x-vertex") {
			type = gl.VERTEX_SHADER;
		} else { // Unknown shader type
			return null;
		}
	}
	shader = gl.createShader(type);

	gl.shaderSource(shader, theSource);
    
	// Compile the shader program
	gl.compileShader(shader);  
	    
	// See if it compiled successfully
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {  
	    alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));  
	    gl.deleteShader(shader);
	    return null;  
	}
	    
	return shader;
}
