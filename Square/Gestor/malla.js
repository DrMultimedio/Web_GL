function MallaGestor(){
	this.vertices = null;
	this.normales = null;
	this.texturas = null;
	this.indices = null;
	this.vertTriangulo = null;
	this.normTriangulo = null;
	this.textTriangulo = null;
	this.nTriangulos = null;
	this.nombreFich = null;
}
MallaGestor.prototype.getNombre = function(){
	return this.nombreFich;
}
MallaGestor.prototype.cargarFichero = function(fich) { 
		var malla = this;
		var peticion = new XMLHttpRequest();
		peticion.open('GET', fich, false);
		var mesh= null;
		peticion.onload = function() {
				mesh = new OBJ.Mesh(peticion.responseText);
				malla.vertices = mesh.vertices;
				malla.nombreFich = fich;
				malla.indices = mesh.indices;
		}
		peticion.send();
};


MallaGestor.prototype.drawInitProgram = function() {
	console.log("Inicializamos GL");
	fgShader = utils.getShader(gl, "shader-fs");
	vxShader = utils.getShader(gl, "shader-vs");

	prg = gl.createProgram();
	gl.attachShader(prg, vxShader);
	gl.attachShader(prg, fgShader);
	gl.linkProgram(prg);

	if (!gl.getProgramParameter(prg, gl.LINK_STATUS)) {
		alert("No se han podido inicializar los shaders");
	}

	gl.useProgram(prg);
	prg.vertexPosition = gl.getAttribLocation(prg, "aVertexPosition");
}

MallaGestor.prototype.drawInitBuffers = function() {
	console.log("Iniciamos bufferes");	

	squareVertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	
	//The following code snippet creates a vertex buffer and binds the indices to it
	squareIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}

MallaGestor.prototype.draw = function() {

	console.log("Iniciamos");	

	gl = utils.getGLContext('canvasMotor');
	this.drawInitProgram();
	this.drawInitBuffers();
	this.initLoop();

}
MallaGestor.prototype.initLoop = function() {
	console.log("Render loop");	
	//utils.requestAnimFrame(this.initLoop);
	this.drawScene();
};

MallaGestor.prototype.drawScene = function() {
	console.log("Le dibujo");	
		gl.clearColor(0.5, 0.5, 0.5, 1.0);
		gl.enable(gl.DEPTH_TEST);
	
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.viewport(0,0,c_width, c_height);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexBuffer);
		gl.vertexAttribPointer(prg.aVertexPosition, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(prg.vertexPosition);
		
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareIndexBuffer);
		gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT,0);

	};

MallaGestor.prototype.drawOld = function() {

//codigo apoyado en el ejemplo square de WebGL Beginners Guide
	//iniciamos GL
	console.log("Inicializamos GL");

 //   try {
        gl = canvas.getContext("webgl2");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    //inicializamos program
		console.log("Inicializamos Program");
		console.log();

    	//Inicializamos el fragment shader y el vertex shader
		var fgShader = utils.getShader(gl, "shader-fs");
		var vxShader = utils.getShader(gl, "shader-vs");
		console.log(fgShader);
		//guardamos el programa y le pasamos los shaders
		console.log("guardamos el programa y le pasamos los shaders");

		prg = gl.createProgram();
		gl.attachShader(prg, vxShader);
		gl.attachShader(prg, fgShader);
		gl.linkProgram(prg);

		if (!gl.getProgramParameter(prg, gl.LINK_STATUS)) {
			alert("No se han podido inicializar los shaders");
		}

		gl.useProgram(prg);

		//The following lines allow us obtaining a reference to the uniforms and attributes defined in the shaders.
		//This is a necessary step as the shaders are NOT written in JavaScript but in a 
		//specialized language called GLSL. More about this on chapter 3.
		prg.vertexPosition = gl.getAttribLocation(prg, "aVertexPosition");


	//cargamos los buffers
		console.log("Cargamos bufferes");

		//El siguiente codigo crea un buffer de vertices y los enlaza con los de la malla
		squareVertexBuffer = gl.createBuffer();
		//preguntar que hacen exactamente estas lineas de codigo
		gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		
		//El siguiente codigo crea un buffer de vertices y los enlaza con los indices
		squareIndexBuffer = gl.createBuffer();
		//preguntar que hacen exactamente estas lineas de codigo
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareIndexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

	//Render Loop
		console.log("Render loop");

		//dibujamos la escena
			console.log("Dibujamos");

			gl.clearColor(0.5, 0.5, 0.5, 1.0);
			gl.enable(gl.DEPTH_TEST);
		
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
			
	        mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
		    //fieldOfViewYInRadians, aspect, zNear, zFar, dst
		    mat4.identity(mvMatrix);
		    mat4.translate(mvMatrix, [0.0, 0.0, -5]);

			gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexBuffer);
			gl.vertexAttribPointer(prg.aVertexPosition, 3, gl.FLOAT, false, 0, 0);
			gl.enableVertexAttribArray(prg.vertexPosition);
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareIndexBuffer);
			gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT,0);
		



/*
    }
    catch (e) {
    	alert("algo se ha ido de madre xd");
    }
    if (!gl) {
		document.getElementById("resultado").innerHTML = "Tu navegador no soporta WebGL o el código se me ha liado xd. So sorry ):";
    }
*/
};

MallaGestor.prototype.drawImprime = function() {
	document.getElementById("resultado").innerHTML = document.getElementById("resultado").innerHTML + "Vertices<br>" + this.vertices + "<br>";
	document.getElementById("resultado").innerHTML = document.getElementById("resultado").innerHTML + "Indices<br>" + this.indices + "<br>";


};


