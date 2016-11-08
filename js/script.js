//Prototype 2 JavaScript

//GLOBALS
var autoPlay = true, //video will autoplay when true
	playing = false; //status of video player

$(document).ready(function(){
	
	//Jquery element vars
	var $nameInput = $('#name-input'),
		$imageInput = $('#image-input'),
		$preview = $('#preview-container'),
		$createBtn = $('#btn-create'),
		$imageName = $('#img-name'),
		$dragZone = $('#dragzone'),
		$dragDropContainer = $('#dragdrop-container'),
		$inputContainer = $('#initial-user-input'),
		$ivideoContainer = $('#i-video-container');

	//DRAG N DROP VARS
	var img = document.createElement('img');
	var files; //stores uploaded files

	//interactive video elements
	var $viewport = $('#viewport')
		$video = $('#video')[0],
		$overlayContainer = $('#overlay-container'),
		$playButton = $('#btn-play'),
		$textField = $('#textfield'),
		$clearButton = $('#btn-clear'),
		$glContainer = $('#webgl-container');

	//storing height and width of viewport
	var	viewHeight = $viewport.height(),
		viewWidth = $viewport.width();
	
	//vars to store user submitted info
	var userImage,
		userName = "";

	//Render Timing Videos
	var vt = $video.currentTime,
		$vTime = $('#v-time');

	//2D Canvas to capture textures
	var canvas2d = document.createElement('canvas'),
		ctx2d = canvas2d.getContext('2d');
		//set canvas2d size to power of 2
	var	c_h = 256,
		c_w = 512;
		//set canvas properties
		canvas2d.height = c_h;
		canvas2d.width = c_w;
		ctx2d.fillStyle = 'white';
		ctx2d.font = '72px serif';
		ctx2d.textAlign = 'center';
		ctx2d.textBaseline = 'middle';
//		$('body').append(canvas2d);

	//THREE.js vars
	var scene = new THREE.Scene(),
		camera = new THREE.PerspectiveCamera(75, viewWidth/viewHeight, 0.1, 1000),
		//set renderer alpha true so transparent object don't block. and antialias off for texel mapping
		renderer = new THREE.WebGLRenderer( { alpha: true, antialias: true} );
	//create objects to add to canvas
	var logoMesh,
		textMesh;
	//move back camera to see plane	
	camera.position.z = 20; 	

	//render  animation loop
	function render() {

		requestAnimationFrame( render );	
		
		getVideoTime();

		animation();

		renderer.render( scene, camera );	

		if(!playing)
			return;
	}

	function animation () {

		//logoMesh instructions 
		if ( vt < 2) {
			logoMesh.position.y = 22;
		} else if ( 2 < vt && vt < 12) {
			logoMesh.position.y = easeOutQuad(vt - 2, 20, -20, 5);
		} else if (12 < vt) {
			logoMesh.position.y = 22;
		}

		//textMesh instructions
		if (vt < 11){
			textMesh.material.opacity = 0;
		} else if ( 12 < vt && vt < 13) {
			textMesh.material.opacity = (vt - 12);
		} else if ( 13 < vt && vt < 17) {
			textMesh.material.opacity = 1;
		} else if ( 17 < vt && vt < 18){
			textMesh.material.opacity = (18 - vt);
		} else if ( 18 < vt){
			textMesh.material.opacity = 0;
		}

	};

//to display timecode
//	setInterval(function (){ $vTime.html(vt);},100);

	function getVideoTime(){
		//update video timecode
		vt = $video.currentTime;		
	};

	//get time when video starts
	$video.onplay = function() {
		//set playing to true
		playing = true;		
		render();
	};
	$video.onpause = function (){
		playing = false;
	};
	$video.onseeked = function(){
		render();
	};


	//define dropzone and handlers
	var	dragDrop = $dragZone[0];
		dragDrop.addEventListener('dragenter', dragenter, false);
		dragDrop.addEventListener('dragover', dragover, false);
		dragDrop.addEventListener('drop', drop, false);

	//if user manually uploads image
	$imageInput.change(function(){
		handleFiles(this.files[0]);
	});

	//if auto play, set playPause btn to Pause, else play
	autoPlay ? $playButton.html("Pause") : $playButton.html("Play")

	//when button is pressed, fire playPause
	$playButton.click( function(){
		playPause()
	});

	//when user hits 'Create Video', hide input, show video and play
	$createBtn.click( function(){
		
		init();

		//create bmp for userName
		userName = $nameInput.val();
		//write user name onto middle of canvas
		if(!userName){
			userName = 'You';
		}

		ctx2d.fillText( 'Directed by', c_w/2, 32);
		ctx2d.fillText( userName, c_w/2, c_h/2);

		//create mesh using user's name
		textMesh = planeMeshFromCanvas(20, 10);
		//add to scene
		scene.add(textMesh);
		//render to force three to init the texture
		renderer.render(scene, camera);

		ctx2d.clearRect(0,0,c_w,c_h);

		//if user uploaded an image
		if(img.src) {
			drawCenteredUserImage(img);
		}

		logoMesh = planeMeshFromCanvas(20,10);

		logoMesh.position.y = 0;
		
		scene.add( logoMesh );
		//render to force three to init the texture
		renderer.render(scene, camera);

		//initial mesh properties
		logoMesh.position.y = 22;
		textMesh.position.y = -2;
		textMesh.position.z = 5;
		textMesh.material.opacity = 0;

		$inputContainer.hide();
		$ivideoContainer.show();
		
		if(autoPlay){
			$video.play();
		}
	});	

	function drawCenteredUserImage(image){

		var img_h = image.height,
			img_w = image.width;

		//if image width/height ratio is bigger than canvas's than the image need to be drawn at canvas width
		if (img_w / img_h > c_w / c_h){
			//have to find new height of image to maintain ratio
			var drawHeight = c_w * img_h / img_w;
			//draw new image and offset y by half difference of draw height and canvas height
			ctx2d.drawImage( image , 0 , (c_h - drawHeight) / 2 , c_w , drawHeight);
		} 
		//is it needs to be drawn to canvas height
		else if (img_w / img_h < c_w / c_h) {
			//find the new width
			var drawWidth = c_h * img_w / img_h;
			//offest by half difference of drawheight and canvan height
			ctx2d.drawImage( image , (c_w - drawWidth) / 2 , 0 , drawWidth , c_h);
		} else {
			//else they're the same ratio, just draw it directly on canvas
			ctx2d.drawImage( image, 0, 0, c_w, c_h);
		}			
	};

	//returns plane Mesh from with texture from canvas
	function planeMeshFromCanvas(x,y) {

		var texture = new THREE.Texture(canvas2d);
		//texel mapping fix anisotropy, magFilter and minFIlter

		texture.needsUpdate = true;
		
		var material = new THREE.MeshBasicMaterial({ map:texture });
		material.transparent = true;

		console.log(material);

		var geometry = new THREE.PlaneGeometry( x, y);

		return new THREE.Mesh( geometry, material);
	};

	function init(){
		//setting the renderer to the viewport size
		renderer.setSize( viewWidth, viewHeight ); 

		renderer.domElement.classList.add('canvas');
		renderer.domElement.id = 'webgl';
		$glContainer.append(renderer.domElement); //insert into $glContainer		
	};
	
	//function to be called when Play/Pause button is pressed
	function playPause(){
	    if ($video.paused) {
	        $video.play();
	        $playButton.html("Pause");
	    } else {
	        $video.pause();
	        $playButton.html("Play");
	    }
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
	    files = dt.files;		

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

		img.setAttribute('id','image-preview');

		//insert img element to preview div
		$dragZone.html(img);

		$imageName.html(file.name);

		var reader = new FileReader();
		
		//tells reader to read file (firing onload)
		reader.readAsDataURL(file);

		//tells the reader what to do when onload is fired
		reader.onload = (function(aImg) { 
			return function (e) { 
				aImg.src = e.target.result;
				$dragZone.width($('#image-preview').width());
			};
		})(img);
		
		//stores userImage as $object		
		userImage = $('.image-preview');	
		
		//adds alt tag
		userImage.attr('alt',file.name);

		return true;
	}
});




