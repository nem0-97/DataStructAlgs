//TODO: Build comprehensive Graph class
//TODO: Make more efficient
//maybe make minheap and other data structures and implement them here.

//TODO: for dag, bellmanFord, etc. if detect something like cycle should return null? or do resulting from and cost tell something useful so return them and a boolean indicating if cycles exist?
//TODO: Maybe make more use of keys(store keys in outEdges,return map of key to key instead of key to Vertex etc.)
//TODO: Since objects are references could get rid a lot of the searching though this.v in add edge and remove edge

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
  /*removeVertex(vert){//remove the vertex and all edges pointing to it

}*/
removeEdge(src,dest,dir=True){
  for(let i=0;i<this.v.length;i++){
    if(this.v[i]==src){
      for(let j=this.v[i].outEdges.length-1;i>=0;i--){
        if(this.v[i].outEdges[j]==dest){
          this.v[i].outEdges.splice(j,1);
          this.v[i].weights.splice(j,1);
          if(dir){break;}
        }
      }
    }
    if(!dir&&this.v[i]==dest){
      for(let j=this.v[i].outEdges.length-1;i>=0;i--){
        if(this.v[i].outEdges[j]==dest){
          this.v[i].outEdges.splice(j,1);
          this.v[i].weights.splice(j,1);
          if(dir){break;}
        }
      }
    }
  }
}
addEdge(v1,v2,w,dir=true){//if dir is false then edge goes both ways, else goes from v1 to v2
  v1.addEdge(v2,w,dir);//can just do this since objects are stored as references in arrays so this.v should be updated too
  /*let found=false;
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
}*/
}

//get top ordering
kahnTop(){//maybe return reverse top order(would make it more efficient if want to loop over returned order and delete in top order)
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
}
dfsTop(){

}
//get MST(minimum spanning tree) as array of vertex pairs
kruskals(){
  let mst={};
}
prims(){
  //initialize stuff
  let open=this.v.slice();//vertices not spanned yet
  let cost={};//cost to add vertex to tree
  let mst={};//edges in mst(mst[destVertex]=srcVertex)
  cost[this.v[0]]=0;//chose arbitrary vertex to start at
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
    for(let i=open.length-1;i>=0;i--){//remove cur from open
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
    for(let i=open.length-1;i>=0;i--){
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
dag(start,goal=null){
  let temp=this.kahnTop();
  if(!temp[0]){//if it is acyclic
    //initialize stuff
    let from={};//for each vertex which vertex came to it from(to rebuild path)
    let cost={};//cost from start to that vertex
    cost[start]=0;
    for(let i=0;i<this.v.length;i++){
      if(this.v[i]!=start){
        cost[this.v[i]]=Infinity;
      }
    }
    let i=0
    while(temp[1][i]!=start){//get index of start in top order
      i++;
    }
    //run algorithm
    while(i<temp[1].length){//in top order until reach goal or end of topOrder
      if(temp[1][i]==goal){//if there was a goal vertex and are about to relax its edges(then it should already have proper path found)
        let cur=temp[1][i];
        let path=[cur];//reconstruct path and return it
        while(cur != start){
          cur=from[cur];
          path.unshift(cur);
        }
        return [path,cost[goal]];//return path from start to goal as array of vertices and the cost of the path
      }
      for(let j=0;j<temp[1][i].outEdges.length;j++){//relax edges
        let comp=cost[temp[1][i]]+temp[1][i].weights[j];
        if(comp<cost[temp[1][i].outEdges[j]]){//if find new shortest distacne update
          cost[temp[1][i].outEdges[j]]=comp;
          from[temp[1][i].outEdges[j]]=temp[1][i];
        }
      }
      i++;
    }
    return [from,cost];
  }
  //if has cycles
  //console.log('Graph:'+this+'is not acyclic');
  return null;
}
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
    for(let i=open.length-1;i>=0;i--){
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
bellmanFord(start,goal){//maybe add vertex to boolean map to check if a vertex's cost has changed if not do not relax edges out it, to make more efficient
  //initialize stuff
  let from={};//for each vertex which vertex came to it from(to rebuild path)
  let cost={};//cost from start to that vertex
  cost[start]=0;
  for(let i=0;i<this.v.length;i++){
    if(this.v[i]!=start){
      cost[this.v[i]]=Infinity;
    }
  }
  //run algorithm
  let changed=true;
  for(let i=0;i<this.v.length-1&&changed;i++){//relax all edges v-1 times(or until no costs change)
    changed=false;
    for(let j=0;j<this.v.length;j++){//for every vertex
      for(let k=0;k<this.v[j].outEdges.length;k++){//for every edge
        let comp=cost[this.v[j]]+this.v[j].weights[k];
        if(comp<cost[this.v[j].outEdges[k]]){//elax it to see if new lowest cost
          changed=true;
          cost[this.v[j].outEdges[k]]=comp;
          from[this.v[j].outEdges[k]]=this.v[j];
        }
      }
    }
  }
  if(changed){//if was still changing after v-1 rounds of relaxing all edges relax one more time to check for  neg weight cycles
    for(let j=0;j<this.v.length;j++){//for every vertex
      for(let k=0;k<this.v[j].outEdges.length;k++){//for every edge
        let comp=cost[this.v[j]]+this.v[j].weights[k];
        if(comp<cost[this.v[j].outEdges[k]]){//elax it to see if new lowest cost
          changed=true;
          cost[this.v[j].outEdges[k]]=comp;
          from[this.v[j].outEdges[k]]=this.v[j];
        }
      }
    }
  }
  if(changed){//there is neg weight cycle
    return null;
  }
  if(goal){//if there was a goal just return that path
    let cur=goal;
    let path=[cur];//reconstruct path and return it
    while(cur != start){
      cur=from[cur];
      path.unshift(cur);
    }
    return [path,cost[goal]];//return path from start to goal and cost as array of vertices and the cost of the path
  }
  return [from,cost];//else return necessary info to rebuild paths and the costs
}
floydWarshall(){//return best paths from each vertex to every other vertex(not going to return phi table(highest indexed vertex included on path between 2 vertices))

}
}
