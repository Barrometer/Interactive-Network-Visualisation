/**
 * Front end file, handles rendering and UI
 */

/**
 * @typedef {object} Coords
 * @property {number} x
 * @property {number} y
 * @property {number} z
 */

import * as THREE from 'three';
var network = require("./network");
var eades = require("./forcedirected");
var graphgenerator = require("./graphgenerator");
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
var dat = require("dat.gui");
var sgd2 =  require("./sgd2");
import greekData from "./../data/greek_gods.json";



let betterData = JSON.stringify(greekData);
//console.log(betterData);

//INIT
let container = document.getElementById("canvasContainer");
document.body.appendChild(container);

let divWidth =  document.getElementById("canvasContainer").offsetWidth;
let divHeight = document.getElementById("canvasContainer").offsetHeight;
console.log("Width = " + divWidth);
console.log("Height = " + divHeight);
let renderer = new THREE.WebGLRenderer();
renderer.setSize(divWidth,divHeight);
container.appendChild(renderer.domElement);

let scene = new THREE.Scene();

let camera = new THREE.PerspectiveCamera(45,divWidth/divHeight,1,500);
camera.position.y = 150;
camera.position.z = 500;
camera.lookAt( scene.position );
scene.add( camera );

scene.add( new THREE.AmbientLight( 0x222222 ) );

var light = new THREE.PointLight( 0xffffff, 1 );
camera.add( light );

let mesh = new THREE.Mesh( 
	new THREE.BoxGeometry( 200, 200, 200, 1, 1, 1 ), 
	new THREE.MeshPhongMaterial( { color : 0x0080ff } 
) );

scene.add( mesh );

function render() {

    mesh.rotation.y += 0.01;
    
    renderer.render( scene, camera );

}

(function animate() {

    requestAnimationFrame( animate );

    render();

})();