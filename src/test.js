var network = require("./network")
var sgd2 =  require("./sgd2");
var fs = require("fs");

let data = fs.readFileSync("./data/greek_gods.json","utf8");
let graph = new network.networkGraph();
//graph.load(data);

graph.addLink("A","B");
graph.addLink("A","C");
graph.addLink("A","G");
graph.addLink("B","D");
graph.addLink("D","E");
graph.addLink("C","E");
graph.addLink("E","F");
graph.addLink("F","G");

graph.randomiseNodeLocations();
let mySGD2 = new sgd2.sgd2(graph,0.1,30);
mySGD2.updateWeightCoeff(-3);
mySGD2.print();
mySGD2.graph.print();
//mySGD2.print();
let i = 0, iters = 30;
for (i;i<iters;i++){
  mySGD2.sgd2Iteration();
}
//mySGD2.print();
mySGD2.graph.print();
