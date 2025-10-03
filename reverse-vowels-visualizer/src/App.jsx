import React, { useEffect, useMemo, useState } from 'react';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';

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
  if (!str) return [];
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
  if (!str) return null;
  str = str.trim();
  try {
    if (str.startsWith('[')) {
      const parsed = JSON.parse(str);
      if (Array.isArray(parsed)) return parsed.map(row => Array.isArray(row) ? row : []);
    }
  } catch (e) {}
  const parts = str.split(';').map(p => p.trim()).filter(Boolean);
  const adj = [];
  for (const p of parts) {
    const [idx, rest] = p.split(':').map(s => s.trim());
    if (!idx) continue;
    const i = Number(idx);
    const neis = rest ? rest.split(',').map(s => Number(s.trim())).filter(n => Number.isFinite(n)) : [];
    adj[i] = neis;
  }
  for (let i = 0; i < (adj.length || 0); i++) if (!Array.isArray(adj[i])) adj[i] = [];
  return adj.length ? adj : null;
}

/* ---------- step generators (unchanged from your original code) ---------- */

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

/* ---------- DSAVisualizer component (UI updates for centering/professional look) ---------- */

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

  const [inputArrayString, setInputArrayString] = useState('');
  const [inputArray, setInputArray] = useState([]);
  const [inputOpsString, setInputOpsString] = useState('');
  const [inputAdjString, setInputAdjString] = useState('');
  const [inputStr, setInputStr] = useState('');
  const [kWindow, setKWindow] = useState(3);
  const [target, setTarget] = useState('');

  const [steps, setSteps] = useState([]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);

  useEffect(() => {
    setAlgorithm(prev => concepts[concept].includes(prev) ? prev : concepts[concept][0]);
  }, [concept, concepts]);

  function handleApply() {
    const parsed = parseNumberList(inputArrayString);
    setInputArray(parsed);
    generateStepsFromInputs(parsed);
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
        if (algorithm === 'Stack') { const useOps = ops.length ? ops : [{type:'push',val:1},{type:'push',val:2},{type:'pop'}]; s = genStackOps(useOps); }
        if (algorithm === 'Queue') { const useOps = ops.length ? ops : [{type:'enqueue',val:1},{type:'enqueue',val:2},{type:'dequeue'}]; s = genQueueOps(useOps); }
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
        if (algorithm === 'Fibonacci DP') s = genFibDP(8);
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

  const cur = steps[index] || {};

  /* ---------- render helpers ---------- */

  const renderArray = (arr, meta = {}) => (
    <div className="flex flex-wrap justify-center gap-3">
      {(arr || []).map((v, i) => {
        const classes = [
          'w-14', 'h-14', 'flex', 'items-center', 'justify-center',
          'rounded-lg', 'font-bold', 'text-white', 'text-lg',
          'transition-transform', 'duration-200', 'shadow-md'
        ];
        if (meta && meta.comparing && meta.comparing.includes(i)) classes.push('bg-blue-500 scale-105');
        else if (meta && meta.swapped && meta.swapped.includes(i)) classes.push('bg-yellow-500 scale-105');
        else if (meta && meta.pivotIndex === i) classes.push('bg-purple-500 scale-105');
        else if (meta && meta.passEnd === i) classes.push('bg-green-600');
        else classes.push('bg-slate-700');
        return (<div key={i} className={classes.join(' ')}>{String(v)}</div>);
      })}
    </div>
  );

  const renderNodes = (nodes, meta = {}) => (
    <div className="flex gap-6 items-center justify-center flex-wrap">
      {(nodes || []).map((n) => (
        <div key={n.id} className="flex items-center gap-2">
          <div className={`px-3 py-2 rounded-md border font-medium transition-shadow ${meta.reversing === n.id ? 'bg-yellow-400 shadow-lg' : 'bg-slate-700 text-white shadow'}`}>{n.val}</div>
          <div className="text-white/60">→</div>
        </div>
      ))}
      <div className="text-white/80">null</div>
    </div>
  );

  const renderTree = (tree, meta = {}) => (
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-3 flex-wrap justify-center">
        {(tree || []).map((n) => (
          <div key={n.id} className={`px-4 py-2 rounded-md transition-transform ${meta.visiting === n.id ? 'bg-yellow-400 scale-105 shadow-lg' : 'bg-slate-700 text-white shadow'}`}>{n.val}</div>
        ))}
      </div>
      <div className="text-sm text-white/80">(Nodes shown left-to-right by id — traversal highlights visiting nodes)</div>
    </div>
  );

  const renderGraph = (adj, meta = {}) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {(adj || []).map((neis, i) => (
        <div key={i} className={`p-3 rounded-md transition-shadow ${meta.visiting === i ? 'bg-yellow-400 shadow-lg' : 'bg-slate-700 text-white shadow'}`}>
          <div className="font-bold">{i}</div>
          <div className="text-sm text-white/80">→ {Array.isArray(neis) ? neis.join(', ') : ''}</div>
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
  }

  /* ---------- JSX (centered, polished layout) ---------- */
  /* ---------- Replace your current `return(...)` with this block ---------- */
return (
  /* fixed inset-0 makes the app occupy the entire viewport */
  <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
    {/* top-level vertical layout: header + main */}
    <div className="flex flex-col h-full w-full">
      {/* Header — stays at the top; compact so the rest of screen is usable */}
      <header className="flex-none py-6 px-8 border-b border-white/8">
        <div className="max-w-full">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">DSA Visualizer</h1>
          <p className="text-sm text-white/70 mt-2">Interactive steps and visual explanations for common algorithms & data structures — now full-screen.</p>
        </div>
      </header>

      {/* Main content fills remaining height. Use overflow-auto so it scrolls when needed. */}
      <main className="flex-1 overflow-auto p-6">
        {/* Use a 12-column grid so we can allocate exact proportions:
            - left: 5/12 (~41.6%) for controls
            - right: 7/12 (~58.4%) for visualization & legend
         */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full">
          {/* LEFT column: Controls (spans 5/12 on md+) */}
          <div className="md:col-span-5 flex flex-col h-full">
            <div className="flex-1 bg-neutral-800/60 rounded-2xl border border-white/6 p-6 shadow-inner h-full">
              <div className="flex flex-col h-full">
                <div className="flex gap-3 mb-4">
                  <select value={concept} onChange={(e) => setConcept(e.target.value)} className="flex-1 px-4 py-2 rounded-lg bg-neutral-700 text-white border border-white/6">
                    {Object.keys(concepts).map((c) => (<option key={c} value={c}>{c}</option>))}
                  </select>
                  <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)} className="w-44 px-4 py-2 rounded-lg bg-neutral-700 text-white border border-white/6">
                    {concepts[concept].map((alg) => (<option key={alg} value={alg}>{alg}</option>))}
                  </select>
                </div>

                <div className="space-y-4 mb-4">
                  {(concept === 'Sorting' || concept === 'Searching' || (concept === 'Data Structures' && ['Heapify', 'LinkedList Reverse'].includes(algorithm)) || (concept === 'Algorithms' && ['Kadane (Max Subarray)'].includes(algorithm))) && (
                    <div>
                      <label className="block mb-1 text-sm font-medium text-white/80">Input Array</label>
                      <input type="text" value={inputArrayString} onChange={(e) => setInputArrayString(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-neutral-700 text-white border border-white/6" placeholder="e.g. 5,3,8,1,2" />
                    </div>
                  )}

                  {concept === 'Searching' && (
                    <div>
                      <label className="block mb-1 text-sm font-medium text-white/80">Target Value</label>
                      <input type="text" value={target} onChange={(e) => setTarget(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-neutral-700 text-white border border-white/6" placeholder="e.g. 3" />
                    </div>
                  )}

                  {concept === 'Two Pointers / Sliding Window' && algorithm === 'Reverse Vowels' && (
                    <div>
                      <label className="block mb-1 text-sm font-medium text-white/80">Input String</label>
                      <input type="text" value={inputStr} onChange={(e) => setInputStr(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-neutral-700 text-white border border-white/6" placeholder="e.g. hello world" />
                    </div>
                  )}

                  {concept === 'Two Pointers / Sliding Window' && algorithm === 'Max Window Sum (k)' && (
                    <div>
                      <label className="block mb-1 text-sm font-medium text-white/80">Window Size (k)</label>
                      <input type="number" value={kWindow} onChange={(e) => setKWindow(Number(e.target.value))} className="w-full px-4 py-2 rounded-lg bg-neutral-700 text-white border border-white/6" placeholder="e.g. 3" />
                    </div>
                  )}

                  {concept === 'Data Structures' && (
                    <div>
                      <label className="block mb-1 text-sm font-medium text-white/80">Operations (Stack/Queue)</label>
                      <input type="text" value={inputOpsString} onChange={(e) => setInputOpsString(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-neutral-700 text-white border border-white/6" placeholder="e.g. push:1,push:2,pop" />
                      <p className="text-xs text-white/60 mt-1">Format: push:value, pop, enqueue:value, dequeue</p>
                    </div>
                  )}

                  {concept === 'Graphs' && (
                    <div>
                      <label className="block mb-1 text-sm font-medium text-white/80">Adjacency List</label>
                      <input type="text" value={inputAdjString} onChange={(e) => setInputAdjString(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-neutral-700 text-white border border-white/6" placeholder="e.g. 0:1,2;1:0;2:0 or JSON" />
                      <p className="text-xs text-white/60 mt-1">Format: node:neighbor1,neighbor2;... or JSON array</p>
                    </div>
                  )}
                </div>

                <div className="mt-auto flex gap-3 justify-center">
                  <button onClick={handleApply} className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold">Apply</button>
                  <button onClick={resetAll} className="px-6 py-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 font-semibold border border-white/6">Reset</button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT column: Visualization + controls + legend (spans 7/12 on md+) */}
          <div className="md:col-span-7 flex flex-col gap-4 h-full">
            <div className="bg-neutral-800/50 rounded-2xl border border-white/6 p-6 shadow-inner flex flex-col h-full">
              <h2 className="text-xl font-semibold mb-4">Visualization</h2>

              <div className="flex-1 w-full flex items-center justify-center mb-4 overflow-auto">
                {/* Let visualization stretch — full width */}
                <div className="w-full">
                  {concept === 'Sorting' && renderArray(cur.arr, cur.meta)}
                  {concept === 'Searching' && renderArray(cur.arr, cur.meta)}
                  {concept === 'Two Pointers / Sliding Window' && algorithm === 'Reverse Vowels' && (
                    <div className="text-center text-2xl font-bold">
                      {(cur.arr || []).map((ch, i) => {
                        const classes = ['inline-block', 'px-3', 'py-1', 'm-0.5', 'rounded', 'transition-transform', 'duration-200'];
                        if (cur.meta && (cur.meta.left === i || cur.meta.right === i)) classes.push('bg-blue-400 text-white scale-105');
                        else if (cur.meta && cur.meta.swapped && cur.meta.swapped.includes(i)) classes.push('bg-yellow-400 text-black scale-105');
                        else classes.push('bg-slate-700 text-white');
                        return (<span key={i} className={classes.join(' ')}>{ch}</span>);
                      })}
                    </div>
                  )}
                  {concept === 'Two Pointers / Sliding Window' && algorithm === 'Max Window Sum (k)' && renderArray(cur.arr, cur.meta)}
                  {concept === 'Data Structures' && renderArray(cur.arr, cur.meta)}
                  {concept === 'Graphs' && renderGraph(cur.adj, cur.meta)}
                  {concept === 'Trees' && renderTree(cur.tree, cur.meta)}
                </div>
              </div>

              {/* Playback controls — centered and full width */}
              <div className="w-full bg-neutral-900/40 p-4 rounded-lg border border-white/6">
                <div className="flex items-center justify-center gap-4 mb-3">
                  <button onClick={stepBack} className="p-2 rounded-md bg-neutral-800 border border-white/8"><SkipBack size={18} /></button>
                  <button onClick={togglePlay} className="p-3 rounded-md bg-neutral-800 border border-white/8">{playing ? <Pause size={18} /> : <Play size={18} />}</button>
                  <button onClick={stepForward} className="p-2 rounded-md bg-neutral-800 border border-white/8"><SkipForward size={18} /></button>

                  <div className="ml-6 flex items-center gap-2">
                    <div className="text-sm text-white/70">Speed (ms)</div>
                    <input type="number" value={speed} onChange={handleSpeedChange} className="w-28 px-2 py-1 rounded-md bg-neutral-800 text-white border border-white/6" />
                  </div>
                </div>

                <div>
                  <input
                    type="range"
                    min={0}
                    max={Math.max(0, (steps.length - 1))}
                    value={index}
                    onChange={handleIndexChange}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-white/60 mt-1">
                    <div>0</div>
                    <div>{steps.length > 0 ? steps.length - 1 : 0}</div>
                  </div>

                  <div className="mt-2 text-center">
                    <div className="font-semibold">{cur.description || 'No step'}</div>
                    <div className="text-xs text-white/60 mt-1">{`Step ${index} of ${Math.max(0, steps.length - 1)}`}</div>
                  </div>
                </div>
              </div>

              {/* Legend at bottom of the right column (keeps compact but full-width) */}
              <div className="mt-4">
                <div className="bg-white/6 backdrop-blur-sm border border-white/10 p-4 rounded-xl shadow-lg">
                  <h3 className="font-semibold text-lg mb-3 text-center">Legend</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-400 rounded-md border border-white shadow-sm" />
                      <span className="text-white/90 text-sm">Left pointer scanning</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-400 rounded-md border border-white shadow-sm" />
                      <span className="text-white/90 text-sm">Right pointer scanning</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-yellow-400 rounded-md border border-white shadow-sm" />
                      <span className="text-white/90 text-sm">Swapping </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 rounded-md border border-white shadow-sm" />
                      <span className="text-white/90 text-sm">Final  position</span>
                    </div>
                  </div>
                </div>
              </div>
            </div> {/* end right card */}
          </div> {/* end right col */}
        </div> {/* end grid */}
      </main>
    </div>
  </div>
);
}