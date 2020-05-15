var network = require("./network")

class test{
  constructor(a){
    this.a = a;
  }
  test(){
    console.log(this.a);
  }
}
var foo = "foo"
let testObject = new test(foo)
testObject.test();
foo = "bar"


testObject.test();