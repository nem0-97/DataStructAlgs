function test(){
  let v=new Vertex({x:0,y:0},[],[],0);
  let v1=new Vertex({x:1,y:3},[],[],1);
  let v2=new Vertex({x:3,y:7},[],[],2);
  let v3=new Vertex({x:2,y:5},[],[],3);
  let v4=new Vertex({x:1,y:1},[],[],4);

  let g=new Graph([v,v1]);
  //let g=new Graph();
  g.addVertex(v2);
  g.addVertices([v3,v4]);
  g.addEdge(v,v2,3);
  v2.addEdge(v1,4);
  //v1.addEdge(v,-4);
  v1.addEdge(v3,4);
  v3.addEdge(v4,4);
  //0->2->1->3->4
  console.log(g.kahnTop());
  console.log(g.prims());
  console.log(g.aStar(v,v3,function(s,g){return Math.sqrt(Math.pow((v1.data.x-v.data.x),2)+Math.pow((v1.data.y-v.data.y),2)) ;}));
  console.log(g.djikstras(v,v3));
  console.log(g.djikstras(v));
  console.log(g.dag(v,v3));
  console.log(g.dag(v));
  console.log(g.bellmanFord(v,v3));
  console.log(g.bellmanFord(v));
  //works
  //to implement and test:floydwarshall,dfsTop, kruskals

}
test();
