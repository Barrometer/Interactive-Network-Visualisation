/**
 * This will eventually become the front end rendering.
 * Right now it's just some proofs of concept
 */
import * as THREE from 'three';
//import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
camera.position.set( 0, 0, 100 );
camera.lookAt( 0, 0, 0 );

var scene = new THREE.Scene();

var lineMaterial = new THREE.LineBasicMaterial( { color: 0x0000ff } );
//controls = new THREE.OrbitControls(camera,renderer.domElement)

var points = [];
points.push( new THREE.Vector3( - 10, 0, 0 ) );
points.push( new THREE.Vector3( 0, 10, 0 ) );
points.push( new THREE.Vector3( 10, 0, 0 ) );

var lineGeometry = new THREE.BufferGeometry().setFromPoints( points );
var line = new THREE.Line( lineGeometry, lineMaterial );
scene.add( line );


var meshMaterial = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
var meshGeometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
var cube1 = new THREE.Mesh( meshGeometry, meshMaterial );
cube1.position.x =   10
var cube2 = new THREE.Mesh( meshGeometry, meshMaterial );
cube2.position.x =   -10
var cube3 = new THREE.Mesh( meshGeometry, meshMaterial );
cube3.position.y =   10
scene.add( cube1 );
scene.add( cube2 );
scene.add( cube3 );




renderer.render( scene, camera );