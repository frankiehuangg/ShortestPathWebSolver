const matrix = [
  [0, 4, 1, 0],
  [4, 0, 1, 5],
  [2, 1, 0, 3],
  [0, 5, 3, 0]
];

const matrix2 = [
  [0, 8, 0, 7, 0, 0, 0, 0, 0, 0],
  [8, 0, 2, 0, 6, 0, 0, 0, 0, 0],
  [0, 2, 0, 3, 0, 7, 0, 0, 0, 0],
  [7, 0, 3, 0, 4, 0, 4, 0, 0, 0],
  [0, 6, 0, 4, 0, 3, 0, 3, 0, 0],
  [0, 0, 7, 0, 3, 0, 5, 0, 9, 0],
  [0, 0, 0, 4, 0, 5, 0, 4, 0, 8],
  [0, 0, 0, 0, 3, 0, 4, 0, 5, 0],
  [0, 0, 0, 0, 0, 9, 0, 5, 0, 2],
  [0, 0, 0, 0, 0, 0, 8, 0, 2, 0]
];



const nodes = [
  { x: 1, y: 1 },
  { x: 3, y: 1 },
  { x: 5, y: 1 },
  { x: 2, y: 3 },
  { x: 4, y: 3 },
  { x: 6, y: 3 },
  { x: 3, y: 5 },
  { x: 5, y: 5 },
  { x: 4, y: 7 },
  { x: 6, y: 7 },
];


function heuristic(node1, node2) {
  // console.log(nodes[node2].x);
  // console.log(nodes[node1].x);
  // console.log(nodes[node2].y);
  // console.log(nodes[node1].y);
  return Math.sqrt(Math.pow(nodes[node2].x - nodes[node1].x, 2) + Math.pow(nodes[node2].y - nodes[node1].y, 2));
}

class PriorityQueue {
    constructor() {
      this.items = [];
    }
    enqueue(item, priority) {
      this.items.push({item, priority});
      this.items.sort((a, b) => a.priority - b.priority);
    }
    dequeue() {
      return this.items.shift().item;
    } 
    isEmpty() {
      return this.items.length === 0;
    }
}


export function ucs(start, goal, matrix) {
  const queue = new PriorityQueue(); //Queue of nodes sort by cost
  const gCost = new Map(); //Map to keep track of the cost to reach each node 
  const parentNode = new Map(); //Map of the best path to reach each node
  parentNode.set(start, null);
  gCost.set(start, 0);

  queue.enqueue(start, 0); //

  while (!queue.isEmpty()) {
    const node = queue.dequeue(); // explore the node with lowest path cost

    if (node === goal) {
      //Reconstruct path
      const path = [node];
      let parent = parentNode.get(node);

      while (parent!==start) {
        path.push(parent);
        parent = parentNode.get(parent);
      }
      path.push(start); //Push start node
      path.reverse(); //Reverse list

      return { cost: gCost.get(node), path }; 
    }

    for (let i = 0; i < matrix[node].length; i++) {
      if (matrix[node][i] !== 0) { //check if nodes is connected and not visited
        const next=i;
        const newCost = gCost.get(node) + matrix[node][next]; //Calculate newCost for each node

        if (!gCost.has(next) || newCost < gCost.get(next)) { 
          /*
          Check if enqueue node is needed
          
          ensures that the algorithm explores the path with the lowest cost to reach a node 
          and avoids revisit nodes with higher path costs.

          to save resources
          */
          gCost.set(i, newCost); //set new cost to reach node
          parentNode.set(i, node); //Set new map foor path
          queue.enqueue(i, newCost); //Enqueue node
        }
      }
    }
  }

  return { cost: -1, path: [] }; //goal not found
}



export function aStar(start,goal,matrix){
    // Initialize data structures
    const queue = new PriorityQueue(); //queue of nodes sort by cost
    queue.enqueue(start, 0); 
    const parentNode = new Map(); //Map to keep track of the cost to reach each node 
    const gCost = new Map(); //Map to keep track of the cost to reach each node 
    parentNode.set(start, null);
    gCost.set(start, 0);
  
    // A* algorithm
    while (!queue.isEmpty()) {
      const current = queue.dequeue();
  
      if (current === goal) {
        // Reconstruct path
        const path = [current];
        let parent = parentNode.get(current);
        while (parent !== start) {
          path.push(parent);
          parent = parentNode.get(parent);
        }
        path.push(start); //Push start node
        path.reverse(); //Reverse list
        
        return {cost: gCost.get(current), path: path };
      }
  
      for (let i = 0; i < matrix.length; i++) {
        if (matrix[current][i] !== 0) { //check if nodes is connected
          const next = i; //neighbor node
          const newCost = gCost.get(current) + matrix[current][i]; //Calculate newCost for each node
          if (!gCost.has(next) || newCost < gCost.get(next)) {
            /*
            Check if enqueue node is needed
            
            ensures that the algorithm explores the path with the lowest cost to reach a node 
            and avoids revisit nodes with higher path costs.

            to save resources
          */
            gCost.set(next, newCost);
            const priority = newCost + heuristic(next, goal); //Set priority using heuristic
            // console.log(current); 
            // console.log(next); 
            // console.log(heuristic(next,goal)); 
            queue.enqueue(next, priority);
            parentNode.set(next, current);
          }
        }
      }
    }
  
    return {cost:-1 ,path:[]};
}


const result = ucs(9, 1, matrix2);
const result2 =aStar(9, 1, matrix2);
console.log(result); 
console.log(result2); 

