/**
 * Code for importing some .graphml networks
 * Takes as command line argument path to .graphml file, and name of json to write to
 * Usage:   Input 1: path to graphml
 *          Input 2: path to output
 */


var convert =  require("xml-js");
var fs = require("fs");
var network = require("./network");

var myArgs = process.argv.slice(2);
console.log('myArgs: ', myArgs);

if(myArgs.length<2){
  console.log("Not enough arguments");
  process.exit(1);
}

let sourcePath = myArgs[0];
let destPath = myArgs[1];

let myGraph = new network.networkGraph();
try{
  var graphmlData = fs.readFileSync(sourcePath)
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

fs.writeFileSync(destPath,jsonGraph);

