/**
 * A file defining a variety of force directed algorithms
 * 
 */
var network = require("./network");

/**
 * Implements a force simulator based on Eades mechanical model
 * Attractive force is only between connected nodes, = c1*log(c2/d)
 * Repulsive force between all nodes, = c3/d**2
 * Moves nodes c4*total force on node
 */
exports.eadesForceSimulator = class{
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
      //console.log(nodesConnectedtoNode1);
      for (let [key2,node2] of graph.nodes) {
        if(key1 != key2) { //this should prevent calculating the force of a node on itself
          let node2Position = node2.coords;
          let vec1To2 = sub3DVector(node2Position,node1Position);
          let vec2To1 = sub3DVector(node1Position,node2Position);
          let distance = length3DVector(vec1To2);
          let currentForce = {x: 0, y:0, z: 0};
          normalise3DVector(vec1To2);
          normalise3DVector(vec2To1);
          distance = Math.max(distance,0.01); //if too close just pretend they're not
          //if connected attract
          if (nodesConnectedtoNode1.includes(node2)) {
            //do some maths
            let attractionMagnitude = this.c1 * Math.log10(distance/this.c2);
            let forceTowardsN2 = scalarTimes3DVector(attractionMagnitude,vec1To2);
            currentForce = add3DVector(currentForce,forceTowardsN2);

          }
          //always repel
          let repulsionMaginitude = this.c3/Math.pow(distance,2);
          let forceAwayN2 =  scalarTimes3DVector(repulsionMaginitude,vec2To1);
          currentForce = add3DVector(currentForce,forceAwayN2);
          forceOnNode = add3DVector(currentForce,forceOnNode);
          
        }
      }
      //for node1 all forces calculated
      let obj = {nodeName: key1, forceOnNode: forceOnNode}
      forcesArray.push(obj)
    }
    //forces for all nodes calculated
    //now to move all nodes by the correct force times c4
    for (let value of forcesArray) {
      let name = value.nodeName;
      let force = value.forceOnNode;
      let motion = scalarTimes3DVector(this.c4,force);
      graph.applyMotionVectorToNode(name,motion);
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
function length3DVector(vector) {
  let squaredSum = Math.pow(vector.x,2) + Math.pow(vector.y,2) + Math.pow(vector.z,2);
  return Math.sqrt(squaredSum);
}
/**
 * Normalises the input 3D vector
 * @param {object} vector
 * @param {number} vector.x
 * @param {number} vector.y
 * @param {number} vector.z 
 */
function normalise3DVector(vector){
  let length = length3DVector(vector);
  vector.x = vector.x/length;
  vector.y = vector.y/length;
  vector.z = vector.z/length;
}
/**
 * Returns the product of a scalar and a vector
 * @param {object} vector
 * @param {number} vector.x
 * @param {number} vector.y
 * @param {number} vector.z 
 * @param {number} scalar
 */
function scalarTimes3DVector(scalar, vector){
  return {x: scalar*vector.x, y: scalar*vector.y, z: scalar*vector.z}
}
