/**
 * This will eventually become the front end rendering.
 * Right now it's just some proofs of concept
 */
import * as THREE from 'three';
var network = require("./network");
var eades = require("./forcedirected");
var graphgenerator = require("./graphgenerator");
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
var dat = require("dat.gui");

var c1=2,c2=3,c3=3,c4=0.1;
var numIterations = 30;
var myGraph = new network.networkGraph();
var myGenerator = new graphgenerator.dagGenerator(50,1.2);
myGenerator.randomise();
var myEades =  new eades.eadesForceSimulator(c1,c2,c3,c4);
var container;
var camera,scene,raycaster,renderer,controls;
var mouse = new THREE.Vector2();
var params = {
  c1: 2,
  c2: 3,
  c3: 3,
  c4: 4,
  iterations: 30
}
var myGui = new dat.GUI();

var c1Controller = myGui.add(params,"c1");
var c2Controller = myGui.add(params,"c2");
var c3Controller = myGui.add(params,"c3");
var c4Controller = myGui.add(params,"c4");
var iterController = myGui.add(params,"iterations");

var nodeArray = [];
var lineArray = [];

init();
animate();

function init(){
  container = document.createElement("div");
  document.body.appendChild(container);
  camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight,1,500);
  scene = new THREE.Scene();
  raycaster = new THREE.Raycaster();

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);
  controls = new OrbitControls(camera,renderer.domElement);
  controls.update();
  document.addEventListener("mousemove",onMouseMove,false);
}

function onMouseMove( event ) {

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

function animate(){
  requestAnimationFrame(animate);
  controls.update();
  raycaster.setFromCamera(mouse,camera);
}