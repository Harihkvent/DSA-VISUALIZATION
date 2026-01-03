import React, { useEffect, useMemo, useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Moon, Sun, Info, Zap, BookOpen } from 'lucide-react';
import Footer from './components/Footer'; // adjust path as needed

/* ---------- parsers & generators (kept intact, safe guards kept) ---------- */

function parseNumberList(str) {
  if (!str || typeof str !== 'string') return [];
  return str
    .split(',')
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .map(Number)
    .filter(n => Number.isFinite(n));
}

function parseOps(str) {
  if (!str || typeof str !== 'string') return [];
  return str.split(',').map(tok => tok.trim()).filter(Boolean).map(tok => {
    const [a, b] = tok.split(':').map(s => s.trim());
    if (a.toLowerCase() === 'push') return { type: 'push', val: Number(b) };
    if (a.toLowerCase() === 'pop') return { type: 'pop' };
    if (a.toLowerCase() === 'enqueue') return { type: 'enqueue', val: Number(b) };
    if (a.toLowerCase() === 'dequeue') return { type: 'dequeue' };
    return null;
  }).filter(Boolean);
}

function parseAdjList(str) {
  if (!str || typeof str !== 'string') return null;
  str = str.trim();
  try {
    if (str.startsWith('[')) {
      const parsed = JSON.parse(str);
      if (Array.isArray(parsed)) return parsed.map(row => Array.isArray(row) ? row : []);
    }
  } catch (e) {}
  const parts = str.split(';').map(p => p.trim()).filter(Boolean);
  if (parts.length === 0) return null;
  const adj = [];
  for (const p of parts) {
    const [idx, rest] = p.split(':').map(s => s.trim());
    if (!idx) continue;
    const i = Number(idx);
    if (!Number.isFinite(i)) continue;
    const neis = rest ? rest.split(',').map(s => Number(s.trim())).filter(n => Number.isFinite(n)) : [];
    adj[i] = neis;
  }
  // normalize to full array
  const maxIndex = Math.max(-1, ...adj.map((v, i) => (v === undefined ? -1 : i)));
  const out = [];
  for (let i = 0; i <= maxIndex; i++) out[i] = Array.isArray(adj[i]) ? adj[i] : [];
  return out.length ? out : null;
}

/* ---------- Algorithm Metadata ---------- */

const algorithmInfo = {
  'Bubble': {
    description: 'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    example: '5,3,8,1,2',
    bestFor: 'Learning sorting basics, small datasets'
  },
  'Selection': {
    description: 'Divides input into sorted and unsorted regions, repeatedly selects the smallest element from unsorted region.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    example: '64,25,12,22,11',
    bestFor: 'Small datasets, minimal memory writes'
  },
  'Insertion': {
    description: 'Builds final sorted array one item at a time, inserting each element into its proper position.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    example: '12,11,13,5,6',
    bestFor: 'Nearly sorted data, online algorithms'
  },
  'Merge': {
    description: 'Divides array into halves, recursively sorts them, then merges the sorted halves.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    example: '38,27,43,3,9,82,10',
    bestFor: 'Large datasets, stable sorting, linked lists'
  },
  'Quick': {
    description: 'Picks a pivot element, partitions array around pivot, then recursively sorts partitions.',
    timeComplexity: 'O(n log n) avg, O(n²) worst',
    spaceComplexity: 'O(log n)',
    example: '10,7,8,9,1,5',
    bestFor: 'General purpose, in-place sorting'
  },
  'Linear': {
    description: 'Sequentially checks each element until target is found or list ends.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    example: '2,3,4,10,40',
    target: '10',
    bestFor: 'Unsorted data, small datasets'
  },
  'Binary': {
    description: 'Repeatedly divides sorted array in half, eliminating half of remaining elements each step.',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    example: '2,3,4,10,40',
    target: '10',
    bestFor: 'Sorted arrays, large datasets'
  },
  'Reverse Vowels': {
    description: 'Uses two pointers from both ends to swap vowels in a string.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    example: 'hello world',
    bestFor: 'String manipulation, two-pointer technique'
  },
  'Max Window Sum (k)': {
    description: 'Slides a fixed-size window through array to find subarray with maximum sum.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    example: '1,4,2,10,2,3,1,0,20',
    k: '3',
    bestFor: 'Subarray problems, optimization'
  },
  'Stack': {
    description: 'Last-In-First-Out (LIFO) data structure. Elements are added and removed from the same end.',
    timeComplexity: 'O(1) per operation',
    spaceComplexity: 'O(n)',
    example: 'push:1,push:2,push:3,pop,push:4',
    bestFor: 'Function calls, undo operations, expression evaluation'
  },
  'Queue': {
    description: 'First-In-First-Out (FIFO) data structure. Elements are added at rear and removed from front.',
    timeComplexity: 'O(1) per operation',
    spaceComplexity: 'O(n)',
    example: 'enqueue:1,enqueue:2,dequeue,enqueue:3',
    bestFor: 'Task scheduling, BFS, buffers'
  },
  'LinkedList Reverse': {
    description: 'Reverses the direction of pointers in a singly linked list.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    example: '1,2,3,4,5',
    bestFor: 'Pointer manipulation, in-place reversal'
  },
  'Heapify': {
    description: 'Converts an array into a max-heap data structure where parent nodes are greater than children.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    example: '4,10,3,5,1',
    bestFor: 'Priority queues, heap sort, top-k problems'
  },
  'BFS': {
    description: 'Explores graph level by level, visiting all neighbors before moving to next level.',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    example: '0:1,2;1:0,3;2:0;3:1',
    bestFor: 'Shortest path, level-order traversal'
  },
  'DFS': {
    description: 'Explores graph by going as deep as possible along each branch before backtracking.',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    example: '0:1,2;1:0,3;2:0;3:1',
    bestFor: 'Pathfinding, cycle detection, topological sort'
  },
  'Binary Tree Traversals': {
    description: 'Different ways to visit all nodes: Preorder (Root-Left-Right), Inorder (Left-Root-Right), Postorder (Left-Right-Root), Level-order (BFS).',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h) recursive, O(n) iterative',
    example: '1,2,3,4,5,6,7',
    bestFor: 'Tree processing, expression trees'
  },
  'Kadane (Max Subarray)': {
    description: 'Finds maximum sum of contiguous subarray using dynamic programming.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    example: '-2,1,-3,4,-1,2,1,-5,4',
    bestFor: 'Maximum subarray problems, DP introduction'
  },
  'Fibonacci DP': {
    description: 'Computes Fibonacci numbers using dynamic programming with memoization.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    example: '8',
    bestFor: 'Introduction to DP, optimization problems'
  }
};

/* ---------- step generators ---------- */

function genBubbleSort(a) {
  const arr = [...a];
  const steps = [{ arr: [...arr], meta: {}, description: 'Initial array' }];
  if (arr.length <= 1) return [...steps, { arr: [...arr], meta: { complete: true }, description: 'Sorted!' }];

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      steps.push({ arr: [...arr], meta: { comparing: [j, j + 1] }, description: `Compare arr[${j}] and arr[${j + 1}]` });
      if (arr[j] > arr[j + 1]) { [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]; steps.push({ arr: [...arr], meta: { swapped: [j, j + 1] }, description: `Swap ${j} and ${j + 1}` }); }
    }
    steps.push({ arr: [...arr], meta: { passEnd: arr.length - i - 1 }, description: `End of pass ${i + 1}` });
  }

  steps.push({ arr: [...arr], meta: { complete: true }, description: 'Sorted!' });
  return steps;
}

function genSelectionSort(a) {
  const arr = [...a];
  const steps = [{ arr: [...arr], meta: {}, description: 'Initial' }];
  for (let i = 0; i < arr.length; i++) {
    let min = i; steps.push({ arr: [...arr], meta: { i }, description: `Select index ${i}` });
    for (let j = i + 1; j < arr.length; j++) {
      steps.push({ arr: [...arr], meta: { comparing: [min, j] }, description: `Compare ${min} and ${j}` });
      if (arr[j] < arr[min]) { min = j; steps.push({ arr: [...arr], meta: { newMin: min }, description: `New min ${min}` }); }
    }
    if (min !== i) { [arr[i], arr[min]] = [arr[min], arr[i]]; steps.push({ arr: [...arr], meta: { swapped: [i, min] }, description: `Swap ${i} and ${min}` }); }
  }
  steps.push({ arr: [...arr], meta: { complete: true }, description: 'Sorted!' });
  return steps;
}

function genInsertionSort(a) {
  const arr = [...a]; const steps = [{ arr: [...arr], meta: {}, description: 'Initial' }];
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i]; let j = i - 1; steps.push({ arr: [...arr], meta: { keyIndex: i }, description: `Insert ${key}` });
    while (j >= 0 && arr[j] > key) { arr[j + 1] = arr[j]; steps.push({ arr: [...arr], meta: { shifting: [j, j + 1] }, description: `Shift ${j} to ${j + 1}` }); j--; }
    arr[j + 1] = key; steps.push({ arr: [...arr], meta: { placed: j + 1 }, description: `Placed at ${j + 1}` });
  }
  steps.push({ arr: [...arr], meta: { complete: true }, description: 'Sorted!' }); return steps;
}

function genMergeSort(a) {
  const arr = [...a]; const steps = [{ arr: [...arr], meta: {}, description: 'Initial' }];
  function mergeSortRange(l, r) {
    if (l >= r) return; const mid = Math.floor((l + r) / 2); mergeSortRange(l, mid); mergeSortRange(mid + 1, r);
    let i = l, j = mid + 1; const temp = [];
    while (i <= mid && j <= r) { steps.push({ arr: [...arr], meta: { comparing: [i, j] }, description: `Compare ${i} and ${j}` }); if (arr[i] <= arr[j]) temp.push(arr[i++]); else temp.push(arr[j++]); }
    while (i <= mid) temp.push(arr[i++]); while (j <= r) temp.push(arr[j++]);
    for (let k = l; k <= r; k++) { arr[k] = temp[k - l]; steps.push({ arr: [...arr], meta: { writing: k }, description: `Write ${k} = ${arr[k]}` }); }
  }
  if (arr.length > 1) mergeSortRange(0, arr.length - 1); steps.push({ arr: [...arr], meta: { complete: true }, description: 'Sorted!' }); return steps;
}

function genQuickSort(a) {
  const arr = [...a]; const steps = [{ arr: [...arr], meta: {}, description: 'Initial' }];
  function qs(l, r) { if (l >= r) return; const pivot = arr[r]; let i = l; steps.push({ arr: [...arr], meta: { pivotIndex: r }, description: `Pivot ${pivot}` });
    for (let j = l; j < r; j++) { steps.push({ arr: [...arr], meta: { comparing: [j, r] }, description: `Compare ${j}` }); if (arr[j] < pivot) { [arr[i], arr[j]] = [arr[j], arr[i]]; steps.push({ arr: [...arr], meta: { swapped: [i, j] }, description: `Swap ${i} and ${j}` }); i++; } }
    [arr[i], arr[r]] = [arr[r], arr[i]]; steps.push({ arr: [...arr], meta: { swapped: [i, r] }, description: `Pivot placed ${i}` }); qs(l, i - 1); qs(i + 1, r);
  }
  if (arr.length > 1) qs(0, arr.length - 1); steps.push({ arr: [...arr], meta: { complete: true }, description: 'Sorted!' }); return steps;
}

function genLinearSearch(a, target) { const arr = [...a]; const steps = [{ arr: [...arr], meta: {}, description: `Looking for ${target}` }]; for (let i = 0; i < arr.length; i++) { steps.push({ arr: [...arr], meta: { comparing: [i] }, description: `Check ${i}` }); if (arr[i] === target) { steps.push({ arr: [...arr], meta: { found: i }, description: `Found at ${i}` }); break; } } steps.push({ arr: [...arr], meta: { complete: true }, description: 'Done' }); return steps; }

function genBinarySearch(a, target) { const arr = [...a].slice().sort((x, y) => x - y); const steps = [{ arr: [...arr], meta: {}, description: `Sorted input` }]; let l = 0, r = arr.length - 1; while (l <= r) { const mid = Math.floor((l + r) / 2); steps.push({ arr: [...arr], meta: { mid, l, r }, description: `Check mid ${mid} (value ${arr[mid]})` }); if (arr[mid] === target) { steps.push({ arr: [...arr], meta: { found: mid }, description: `Found at ${mid}` }); break; } else if (arr[mid] < target) l = mid + 1; else r = mid - 1; } steps.push({ arr: [...arr], meta: { complete: true }, description: 'Done' }); return steps; }

function genReverseVowels(aStr) { const s = String(aStr).split(''); const vowels = 'aeiouAEIOU'; const steps = [{ arr: [...s], meta: {}, description: 'Initial string' }]; let l = 0, r = s.length - 1; while (l < r) { while (l < r && !vowels.includes(s[l])) { steps.push({ arr: [...s], meta: { left: l }, description: `Left ${l} not vowel` }); l++; } while (l < r && !vowels.includes(s[r])) { steps.push({ arr: [...s], meta: { right: r }, description: `Right ${r} not vowel` }); r--; } if (l < r) { steps.push({ arr: [...s], meta: { swapping: [l, r] }, description: `Swap ${l} and ${r}` }); [s[l], s[r]] = [s[r], s[l]]; steps.push({ arr: [...s], meta: { swapped: [l, r] }, description: `After swap` }); l++; r--; } } steps.push({ arr: [...s], meta: { complete: true }, description: 'Complete' }); return steps; }

function genMaxSubarrayWindow(a, k) { const arr = [...a]; const steps = [{ arr: [...arr], meta: {}, description: `Window size ${k}` }]; if (k <= 0 || k > arr.length) { steps.push({ arr: [...arr], meta: { complete: true }, description: 'Invalid window size' }); return steps; } let sum = 0; for (let i = 0; i < k; i++) sum += arr[i]; steps.push({ arr: [...arr], meta: { window: [0, k - 1], sum }, description: `Initial window sum = ${sum}` }); let max = sum, maxStart = 0; for (let i = k; i < arr.length; i++) { sum += arr[i] - arr[i - k]; const start = i - k + 1; steps.push({ arr: [...arr], meta: { window: [start, i], sum }, description: `Window [${start}, ${i}] sum=${sum}` }); if (sum > max) { max = sum; maxStart = start; steps.push({ arr: [...arr], meta: { best: [maxStart, maxStart + k - 1], max }, description: `New best window` }); } } steps.push({ arr: [...arr], meta: { complete: true, max, maxStart }, description: `Best sum ${max}` }); return steps; }

function genStackOps(ops) { const steps = []; const stack = []; steps.push({ arr: [...stack], meta: {}, description: 'Start stack (top on right)' }); for (const op of ops) { if (op.type === 'push') { stack.push(op.val); steps.push({ arr: [...stack], meta: { pushed: op.val }, description: `push ${op.val}` }); } else if (op.type === 'pop') { const val = stack.pop(); steps.push({ arr: [...stack], meta: { popped: val }, description: `pop -> ${val}` }); } } steps.push({ arr: [...stack], meta: { complete: true }, description: 'Done' }); return steps; }

function genQueueOps(ops) { const steps = []; const q = []; steps.push({ arr: [...q], meta: {}, description: 'Start queue (front on left)' }); for (const op of ops) { if (op.type === 'enqueue') { q.push(op.val); steps.push({ arr: [...q], meta: { enq: op.val }, description: `enqueue ${op.val}` }); } else if (op.type === 'dequeue') { const val = q.shift(); steps.push({ arr: [...q], meta: { deq: val }, description: `dequeue -> ${val}` }); } } steps.push({ arr: [...q], meta: { complete: true }, description: 'Done' }); return steps; }

function genLinkedListReverse(a) { const nodes = a.map((v, i) => ({ id: i, val: v, next: i + 1 < a.length ? i + 1 : null })); const steps = [{ nodes: JSON.parse(JSON.stringify(nodes)), meta: {}, description: 'Initial list' }]; let head = a.length > 0 ? 0 : null; let prev = null; while (head !== null) { const next = nodes[head].next; nodes[head].next = prev; steps.push({ nodes: JSON.parse(JSON.stringify(nodes)), meta: { reversing: head }, description: `Reverse link at node ${head}` }); prev = head; head = next; } steps.push({ nodes: JSON.parse(JSON.stringify(nodes)), meta: { head: prev, complete: true }, description: 'Reversed list' }); return steps; }

function genHeapify(a) { const arr = [...a]; const steps = [{ arr: [...arr], meta: {}, description: 'Initial array (heap view)' }]; function heapify(n, i) { let largest = i; const l = 2 * i + 1, r = 2 * i + 2; if (l < n) steps.push({ arr: [...arr], meta: { comparing: [i, l] }, description: `Compare ${i} and ${l}` }); if (r < n) steps.push({ arr: [...arr], meta: { comparing: [i, r] }, description: `Compare ${i} and ${r}` }); if (l < n && arr[l] > arr[largest]) largest = l; if (r < n && arr[r] > arr[largest]) largest = r; if (largest !== i) { [arr[i], arr[largest]] = [arr[largest], arr[i]]; steps.push({ arr: [...arr], meta: { swapped: [i, largest] }, description: `Swap ${i} and ${largest}` }); heapify(n, largest); } } for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) heapify(arr.length, i); steps.push({ arr: [...arr], meta: { complete: true }, description: 'Max-heap built' }); return steps; }

function genKadane(a) { const arr = [...a]; const steps = [{ arr: [...arr], meta: {}, description: 'Initial array' }]; let maxSoFar = -Infinity, cur = 0; for (let i = 0; i < arr.length; i++) { cur = Math.max(arr[i], cur + arr[i]); maxSoFar = Math.max(maxSoFar, cur); steps.push({ arr: [...arr], meta: { index: i, cur, maxSoFar }, description: `Index ${i}: cur=${cur}, max=${maxSoFar}` }); } steps.push({ arr: [...arr], meta: { complete: true, maxSoFar }, description: `Max subarray sum: ${maxSoFar}` }); return steps; }

function genFibDP(n) { const table = Array(n + 1).fill(null); const steps = [{ table: [...table], meta: {}, description: 'Start DP table' }]; table[0] = 0; if (n >= 1) table[1] = 1; steps.push({ table: [...table], meta: { set: [0, 1] }, description: 'Base cases' }); for (let i = 2; i <= n; i++) { table[i] = table[i - 1] + table[i - 2]; steps.push({ table: [...table], meta: { i, value: table[i] }, description: `Computed fib(${i}) = ${table[i]}` }); } steps.push({ table: [...table], meta: { complete: true }, description: 'DP table complete' }); return steps; }

function genGraphBFS(adj, start = 0) { const steps = [{ adj, meta: {}, description: 'Initial graph' }]; const visited = new Array(adj.length).fill(false); const q = [start]; visited[start] = true; steps.push({ adj, meta: { discovered: start }, description: `Start at ${start}` }); while (q.length) { const u = q.shift(); steps.push({ adj, meta: { visiting: u }, description: `Visit ${u}` }); for (const v of adj[u]) if (!visited[v]) { visited[v] = true; q.push(v); steps.push({ adj, meta: { discovered: v, from: u }, description: `Discovered ${v} from ${u}` }); } } steps.push({ adj, meta: { complete: true }, description: 'BFS done' }); return steps; }

function genGraphDFS(adj, start = 0) { const steps = [{ adj, meta: {}, description: 'Initial graph' }]; const visited = new Array(adj.length).fill(false); function dfs(u, parent = null) { visited[u] = true; steps.push({ adj, meta: { visiting: u, parent }, description: `Visit ${u}` }); for (const v of adj[u]) if (!visited[v]) dfs(v, u); } dfs(start); steps.push({ adj, meta: { complete: true }, description: 'DFS done' }); return steps; }

function genBinaryTreeTraversal(root) {
  const steps = [{ tree: root, meta: {}, description: 'Initial tree' }];
  const preorder = [];
  function pre(nodeId) { if (nodeId == null) return; preorder.push(nodeId); steps.push({ tree: root, meta: { visiting: nodeId, order: [...preorder] }, description: `Visit ${nodeId} (preorder)` }); pre(root[nodeId].left); pre(root[nodeId].right); }
  pre(0);
  steps.push({ tree: root, meta: { complete: true, preorder }, description: 'Preorder complete' });
  const inorder = [];
  function inord(nodeId) { if (nodeId == null) return; inord(root[nodeId].left); inorder.push(nodeId); steps.push({ tree: root, meta: { visiting: nodeId, order: [...inorder] }, description: `Visit ${nodeId} (inorder)` }); inord(root[nodeId].right); }
  inord(0);
  steps.push({ tree: root, meta: { inorder, complete: true }, description: 'Inorder complete' });
  const postorder = [];
  function post(nodeId) { if (nodeId == null) return; post(root[nodeId].left); post(root[nodeId].right); postorder.push(nodeId); steps.push({ tree: root, meta: { visiting: nodeId, order: [...postorder] }, description: `Visit ${nodeId} (postorder)` }); }
  post(0);
  steps.push({ tree: root, meta: { postorder, complete: true }, description: 'Postorder complete' });
  const q = [0]; const bfs = [];
  while (q.length) { const id = q.shift(); bfs.push(id); steps.push({ tree: root, meta: { visiting: id, bfs: [...bfs] }, description: `BFS visit ${id}` }); if (root[id].left != null) q.push(root[id].left); if (root[id].right != null) q.push(root[id].right); }
  steps.push({ tree: root, meta: { bfs, complete: true }, description: 'BFS complete' });
  return steps;
}

/* ---------- DSAVisualizer component ---------- */

export default function DSAVisualizer() {
  const concepts = useMemo(() => ({
    Sorting: ['Bubble', 'Selection', 'Insertion', 'Merge', 'Quick'],
    Searching: ['Linear', 'Binary'],
    'Two Pointers / Sliding Window': ['Reverse Vowels', 'Max Window Sum (k)'],
    'Data Structures': ['Stack', 'Queue', 'LinkedList Reverse', 'Heapify'],
    Graphs: ['BFS', 'DFS'],
    Trees: ['Binary Tree Traversals'],
    Algorithms: ['Kadane (Max Subarray)', 'Fibonacci DP']
  }), []);

  const [concept, setConcept] = useState(Object.keys(concepts)[0]);
  const [algorithm, setAlgorithm] = useState(concepts[Object.keys(concepts)[0]][0]);

  // inputs (no "hidden" defaults; user must provide input before Apply for most cases)
  const [inputArrayString, setInputArrayString] = useState('');
  const [inputArray, setInputArray] = useState([]);
  const [inputOpsString, setInputOpsString] = useState('');
  const [inputAdjString, setInputAdjString] = useState('');
  const [inputStr, setInputStr] = useState('');
  const [kWindow, setKWindow] = useState(3);
  const [target, setTarget] = useState('');
  const [fibN, setFibN] = useState(8);

  const [steps, setSteps] = useState([]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setAlgorithm(prev => concepts[concept].includes(prev) ? prev : concepts[concept][0]);
  }, [concept, concepts]);

  function handleApply() {
    const parsed = parseNumberList(inputArrayString);
    setInputArray(parsed);
    generateStepsFromInputs(parsed);
  }

  function loadExample() {
    const info = algorithmInfo[algorithm];
    if (!info) return;
    
    // Load example inputs based on algorithm
    if (info.example) setInputArrayString(info.example);
    if (info.target) setTarget(info.target);
    if (info.k) setKWindow(Number(info.k));
    
    // For string-based algorithms
    if (algorithm === 'Reverse Vowels') {
      setInputStr(info.example);
    }
    
    // For graph algorithms
    if (concept === 'Graphs') {
      setInputAdjString(info.example);
    }
    
    // For Fibonacci
    if (algorithm === 'Fibonacci DP') {
      setFibN(Number(info.example));
    }
  }

  function generateStepsFromInputs(arr = inputArray) {
    const ops = parseOps(inputOpsString);
    const adj = parseAdjList(inputAdjString);
    const tgt = target === '' ? null : Number(target);

    let s = [];
    try {
      if (concept === 'Sorting') {
        if (arr.length === 0) throw new Error('Provide a comma-separated list of numbers and click Apply.');
        switch (algorithm) {
          case 'Bubble': s = genBubbleSort(arr); break;
          case 'Selection': s = genSelectionSort(arr); break;
          case 'Insertion': s = genInsertionSort(arr); break;
          case 'Merge': s = genMergeSort(arr); break;
          case 'Quick': s = genQuickSort(arr); break;
          default: s = genBubbleSort(arr);
        }
      } else if (concept === 'Searching') {
        if (arr.length === 0) throw new Error('Provide input array.');
        if (tgt === null || !Number.isFinite(tgt)) throw new Error('Provide numeric target.');
        if (algorithm === 'Linear') s = genLinearSearch(arr, tgt); else s = genBinarySearch(arr, tgt);
      } else if (concept === 'Two Pointers / Sliding Window') {
        if (algorithm === 'Reverse Vowels') {
          if (!inputStr) throw new Error('Provide a string for Reverse Vowels.');
          s = genReverseVowels(inputStr);
        } else {
          if (arr.length === 0) throw new Error('Provide input array.');
          s = genMaxSubarrayWindow(arr, Number(kWindow));
        }
      } else if (concept === 'Data Structures') {
        if (algorithm === 'Stack') { if (ops.length === 0) throw new Error('Provide operations for Stack (e.g. push:1,push:2,pop).'); s = genStackOps(ops); }
        if (algorithm === 'Queue') { if (ops.length === 0) throw new Error('Provide operations for Queue (e.g. enqueue:1,enqueue:2,dequeue).'); s = genQueueOps(ops); }
        if (algorithm === 'LinkedList Reverse') { if (arr.length === 0) throw new Error('Provide input array to create list nodes.'); s = genLinkedListReverse(arr); }
        if (algorithm === 'Heapify') { if (arr.length === 0) throw new Error('Provide input array.'); s = genHeapify(arr); }
      } else if (concept === 'Graphs') {
        if (!adj) throw new Error('Provide adjacency list (format: 0:1,2;1:0) or JSON array.');
        s = algorithm === 'BFS' ? genGraphBFS(adj, 0) : genGraphDFS(adj, 0);
      } else if (concept === 'Trees') {
        if (arr.length === 0) throw new Error('Provide input array to build a complete binary tree.');
        const n = arr.length;
        const sampleTree = arr.map((v, i) => ({ id: i, val: v, left: 2 * i + 1 < n ? 2 * i + 1 : null, right: 2 * i + 2 < n ? 2 * i + 2 : null }));
        s = genBinaryTreeTraversal(sampleTree);
      } else if (concept === 'Algorithms') {
        if (algorithm === 'Kadane (Max Subarray)') { if (arr.length === 0) throw new Error('Provide input array.'); s = genKadane(arr); }
        if (algorithm === 'Fibonacci DP') { if (!Number.isFinite(Number(fibN)) || fibN < 0) throw new Error('Provide a non-negative integer n for Fibonacci DP.'); s = genFibDP(Number(fibN)); }
      }
    } catch (err) {
      s = [{ meta: {}, description: `Error: ${String(err.message || err)}` }];
    }

    setSteps(s);
    setIndex(0);
    setPlaying(false);
  }

  useEffect(() => {
    let t;
    if (playing && steps.length > 0 && index < steps.length - 1) {
      t = setTimeout(() => setIndex(i => Math.min(i + 1, steps.length - 1)), speed);
    } else if (index >= steps.length - 1) {
      setPlaying(false);
    }
    return () => clearTimeout(t);
  }, [playing, index, steps, speed]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (steps.length === 0) return;
      
      switch(e.key) {
        case ' ': // Space - Play/Pause
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowRight': // Right arrow - Next step
          e.preventDefault();
          stepForward();
          break;
        case 'ArrowLeft': // Left arrow - Previous step
          e.preventDefault();
          stepBack();
          break;
        case 'Escape': // Escape - Stop playing
          if (playing) setPlaying(false);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [steps, playing, index]);

  const cur = steps[index] || {};

  /* ---------- render helpers ---------- */

  const renderArray = (arr, meta = {}) => (
    <div className="flex flex-wrap justify-center gap-3">
      {(arr || []).map((v, i) => {
        const classes = [
          'w-14', 'h-14', 'flex', 'items-center', 'justify-center',
          'rounded-xl', 'font-bold', 'text-lg',
          'transition-all', 'duration-300', 'shadow-md', 'border-2'
        ];
        // Safe color palette: blue, green, white, gray
        if (meta && meta.window && i >= meta.window[0] && i <= meta.window[1]) {
          classes.push(darkMode ? 'bg-cyan-900/40 border-cyan-400 text-cyan-300 scale-105' : 'bg-blue-500 border-blue-700 text-white scale-105 shadow-blue-200');
        } else if (meta && meta.best && i >= meta.best[0] && i <= meta.best[1]) {
          classes.push(darkMode ? 'bg-emerald-900/40 border-emerald-400 text-emerald-300 scale-105' : 'bg-green-500 border-green-700 text-white scale-105 shadow-green-200');
        } else if (meta && meta.comparing && meta.comparing.includes(i)) {
          classes.push(darkMode ? 'bg-purple-900/40 border-purple-400 text-purple-300 scale-105' : 'bg-blue-400 border-blue-600 text-white scale-105 shadow-blue-200');
        } else if (meta && meta.shifting && meta.shifting.includes(i)) {
          classes.push(darkMode ? 'bg-yellow-900/40 border-yellow-400 text-yellow-300 scale-105' : 'bg-gray-400 border-gray-600 text-white scale-105 shadow-gray-200');
        } else if (meta && meta.swapped && meta.swapped.includes(i)) {
          classes.push(darkMode ? 'bg-amber-900/40 border-amber-400 text-amber-300 scale-105' : 'bg-blue-300 border-blue-500 text-white scale-105 shadow-blue-200');
        } else if (meta && meta.pivotIndex === i) {
          classes.push(darkMode ? 'bg-pink-900/40 border-pink-400 text-pink-300 scale-105' : 'bg-gray-500 border-gray-700 text-white scale-105 shadow-gray-200');
        } else if (meta && (meta.mid === i || (Array.isArray(meta.found) ? meta.found.includes(i) : meta.found === i))) {
          classes.push(darkMode ? 'bg-teal-900/40 border-teal-400 text-teal-300 scale-105' : 'bg-green-400 border-green-600 text-white scale-105 shadow-green-200');
        } else {
          classes.push(darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-gray-100 border-gray-300 text-gray-800');
        }
        return (<div key={i} className={classes.join(' ')}>{String(v)}</div>);
      })}
    </div>
  );

  const renderNodes = (nodes = [], meta = {}) => {
    // prefer to show linked-list order starting from head (meta.head) or compute head
    let order = [];
    if (meta && Number.isFinite(meta.head)) {
      let curId = meta.head;
      const seen = new Set();
      while (curId !== null && curId !== undefined && !seen.has(curId) && nodes[curId]) { order.push(nodes[curId]); seen.add(curId); curId = nodes[curId].next; }
    }
    if (order.length === 0) {
      // compute head as node that is not referenced by any next
      const referenced = new Set(nodes.map(n => n.next).filter(n => n !== null && n !== undefined));
      const headIdx = nodes.find(n => !referenced.has(n.id))?.id ?? null;
      if (headIdx !== null && headIdx !== undefined) {
        let curId = headIdx; const seen = new Set();
        while (curId !== null && curId !== undefined && !seen.has(curId) && nodes[curId]) { order.push(nodes[curId]); seen.add(curId); curId = nodes[curId].next; }
      } else order = nodes.slice();
    }

    return (
      <div className="flex gap-6 items-center justify-center flex-wrap">
        {order.map((n, idx) => (
          <div key={n.id} className="flex items-center gap-2">
            <div className={`px-4 py-3 rounded-xl border-2 font-semibold transition-all ${meta.reversing === n.id ? (darkMode ? 'bg-amber-900/40 border-amber-400 text-amber-300 shadow-lg' : 'bg-blue-400 border-blue-600 text-white shadow-lg shadow-blue-200') : (darkMode ? 'bg-gray-700 border-gray-600 text-gray-200 shadow-md' : 'bg-gray-100 border-gray-300 text-gray-800 shadow-md')}`}>{n.val}</div>
            <div className={`text-xl ${darkMode ? 'text-gray-500' : 'text-blue-400'}`}>→</div>
          </div>
        ))}
        <div className={`font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>null</div>
      </div>
    );
  };

  const renderTree = (tree = [], meta = {}) => (
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-3 flex-wrap justify-center">
        {(tree || []).map((n) => (
          <div key={n.id} className={`px-5 py-3 rounded-xl border-2 transition-all font-semibold ${meta.visiting === n.id ? (darkMode ? 'bg-purple-900/40 border-purple-400 text-purple-300 scale-105 shadow-lg' : 'bg-blue-400 border-blue-600 text-white scale-105 shadow-lg shadow-blue-200') : (darkMode ? 'bg-gray-700 border-gray-600 text-gray-200 shadow-md' : 'bg-gray-100 border-gray-300 text-gray-800 shadow-md')}`}>{n.val}</div>
        ))}
      </div>
      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>(Nodes shown left-to-right by id — traversal highlights visiting nodes)</div>
    </div>
  );

  const renderGraph = (adj = [], meta = {}) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {(adj || []).map((neis, i) => (
        <div key={i} className={`p-4 rounded-xl border-2 transition-all ${meta.visiting === i ? (darkMode ? 'bg-teal-900/40 border-teal-400 text-teal-300 shadow-lg' : 'bg-green-400 border-green-600 text-white shadow-lg shadow-green-200') : (darkMode ? 'bg-gray-700 border-gray-600 text-gray-200 shadow-md' : 'bg-gray-100 border-gray-300 text-gray-800 shadow-md')}`}>
          <div className="font-bold text-lg">{i}</div>
          <div className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>→ {Array.isArray(neis) ? neis.join(', ') : ''}</div>
        </div>
      ))}
    </div>
  );

  /* ---------- control handlers ---------- */

  function togglePlay() {
    if (steps.length === 0) return;
    setPlaying(p => !p);
  }

  function stepForward() {
    setIndex(i => Math.min(i + 1, Math.max(0, steps.length - 1)));
    setPlaying(false);
  }

  function stepBack() {
    setIndex(i => Math.max(0, i - 1));
    setPlaying(false);
  }

  function handleIndexChange(e) {
    const v = Number(e.target.value);
    if (!Number.isFinite(v)) return;
    setIndex(Math.max(0, Math.min(v, Math.max(0, steps.length - 1))));
    setPlaying(false);
  }

  function handleSpeedChange(e) {
    const v = Number(e.target.value);
    if (!Number.isFinite(v) || v <= 0) return;
    setSpeed(v);
  }

  function resetAll() {
    setSteps([]);
    setIndex(0);
    setPlaying(false);
    // keep inputs but clear parsed array
    setInputArray([]);
  }

  /* ---------- JSX ---------- */
  return (
    <div className={`min-h-screen w-full transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-gray-50'}`}>
      <div className="flex flex-col min-h-screen">
        <header className={`flex-none py-8 px-8 backdrop-blur-sm border-b shadow-sm transition-colors duration-300 ${darkMode ? 'bg-gray-800/80 border-gray-700/60' : 'bg-white/90 border-blue-200'}`}>
          <div className="max-w-full flex items-center justify-between">
            <div>
              <h1 className={`text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight ${darkMode ? 'bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent' : 'text-blue-900'}`}>DSA Visualizer</h1>
              <p className={`text-lg md:text-xl mt-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Interactive steps and visual explanations for common algorithms & data structures.</p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-3 rounded-xl transition-all duration-300 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-blue-400' : 'bg-blue-50 hover:bg-blue-100 text-blue-700'} shadow-md hover:shadow-lg`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full">
            <div className="md:col-span-5 flex flex-col h-full">
              <div className={`flex-1 rounded-2xl border p-6 shadow-lg h-full transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-blue-200 shadow-blue-50'}`}>
                <div className="flex flex-col h-full">
                  <div className="flex gap-3 mb-4">
                    <select value={concept} onChange={(e) => setConcept(e.target.value)} className={`flex-1 px-4 py-2.5 rounded-lg border outline-none transition-all font-medium ${darkMode ? 'bg-gray-700 text-gray-100 border-gray-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20' : 'bg-blue-50 text-gray-800 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'}`}>
                      {Object.keys(concepts).map((c) => (<option key={c} value={c}>{c}</option>))}
                    </select>
                    <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)} className={`w-44 px-4 py-2.5 rounded-lg border outline-none transition-all font-medium ${darkMode ? 'bg-gray-700 text-gray-100 border-gray-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20' : 'bg-blue-50 text-gray-800 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'}`}>
                      {concepts[concept].map((alg) => (<option key={alg} value={alg}>{alg}</option>))}
                    </select>
                  </div>

                  {/* Algorithm Info Section */}
                  {algorithmInfo[algorithm] && (
                    <div className={`mb-4 p-4 rounded-xl border-2 transition-all ${darkMode ? 'bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-blue-700/50' : 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-300'}`}>
                      <div className="flex items-start gap-2 mb-2">
                        <BookOpen size={18} className={darkMode ? 'text-cyan-400 mt-0.5' : 'text-blue-600 mt-0.5'} />
                        <div className="flex-1">
                          <h3 className={`font-bold text-sm mb-1 ${darkMode ? 'text-cyan-300' : 'text-blue-800'}`}>{algorithm}</h3>
                          <p className={`text-xs leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{algorithmInfo[algorithm].description}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        <div className={`flex items-center gap-1.5 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          <Zap size={14} className={darkMode ? 'text-yellow-400' : 'text-yellow-600'} />
                          <span className="font-medium">Time:</span>
                          <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${darkMode ? 'bg-gray-700 text-cyan-300' : 'bg-white text-blue-700'}`}>{algorithmInfo[algorithm].timeComplexity}</code>
                        </div>
                        <div className={`flex items-center gap-1.5 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          <Info size={14} className={darkMode ? 'text-green-400' : 'text-green-600'} />
                          <span className="font-medium">Space:</span>
                          <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${darkMode ? 'bg-gray-700 text-cyan-300' : 'bg-white text-blue-700'}`}>{algorithmInfo[algorithm].spaceComplexity}</code>
                        </div>
                      </div>
                      {algorithmInfo[algorithm].bestFor && (
                        <div className={`mt-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          <span className="font-semibold">Best for:</span> {algorithmInfo[algorithm].bestFor}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-4 mb-4">
                    {(concept === 'Sorting' || concept === 'Searching' || (concept === 'Data Structures' && ['Heapify', 'LinkedList Reverse'].includes(algorithm)) || (concept === 'Algorithms' && ['Kadane (Max Subarray)'].includes(algorithm)) || (concept === 'Trees') || (concept === 'Two Pointers / Sliding Window' && algorithm === 'Max Window Sum (k)')) && (
                      <div>
                        <label className={`block mb-2 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Input Array</label>
                        <input type="text" value={inputArrayString} onChange={(e) => setInputArrayString(e.target.value)} className={`w-full px-4 py-2.5 rounded-lg border outline-none transition-all ${darkMode ? 'bg-gray-700 text-gray-100 border-gray-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 placeholder-gray-500' : 'bg-blue-50 text-gray-800 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder-gray-500'}`} placeholder={concept === 'Searching' ? 'e.g. 2,3,4,10,40' : concept === 'Algorithms' ? 'e.g. -2,1,-3,4,-1,2,1' : concept === 'Trees' ? 'e.g. 1,2,3,4,5,6,7' : 'e.g. 5,3,8,1,2'} />
                      </div>
                    )}

                    {concept === 'Searching' && (
                      <div>
                        <label className={`block mb-2 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Target Value</label>
                        <input type="text" value={target} onChange={(e) => setTarget(e.target.value)} className={`w-full px-4 py-2.5 rounded-lg border outline-none transition-all ${darkMode ? 'bg-gray-700 text-gray-100 border-gray-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 placeholder-gray-500' : 'bg-blue-50 text-gray-800 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder-gray-500'}`} placeholder="e.g. 3" />
                      </div>
                    )}

                    {concept === 'Two Pointers / Sliding Window' && algorithm === 'Reverse Vowels' && (
                      <div>
                        <label className={`block mb-2 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Input String</label>
                        <input type="text" value={inputStr} onChange={(e) => setInputStr(e.target.value)} className={`w-full px-4 py-2.5 rounded-lg border outline-none transition-all ${darkMode ? 'bg-gray-700 text-gray-100 border-gray-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 placeholder-gray-500' : 'bg-blue-50 text-gray-800 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder-gray-500'}`} placeholder="e.g. hello world" />
                      </div>
                    )}

                    {concept === 'Two Pointers / Sliding Window' && algorithm === 'Max Window Sum (k)' && (
                      <div>
                        <label className={`block mb-2 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Window Size (k)</label>
                        <input type="number" value={kWindow} onChange={(e) => setKWindow(Number(e.target.value))} className={`w-full px-4 py-2.5 rounded-lg border outline-none transition-all ${darkMode ? 'bg-gray-700 text-gray-100 border-gray-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 placeholder-gray-500' : 'bg-blue-50 text-gray-800 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder-gray-500'}`} placeholder="e.g. 3" />
                      </div>
                    )}

                    {concept === 'Data Structures' && ['Stack', 'Queue'].includes(algorithm) && (
                      <div>
                        <label className={`block mb-2 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Operations ({algorithm})</label>
                        <input type="text" value={inputOpsString} onChange={(e) => setInputOpsString(e.target.value)} className={`w-full px-4 py-2.5 rounded-lg border outline-none transition-all ${darkMode ? 'bg-gray-700 text-gray-100 border-gray-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 placeholder-gray-500' : 'bg-blue-50 text-gray-800 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder-gray-500'}`} placeholder={algorithm === 'Stack' ? 'e.g. push:1,push:2,push:3,pop' : 'e.g. enqueue:1,enqueue:2,dequeue'} />
                        <p className={`text-xs mt-1.5 ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>Format: {algorithm === 'Stack' ? 'push:value, pop' : 'enqueue:value, dequeue'}</p>
                      </div>
                    )}

                    {concept === 'Graphs' && (
                      <div>
                        <label className={`block mb-2 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Adjacency List</label>
                        <input type="text" value={inputAdjString} onChange={(e) => setInputAdjString(e.target.value)} className={`w-full px-4 py-2.5 rounded-lg border outline-none transition-all ${darkMode ? 'bg-gray-700 text-gray-100 border-gray-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 placeholder-gray-500' : 'bg-blue-50 text-gray-800 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder-gray-500'}`} placeholder="e.g. 0:1,2;1:0,3;2:0;3:1" />
                        <p className={`text-xs mt-1.5 ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>Format: node:neighbor1,neighbor2;... or JSON: [[1,2],[0,3],[0],[1]]</p>
                      </div>
                    )}

                    {concept === 'Algorithms' && algorithm === 'Fibonacci DP' && (
                      <div>
                        <label className={`block mb-2 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>n for Fibonacci DP</label>
                        <input type="number" value={fibN} onChange={(e) => setFibN(Number(e.target.value))} className={`w-full px-4 py-2.5 rounded-lg border outline-none transition-all ${darkMode ? 'bg-gray-700 text-gray-100 border-gray-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 placeholder-gray-500' : 'bg-blue-50 text-gray-800 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder-gray-500'}`} placeholder="e.g. 8" />
                      </div>
                    )}
                  </div>

                  <div className="mt-auto flex gap-3 justify-center flex-wrap">
                    <button onClick={loadExample} className={`px-5 py-2.5 rounded-lg font-semibold border-2 transition-all flex items-center gap-2 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-cyan-300 border-cyan-700 hover:border-cyan-500' : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300 hover:border-blue-500'}`}>
                      <Info size={18} />
                      Load Example
                    </button>
                    <button onClick={handleApply} className={`px-6 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all ${darkMode ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white' : 'bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white'}`}>Apply</button>
                    <button onClick={resetAll} className={`px-6 py-2.5 rounded-lg font-semibold border-2 transition-all ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600' : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300 hover:border-gray-400'}`}>Reset</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-7 flex flex-col gap-4 h-full">
              <div className={`rounded-2xl border p-6 shadow-lg flex flex-col h-full transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-blue-200 shadow-blue-50'}`}>
                <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Visualization</h2>

                <div className="flex-1 w-full flex items-center justify-center mb-4 overflow-auto">
                  <div className="w-full">
                    {/* show readable error or no-step message if steps empty */}
                    {steps.length === 0 && (
                      <div className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>No visualization. Enter inputs and click <strong className={darkMode ? 'text-cyan-400' : 'text-blue-600'}>Apply</strong>.</div>
                    )}

                    {cur && cur.description && cur.description.startsWith('Error:') && (
                      <div className="text-center text-red-500 font-semibold">{cur.description}</div>
                    )}

                    {steps.length > 0 && !cur.description?.startsWith('Error:') && concept === 'Sorting' && renderArray(cur.arr, cur.meta)}
                    {steps.length > 0 && !cur.description?.startsWith('Error:') && concept === 'Searching' && renderArray(cur.arr, cur.meta)}
                    {steps.length > 0 && !cur.description?.startsWith('Error:') && concept === 'Two Pointers / Sliding Window' && algorithm === 'Reverse Vowels' && (
                      <div className="text-center text-2xl font-bold">
                        {(cur.arr || []).map((ch, i) => {
                          const classes = ['inline-block', 'px-3', 'py-2', 'm-1', 'rounded-lg', 'transition-all', 'duration-300', 'border-2'];
                          if (cur.meta && (cur.meta.left === i || cur.meta.right === i)) {
                            classes.push(darkMode ? 'bg-cyan-900/40 border-cyan-400 text-cyan-300 scale-105 shadow-md' : 'bg-blue-500 border-blue-700 text-white scale-105 shadow-md shadow-blue-200');
                          } else if (cur.meta && cur.meta.swapped && cur.meta.swapped.includes(i)) {
                            classes.push(darkMode ? 'bg-amber-900/40 border-amber-400 text-amber-300 scale-105 shadow-md' : 'bg-blue-300 border-blue-500 text-white scale-105 shadow-md shadow-blue-200');
                          } else {
                            classes.push(darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-gray-100 border-gray-300 text-gray-800');
                          }
                          return (<span key={i} className={classes.join(' ')}>{ch}</span>);
                        })}
                      </div>
                    )}
                    {steps.length > 0 && !cur.description?.startsWith('Error:') && concept === 'Two Pointers / Sliding Window' && algorithm === 'Max Window Sum (k)' && (
                      <div>
                        {renderArray(cur.arr, cur.meta)}
                        {cur.meta && cur.meta.sum !== undefined && (
                          <div className={`mt-4 text-center font-semibold text-lg ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                            Current Window Sum: <span className={darkMode ? 'text-cyan-400' : 'text-blue-600'}>{cur.meta.sum}</span>
                            {cur.meta.max !== undefined && (
                              <span> | Best Sum: <span className={darkMode ? 'text-green-400' : 'text-green-600'}>{cur.meta.max}</span></span>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    {steps.length > 0 && !cur.description?.startsWith('Error:') && concept === 'Data Structures' && algorithm !== 'LinkedList Reverse' && renderArray(cur.arr, cur.meta)}
                    {steps.length > 0 && !cur.description?.startsWith('Error:') && concept === 'Data Structures' && algorithm === 'LinkedList Reverse' && renderNodes(cur.nodes, cur.meta)}
                    {steps.length > 0 && !cur.description?.startsWith('Error:') && concept === 'Graphs' && renderGraph(cur.adj, cur.meta)}
                    {steps.length > 0 && !cur.description?.startsWith('Error:') && concept === 'Trees' && renderTree(cur.tree, cur.meta)}
                    {steps.length > 0 && !cur.description?.startsWith('Error:') && concept === 'Algorithms' && algorithm === 'Fibonacci DP' && (
                      <div className="text-center">
                        {(cur.table || []).map((v, i) => (
                          <div key={i} className={`inline-block w-16 h-12 m-1.5 flex items-center justify-center rounded-xl font-semibold shadow-sm border-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-gray-100 border-gray-300 text-gray-800'}`}>{String(v)}</div>
                        ))}
                      </div>
                    )}
                    {steps.length > 0 && !cur.description?.startsWith('Error:') && concept === 'Algorithms' && algorithm === 'Kadane (Max Subarray)' && (
                      <div>
                        {renderArray(cur.arr, cur.meta)}
                        {cur.meta && (cur.meta.cur !== undefined || cur.meta.maxSoFar !== undefined) && (
                          <div className={`mt-4 text-center font-semibold text-lg ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                            Current Sum: <span className={darkMode ? 'text-cyan-400' : 'text-blue-600'}>{cur.meta.cur ?? 0}</span> | 
                            Max Sum: <span className={darkMode ? 'text-green-400' : 'text-green-600'}>{cur.meta.maxSoFar ?? 0}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className={`w-full p-5 rounded-xl border shadow-md transition-colors duration-300 ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-blue-50 border-blue-200'}`}>
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <button onClick={stepBack} title="Previous step (or press left arrow)" className={`p-2.5 rounded-lg border-2 transition-all shadow-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600 hover:border-cyan-400' : 'bg-white border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-500'}`}><SkipBack size={20} /></button>
                    <button onClick={togglePlay} title={playing ? "Pause animation (or press space)" : "Play animation (or press space)"} className={`p-3 rounded-lg border-2 text-white transition-all shadow-md ${darkMode ? 'bg-gradient-to-r from-cyan-500 to-blue-600 border-cyan-600 hover:from-cyan-600 hover:to-blue-700' : 'bg-gradient-to-r from-blue-500 to-blue-700 border-blue-600 hover:from-blue-600 hover:to-blue-800'}`}>{playing ? <Pause size={20} /> : <Play size={20} />}</button>
                    <button onClick={stepForward} title="Next step (or press right arrow)" className={`p-2.5 rounded-lg border-2 transition-all shadow-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600 hover:border-cyan-400' : 'bg-white border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-500'}`}><SkipForward size={20} /></button>

                    <div className="ml-6 flex items-center gap-2">
                      <div className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Speed (ms)</div>
                      <input type="number" value={speed} onChange={handleSpeedChange} title="Animation speed in milliseconds" className={`w-24 px-3 py-1.5 rounded-lg border-2 outline-none transition-all ${darkMode ? 'bg-gray-700 text-gray-100 border-gray-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20' : 'bg-white text-gray-800 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'}`} />
                    </div>
                  </div>

                  <div>
                    <input
                      type="range"
                      min={0}
                      max={Math.max(0, (steps.length - 1))}
                      value={index}
                      onChange={handleIndexChange}
                      className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${darkMode ? 'bg-gray-600 accent-cyan-500' : 'bg-blue-200 accent-blue-500'}`}
                    />
                    <div className={`flex justify-between text-xs mt-1.5 font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <div>0</div>
                      <div>{steps.length > 0 ? steps.length - 1 : 0}</div>
                    </div>

                    <div className="mt-3 text-center">
                      <div className={`font-semibold text-base ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{cur.description || 'No step'}</div>
                      <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{`Step ${index} of ${Math.max(0, steps.length - 1)}`}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className={`border-2 p-5 rounded-xl shadow-md transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' : 'bg-gradient-to-br from-blue-50 to-gray-50 border-blue-200'}`}>
                    <h3 className={`font-bold text-lg mb-4 text-center ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Legend</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-400 border-2 border-blue-600 rounded-lg shadow-sm" />
                        <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Window / Pointer</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-pink-400 border-2 border-pink-600 rounded-lg shadow-sm" />
                        <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Pivot</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-400 border-2 border-orange-600 rounded-lg shadow-sm" />
                        <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Swapping</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-400 border-2 border-green-600 rounded-lg shadow-sm" />
                        <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Best / Result</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <div>
          <Footer darkMode={darkMode} />
        </div>
      </div>
    </div>
  );
}
