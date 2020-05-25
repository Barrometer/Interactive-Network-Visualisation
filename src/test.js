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

//graph.print();
let mySGD2 = new sgd2.sgd2(graph,3);

//mySGD2.graph.print();
mySGD2.print();