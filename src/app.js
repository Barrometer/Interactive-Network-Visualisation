class NetworkNode{
  constructor(nodeName,childNodes,parentNodes){   
    this._nodeName = nodeName //string, should be unique
    this._childNodes = childNodes //list of all nodes considered children
    this._parentNodes =  parentNodes //list of all nodes considered parents
  }
  addChild(newChildName) {
    this._childNodes.push(newChildName)
  }
  addParent(newParentName){
    this._parentNodes.push(newParentName)
  }
  printChildren(){
    var x
    for (i = 0; i < this._childNodes.length(); i ++){
      x+=this._childNodes[i]+" "
    }
    return x
  }
  printParents(){
    var x
    for (i = 0; i < this._parentNodes.length(); i ++){
      x+=this._parentNodes[i]+" "
    }
    return x
  }
}
nodeA =  new NetworkNode("Node A",[],[])
nodeB =  new NetworkNode("Node B",[],[])
nodeA.addChild("Node B")
nodeB.addParent("Node A")
console.log("Test")