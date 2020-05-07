/**
 * Generate random directional acyclic graphs
 */

var network = require("./network");

class dagGenerator{
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
    var i=1; var loops = this.N;
    for(i;i<loops;i++){
      this.addNode(i.toString());
      //every node has at least one link
      //randomly pick j st j<i j in Z+
      //add link from i to j
      let randVarb = Math.random();
      //randomly generate varb x, exponential distribution
      //x describes number of new links to add
    }
  }
}