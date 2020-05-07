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

class basicForceSimulator{
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
    /**
     *@type {Map<String,forceVector>}
     */
    let forces = new Map();
    for (let [key, value] of graph.nodes){
      //first handle attraction from connected nodes
      let linksWithNode = graph.findLinksWithNodeIn(value.name);
      //then handle repulsion from all nodes
    }
  }
}
/**
 * 
 * @param {Number} x 
 * @param {Number} y 
 * @param {Number} z 
 */
function makeForceVector(x,y,z){
  this.x = x;
  this.y = y;
  this.z = z;
}





let myGraph = new network.networkGraph();