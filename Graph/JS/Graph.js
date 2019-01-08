//TODO: Build comprehensive Graph class
//TODO: Make more efficient
      //maybe make minheap and other data structures and implement them here.

//TODO: Make more use of keys(store keys in out edges, etc.)

class Vertex{
  constructor(data=null,edges=[],weights=[],key=0){
    this.data=data;//can store whatever/what the vertex represents ,eg.coordinates
    this.outEdges=edges;//stores vertices reachable from this one
    this.weights=weights;//weights fo each "edge" in edges(should be same length as edges(or longer would work too but pointless))
    this.key=key;
  }
  addEdge(v,w,dir=true){
    this.outEdges.push(v);
    this.weights.push(w);
    if(!dir){
      v.outEdges.push(this);
      v.weights.push(w);
    }
  }
  toString(){
    return this.key;//for when using js object as a map with vertices as key
  }
}

class Graph{
  constructor(vertices=[]){
    this.v=vertices;
    //Maybe store attribuites of graph if known, or just make other versions of graph class like DAG
    /*this.acyclic=true;
    this.directed=true;
    this.negWeights=true;*/
  }
  //basic methods
  addVertex(vert){
    this.v.push(vert);
  }
  addVertices(vertices){
    this.v=this.v.concat(vertices);
  }
  /*removeVertex(vert){

  }
  removeEdge(src,dest,dir=True){

  }
  addEdges(edges,dir=True){//as map of srcVertex:dstVertex
    for(){

    }
  }*/
  addEdge(v1,v2,w,dir=true){//if dir is false then edge goes both ways, else goes from v1 to v2
    let found=false;
    for(let i=0;i<this.v.length;i++){
      if(this.v[i]==v1){
        this.v[i].outEdges.push(v2);
        this.v[i].weights.push(w);
        if(found||dir){//2nd one found(now done), or edge is directed
          break;
        }else{//first one to be found(keep looking for other vertex)
          found=true;
        }
      }
      if(!dir&&this.v[i]==v2){//if edge is not diected and found v2
        this.v[i].outEdges.push(v1);
        this.v[i].weights.push(w);
        if(found){//2nd one found(now done)
          break;
        }else{//first one to be found(keep looking for other vertex)
          found=true;
        }
      }
    }
  }

//get top ordering
kahnTop(){
  //initialize stuff
  let visit=0;
  let inDegs={};
  let q=[];
  let topOrd=[];
  for(let i=0;i<this.v.length;i++){
    inDegs[this.v[i]]=0;
  }
  for(let i=0;i<this.v.length;i++){//initialize indegreees for every vertex in graph
    for(let j=0;j<this.v[i].outEdges.length;j++){
        inDegs[this.v[i].outEdges[j]]+=1;
    }
  }
  //run algorithm
  for(let i=0;i<this.v.length;i++){
    if(inDegs[this.v[i]]==0){
      q.push(this.v[i]);
    }
  }

  while(q.length!=0){
    let cur=q.shift();//remove 1st element in q move it to toporder
    topOrd.push(cur);
    visit++;
    for(let i=0;i<cur.outEdges.length;i++){//for each neighbor of cur
      if(--inDegs[cur.outEdges[i]]==0){//decrement its indegree, if it is now 0 add to queue
        q.push(cur.outEdges[i]);
      }
    }
  }
  //return whether has cycles and the topOrd found
  if(visit!=this.v.length){//had a cycle
    return [true,topOrd];
  }
  return [false,topOrd];
}/*
dfsTop(){

}

//get MST(minimum spanning tree) as array of vertex pairs
kruskals(){
let mst={};
}*/
prims(){
  //initialize stuff
  let open=this.v.slice();//vertices not spanned yet
  let cost={};//cost to add vertex to tree
  let mst={};//edges in mst(mst[destVertex]=srcVertex)
  cost[this.v[0]]=0;
  for(let i=1;i<this.v.length;i++){
    cost[this.v[i]]=Infinity;
  }

  //run algorithm
  while(open.length!=0){
    let minT=Infinity;
    let cur;
    for(let i=0;i<open.length;i++){//make cur= vertex with lowest cost to add to mst
      if(cost[open[i]]<minT){
        cur=open[i];
        minT=cost[open[i]];
      }
    }
    if(!cur){//if graph is not connected
      return {};//maybe just break and return mst(a tree but not a spanning tree)
    }
    for(let i=open.length;i>=0;i--){//remove cur from open
      if(open[i]==cur){
        open.splice(i,1);
      }
    }
    for(let i=0;i<cur.outEdges.length;i++){//for each neighbor of cur
      if(cur.weights[i]<cost[cur.outEdges[i]]){//if from cur to this neighbor is bette than cost to that neighbor replace it in mst
        cost[cur.outEdges[i]]=cur.weights[i];//update its cost and from
        mst[cur.outEdges[i]]=cur;
      }
    }
  }
  return mst;//return vertex pairs(edges)
}

//pathfinding
aStar(start,goal,h=function(x,g){return 0;}){//h is function used to estimate cheapest cost from some vertex to goal vertex
  //initialize stuff
  let closed=[];//evaluated vertices
  let open=[start];//not evaluated but discovered
  let from={};//for each vertex which vertex came to it from(to rebuild path)
  let cost={};//cost from start to that vertex
  let tCost={};//estimated total cost from start to goal through vertex
  cost[start]=0;
  tCost[start]=h(start,goal);
  for(let i=0;i<this.v.length;i++){
    if(this.v[i]!=start){
      cost[this.v[i]]=Infinity;
      tCost[this.v[i]]=Infinity;
    }
  }
  //run algorithm
  while(open.length!=0){
    let minT=Infinity;
    let cur;//get lowest tCost vertex in open
    for(let i=0;i<open.length;i++){
      if(tCost[open[i]]<minT){
        cur=open[i];
        minT=tCost[open[i]];
      }
    }
    if(cur==goal){
      //reconstruct path and return it
      let path=[cur];
      while(cur != start){
        cur=from[cur];
        path.unshift(cur);
      }
      return [path,cost[goal]];//return path as array of vertices and the cost of the path
    }
    //move cur from open to closed
    for(let i=open.length;i>=0;i--){
      if(open[i]==cur){
        open.splice(i,1);
      }
    }
    closed.push(cur);
    for(let i=0;i<cur.outEdges.length;i++){//for each neighbor of cur
      if(!closed.includes(cur.outEdges[i])){//if not already evaluated
        let tempCost=cost[cur]+cur.weights[i];//tempCost to it is cost to cur from start + cost from cur to it
        if(!open.includes(cur.outEdges[i])){//push it to open so its neighbors can get evaluated
          open.push(cur.outEdges[i]);
        }
        if(tempCost<cost[cur.outEdges[i]]){//check if found better cost to it from start by going through cur
          from[cur.outEdges[i]]=cur;
          cost[cur.outEdges[i]]=tempCost;
          tCost[cur.outEdges[i]]=cost[cur.outEdges[i]]+h(cur.outEdges[i],goal);//h(goal,goal) should be 0
        }
      }
    }
  }
}
/*dag(){

}*/
djikstras(start,goal=null){//same as a* without heuristic
  //initialize stuff
  let open=this.v.slice();//not visited(copy of graph's vertex array)
  let from={};//for each vertex which vertex came to it from(to rebuild path)
  let cost={};//cost from start to that vertex

  cost[start]=0;

  for(let i=0;i<this.v.length;i++){
    if(this.v[i]!=start){
      cost[this.v[i]]=Infinity;
    }
  }
  //run algorithm
  while(open.length!=0){
    let minT=Infinity;
    let cur;//get lowest cost vertex in open
    for(let i=0;i<open.length;i++){
      if(cost[open[i]]<minT){
        cur=open[i];
        minT=cost[open[i]];
      }
    }
    if(cur==goal){//if there was a goal vertex and it got reached
      let path=[cur];//reconstruct path and return it
      while(cur != start){
        cur=from[cur];
        path.unshift(cur);
      }
      return [path,cost[goal]];//return path from start to goal as array of vertices and the cost of the path
    }
    //remove cur from open
    for(let i=open.length;i>=0;i--){
      if(open[i]==cur){
        open.splice(i,1);
      }
    }

    for(let i=0;i<cur.outEdges.length;i++){//for each neighbor of cur
      let tempCost=cost[cur]+cur.weights[i];//tempCost to it is cost to cur from start + cost from cur to it
      if(tempCost<cost[cur.outEdges[i]]){//if found better cost to it from start by going through cur
        from[cur.outEdges[i]]=cur;//cur is now way to get to it
        cost[cur.outEdges[i]]=tempCost;//and set its new cost
      }
    }
  }
  return [from,cost];//return info needed to rebuild paths and the costs of the paths
}
/*
bellmanFord(){

}
floydWarshall(){//return best paths from each vertex to every other vertex

}*/
}
