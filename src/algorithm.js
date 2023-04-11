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

function ucs(start, goal, matrix) {
  const visited = new Set([start]); // set of visited nodes
  const queue = new PriorityQueue(); // queue of nodes to explore, with their path and path cost
  const gCost = new Map([[start, 0]]); // map of the cost to reach each node
  const parentNode = new Map([[start, null]]); // map of the best path to reach each node

  queue.enqueue(start, 0);

  while (!queue.isEmpty()) {
    const node = queue.dequeue(); // explore the node with lowest path cost

    if (node === goal) {
      const path = [node];
      let prev = parentNode.get(node);

      while (prev!==start) {
        path.push(prev);
        prev = parentNode.get(prev);
      }
      path.push(start);
      path.reverse();

      return { cost: gCost.get(node), path }; // goal found, return its cost and path
    }

    for (let i = 0; i < matrix[node].length; i++) {
      if (matrix[node][i] !== 0 && !visited.has(i)) { // if there is a connection and the node hasn't been visited
        visited.add(i);
        const newCost = gCost.get(node) + matrix[node][i];

        if (!gCost.has(i) || newCost < gCost.get(i)) {
          gCost.set(i, newCost);
          parentNode.set(i, node);
          queue.enqueue(i, newCost);
        }
      }
    }
  }

  return { cost: -1, path: [] }; // goal not found
}



function aStar(start,goal,matrix){
    // Initialize data structures
    const queue = new PriorityQueue();
    queue.enqueue(start, 0);
    const parentNode = new Map();
    const gCost = new Map();
    parentNode.set(start, null);
    gCost.set(start, 0);
  
    // A* algorithm
    while (!queue.isEmpty()) {
      const current = queue.dequeue();
  
      if (current === goal) {
            // Reconstruct path
        const path = [current];
        let prev = parentNode.get(current);
        while (prev !== start) {
          path.push(prev);
          prev = parentNode.get(prev);
        }
        path.push(start);
        path.reverse();
        
        return {cost: gCost.get(current), path: path };
      }
  
      for (let i = 0; i < matrix.length; i++) {
        if (matrix[current][i] !== 0) {
          const next = i;
          const newCost = gCost.get(current) + matrix[current][i];
          if (!gCost.has(next) || newCost < gCost.get(next)) {
            gCost.set(next, newCost);
            const priority = newCost + heuristic(next, goal);
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

const result = ucs(0, 3, matrix2);
const result2 =aStar(9, 1, matrix2);
console.log(result); 
console.log(result2); 