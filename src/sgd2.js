/**
 * Implements Stochastic Gradient Descent for Graph Drawing
 * As described in https://arxiv.org/abs/1710.04626
 */

var network = require("./network");

class sgd2{
  /**
   * 
   * @param {network.networkGraph} graph 
   */
  constructor(graph) {
    this.stress = 0;
    this.weightExponent = -2;
    this.graph = graph
    /**
     * The map between pairs of nodes and a distance
     *@type {Map<String,Number>}
     */
    this.adjacencyMap = new Map();
  }
  /**
   * Iterate over all nodes in graph, build an adjaceny graph for it
   */
  buildAdjacenyMap(){
    for (let [keyI, valueI] of this.graph.nodes){
      for (let [keyJ, valueJ] of this.graph.nodes){
        let mainName = "pair"+keyI+"with"+keyJ;
        let alternateName = "pair"+keyJ+"with"+keyI;
        if(keyI == keyJ){ //ie they're the same node
          this.adjacencyMap.set(mainName,0);
        }
        else{
          if(!this.adjacencyMap.has(alternateName)){ //ie only do ij if not done ji
            let distance = this.adjacencyStep(keyI,keyJ);
            this.adjacencyMap.set(mainName,distance);
          }


        }
      }
    }
  }
  /**
   * Works out the distance between two nodes using a breadth first approach
   * @param {string} nodeI 
   * @param {string} nodeJ 
   */
  adjacencyStep(nodeI,nodeJ){

    let reachable = this.graph.adjacentNodesNames(nodeI);
    if(reachable.includes(nodeJ)){
      //this means nodeI and nodeJ are adjacent
      return 1;
    }
    let found = false;
    let distance = 2;
    
    while(!found){
      let reachableChildren = [];
      for (let node in reachable){
        let tempReachable = this.graph.adjacentNodesNames(node);
        if(tempReachable.includes(nodeJ)){ // ie if we can find it
          return distance;
        }
        //otherwise add this lot of reachable nodes to the storage
        tempReachable.forEach(function(item){
          reachableChildren.push(item);
        });
      }
      //if here, none of the reachable nodes is nodeJ, need to explore next depth
      distance++;
      reachable=reachableChildren;
    }
  }


  /**
   * Need to:
   *  1. Build adjacency
   *  2. Randomly pick pairs of nodes
   *    2.a Calculate r
   *    2.b Update nodes
   */
}