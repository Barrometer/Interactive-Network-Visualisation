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

//UI INIT

var INTERSECTED;
var myGenerator = new graphgenerator.dagGenerator(50,1.2);
myGenerator.randomise();
//var myGraph = myGenerator.graph;
var myGraph = new network.networkGraph();
myGraph.load(betterData);
myGraph.randomiseNodeLocations();
var meshMaterial = new THREE.MeshBasicMaterial({color:0xffff00});
var meshGeometry = new THREE.BoxBufferGeometry(1,1,1);
var mouse = new THREE.Vector2();
var params = {
  c1: 5,
  c2: 20,
  c3: 20,
  c4: 0.1,
  eadesIters: 1000,
  epsilon: 0.1,
  distanceWeight: -2,
  sgd2Iters: 30,
  layoutMode: "Sgd2",
  loopCount: 0,
  pause: false,
  sdg2DistanceScale: 10
}
var myEades =  new eades.eadesForceSimulator(params.c1, params.c2, params.c3, params.c4);
var mySGD2 =  new sgd2.sgd2(myGraph,params.epsilon,params.sgd2Iters);
//var loopCount = 0;
var myGui = new dat.GUI();
var modeController = myGui.add(params,"layoutMode",["Eades","Sgd2"]);
var loopListener = myGui.add(params,"loopCount").listen();
var pauseGraph =  myGui.add(params,"pause");
var guiEades =  myGui.addFolder("Eades Parameters")
var c1Controller = guiEades.add(params,"c1",0,100);
var c2Controller = guiEades.add(params,"c2",0,100);
var c3Controller = guiEades.add(params,"c3",0,100);
var c4Controller = guiEades.add(params,"c4",0,100);
var eadesIterController = guiEades.add(params,"eadesIters");

var guiSGD2 = myGui.addFolder("SGD2 Parameters");
var weightExponentController = guiSGD2.add(params,"distanceWeight",-10,-1);
var sgd2ItersController = guiSGD2.add(params,"sgd2Iters",0);
var sgd2DistanceScaleCont =  guiSGD2.add(params,"sdg2DistanceScale",1)
//contoller callbacks
sgd2ItersController.onFinishChange(function(value){
  mySGD2.updateNumIters(value);
  //mySGD2.currIter = 0;
})
sgd2DistanceScaleCont.onFinishChange(function(value){
  mySGD2.distanceScale = value;
  params.loopCount = 0;
  mySGD2.currIter=0;
})
weightExponentController.onFinishChange(function(value){
  mySGD2.updateWeightCoeff(value);
  mySGD2.currIter=0;
  params.loopCount = 0;
})
modeController.onChange(function(value){
  console.log("Changed, now using "+ value);
  params.loopCount = 0;
  mySGD2.currIter = 0;
})

c1Controller.onFinishChange(function(value){
  myEades.c1 = value;
  params.loopCount = 0;
  
});

c2Controller.onFinishChange(function(value){
  myEades.c2 = value;
  params.loopCount = 0;
  
});

c3Controller.onFinishChange(function(value){
  myEades.c3 = value;
  params.loopCount = 0;
  
});

c4Controller.onFinishChange(function(value){
  myEades.c4 = value;
  params.loopCount = 0;
  
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
camera.position.set( 0, 0, 100 );
camera.lookAt( 0, 0, 0 );

var raycaster = new THREE.Raycaster();

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
  
    mouse.x = ( ( event.clientX - renderer.domElement.offsetLeft ) / renderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = - ( ( event.clientY - renderer.domElement.offsetTop ) / renderer.domElement.clientHeight ) * 2 + 1;
  
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
    if((params.layoutMode=="Eades")&&(params.loopCount<params.eadesIters)&&!params.pause){
      params.loopCount++;
      myEades.simulatorStep(myGraph);
      //now to update node positions
      updateScene();
    }
    if((params.layoutMode=="Sgd2")&&(params.loopCount<params.sgd2Iters)&&!params.pause){
      params.loopCount++;
      mySGD2.sgd2Iteration();
      myGraph = mySGD2.graph;
      updateScene();
    }
    renderer.render(scene,camera)
  }
  
  function updateScene(){
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