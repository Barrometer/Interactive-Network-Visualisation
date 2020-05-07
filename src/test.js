var network = require("./network")

var myGraph = new network.networkGraph();
myGraph.addNode("NodeA",{x: 15, y: 5, z: 0},{foo: "bar"});
myGraph.addNode("NodeB",{x: 10, y: 5, z: 0},{});
myGraph.addNode("NodeC",{x: 10, y: 10, z: 0},{});
myGraph.addNode("NodeD",{x: 10, y: 15, z: 0},{});
myGraph.addNode("NodeE",{x: 5, y: 5, z: 0},{});
myGraph.addLink("NodeA","NodeB");
myGraph.addLink("NodeE","NodeB");
myGraph.print();

console.log(myGraph.findLinksWithNodeIn("NodeB"));
console.log(myGraph.findNodesLinkedToNode("NodeB"));
