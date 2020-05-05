/**
 * Nodes represent nodes within a graph
 */
class Node{
  /**
   * Constructor for node
   * @param {string} name Unique Name for the Node
   * @param {Number} x x co-ord
   * @param {Number} y y co-ord
   * @param {Number} z z co-ord
   * @param {object} data data object for node
   */
  constructor(name,x,y,z,data){
    this._name = name //unique
    this._x = x
    this._y = y
    this._z = z
    this._data = data
    this._hidden = false
  }
  hide(){
    this._hidden = true
  }
  unhide(){
    this._hidden =  false
  }
}
/**
 * Links are inherently directional
 * Links consist of a unique id, and a record of which two NetworkNodes are joint
 */
class Link{
  /**
   * Constructor for Link
   * @param {Node} nodeFrom Node the link starts at
   * @param {Node} nodeTo Node the link ends at
   */
  constructor(nodeFrom,nodeTo){
    this._name = makeLinkName(nodeTo._name,nodeFrom._name)
    this._from = nodeFrom
    this._to = nodeTo
  }
}
/** 
 * Graph is the main class to be instantiated
 * Graph keeps track of nodes, and links
 * Graph has functions to filter nodes based on node data
 * Graph has funcstions to import and to save
 * Graph has functions to add new nodes, remove nodes
*/
class Graph{
  constructor(){
      this._nodes = new Map()
      this._links = new Map()
  }
  save(){

  }
  load(){

  }
  addNode(name, data){
    //if node does not exist, give it unique id and add it
  }
  addLink(nodeFrom,nodeTo){
    //takes two nodes (which do not need to exist) and adds a link between them
  }
}
/**
 * Function to make name for a link by combining names of strings
 * @param {string} to 
 * @param {string} from 
 */
function makeLinkName(to,from){
  return "linkFrom"+to+"To"+from
}