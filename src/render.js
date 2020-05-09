/**
 * This will eventually become the front end rendering.
 * Right now it's just some proofs of concept
 */
import * as THREE from 'three';
var network = require("./network");
var eades = require("./forcedirected");
var graphgenerator = require("./graphgenerator");
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
var raycaster = new THREE.Raycaster();
var mouse =  new THREE.Vector2();
var dat = require("dat.gui");

var gui = new dat.GUI()
function onMouseMove( event ) {

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );

camera.position.set( 0, 0, 100 );
camera.lookAt( 0, 0, 0 );
var controls = new OrbitControls( camera, renderer.domElement );
controls.update();
document.addEventListener('mousemove',onMouseMove,false);

var myGenerator = new graphgenerator.dagGenerator(50,1.2);
myGenerator.randomise();
var myGraph =  myGenerator.graph;
var myEades = new eades.eadesForceSimulator(2,3,3,0.1);
var i =0; var loops = 200;
for(i;i<loops;i++){
  myEades.simulatorStep(myGraph);
}

myGraph.print();
var lineMaterial = new THREE.LineBasicMaterial( { color: 0x0000ff } );
//controls = new THREE.OrbitControls(camera,renderer.domElement)
//var lineGeometry = new THREE.BufferGeometry().setFromPoints( points );
var meshMaterial = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
var meshGeometry = new THREE.BoxBufferGeometry( 1, 1, 1 );

var nodeNamesAndCoords = myGraph.getNodeNamesAndCoords();
var lineNamesAndCoords = myGraph.getLineNamesAndCoords();

function coordsToRenderedNodes(nameAndCoord) {
  //console.log(nameAndCoord.name);
  var cube = new THREE.Mesh( meshGeometry, meshMaterial );
  cube.position.x =  nameAndCoord.coords.x;
  cube.position.y =  nameAndCoord.coords.y;
  cube.position.z =  nameAndCoord.coords.z;
  cube.name = nameAndCoord.name;
  scene.add(cube);
}
function coordsToRenderedArrows(nameAndCoords) {
  //console.log(nameAndCoords.name);
  var from = nameAndCoords.coordsFrom;
  var to = nameAndCoords.coordsTo;
  //console.log(to.x-from.x)
  var dir = new THREE.Vector3(to.x - from.x, to.y - from.y, to.z -  from.z);
  var length = dir.length();
  dir.normalize();
  var origin =  new THREE.Vector3(from.x, from.y, from.z);
  var arrow =  new THREE.ArrowHelper(dir,origin,length,0x0000ff);
  arrow.name = nameAndCoords.name;
  scene.add(arrow);
}
nodeNamesAndCoords.forEach(coordsToRenderedNodes);
lineNamesAndCoords.forEach(coordsToRenderedArrows);
function animate() {

	requestAnimationFrame( animate );

	// required if controls.enableDamping or controls.autoRotate are set to true
	controls.update();

  raycaster.setFromCamera(mouse,camera);
  var intersects = raycaster.intersectObjects(scene.children)
  if(intersects.length > 0){
    //only care for first
    console.log("Intersection with object named " + intersects[0].object.name);
  }

	renderer.render( scene, camera );

}
animate();