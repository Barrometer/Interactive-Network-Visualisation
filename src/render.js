/**
 * This will eventually become the front end rendering.
 * Right now it's just some proofs of concept
 */
import * as THREE from 'three';
var network = require("./network")
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );

camera.position.set( 0, 0, 100 );
camera.lookAt( 0, 0, 0 );
var controls = new OrbitControls( camera, renderer.domElement );
controls.update();


var myGraph = new network.networkGraph();
myGraph.addNode("NodeA",{x: 15, y: 5, z: 0},{});
myGraph.addNode("NodeB",{x: 10, y: 5, z: 0},{});
myGraph.addNode("NodeC",{x: 10, y: 10, z: 0},{});
myGraph.addNode("NodeD",{x: 10, y: 15, z: 0},{});
myGraph.addNode("NodeE",{x: 5, y: 5, z: 0},{});
myGraph.addLink("NodeA","NodeB");
myGraph.addLink("NodeE","NodeB");
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
  scene.add(arrow);
}
nodeNamesAndCoords.forEach(coordsToRenderedNodes);
lineNamesAndCoords.forEach(coordsToRenderedArrows);
function animate() {

	requestAnimationFrame( animate );

	// required if controls.enableDamping or controls.autoRotate are set to true
	controls.update();

	renderer.render( scene, camera );

}
animate();