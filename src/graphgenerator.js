/**
 * Generate random directional acyclic graphs
 */

var network = require("./network");

exports.dagGenerator = class {
  /**
   * 
   * @param {number} N the number of nodes to generate
   * @param {number} lambda the lamda value used to randomly calculate the number of additional links a node gets
   */
  constructor(N,lambda=1){
    this.graph = new network.networkGraph();
    this.num = N;
    this.lamb = lambda;
  }
  /**
   * Randomly generates a graph
   * All nodes link to at least one node, no cycles.
   * Randomly adds extra links per node based on exponential distribution
   */
  randomise(){
    /*
    Basic pattern:
    */
    this.graph = new network.networkGraph();
    this.graph.addNode("0");
    var i=1; var loops = this.num;
    for(i;i<loops;i++){
      this.graph.addNode(i.toString());
      //every node has at least one link
      //randomly pick j st j<i j in Z+
      //add link from i to j
      let randInt = getRandomInt(0,i);
      this.graph.addLink(i.toString(),randInt.toString());
      //randomly generate varb x, exponential distribution
      //x describes number of new links to add at most
      
      let uniformInput = Math.random();
      let expRandFloat = uniformToExponential(uniformInput,this.lamb);
      let expRandInt = Math.floor(expRandFloat);
      //x cannot be greater than i - 1 to avoid duplicate links
      let numberExtraLinks = Math.min(expRandInt,i-1);
      var j = 0;
      for (j; j<numberExtraLinks; j++){
        let randInt = getRandomInt(0,i);
        this.graph.addLink(i.toString(),randInt.toString());
      }
    }
    this.graph.randomiseNodeLocations();
  }
};
/**
 * Returns a random integer x, st min<=x<max
 * @param {number} min 
 * @param {number} max 
 */
function getRandomInt(min,max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
/**
 * Converts a uniformly distributed random varb in range 0-1 to an exponentially distributed random varb
 * @param {number} x uniformly distribution varb in range 0-1
 * @param {number} lambda parameter for lambda distribution
 */
function uniformToExponential(x,lambda) {
  // general approach is described here https://stats.stackexchange.com/a/234569
  // if x is uniform [a,b] then -1/k * ln ((x-a)/(b-a)) is exponential with parameter k
  let logPart = Math.log(x);
  let expVarb = logPart / lambda * -1;
  return expVarb;
}