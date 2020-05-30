/**
 * Implements Stochastic Gradient Descent for Graph Drawing
 * As described in https://arxiv.org/abs/1710.04626
 */

var network = require("./network");

class nodePair{
  /**
   * 
   * @param {string} iName 
   * @param {string} jName 
   * @param {number} distance
   * @param {number} weight
   */
  constructor(iName,jName,distance,weight){
    this.i = iName;
    this.j = jName;
    this.distance = distance;
    this.weight = weight;
  }
}

exports.sgd2 = class{
  /**
   * 
   * @param {network.networkGraph} graph 
   * @param {number} epsilon
   * @param {number} maxIter
   */
  constructor(graph,epsilon,maxIter) {
    this.stress = 0;
    this.weightExponent = -2; // must be less than 0;
    this.graph = graph;
    this.epsilon = epsilon;
    /**
     * The map between pairs of nodes and a distance
     *@type {Map<String,nodePair>}
     */
    this.termMap = new Map();
    /**
     * @type {String[]}
     */
    this.termNameArray = [];
    this.buildAdjacenyMap();
    this.dMin = this.findMinDistanceInGraph();
    this.dMax = this.findMaxDistanceInGraph();

    this.wMin = Math.pow(this.dMax,this.weightExponent);
    this.wMax = Math.pow(this.dMin,this.weightExponent);
    this.etaMax = 1/this.wMin;
    this.etaMin = this.epsilon/this.wMax;
    this.maxIter = maxIter;

    /**
     * -lambda for use in calculating eta(t)
     */
    this.negLambda = Math.log(this.etaMin/this.etaMax) / (this.maxIter - 1);
    this.currIter = 0;
  }
  /**
   * Updates the weight exponent used in calculations. Must be negative
   * @param {number} newWeight 
   */
  updateWeightCoeff(newWeight){
    if(!(newWeight<0)){
      console.log("invalid weight coeffictient")
      return;
    }
    this.weightExponent = newWeight;
    for (let termPair of this.termMap.values()){
      termPair.weight = Math.pow(value.distance,this.weightExponent);
    }
    this.wMin = Math.pow(this.dMax,this.weightExponent);
    this.wMax = Math.pow(this.dMin,this.weightExponent);
    this.etaMax = 1/this.wMin;
    this.etaMin = this.epsilon/this.wMax;
    this.negLambda = Math.log(this.etaMin/this.etaMax) / (this.maxIter - 1);
  }
  /**
   * Updates the new maximum number of iterations
   * @param {number} newMax 
   */
  updateNumIters(newMax){
    this.maxIter = newMax;
    this.currIter = 0;
    this.negLambda = Math.log(this.etaMin/this.etaMax) / (this.maxIter - 1);
  }
  /**
   * A test function that prints key data
   */
  print(){
    console.log("dMin = " + this.dMin);
    console.log("dMax = " + this.dMax);
    for (let [key,value] of this.termMap){
      console.log("Term is called" + key +", distance is " + value.distance);
    }
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
          //let term = new nodePair(keyI,keyJ,0,0);
          //this.termMap.set(mainName,term);
        }
        else{
          if(!this.termMap.has(alternateName)){ //ie only do ij if not done ji
            let distance = this.adjacencyStep(keyI,keyJ);
            let weight = Math.pow(distance,this.weightExponent);
            let term = new nodePair(keyI,keyJ,distance,weight);
            this.termMap.set(mainName,term);
          }


        }
      }
    }
    //at this point, we have a map with NC2 elements, where N is the number of nodes in the graph
    //We also want an array of every node in the map for use later.
    this.termNameArray = Array.from(this.termMap.keys());
    
  }
  /**
   * Works out the distance between two nodes using a breadth first approach
   * @param {string} nodeI 
   * @param {string} nodeJ 
   */
  adjacencyStep(nodeI,nodeJ){
    //console.log("Looking for " + nodeI + ", "+nodeJ)
    let reachable = this.graph.adjacentNodesNames(nodeI);
    //console.log(reachable);
    if(reachable.includes(nodeJ)){
      //this means nodeI and nodeJ are adjacent
      //console.log("Found, distance 1");
      return 1;
    }
    let found = false;
    let distance = 2;
    
    while(!found){
      let reachableChildren = [];
      for (let index in reachable){
        let consideredNode = reachable[index];
        //console.log("Considering child " + consideredNode)
        let tempReachable = this.graph.adjacentNodesNames(consideredNode);
        //console.log(tempReachable);
        if(tempReachable.includes(nodeJ)){ // ie if we can find it
          //console.log("Found, distance " + distance)
          return distance;
        }
        //otherwise add this lot of reachable nodes to the storage
        tempReachable.forEach(function(item){
          reachableChildren.push(item);
        });
        //console.log("Not found")
      }
      //if here, none of the reachable nodes is nodeJ, need to explore next depth
      distance++;
      reachable=reachableChildren;
      
      
    }
  }
  /**
   * Perform an iteration of SGD2
   */
  sgd2Iteration(){
    if(this.currIter>=this.maxIter){
      console.log("Finished, stop calling me");
      return;
    }
    //first want to shuffle terms
    this.shuffleFisherYates();
    //now want to go through each term, and apply an sgd2 step

    /*
    console.log("etaMax = " + this.etaMax);
    console.log("etaMin = " + this.etaMin);
    console.log("currIter = " + this.currIter);
    console.log("negLambda = " + this.negLambda);
    */
    let etaT = this.etaMax * Math.exp(this.currIter * this.negLambda);
    //console.log("etaT = " + etaT);
    for (let index in this.termNameArray){
      let termName = this.termNameArray[index];
      //console.log("Test, termName = " +termName)
      let term = this.termMap.get(termName);
      let nodeIName = term.i;
      let nodeJName = term.j;
      let idealDistance = term.distance;
      let pairWeight = term.weight;
      

      let nodeICoords = this.graph.getNodeCoord(nodeIName);
      let nodeJCoords = this.graph.getNodeCoord(nodeJName);

      //calculate r vector
      /*
        r = (||Xi-Xj||-dij)/2 * (Xi-Xj/||Xi-Xj||)
      */
      let differenceIJ = sub3DVector(nodeICoords,nodeJCoords);      
      let normIJ = length3DVector(differenceIJ);   
      let rScalarPart = (normIJ - idealDistance) / 2;      
      let rVectorPart = scalarTimes3DVector( (1 / normIJ), differenceIJ,);     
      let r = scalarTimes3DVector(rScalarPart,rVectorPart);      
      let mu =  Math.min(1, pairWeight * etaT);
      
      
      r = scalarTimes3DVector(mu,r);
      let deltaI =  scalarTimes3DVector(-1, r);
      let deltaJ =  scalarTimes3DVector(1, r);
      this.graph.applyMotionVectorToNode(nodeIName,deltaI)
      
      this.graph.applyMotionVectorToNode(nodeJName,deltaJ);
    }
    this.currIter++;
  }
  /**
   * Shuffles the termNameArray using the Fisher-Yates algorithm
   */ 
  shuffleFisherYates(){
    for (let i = this.termNameArray.length-1; i>0; i--){
      const j = Math.floor(Math.random()*(i+1));
      let temp = this.termNameArray[i];
      this.termNameArray[i] = this.termNameArray[j];
      this.termNameArray[j] = temp;
    }
  }
  /**
   *Iterates over map, returns minimum distance
   */
  findMinDistanceInGraph(){
    let values = Array.from(this.termMap.values());
    let minimumPair = values.reduce(function(prev,curr){
      return prev.distance < curr.distance ? prev : curr;
    });
    return minimumPair.distance;
  }

  findMaxDistanceInGraph(){
    let values = Array.from(this.termMap.values());
    let maximumPair = values.reduce(function(prev,curr){
      return prev.distance < curr.distance ? curr : prev;
    });
    return maximumPair.distance;
  }
}


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