/**
 * A file to apply a force directed graph drawing algorithm
 * 
 * Most basic algorithm at core:
 *  1. Calculate Force on each vertex
 *  2. Move each vertex
 *  3. Repeat n times
 * This is inefficient but simple
 * 
 * More complicated algorithms alter both attractions / repulsive force
 * Some algorithms use Barnes-Hut simultion of distant forces to reduce time complexity
 */

 /*
Pseudocode:
  Take Graph:
    For M:
      For each node in graph:
        Calculate Forces:
          for links in node
            Force += c1 * log(link.length/c2)
          for other nodes in graph
            Force += c3 / nodes.distance^2
      move all vertices c4 * force on vertex      
 */

 /*
 Other thoughts:
 Forces have magnitude and direction. Direction is normalised vector between nodes. 
 When force is attractive, dir is node2.pos - node1.pos. When force is repulsive, dir is node1.pos-node2.pos
 */

var network = require("./network");

/**
 * Implements a force simulator based on Eades
 */
class eadesForceSimulator{
  /**
   * 
   * @param {Number} c1 
   * @param {Number} c2 
   * @param {Number} c3 
   * @param {Number} c4 
   */
  constructor(c1,c2,c3,c4){
    this.c1 = c1;
    this.c2 = c2;
    this.c3 = c3;
    this.c4 = c4;
  }
  /**
   * 
   * @param {network.networkGraph} graph 
   */
  simulatorStep(graph){
    /* 
    For each node
      Consider an other node
      If connected, attract
      Also repel
    */
   let forcesArray = [];
    for (let[key1,node1] of graph.nodes) {
      let forceOnNode = {x: 0, y:0, z: 0};
      let node1Position = node1.coords;
      let nodesConnectedtoNode1 = graph.findNodesLinkedToNode(key1);
      for (let [key2,node2] of graph.nodes) {
        if(key1 != key2) { //this should prevent calculating the force of a node on itself
          let node2Position = node2.coords;
          let vec1To2 = sub3DVector(node2Position,node1Position);
          let distance = length3dVector(vec1To2);
          distance = Math.max(distance,0.01); //if too close just pretend they're not
          //if connected attract
          if (nodesConnectedtoNode1.includes(node2)) {
            //do some maths
          }
          //always repel

        }
      }
    }
  }  
}
/**
 * 
 * @param {Number} x 
 * @param {Number} y 
 * @param {Number} z 
 */
function makeVector3D(x,y,z){
  this.x = x;
  this.y = y;
  this.z = z;
}
/**
 * Adds two 3D vectors, returns their sum
 * @param {Object} vector1 
 * @param {number} vector1.x
 * @param {number} vector1.y
 * @param {number} vector1.z
 * @param {Object} vector2
 * @param {number} vector2.x
 * @param {number} vector2.y
 * @param {number} vector2.z 
 */
function add3DVector(vector1, vector2){
  return {x: vector1.x + vector2.x, y: vector1.y + vector2.y, z: vector1.z + vector2.z}
}
/**
 * Calculates vector1-vector2
 * @param {Object} vector1 
 * @param {number} vector1.x
 * @param {number} vector1.y
 * @param {number} vector1.z
 * @param {Object} vector2
 * @param {number} vector2.x
 * @param {number} vector2.y
 * @param {number} vector2.z 
 */
function sub3DVector(vector1, vector2){
  return {x: vector1.x - vector2.x, y: vector1.y - vector2.y, z: vector1.z - vector2.z}
}
/**
 * Returns lenth of a 3d vector
 * @param {object} vector
 * @param {number} vector.x
 * @param {number} vector.y
 * @param {number} vector.z 
 */
function length3dVector(vector) {
  let squaredSum = Math.pow(vector.x,2) + Math.pow(vector.y,2) + Math.pow(vector.z,2);
  return Math.sqrt(squaredSum);
}


let myGraph = new network.networkGraph();