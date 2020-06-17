/**
 * Front end file, handles rendering and UI, and is the start of the bundling process
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
var Stats =  require("stats.js")
import greekData from "./../data/greek_gods.json"; //alter to change loaded data



let betterData = JSON.stringify(greekData);
//console.log(betterData);

//UI and Graph Initialisation 
var stats =  new Stats();
stats.showPanel(0);
let statsContainer = document.getElementById("statsContainer");
statsContainer.appendChild(stats.dom);
//fps / memory tracker now attached
var INTERSECTED; // stores the last intersected node

//random generator
var myGenerator = new graphgenerator.dagGenerator(75,1.2);
myGenerator.randomise();
var myRandomGraph = myGenerator.graph;

//loaded data
var myFamilyTreeGraph = new network.networkGraph();
myFamilyTreeGraph.load(betterData);
myFamilyTreeGraph.randomiseNodeLocations();

//the graph used throughout the rest of the program
var myGraph;
myGraph =  myFamilyTreeGraph;

var meshMaterial = new THREE.MeshBasicMaterial({color:0xffff00}); // node colour
var meshGeometry = new THREE.BoxBufferGeometry(1,1,1); // node shape
var mouse = new THREE.Vector2(); // used as part of interaction

//used as part of UI controllers
var params = {
  c1: 5,
  c2: 10,
  c3: 10,
  c4: 0.5,
  eadesIters: 500,
  epsilon: 0.1,
  distanceWeight: -2,
  sgd2Iters: 30,
  layoutMode: "Sgd2",
  loopCount: 0,
  pause: false,
  useRandomGraph: false,
  reset: function(){resetFunction()},
  twoDimensional: false,
  sdg2DistanceScale: 10
}

var myEades =  new eades.eadesForceSimulator(params.c1, params.c2, params.c3, params.c4);

//testing sgd2 initialisation
var t0 = performance.now();
var mySGD2 =  new sgd2.sgd2(myGraph,params.epsilon,params.sgd2Iters);
var t1 = performance.now();
console.log("sgd2 init took " + (t1-t0 + "ms")); //prints to dev console, not shown to user

//gui and controllers using dat.gui
var myGui = new dat.GUI({ autoPlace: false });
var guiContainer =  document.getElementById("guiContainer");
guiContainer.appendChild(myGui.domElement);
var modeController = myGui.add(params,"layoutMode",["Eades","Sgd2"]);
var loopListener = myGui.add(params,"loopCount").listen();
//disabled below as overall functionality broken
//var graphUsageController = myGui.add(params,"useRandomGraph");
var pauseGraph =  myGui.add(params,"pause");
var resetController = myGui.add(params,"reset");
var dimensionalityController = myGui.add(params,"twoDimensional");
var guiEades =  myGui.addFolder("Eades Parameters")
var c1Controller = guiEades.add(params,"c1",0,100);
var c2Controller = guiEades.add(params,"c2",0,100);
var c3Controller = guiEades.add(params,"c3",0,100);
var c4Controller = guiEades.add(params,"c4",0,100);
var eadesIterController = guiEades.add(params,"eadesIters");
guiEades.open();

var guiSGD2 = myGui.addFolder("SGD2 Parameters");
var weightExponentController = guiSGD2.add(params,"distanceWeight",-10,-1);
var sgd2ItersController = guiSGD2.add(params,"sgd2Iters",0);
var sgd2DistanceScaleCont =  guiSGD2.add(params,"sdg2DistanceScale",1);
guiSGD2.open();
//controller callbacks
//controller callbacks are called when the user alters a value


/* // currently non functional, need to clear scene.
graphUsageController.onFinishChange(function(value){
  console.log(value);
  if(value){// ie switching to use a random graph
    myGraph = myRandomGraph;
    myGraph.randomiseNodeLocations();
    mySGD2 =  new sgd2.sgd2(myGraph,params.epsilon,params.sgd2Iters);
  }
  else{
    myGraph = myFamilyTreeGraph;
    myGraph.randomiseNodeLocations();
    mySGD2 =  new sgd2.sgd2(myGraph,params.epsilon,params.sgd2Iters);
  }
});*/
dimensionalityController.onFinishChange(function(value){
  myGraph.twoD = !myGraph.twoD;
  myGraph.randomiseNodeLocations();
  mySGD2.graph =  myGraph;
});

sgd2ItersController.onFinishChange(function(value){
  mySGD2.updateNumIters(value);
  //dodgy hack
  params.loopCount = value;
})
sgd2DistanceScaleCont.onFinishChange(function(value){
  mySGD2.distanceScale = value;
})
weightExponentController.onFinishChange(function(value){
  mySGD2.updateWeightCoeff(value);
})
modeController.onChange(function(value){
  myGraph.randomiseNodeLocations();
  mySGD2.graph =  myGraph;
  //console.log("Changed, now using "+ value);
  params.loopCount = 0;
  mySGD2.currIter=0;
})

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

//arrays to store names of lines and nodes
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

//ui handling, will attach renderer correctly
let container = document.getElementById("canvasContainer");
document.body.appendChild(container);

let divWidth =  document.getElementById("canvasContainer").offsetWidth;
let divHeight = document.getElementById("canvasContainer").offsetHeight;
//console.log("Width = " + divWidth);
//console.log("Height = " + divHeight);

//set up of three.js renderer, camera, and scene
let renderer = new THREE.WebGLRenderer();
renderer.setSize(divWidth,divHeight);
container.appendChild(renderer.domElement);

let scene = new THREE.Scene();
scene.background =  new THREE.Color(0xf0f0f0);
let camera = new THREE.PerspectiveCamera(45,divWidth/divHeight,1,500);
camera.position.set( 0, 0, 100 );
camera.lookAt( 0, 0, 0 );

var raycaster = new THREE.Raycaster(); // used as part of mouse over

// a prebuilt module in Three.js handling rotating etc
var controls = new OrbitControls(camera,renderer.domElement);
controls.update();

document.addEventListener("mousemove",onMouseMove,false);

//want to create objects in scene for all nodes / lines
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
  stats.begin(); // start of fps timing
  requestAnimationFrame(animate);
  controls.update();
  raycaster.setFromCamera(mouse,camera);
  var intersects = raycaster.intersectObjects(scene.children);
  if (intersects.length > 0) {
    if(intersects[0].object!=INTERSECTED){
      INTERSECTED = intersects[0].object;
      let nodeName = intersects[0].object.name
      myGraph.nodes.get(nodeName).print();
      let nodeText = myGraph.nodes.get(nodeName).toString();
      document.getElementById("dataContainer").innerText = nodeText;
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
    //now to update node positions
    updateScene();
  }
  renderer.render(scene,camera)
  stats.end(); // end of fps timing
}

/**
 * A function called to update the scene when the underlying graphs
 * is modiifed by the graph drawing algorithms
 */
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
/**
 * A function called when resetting the state of the graph
 */
function resetFunction() {
  myGraph.randomiseNodeLocations();
  mySGD2.graph =  myGraph;
  params.loopCount = 0;
  mySGD2.currIter=0;
}