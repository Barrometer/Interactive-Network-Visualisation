/**
 * Code for importing some .graphml networks
 * Takes as command line argument path to .graphml file, and name of json to write to
 */

/*
Graphml is basically just xml

*/

var convert =  require("xml-js");
var fs = require("fs");
var network = require("./network");

let myGraph = new network.networkGraph();
try{
  var graphmlData = fs.readFileSync("greek_gods_antichains.graphml")
  var graphmlAsJSON =  convert.xml2json(graphmlData,{compact: true, spaces: 4});
  //console.log(graphmlAsJSON);

  var jsonObject =  JSON.parse(graphmlAsJSON);
  for (let value in jsonObject.graphml.graph.node){
    //console.log(value);
    let nodeName = jsonObject.graphml.graph.node[value]._attributes.id;
    myGraph.addNode(nodeName);
  }
  for (let value in jsonObject.graphml.graph.edge){
    let source = jsonObject.graphml.graph.edge[value]._attributes.source;
    let target = jsonObject.graphml.graph.edge[value]._attributes.target;
    myGraph.addLink(source,target);
  }
} catch (err){
  console.log(err)
}
let jsonGraph =  JSON.stringify(myGraph);

fs.writeFileSync("newTest.json",jsonGraph);