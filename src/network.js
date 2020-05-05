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
  save(){

  }
  load(){

  }
  /**
   * Creates a new node with given name and data if does not exist
   * @param {string} name name of node
   * @param {object} data data of node
   */
  addNode(name, data){
    //if node does not exist, give it unique id and add it
    data = data || {};
    if(! this._nodes.has (name)){
      let nodeToAdd = new NetworkNode(name,0,0,0,data); //location needs tweaking
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
    this.addNode(nodeFrom,{});
    this.addNode(nodeTo,{});
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
      this._nodes.get(nodeName).setCoords(coords)
    }
  }
  /**
   * Applies a function to all nodes in Graph
   * @param {func} callback 
   * @param {object} args 
   */
  forEachNode(callback,args){
    for (let value of this._nodes.values()){
      callback.apply(this,value,args)
    }
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

let myGraph = new Graph();

myGraph.addLink("NodeA","NodeB");
myGraph.setNodeData("NodeA",{age: 10, cited: 5})
myGraph.addNode("NodeC");
myGraph.addLink("NodeC","NodeA");
myGraph.setCoords("NodeA",{x: 0, y: 10, z: 0})
myGraph.setCoords("NodeB",{x: 5, y: 5, z: 0})
myGraph.setCoords("NodeC",{x: -5, y: 5, z: 0})


myGraph.print();

/*
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
camera.position.set( 0, 0, 100 );
camera.lookAt( 0, 0, 0 );

var scene = new THREE.Scene();

var lineMaterial = new THREE.LineBasicMaterial( { color: 0x0000ff } );
var meshMaterial = new THREE.MeshBasicMaterial( { color: 0xffff00 } );*/





renderer.render( scene, camera );