// ═══════════════════════════════════════════════════════════
//  DSA Presets — 14 working JS snippets for algorithm visualization
// ═══════════════════════════════════════════════════════════

export interface DSAPreset {
  id: string;
  name: string;
  category: string;
  code: string;
}

export interface DSACategory {
  emoji: string;
  name: string;
  presets: DSAPreset[];
}

export const dsaCategories: DSACategory[] = [
  {
    emoji: '📦',
    name: 'Sorting',
    presets: [
      {
        id: 'bubble-sort',
        name: 'Bubble Sort',
        category: 'Sorting',
        code: `function bubbleSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}
const result = bubbleSort([64, 34, 25, 12, 22, 11]);
console.log("Sorted:", result);`,
      },
      {
        id: 'merge-sort',
        name: 'Merge Sort',
        category: 'Sorting',
        code: `function merge(left, right) {
  let result = [];
  let i = 0;
  let j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}

function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  let mid = Math.floor(arr.length / 2);
  let left = mergeSort(arr.slice(0, mid));
  let right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

const result = mergeSort([38, 27, 43, 3, 9, 82, 10]);
console.log("Sorted:", result);`,
      },
      {
        id: 'quick-sort',
        name: 'Quick Sort',
        category: 'Sorting',
        code: `function quickSort(arr) {
  if (arr.length <= 1) return arr;
  let pivot = arr[arr.length - 1];
  let left = [];
  let right = [];
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  return quickSort(left).concat([pivot]).concat(quickSort(right));
}

const result = quickSort([10, 80, 30, 90, 40, 50, 70]);
console.log("Sorted:", result);`,
      },
      {
        id: 'insertion-sort',
        name: 'Insertion Sort',
        category: 'Sorting',
        code: `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}

const result = insertionSort([12, 11, 13, 5, 6]);
console.log("Sorted:", result);`,
      },
      {
        id: 'selection-sort',
        name: 'Selection Sort',
        category: 'Sorting',
        code: `function selectionSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      let temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;
    }
  }
  return arr;
}

const result = selectionSort([64, 25, 12, 22, 11]);
console.log("Sorted:", result);`,
      },
    ],
  },
  {
    emoji: '🔍',
    name: 'Searching',
    presets: [
      {
        id: 'binary-search',
        name: 'Binary Search',
        category: 'Searching',
        code: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}

const index = binarySearch([1, 3, 5, 7, 9, 11, 13], 7);
console.log("Found at index:", index);`,
      },
      {
        id: 'linear-search',
        name: 'Linear Search',
        category: 'Searching',
        code: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;
    }
  }
  return -1;
}

const data = [4, 2, 7, 1, 9, 3];
const target = 7;
const index = linearSearch(data, target);
console.log("Found", target, "at index:", index);`,
      },
    ],
  },
  {
    emoji: '🗂️',
    name: 'Data Structures',
    presets: [
      {
        id: 'stack',
        name: 'Stack (push/pop)',
        category: 'Data Structures',
        code: `function createStack() {
  let items = [];

  function push(item) {
    items.push(item);
    console.log("Pushed:", item);
  }

  function pop() {
    let item = items.pop();
    console.log("Popped:", item);
    return item;
  }

  function peek() {
    return items[items.length - 1];
  }

  function size() {
    return items.length;
  }

  return { push, pop, peek, size };
}

const stack = createStack();
stack.push(10);
stack.push(20);
stack.push(30);
console.log("Top:", stack.peek());
stack.pop();
stack.pop();
console.log("Size:", stack.size());`,
      },
      {
        id: 'queue',
        name: 'Queue (enqueue/dequeue)',
        category: 'Data Structures',
        code: `function createQueue() {
  let items = [];

  function enqueue(item) {
    items.push(item);
    console.log("Enqueued:", item);
  }

  function dequeue() {
    let item = items.shift();
    console.log("Dequeued:", item);
    return item;
  }

  function front() {
    return items[0];
  }

  function size() {
    return items.length;
  }

  return { enqueue, dequeue, front, size };
}

const queue = createQueue();
queue.enqueue("A");
queue.enqueue("B");
queue.enqueue("C");
console.log("Front:", queue.front());
queue.dequeue();
queue.dequeue();
console.log("Size:", queue.size());`,
      },
      {
        id: 'linked-list',
        name: 'Linked List (traversal + insertion)',
        category: 'Data Structures',
        code: `function createNode(value) {
  return { value: value, next: null };
}

function insertAtEnd(head, value) {
  let newNode = createNode(value);
  if (!head) return newNode;
  let current = head;
  while (current.next) {
    current = current.next;
  }
  current.next = newNode;
  return head;
}

function traverse(head) {
  let current = head;
  let values = [];
  while (current) {
    values.push(current.value);
    current = current.next;
  }
  return values;
}

let head = null;
head = insertAtEnd(head, 10);
head = insertAtEnd(head, 20);
head = insertAtEnd(head, 30);
head = insertAtEnd(head, 40);
const list = traverse(head);
console.log("List:", list);`,
      },
      {
        id: 'binary-tree',
        name: 'Binary Tree (insertion + in-order)',
        category: 'Data Structures',
        code: `function createTreeNode(value) {
  return { value: value, left: null, right: null };
}

function insert(root, value) {
  if (!root) return createTreeNode(value);
  if (value < root.value) {
    root.left = insert(root.left, value);
  } else {
    root.right = insert(root.right, value);
  }
  return root;
}

function inOrder(node, result) {
  if (!node) return;
  inOrder(node.left, result);
  result.push(node.value);
  inOrder(node.right, result);
}

let root = null;
const values = [5, 3, 7, 1, 4, 6, 8];
for (let i = 0; i < values.length; i++) {
  root = insert(root, values[i]);
}

let sorted = [];
inOrder(root, sorted);
console.log("In-order:", sorted);`,
      },
    ],
  },
  {
    emoji: '🌐',
    name: 'Graph Algorithms',
    presets: [
      {
        id: 'bfs',
        name: 'BFS (Breadth-First Search)',
        category: 'Graph Algorithms',
        code: `function bfs(graph, start) {
  let visited = {};
  let queue = [start];
  let order = [];
  visited[start] = true;

  while (queue.length > 0) {
    let node = queue.shift();
    order.push(node);
    let neighbors = graph[node] || [];
    for (let i = 0; i < neighbors.length; i++) {
      if (!visited[neighbors[i]]) {
        visited[neighbors[i]] = true;
        queue.push(neighbors[i]);
      }
    }
  }
  return order;
}

const graph = {
  A: ["B", "C"],
  B: ["D", "E"],
  C: ["F"],
  D: [],
  E: ["F"],
  F: []
};

const result = bfs(graph, "A");
console.log("BFS order:", result);`,
      },
      {
        id: 'dfs',
        name: 'DFS (Depth-First Search)',
        category: 'Graph Algorithms',
        code: `function dfs(graph, node, visited, order) {
  if (visited[node]) return;
  visited[node] = true;
  order.push(node);
  let neighbors = graph[node] || [];
  for (let i = 0; i < neighbors.length; i++) {
    dfs(graph, neighbors[i], visited, order);
  }
}

const graph = {
  A: ["B", "C"],
  B: ["D", "E"],
  C: ["F"],
  D: [],
  E: ["F"],
  F: []
};

let visited = {};
let order = [];
dfs(graph, "A", visited, order);
console.log("DFS order:", order);`,
      },
    ],
  },
  {
    emoji: '⚡',
    name: 'Dynamic Programming',
    presets: [
      {
        id: 'fibonacci-memo',
        name: 'Fibonacci (memoized recursive)',
        category: 'Dynamic Programming',
        code: `function fibonacci(n, memo) {
  if (memo[n] !== undefined) return memo[n];
  if (n <= 1) return n;
  memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
  return memo[n];
}

let memo = {};
for (let i = 0; i <= 8; i++) {
  console.log("fib(" + i + ") =", fibonacci(i, memo));
}`,
      },
      {
        id: 'factorial-recursive',
        name: 'Factorial (recursive)',
        category: 'Dynamic Programming',
        code: `function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

for (let i = 1; i <= 8; i++) {
  console.log(i + "! =", factorial(i));
}`,
      },
    ],
  },
];

// Flat list of all presets for quick lookup
export const allDSAPresets: DSAPreset[] = dsaCategories.flatMap(c => c.presets);
