

var canvas;
var gl;

var axis = 0;
var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var theta = [0, 0, 0];
var thetaLoc;
var showType = 0;

var colorsToChoose = [
    [0.75, 0.91, 0.91, 1.0],
    [0.45, 0.78, 0.71, 1.0],
    [0.48, 0.37, 0.51, 1.0]
];

var divideTimes = 15;
var indices = []; 
var vertices = [];
var vertexColors = [];
var verticesNum = 0;

for (var row = 0; row <= divideTimes; row++) {
    var θ = row * Math.PI / divideTimes - Math.PI / 2; 
    var sinθ = Math.sin(θ);
    var cosθ = Math.cos(θ);
    for (var col = 0; col <= divideTimes; col++) {
        var φ = col * 2 * Math.PI / divideTimes - Math.PI; 
        var sinφ = Math.sin(φ);
        var cosφ = Math.cos(φ);
        var x = cosθ * cosφ;
        var y = cosθ * sinφ;
        var z = sinθ;
        vertices.push(vec3(0.0, 0.0, 0.0));
        vertices[verticesNum][0] = x;
        vertices[verticesNum][1] = y;
        vertices[verticesNum][2] = z;
        verticesNum = verticesNum + 1;

        var ranNum = Math.floor(Math.random() * 3);
        vertexColors.push(colorsToChoose[ranNum]);
    }
}

for (var i = 0; i < divideTimes; i++) {
    for (var j = 0; j < divideTimes; j++) {
        var first = i * (divideTimes + 1) + j;
        var second = first + divideTimes + 1;
        indices.push(first); 
        indices.push(second); 
        indices.push(first + 1); 

        indices.push(first + 1); 
        indices.push(second); 
        indices.push(second + 1); 
    }
}
console.log(vertices);
console.log(indices);

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 0.0, 0.3);
    gl.enable(gl.DEPTH_TEST);;

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);


    var iBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertexColors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    thetaLoc = gl.getUniformLocation(program, "theta");

    document.getElementById("xButton").onclick = function () {
        axis = xAxis;
    };
    document.getElementById("yButton").onclick = function () {
        axis = yAxis;
    };
    document.getElementById("zButton").onclick = function () {
        axis = zAxis;
    };
    document.getElementById("aButton").onclick = function () {
        showType = 0;
    };
    document.getElementById("bButton").onclick = function () {
        showType = 1;
    };

    render();
}


function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    theta[axis] += 0.5;
    gl.uniform3fv(thetaLoc, theta);
    if (showType == 0) {
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);
    } else {
        gl.drawElements(gl.LINES, indices.length, gl.UNSIGNED_BYTE, 0);
    }

    requestAnimFrame(render);
}


//从零开始的异世界



/*
var canvas;
var gl;

var points = [];
var colors = [];
var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = 0;
var theta = [0, 0, 0];
var thetaLoc;

var showType = 0;

var divideTimes = 55;
var vertices = [];
var nums = divideTimes * divideTimes * 6;
var verticesNum = 0;

for (var latNum = 0; latNum <= divideTimes; latNum++) {
    var lat = latNum * Math.PI / divideTimes - Math.PI / 2; //纬度范围从-π/2到π/2
    var sinLat = Math.sin(lat);
    var cosLat = Math.cos(lat);

    for (var longNum = 0; longNum <= divideTimes; longNum++) {
        var lon = longNum * 2 * Math.PI / divideTimes - Math.PI; //经度范围从-π到π
        var sinLon = Math.sin(lon);
        var cosLon = Math.cos(lon);

        var x = cosLat * cosLon;
        var y = cosLat * sinLon;
        var z = sinLat;

        vertices.push(vec4(0.0, 0.0, 0.0, 1.0));
        vertices[verticesNum][0] = x;
        vertices[verticesNum][1] = y;
        vertices[verticesNum][2] = z;
        verticesNum = verticesNum + 1;
    }
}

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    drawBall();

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 0.0, 0.3);

    gl.enable(gl.DEPTH_TEST);
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);


    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    thetaLoc = gl.getUniformLocation(program, "theta");


    document.getElementById( "xButton" ).onclick = function () {
        axis = xAxis;
    };
    document.getElementById( "yButton" ).onclick = function () {
        axis = yAxis;
    };
    document.getElementById( "zButton" ).onclick = function () {
        axis = zAxis;
    };
    document.getElementById( "aButton" ).onclick = function () {
        showType = 0;
    };
    document.getElementById( "bButton" ).onclick = function () {
        showType = 1;
    };

    render();
}


function drawBall() {
    for (var latNum = 0; latNum < divideTimes; latNum++) {
        for (var longNum = 0; longNum < divideTimes; longNum++) {
            var first = latNum * (divideTimes + 1) + longNum;
            var second = first + divideTimes + 1;

            drawSquare(first, first + 1, second + 1, second);
        }
    }
}

function drawSquare(a, b, c, d) {
    var vertexColor = [
        [0.75, 0.91, 0.91, 1.0], 
        [0.45, 0.78, 0.71, 1.0],
        [0.48, 0.37, 0.51, 1.0]
    ];

    var indices = [a, b, c, a, c, d];

    for (var i = 0; i < 6; ++i) {
        points.push(vertices[indices[i]]);
        var ranNum = Math.floor(Math.random() * 3);
        colors.push(vertexColor[ranNum]);
    }
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    theta[axis] += 0.8;
    gl.uniform3fv(thetaLoc, theta);

    if(showType == 0){
        gl.drawArrays(gl.TRIANGLES, 0, nums);
    }
    else{
        gl.drawArrays(gl.LINES, 0, nums);
    }
    

    requestAnimFrame(render);
}

*/

/*
Conclusions:
    In this work there are two main steps.
    The first one is to create the grid which is somewhat similar to 
creating the background in the tetris game. The key for this step is 
the equation set below:
    x = cosθ * cosφ;
    y = cosθ * sinφ;
    z = sinθ;
    The second one is to create the indices to draw the triangles.
I try to use two triangls to draw a square. Also I set counterclockwise
order in both triangles.
    I also attempt to achive the goal by using gl.drawArrays(). Compared
with gl.drawElements(), it will apparently cost more memory.

Finished At:
11:50, 10.17, 2020
Yanzhe Chen
*/