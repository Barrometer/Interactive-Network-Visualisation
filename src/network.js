
/**
 * This file provides the backing network model for the entire simulation
 */


 /**
  * @typedef {Object} Coordinate
  * @property {number} x - The x coordinate
  * @property {number} y - The y coordinate
  * @property {number} z - The z coordinate
  */
/**
 * @typedef {Object} nameCoordPair
 * @property {string} name - The name of the Node
 * @property {Coordinate} coords - The coordinate of the Node
 * @property {number} coords.x - The x coordinate
 * @property {number} coords.y - The y coordinate
 * @property {number} coords.z - The z coordinate
 */
class networkNode {
  /**
  *
  * @param {string} nodeName The name of the node
  * @param {object} nodeCoords Object describing the position of the node
  * @param {number} nodeCoords.x
  * @param {number} nodeCoords.y
  * @param {number} nodeCoords.z
  * @param {object} nodeData Object containing all other data associated with this node
  */
  constructor(nodeName, nodeCoords, nodeData) {
    this.name = nodeName;
    this.coords = nodeCoords;
    this.data = nodeData;
  }
  print() {
    console.log("Node named " + this.name + " at co-ordinates [" +
    this.coords.x + ", " + this.coords.y + ", " + this.coords.z +
    "]")
    for (const property in this.data) {
      console.log(`${property}: ${this.data[property]}`);
    }
  }
}
function makeLinkName(nodeNameFrom, nodeNameTo) {
  return "linkFrom_" + nodeNameFrom + "_To_" + nodeNameTo;
}
class networkLink{
  /**
   * Make a networkLink
   * @param {string} nodeNameFrom 
   * @param {string} nodeNameTo 
   */
  constructor( nodeNameFrom, nodeNameTo ) {
    this.name = makeLinkName(nodeNameFrom , nodeNameTo);
    this.from = nodeNameFrom;
    this.to = nodeNameTo;
  }
  print() {
    console.log(`Link called ${this.name}, links from ${this.from} to ${this.to}`)
  }
}

export class networkGraph{
  constructor(){
    /**
     * A map from string to networkNode
     * @type {Map<String,networkNode>}
     */
    this.nodes = new Map(); //maps strings to networkNodes
    /**
     * A map from string to networkLink
     * @type {Map<String,networkLink>}
     */
    this.links = new Map(); 
  }
  /**
  * If there is not a node by this name in the network, adds it to the network
  * If there is already such a node, does nothing
  * Returns 1 on added node, 0 otherwise
  * @param {string} nodeName The name of the node
  * @param {object} nodeCoords Object describing the position of the node
  * @param {number} nodeCoords.x
  * @param {number} nodeCoords.y
  * @param {number} nodeCoords.z
  * @param {object} nodeData Object containing all other data associated with this node
  */
  addNode(nodeName,nodeCoords,nodeData) {
    nodeCoords = nodeCoords || {x: 0, y: 0, z: 0}
    if (!this.nodes.has(nodeName)) {
      let nodeToAdd = new networkNode(nodeName, nodeCoords, nodeData);
      this.nodes.set(nodeName, nodeToAdd);
      return 1;
    }
    else {
      return 0;
    }
  }
  /**
   * Adds a link between two networkNodes if one does not exist. Will also add new networkNode if required
   * Returns 1 on added link, 0 otherwise
   * @param {string} nodeNameFrom 
   * @param {string} nodeNameTo 
   */
  addLink(nodeNameFrom,nodeNameTo) {
    let nameOfLink = makeLinkName(nodeNameFrom, nodeNameTo);
    if (!this.links.has(nameOfLink)) {
      this.addNode(nodeNameFrom);
      this.addNode(nodeNameTo);
      let linkToAdd = new networkLink(nodeNameFrom, nodeNameTo);
      this.links.set(nameOfLink,linkToAdd);
      return 1;
    }
    else {
      return 0;
    }
  }
  /**
   * Returns an array containing all the names of links a node is in. If the 
   * node is not in the network or is not in the links this array is empty
   * @param {string} nodeName 
   */
  findLinksWithNodeIn(nodeName) {
    let linksWithNodeIn = [];
    if(this.nodes.has(nodeName)) {
      for (let [key, value] of this.links) {
        if ((value.from == nodeName) || (value.to == nodeName)){
          linksWithNodeIn.push(key)
        }
      }
    }
    return linksWithNodeIn;
  }
  /**
   * If a node exists in the network, sets it's coords to the specified values
   * Does not update
   * @param {string} nodeName 
   * @param {object} newNodeCoords
   * @param {number} newNodeCoords.x
   * @param {number} newNodeCoords.y
   * @param {number} newNodeCoords.z 
   */
  updateNodeCoords(nodeName, newNodeCoords) {
    if(this.nodes.has(nodeName)) {
      let nodeToUpdate = this.nodes.get(nodeName);
      nodeToUpdate.coords = newNodeCoords;
    }
  }
/**
 * Updates an existing node with new data. Properties in the networkNode.data
 * that are not in newNodeData will not be altered
 * @param {string} nodeName 
 * @param {object} newNodeData 
 */
  updateNodeData(nodeName,newNodeData) {
    if(this.nodes.has(nodeName)) {
      let nodeToUpdate = this.nodes.get(nodeName);
      Object.assign(nodeToUpdate.data,newNodeData);
    }
  }
  /**
   * Prints out the networkGraph in a pretty format
   */
  print() {
      for (let [key,value] of this.nodes) {
        console.log(`Key: ${key}`);
        value.print();
      }
      for (let [key,value] of this.links) {
        console.log(`Key: ${key}`);
        value.print();
      }
  }
  /**
   * Returns an array of objs consisting of all the nodes names and strings
   */
  getNodeNamesAndCoords() {
    let result = [];
    for (let value of this.nodes.values()) {
      let nameOfNode = value.name;
      let coordsOfNode = value.coords;
      let obj = {name: nameOfNode, coords: coordsOfNode};
      result.push(obj);
    }
    return result;
  }
  /**
   * returns an array of Objects, consisting of the name of the link and the
   * coordinates of the two ends
   */
  getLineNamesAndCoords() {
    let result = [];
    for (let value of this.links.values()) {
      let nameOfLink =  value.name;
      let fromCoords = this.nodes.get(value.from).coords;
      let toCoords = this.nodes.get(value.to).coords;
      let obj = {name: nameOfLink, coordsTo: toCoords, coordsFrom: fromCoords};
      result.push(obj);
    }
    return result; 
  }
}
/*
let myGraph = new networkGraph();
myGraph.addNode("NodeA",{x: 10, y: 0, z: 0},{foo: "bar"});
myGraph.addNode("NodeB",{x: 10, y: 5, z: 0},{foo: "yay"});
myGraph.addNode("NodeC",{x: 10, y: 10, z: 0},{});
myGraph.addNode("NodeD",{x: 10, y: 15, z: 0},{});
myGraph.addNode("NodeE",{x: 10, y: 20, z: 0},{});

myGraph.addLink("NodeA","NodeB");
myGraph.addLink("NodeE","NodeB");

myGraph.updateNodeCoords("NodeE",{x:2,y:2,z:2});

myGraph.print();

var foo = myGraph.findLinksWithNodeIn("NodeB");
console.log(foo);*/
