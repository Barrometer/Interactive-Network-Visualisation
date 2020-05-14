/**
 * This will eventually become the front end rendering.
 * Right now it's just some proofs of concept
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

//INIT

var INTERSECTED;
var numIterations = 30;
var myGenerator = new graphgenerator.dagGenerator(50,1.2);
myGenerator.randomise();
var myGraph = myGenerator.graph;

var meshMaterial = new THREE.MeshBasicMaterial({color:0xffff0});
var meshGeometry = new THREE.BoxBufferGeometry(1,1,1);
var mouse = new THREE.Vector2();
var params = {
  c1: 2,
  c2: 3,
  c3: 3,
  c4: 0.1,
  iterations: 100
}
var myEades =  new eades.eadesForceSimulator(params.c1, params.c2, params.c3, params.c4);
var loopCount = 0;
var myGui = new dat.GUI();

var c1Controller = myGui.add(params,"c1");
var c2Controller = myGui.add(params,"c2");
var c3Controller = myGui.add(params,"c3");
var c4Controller = myGui.add(params,"c4");
var iterController = myGui.add(params,"iterations");

c1Controller.onFinishChange(function(value){
  myEades.c1 = value;
  
});

c2Controller.onFinishChange(function(value){
  myEades.c2 = value;
  
});

c3Controller.onFinishChange(function(value){
  myEades.c3 = value;
  
});

c4Controller.onFinishChange(function(value){
  myEades.c4 = value;
  
});

var nodeNamesAndCoords = myGraph.getNodeNamesAndCoords();
var lineNamesAndCoords = myGraph.getLineNamesAndCoords();

/**
 * @type {Array.<THREE.Mesh>}
 */
var nodeArray = [];
/**
 * @type {Array.<THREE.ArrowHelper>}
 */
var lineArray = [];

var camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight,1,500);
camera.position.set( 0, 0, 100 );
camera.lookAt( 0, 0, 0 );
var scene = new THREE.Scene();
var raycaster = new THREE.Raycaster();

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var controls = new OrbitControls(camera,renderer.domElement);
controls.update();
document.addEventListener("mousemove",onMouseMove,false);

//want to create objects for all nodes / lines
nodeNamesAndCoords.forEach(function(value){
  var cube = new THREE.Mesh(meshGeometry,meshMaterial);
  cube.position.x = value.coords.x;
  cube.position.y = value.coords.y;
  cube.position.z = value.coords.z;
  cube.name = value.name;
  nodeArray.push(cube);
  scene.add(cube);
});
lineNamesAndCoords.forEach(function(value){
  var from = value.coordsFrom;
  var to = value.coordsTo;
  //console.log(to.x-from.x)
  var dir = new THREE.Vector3(to.x - from.x, to.y - from.y, to.z -  from.z);
  var length = dir.length();
  dir.normalize();
  var origin =  new THREE.Vector3(from.x, from.y, from.z);
  var arrow =  new THREE.ArrowHelper(dir,origin,length,0x0000ff,1,1);
  arrow.name = value.name;
  lineArray.push(arrow);
  scene.add(arrow);
});

animate();
//function definitions

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
  var intersects = raycaster.intersectObjects(scene.children);
  if (intersects.length > 0) {
    if(intersects[0].object!=INTERSECTED){
      INTERSECTED = intersects[0].object;
      let nodeName = intersects[0].object.name
      myGraph.nodes.get(nodeName).print();
    }
  }
  if(loopCount<params.iterations) {
    loopCount++;
    myEades.simulatorStep(myGraph);
    //now to update node positions
    nodeArray.forEach(function(renderedNode){
      let nodeName = renderedNode.name;
      let nodeCoords = myGraph.getNodeCoord(nodeName);
      
      renderedNode.position.x = nodeCoords.x;
      renderedNode.position.y = nodeCoords.y;
      renderedNode.position.z = nodeCoords.z;
      
    });
    lineArray.forEach(function(renderedLine){
      let lineName = renderedLine.name;
      let lineCoords = myGraph.getLineCoords(lineName);
      
      let from = lineCoords.from;
      let to = lineCoords.to;
      let dir = new THREE.Vector3(to.x - from.x, to.y - from.y, to.z -  from.z);
      let length = dir.length();
      dir.normalize();
      let origin =  new THREE.Vector3(from.x,from.y,from.z);
      renderedLine.position.copy(origin);
      renderedLine.setDirection(dir);
      renderedLine.setLength(length,1,1);
      
      
    });
  }

  renderer.render(scene,camera)
}