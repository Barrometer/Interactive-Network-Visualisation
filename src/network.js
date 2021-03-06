/**
 * This file provides the backing network model for the entire simulation
 */

/**
 * @typedef coordinates
 * @type {object}
 * @property {number} x x coordinate
 * @property {number} y y coordinate
 * @property {number} z z coordinate
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
  /**
   * Converts the node to a string for output to the user
   */
  toString(){
    let result = "\n\nNode called " + this.name +"\n";
    result += "Node has co-ordinates [" +
    this.coords.x.toPrecision(3) + ", " + this.coords.y.toPrecision(3) + ", " + 
    this.coords.z.toPrecision(3) + "]\n";
    result += "Node has data {";
    for (const property in this.data) {
      result += property + ": " + this.data[property] +", \n"
    }
    result += "}";

    return result;
  }
}
/**
 * A helper function to generate edge names
 * @param {string} nodeNameFrom 
 * @param {string} nodeNameTo 
 */
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

exports.networkGraph = class {
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
    /**
     * a toggle for whether the graph is 2D or not
     * @type {boolean} 
     */
    this.twoD = false;
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
   * Returns an array containing all the nodes a node is adjacent to
   * @param {string} nodeName 
   */
  adjacentNodes(nodeName) {
    let linksWithNodeIn = this.findLinksWithNodeIn(nodeName);
    
    let linkedNodes = [];
    for (const linkName of linksWithNodeIn) {
      let link = this.links.get(linkName);
      if (link.from != nodeName) {
        //ie the link is to nodeName
        let theLinkedNode = this.nodes.get(link.from)
        linkedNodes.push(theLinkedNode);
      }
      else if (link.to != nodeName) {
        //ie the link is from nodeName
        let theLinkedNode = this.nodes.get(link.to)
        linkedNodes.push(theLinkedNode);
      } 
      else {
        console.log("Something has gone wrong with adjacentNodes");
      }
    }
    return linkedNodes;
  }
  /**
   * Returns an array containing the names of all the nodes a node is adjacent to
   * @param {string} startNode 
   */
  adjacentNodesNames(startNode){
    let linksWithNodeIn = this.findLinksWithNodeIn(startNode);
    
    let linkedNodes = [];
    for (const linkName of linksWithNodeIn) {
      let link = this.links.get(linkName);
      if (link.from != startNode) {
        //ie the link is to nodeName
        let theLinkedNode = this.nodes.get(link.from)
        linkedNodes.push(theLinkedNode.name);
      }
      else if (link.to != startNode) {
        //ie the link is from nodeName
        let theLinkedNode = this.nodes.get(link.to)
        linkedNodes.push(theLinkedNode.name);
      } 
      else {
        console.log("Something has gone wrong with adjacentNodesNames");
      }
    }
    return linkedNodes;
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
   * Translates a nodes coordiantes by a motion vector
   * @param {string} nodeName 
   * @param {object} motionVector
   * @param {number} motionVector.x
   * @param {number} motionVector.y
   * @param {number} motionVector.z 
   */
  applyMotionVectorToNode(nodeName,motionVector) {
    if(this.nodes.has(nodeName)) {
      let node = this.nodes.get(nodeName);
      let nodeCoords = node.coords;
      let newNodeCoords = addCoords(nodeCoords,motionVector);
      node.coords = newNodeCoords;
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
   * Prints out the networkGraph in a pretty format to the console
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
   * Returns an array of objs consisting of all the nodes names and coords
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
  /**
   * Overload for use with JSON.stringify()
   */
  toJSON() {
    let nodesObj = strMapToObj(this.nodes);
    let linksObjs = strMapToObj(this.links);

    return {nodes: nodesObj, links: linksObjs};
  }
  /**
   * A function to load a graph fron a JSON string
   * @param {string} stringifiedJSONData 
   */
  load(stringifiedJSONData){
    let entireObject = JSON.parse(stringifiedJSONData);
    let nodesObj = entireObject.nodes || {};
    let linksObj = entireObject.links || {};

    this.nodes.clear();
    this.links.clear();

    for (const node in nodesObj){
      let nodeToAdd = nodesObj[node];
      this.addNode(nodeToAdd.name,nodeToAdd.coords,nodeToAdd.data);
    }
    for (const link in linksObj){
      let linkToAdd = linksObj[link];
      this.addLink(linkToAdd.from,linkToAdd.to);
    }
  }
  /**
   * Randomly positions the nodes of a graph in a square of side length n
   * centred at the origin, where n is the number of nodes
   */
  randomiseNodeLocations(){
    let numberOfNodes = this.nodes.size;
    //basic strategy as follows: randomly position nodes in a square of radius n
    //where n is the number of nodes
    for(let value of this.nodes.values()){
      let randX = Math.random() * (numberOfNodes*2)-numberOfNodes;
      let randY = Math.random() * (numberOfNodes*2)-numberOfNodes;
      let randZ = Math.random() * (numberOfNodes*2)-numberOfNodes;
      //two dimensional controller
      if(this.twoD){
        randZ = 0;
      }
      let newCoords = {x: randX, y: randY, z: randZ};
      value.coords = newCoords;
    }
  }
  /**
   * resets the graph
   */
  deleteNetwork(){
    this.nodes.clear();
    this.links.clear();
  }
  /**
   * Applies a large number of updates to the graph
   * @param {Array.<{nodeName: string, coords: coordinates, data: *}>} updates 
   */
  bulkNodeUpdate(updates) {
    for (let update of updates) {
      if (this.nodes.has(update.nodeName)) {
        //do the update
        if(update.hasOwnPropery("coords")){
          this.updateNodeCoords(update.nodeName,update.coords)
        }
        if(update.hasOwnPropery("data")){
          this.updateNodeData(update.nodeName,update.data);
        }
      }
    }
  }
  /**
   * Gets the coordinates of a node from its name. Returns null if node does not exist
   * @param {string} nodeName 
   */
  getNodeCoord(nodeName){
    if(this.nodes.has(nodeName)) {
      return this.nodes.get(nodeName).coords;
    }
    else {
      return null;
    }
  }
  /**
   * Given a valid line name, returns an object with the coordinates of
   * the source and target nodes
   * @param {string} lineName 
   */
  getLineCoords(lineName) {
    if(this.links.has(lineName)){
      let line = this.links.get(lineName);
      let to = this.nodes.get(line.to).coords;
      let from = this.nodes.get(line.from).coords;
      return {from: from, to: to};
    }
    else {
      return null;
    }
  }
};
/**
 * Function to convert Map with string key to an object
 * @param {Map<String,*>} strMap 
 */
function strMapToObj(strMap){ //based on code from https://2ality.com/2015/08/es6-map-json.html
  let obj ={};
  for (let [key,value] of strMap){
    obj[key] = value;
  }
  return obj;
}
/**
 * Function to add 3d vectors
 * @param {object} coord1
 * @param {number} coord1.x
 * @param {number} coord1.y
 * @param {number} coord1.z 
 * @param {object} coord2
 * @param {number} coord2.x
 * @param {number} coord2.y
 * @param {number} coord2.z 
 */
function addCoords(coord1,coord2){
  let newX = coord1.x + coord2.x
  let newY = coord1.y + coord2.y
  let newZ = coord1.z + coord2.z

  return {x: newX, y: newY, z: newZ};
}
