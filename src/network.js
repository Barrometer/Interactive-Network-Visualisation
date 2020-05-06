var THREE = require('three');

/**
 * Nodes represent nodes within a graph
 */
class NetworkNode{
  /**
   * Constructor for NetworkNode
   * @param {string} name Unique Name for the NetworkNode
   * @param {Number} x x co-ord
   * @param {Number} y y co-ord
   * @param {Number} z z co-ord
   * @param {object} data data object for NetworkNode
   */
  constructor(name,x,y,z,data){
    this._name = name; //unique
    this._x = x;
    this._y = y;
    this._z = z;
    this._data = data;
    this._hidden = false;
  }
  /**
   * Hides the NetworkNode
   */
  hide(){
    this._hidden = true;
  }
  /**
   * Unhides NetworkNode
   */
  unhide(){
    this._hidden =  false;
  }
  /**
   * Assigns the given data to the NetworkNode
   * @param {object} data
   */
  setData(data){
    this._data = data;
  }
  /**
   * 
   * @param {object} coords the new co-ordinates of the point
   * @param {number} coords.x the x co-ordinate
   * @param {number} coords.y the y co-ordinate
   * @param {number} coords.z the z co-ordinate
   */
  setCoords(coords){
    this._x = coords.x;
    this._y = coords.y;
    this._z = coords.z;
  }
  /**
   * Returns the co-ordinates of the node as an array
   */
  getCoords(){
    return [this._x,this._y,this._z];
  }

  /**
   * Prints the NetworkNode
   */
  print(){
    console.log("Name = " + this._name);
    if (this._hidden){
      console.log("Node hidden");
    }
    else{
      console.log("Node visible");
    }
    console.log("x = " + this._x + " y = " + this._y + " z = " + this._z);

    for (const property in this._data){
      console.log(`${property}: ${this._data[property]}`);
    }
  }
}
/**
 * Links are inherently directional
 * Links consist of a unique id, and a record of which two NetworkNodes are joint
 */
class NetworkLink{
  /**
   * Constructor for Link
   * @param {string} nodeFrom Name of NetworkNode the link starts at
   * @param {string} nodeTo Name of NetworkNode the link ends at
   */
  constructor(linkName,nodeFrom,nodeTo){
    this._name = linkName;
    this._from = nodeFrom;
    this._to = nodeTo;
  }
  print(){
    console.log("NetworkLink name = " +this._name);
    console.log("Links from " + this._from + " to " + this._to);
  }
  /**
   * Retuns the names of the two linked Nodes as {to,from}
   */
  getNamesOfLinked(){
    return {from: this._from, to: this._to}
  }
}
/** 
 * Graph is the main class to be instantiated
 * Graph keeps track of NetworkNode, and NetworkLinks
 * Graph has functions to filter nodes based on NetworkNode data
 * Graph has funcstions to import and to save
 * Graph has functions to add new NetworkNode, modify data of NetworkNode
*/
class Graph{
  constructor(){
      this._nodes = new Map();
      this._links = new Map();
  }
  toJSON(){
    let nodesObj = strMapToObj(this._nodes);
    let linksObj = strMapToObj(this._links);
    return {nodes: nodesObj,links: linksObj};
  }
  load(jsonData){
    let entireObject = JSON.parse(jsonData);
    let nodesObj = entireObject.nodes || {};
    let linksObj = entireObject.links || {}
    this._nodes.clear();
    this._links.clear();
    for (const node in nodesObj){
      this.addNode(node._name,node._data,node._x,node._y,node._z);
    }
    for (const link in linksObj){
      this.addLink(link._from,link._to);
    }
  }
  /**
   * Creates a new node with given name and data if does not exist
   * @param {string} name name of node
   * @param {object} data data of node
   */
  addNode(name, data, x, y, z){
    //if node does not exist, give it unique id and add it
    data = data || {};
    x = x || 0
    y = y || 0
    z = z || 0
    if(! this._nodes.has (name)){
      let nodeToAdd = new NetworkNode(name,x,y,z,data); //location needs tweaking
      this._nodes.set(name,nodeToAdd);
      console.log("Registered new node named " +name);
    }
    else{
      console.log("Node named " + name +" already in network");
    }
  }
  /**
   * Creates a link between two nodes if the link does not exist. Will create nodes with empty data if needed
   * @param {string} nodeFrom name of node thelink points from
   * @param {string} nodeTo name of node the link points to
   */
  addLink(nodeFrom,nodeTo){
    this.addNode(nodeFrom);
    this.addNode(nodeTo);
    let linkName = makeLinkName(nodeFrom,nodeTo);
    if(! this._nodes.has(linkName)){
      let linkToAdd = new NetworkLink(linkName,nodeFrom,nodeTo);
      this._links.set(linkName,linkToAdd);
      console.log("Added a new link called "+ linkName + ", from node named " + nodeFrom + " to " + nodeTo);
    }
    else{
      console.log("Link called "+ linkName+ ", from node named " + nodeFrom + " to " + nodeTo + " already in network");
    }
  }
  /**
   * Sets the data for a specific node. Does not create a new node if it does not exist
   * Returns 1 on successful update, 0 otherwise
   * @param {string} nodeName name of node to modify
   * @param {object} data data value to set
   */
  setNodeData(nodeName,data){
    if(this._nodes.has(nodeName)){
      this._nodes.get(nodeName).setData(data);
      console.log("Updated node named "+nodeName);
      return 1;
    }
    else{
      console.log("Node does not exist, did not update");
      return 0;
    }
  }
  print(){
    for(let [key,value] of this._nodes){
      console.log("Key : " + key);
      value.print();
    }
    for(let [key,value] of this._links){
      console.log("Key : " + key);
      value.print();
    }
  }
  /**
   * If a node in the graph exists with the given name, returns a reference to it, else returns null
   * @param {string} nodeName 
   */
  getNode(nodeName){
    if(this._nodes.has(nodeName)){
      return this._nodes.get(nodeName);
    }
    else{
      return null;
    }
  }
  /**
   * If a NetworkNode exists, updates it's co-ordinates
   * @param {string} nodeName 
   * @param {object} coords
   * @param {number} coords.x the x co-ordinate
   * @param {number} coords.y the y co-ordinate
   * @param {number} coords.z the z co-ordinate
   */
  setCoords(nodeName,coords){
    if(this._nodes.has(nodeName)){
      this._nodes.get(nodeName).setCoords(coords);
    }
  }
  /**
   * Applies a function to all nodes in Graph
   * @param {function} func 
   */
  forEachNode(func){
    let returnValues = []
    for (let value of this._nodes.values()){
      let temp = func(value);
      returnValues.push(temp);
    }
    return returnValues;
  }
  /**
   * 
   * @param {THREE.MeshBasicMaterial} meshMaterial 
   */
  getNodeCoords(){
    let nodeCoordsArray = [];
    for (let value of this._nodes.values()){
      let coords = value.getCoords();
      nodeCoordsArray.push(coords);
    }
    return nodeCoordsArray;
  }
  /**
   * Returns an array of {coordsfrom,coordsto}
   */
  getLineCoords(){
    let linePairsArray = [];
    for (let value of this._links.values()){
        let namesOfLinked = value.getNamesOfLinked();
        let toCoords = this._nodes.get(namesOfLinked.to).getCoords();
        let fromCoords = this._nodes.get(namesOfLinked.from).getCoords();
        let coordPair ={from: fromCoords, to: toCoords}

        linePairsArray.push(coordPair);
    }
    return linePairsArray
  }
}
/**
 * Function to make name for a link by combining names of strings
 * @param {string} from 
 * @param {string} to 
 */
function makeLinkName(from,to){
  return "linkFrom"+from+"To"+to;
}
function strMapToObj(strMap){
  let obj ={};
  for (let [key,value] of strMap){
    obj[key] = value;
  }
  return obj;
}

let myGraph = new Graph();
let jsonObj = {"nodes":{"NodeA":{"_name":"NodeA","_x":0,"_y":10,"_z":0,"_data":{"age":10,"cited":5},"_hidden":false},"NodeB":{"_name":"NodeB","_x":5,"_y":5,"_z":0,"_data":{},"_hidden":false},"NodeC":{"_name":"NodeC","_x":-5,"_y":5,"_z":0,"_data":{},"_hidden":false}},"links":{"linkFromNodeAToNodeB":{"_name":"linkFromNodeAToNodeB","_from":"NodeA","_to":"NodeB"},"linkFromNodeCToNodeA":{"_name":"linkFromNodeCToNodeA","_from":"NodeC","_to":"NodeA"}}};

myGraph.load(jsonObj)
/*
myGraph.addLink("NodeA","NodeB");
myGraph.setNodeData("NodeA",{age: 10, cited: 5})
myGraph.addNode("NodeC");
myGraph.addLink("NodeC","NodeA");
myGraph.setCoords("NodeA",{x: 0, y: 10, z: 0})
myGraph.setCoords("NodeB",{x: 5, y: 5, z: 0})
myGraph.setCoords("NodeC",{x: -5, y: 5, z: 0})
myGraph.print();

let graphAsJSON = JSON.stringify(myGraph);
console.log("\n\n");
console.log(graphAsJSON)
console.log("\n\n");
let secondGraph = new Graph();
secondGraph.load(graphAsJSON);
myGraph.print();*/
//console.log(jsonToObj.nodes.NodeA); 

/*var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
camera.position.set( 0, 0, 100 );
camera.lookAt( 0, 0, 0 );

var scene = new THREE.Scene();

var lineMaterial = new THREE.LineBasicMaterial( { color: 0x0000ff } );
var meshMaterial = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
var meshGeometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
var arryNodeCoords = myGraph.getNodeCoords();
var arrayLineCoords = myGraph.getLineCoords()
//var nodeCubes = []
function coordsToRenderedNodes(value){
  var cube = new THREE.Mesh( meshGeometry, meshMaterial );
  cube.position.x = value[0];
  cube.position.y = value[1];
  cube.position.z = value[2];
  scene.add(cube);
}
function coordsToRenderedLines(value){
  var to = value.to;
  var from = value.from;
  var dir =  new THREE.Vector3(to[0]-from[0],to[1]-from[1],to[2]-from[2]);
  var length = dir.length();
  dir.normalize();
  var origin = new THREE.Vector3(from[0],from[1],from[2]);
  var arrow =  new THREE.ArrowHelper(dir,origin,length,0x0000ff);
  scene.add(arrow);
}
arryNodeCoords.forEach(coordsToRenderedNodes);
arrayLineCoords.forEach(coordsToRenderedLines);
renderer.render( scene, camera );*/