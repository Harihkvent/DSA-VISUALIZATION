import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Play, Pause, SkipForward, SkipBack, Moon, Sun, Info, Zap, BookOpen, Code, FileText, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import Footer from './components/Footer'; // adjust path as needed
import { codeExamples } from './codeExamples';
import { algorithmWalkthroughs } from './algorithmWalkthroughs';

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
  } catch {
    // JSON parsing failed, try string format
  }
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
  },
  // New Sorting Algorithms
  'Heap Sort': {
    description: 'Converts array into a max heap, then repeatedly extracts the maximum element.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(1)',
    example: '12,11,13,5,6,7',
    bestFor: 'Guaranteed O(n log n), in-place sorting'
  },
  'Counting Sort': {
    description: 'Integer sorting algorithm that counts occurrences of each value.',
    timeComplexity: 'O(n + k)',
    spaceComplexity: 'O(k)',
    example: '4,2,2,8,3,3,1',
    bestFor: 'Small range integers, stable sorting'
  },
  // Linked List Algorithms
  'Floyd Cycle Detection': {
    description: 'Detects if a linked list has a cycle using slow and fast pointers.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    example: '1,2,3,4,5',
    bestFor: 'Cycle detection, tortoise and hare algorithm'
  },
  // String Algorithms
  'Palindrome Check': {
    description: 'Checks if a string reads the same forwards and backwards.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    example: 'racecar',
    bestFor: 'String validation, pattern recognition'
  },
  'Anagram Check': {
    description: 'Checks if two strings are anagrams using frequency counting.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    example: 'listen,silent',
    bestFor: 'String comparison, frequency analysis'
  },
  'KMP Pattern Match': {
    description: 'Knuth-Morris-Pratt algorithm for efficient pattern matching.',
    timeComplexity: 'O(n + m)',
    spaceComplexity: 'O(m)',
    example: 'ababcababa,aba',
    bestFor: 'Fast substring search, pattern matching'
  },
  // Array Algorithms
  'Two Sum': {
    description: 'Finds two numbers in array that add up to target using hash map.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    example: '2,7,11,15',
    target: '9',
    bestFor: 'Array search, hash map problems'
  },
  'Prefix Sum': {
    description: 'Precomputes cumulative sums for efficient range queries.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    example: '1,2,3,4,5',
    bestFor: 'Range sum queries, subarray problems'
  },
  'Rotate Array': {
    description: 'Rotates array elements to the right by k positions.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    example: '1,2,3,4,5,6,7',
    k: '3',
    bestFor: 'Array manipulation, in-place operations'
  },
  // Dynamic Programming
  '0/1 Knapsack': {
    description: 'Maximizes value of items in knapsack with weight constraint.',
    timeComplexity: 'O(n × W)',
    spaceComplexity: 'O(n × W)',
    example: '60,100,120|10,20,30|50',
    bestFor: 'Optimization problems, resource allocation'
  },
  'LCS': {
    description: 'Longest Common Subsequence between two strings using DP.',
    timeComplexity: 'O(m × n)',
    spaceComplexity: 'O(m × n)',
    example: 'ABCDGH,AEDFHR',
    bestFor: 'String similarity, diff algorithms'
  },
  'LIS': {
    description: 'Longest Increasing Subsequence in array using DP.',
    timeComplexity: 'O(n²) or O(n log n)',
    spaceComplexity: 'O(n)',
    example: '10,9,2,5,3,7,101,18',
    bestFor: 'Subsequence problems, optimization'
  },
  'Coin Change': {
    description: 'Minimum coins needed to make amount using DP.',
    timeComplexity: 'O(n × amount)',
    spaceComplexity: 'O(amount)',
    example: '1,2,5|11',
    bestFor: 'Change making, minimum cost problems'
  },
  // Graph Algorithms
  'Dijkstra': {
    description: 'Finds shortest path from source to all vertices using priority queue.',
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
    example: '0:1:4,7:8;1:0:4,2:8,7:11;2:1:8,3:7,5:4,8:2;3:2:7,4:9,5:14;4:3:9,5:10;5:2:4,3:14,4:10,6:2;6:5:2,7:1,8:6;7:0:8,1:11,6:1,8:7;8:2:2,6:6,7:7',
    bestFor: 'Shortest path, weighted graphs'
  },
  'Topological Sort': {
    description: 'Linear ordering of vertices in directed acyclic graph.',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    example: '0:1,2;1:3;2:3;3:',
    bestFor: 'Task scheduling, dependency resolution'
  },
  'Graph Cycle Detection': {
    description: 'Detects if undirected graph contains a cycle using DFS.',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    example: '0:1,2;1:0,2;2:0,1',
    bestFor: 'Graph validation, deadlock detection'
  },
  // Greedy Algorithms
  'Activity Selection': {
    description: 'Selects maximum number of non-overlapping activities.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(1)',
    example: '1,3,0,5,8,5|2,4,6,7,9,9',
    bestFor: 'Scheduling, interval problems'
  },
  'Fractional Knapsack': {
    description: 'Maximizes value by taking fractional items (greedy approach).',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(1)',
    example: '60,100,120|10,20,30|50',
    bestFor: 'Greedy optimization, resource allocation'
  },
  // Bit Manipulation
  'Bit Operations': {
    description: 'Demonstrates AND, OR, XOR, NOT, and bit manipulation techniques.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    example: '5,3',
    bestFor: 'Low-level operations, optimization'
  },
  // Tree Algorithms
  'BST Insert': {
    description: 'Inserts elements into Binary Search Tree maintaining BST property.',
    timeComplexity: 'O(log n) avg, O(n) worst',
    spaceComplexity: 'O(n)',
    example: '50,30,70,20,40,60,80',
    bestFor: 'Ordered data, fast search/insert'
  },
  'LCA': {
    description: 'Finds Lowest Common Ancestor of two nodes in binary tree.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h)',
    example: '3,5,1,6,2,0,8,null,null,7,4',
    bestFor: 'Tree queries, ancestry problems'
  },
  // Recursion & Backtracking
  'N Queens': {
    description: 'Places N queens on N×N chessboard so none attack each other.',
    timeComplexity: 'O(N!)',
    spaceComplexity: 'O(N)',
    example: '4',
    bestFor: 'Backtracking, constraint satisfaction'
  },
  'Generate Permutations': {
    description: 'Generates all permutations of array using backtracking.',
    timeComplexity: 'O(n!)',
    spaceComplexity: 'O(n)',
    example: '1,2,3',
    bestFor: 'Combinatorics, backtracking practice'
  },
  // Advanced Data Structures
  'Trie Insert': {
    description: 'Inserts words into Trie (prefix tree) for fast prefix matching.',
    timeComplexity: 'O(m)',
    spaceComplexity: 'O(n × m)',
    example: 'cat,car,card,dog',
    bestFor: 'Autocomplete, dictionary, prefix search'
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

/* ---------- New Algorithm Generators ---------- */

function genHeapSort(a) {
  const arr = [...a];
  const steps = [{ arr: [...arr], meta: {}, description: 'Initial array' }];
  const n = arr.length;
  
  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapifyForSort(arr, n, i, steps);
  }
  steps.push({ arr: [...arr], meta: { heapBuilt: true }, description: 'Max heap built' });
  
  // Extract elements from heap
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    steps.push({ arr: [...arr], meta: { swapped: [0, i], sorted: i }, description: `Move max to position ${i}` });
    heapifyForSort(arr, i, 0, steps);
  }
  
  steps.push({ arr: [...arr], meta: { complete: true }, description: 'Sorted!' });
  return steps;
}

function heapifyForSort(arr, n, i, steps) {
  let largest = i;
  const l = 2 * i + 1;
  const r = 2 * i + 2;
  
  if (l < n && arr[l] > arr[largest]) largest = l;
  if (r < n && arr[r] > arr[largest]) largest = r;
  
  if (largest !== i) {
    steps.push({ arr: [...arr], meta: { comparing: [i, largest] }, description: `Heapify at ${i}` });
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    steps.push({ arr: [...arr], meta: { swapped: [i, largest] }, description: `Swap ${i} and ${largest}` });
    heapifyForSort(arr, n, largest, steps);
  }
}

function genCountingSort(a) {
  const arr = [...a];
  const steps = [{ arr: [...arr], meta: {}, description: 'Initial array' }];
  if (arr.length === 0) return steps;
  
  const max = Math.max(...arr);
  const min = Math.min(...arr);
  const range = max - min + 1;
  const count = new Array(range).fill(0);
  
  // Count occurrences
  for (let i = 0; i < arr.length; i++) {
    count[arr[i] - min]++;
    steps.push({ arr: [...arr], meta: { counting: i, count: [...count] }, description: `Count ${arr[i]}` });
  }
  
  // Build sorted array
  let idx = 0;
  for (let i = 0; i < range; i++) {
    while (count[i] > 0) {
      arr[idx] = i + min;
      steps.push({ arr: [...arr], meta: { placing: idx }, description: `Place ${i + min} at ${idx}` });
      idx++;
      count[i]--;
    }
  }
  
  steps.push({ arr: [...arr], meta: { complete: true }, description: 'Sorted!' });
  return steps;
}

function genFloydCycle(a) {
  const nodes = a.map((v, i) => ({ id: i, val: v, next: i + 1 < a.length ? i + 1 : null }));
  const steps = [{ nodes: JSON.parse(JSON.stringify(nodes)), meta: {}, description: 'Initial list' }];
  
  // For visualization, create a cycle at position 2 if length > 3
  if (nodes.length > 3) {
    nodes[nodes.length - 1].next = 2;
    steps.push({ nodes: JSON.parse(JSON.stringify(nodes)), meta: { cycleCreated: true }, description: 'Cycle created for demo' });
  }
  
  let slow = 0, fast = 0;
  let hasCycle = false;
  
  while (fast !== null && nodes[fast].next !== null) {
    slow = nodes[slow].next;
    fast = nodes[nodes[fast].next].next;
    steps.push({ nodes: JSON.parse(JSON.stringify(nodes)), meta: { slow, fast }, description: `Slow at ${slow}, Fast at ${fast}` });
    
    if (slow === fast && fast !== null) {
      hasCycle = true;
      steps.push({ nodes: JSON.parse(JSON.stringify(nodes)), meta: { cycleDetected: slow }, description: 'Cycle detected!' });
      break;
    }
  }
  
  if (!hasCycle) {
    steps.push({ nodes: JSON.parse(JSON.stringify(nodes)), meta: { complete: true }, description: 'No cycle found' });
  } else {
    steps.push({ nodes: JSON.parse(JSON.stringify(nodes)), meta: { complete: true, cycle: true }, description: 'Cycle exists!' });
  }
  
  return steps;
}

function genPalindromeCheck(str) {
  const s = String(str).toLowerCase().replace(/[^a-z0-9]/g, '');
  const arr = s.split('');
  const steps = [{ arr: [...arr], meta: {}, description: 'Check if palindrome' }];
  
  let l = 0, r = arr.length - 1;
  let isPalindrome = true;
  
  while (l < r) {
    steps.push({ arr: [...arr], meta: { comparing: [l, r] }, description: `Compare ${l} and ${r}` });
    
    if (arr[l] !== arr[r]) {
      isPalindrome = false;
      steps.push({ arr: [...arr], meta: { mismatch: [l, r] }, description: 'Not a palindrome!' });
      break;
    }
    l++;
    r--;
  }
  
  if (isPalindrome) {
    steps.push({ arr: [...arr], meta: { complete: true, isPalindrome: true }, description: 'Is a palindrome!' });
  } else {
    steps.push({ arr: [...arr], meta: { complete: true, isPalindrome: false }, description: 'Not a palindrome' });
  }
  
  return steps;
}

function genAnagramCheck(str) {
  const parts = String(str).split(',');
  if (parts.length !== 2) {
    return [{ meta: {}, description: 'Provide two strings separated by comma' }];
  }
  
  const s1 = parts[0].trim().toLowerCase().replace(/[^a-z]/g, '');
  const s2 = parts[1].trim().toLowerCase().replace(/[^a-z]/g, '');
  const arr1 = s1.split('');
  const arr2 = s2.split('');
  
  const steps = [{ arr: [...arr1], arr2: [...arr2], meta: {}, description: 'Check if anagrams' }];
  
  if (arr1.length !== arr2.length) {
    steps.push({ arr: [...arr1], arr2: [...arr2], meta: { complete: true, isAnagram: false }, description: 'Different lengths - not anagrams' });
    return steps;
  }
  
  const freq = {};
  for (let i = 0; i < arr1.length; i++) {
    freq[arr1[i]] = (freq[arr1[i]] || 0) + 1;
    steps.push({ arr: [...arr1], arr2: [...arr2], meta: { counting: i, freq: { ...freq } }, description: `Count '${arr1[i]}'` });
  }
  
  for (let i = 0; i < arr2.length; i++) {
    if (!freq[arr2[i]]) {
      steps.push({ arr: [...arr1], arr2: [...arr2], meta: { complete: true, isAnagram: false }, description: 'Not anagrams!' });
      return steps;
    }
    freq[arr2[i]]--;
    steps.push({ arr: [...arr1], arr2: [...arr2], meta: { checking: i, freq: { ...freq } }, description: `Check '${arr2[i]}'` });
  }
  
  steps.push({ arr: [...arr1], arr2: [...arr2], meta: { complete: true, isAnagram: true }, description: 'Are anagrams!' });
  return steps;
}

function genKMP(str) {
  const parts = String(str).split(',');
  if (parts.length !== 2) {
    return [{ meta: {}, description: 'Provide text,pattern separated by comma' }];
  }
  
  const text = parts[0].trim();
  const pattern = parts[1].trim();
  const arr = text.split('');
  const pat = pattern.split('');
  
  const steps = [{ arr: [...arr], pat: [...pat], meta: {}, description: 'KMP Pattern Matching' }];
  
  // Build LPS array
  const lps = new Array(pat.length).fill(0);
  let len = 0;
  let i = 1;
  
  while (i < pat.length) {
    if (pat[i] === pat[len]) {
      len++;
      lps[i] = len;
      i++;
    } else {
      if (len !== 0) len = lps[len - 1];
      else { lps[i] = 0; i++; }
    }
  }
  
  steps.push({ arr: [...arr], pat: [...pat], meta: { lps: [...lps] }, description: 'LPS array computed' });
  
  // Search pattern
  i = 0;
  let j = 0;
  while (i < arr.length) {
    steps.push({ arr: [...arr], pat: [...pat], meta: { textIndex: i, patIndex: j }, description: `Compare text[${i}] with pattern[${j}]` });
    
    if (arr[i] === pat[j]) {
      i++;
      j++;
    }
    
    if (j === pat.length) {
      steps.push({ arr: [...arr], pat: [...pat], meta: { found: i - j }, description: `Pattern found at index ${i - j}!` });
      j = lps[j - 1];
    } else if (i < arr.length && arr[i] !== pat[j]) {
      if (j !== 0) j = lps[j - 1];
      else i++;
    }
  }
  
  steps.push({ arr: [...arr], pat: [...pat], meta: { complete: true }, description: 'Search complete' });
  return steps;
}

function genTwoSum(a, target) {
  const arr = [...a];
  const tgt = Number(target);
  const steps = [{ arr: [...arr], meta: {}, description: `Find two numbers that sum to ${tgt}` }];
  const map = {};
  
  for (let i = 0; i < arr.length; i++) {
    const complement = tgt - arr[i];
    steps.push({ arr: [...arr], meta: { checking: i, complement, map: { ...map } }, description: `Check ${arr[i]}, need ${complement}` });
    
    if (map[complement] !== undefined) {
      steps.push({ arr: [...arr], meta: { found: [map[complement], i], complete: true }, description: `Found: ${arr[map[complement]]} + ${arr[i]} = ${tgt}` });
      return steps;
    }
    
    map[arr[i]] = i;
  }
  
  steps.push({ arr: [...arr], meta: { complete: true }, description: 'No solution found' });
  return steps;
}

function genPrefixSum(a) {
  const arr = [...a];
  const prefix = new Array(arr.length);
  const steps = [{ arr: [...arr], prefix: [], meta: {}, description: 'Build prefix sum array' }];
  
  prefix[0] = arr[0];
  steps.push({ arr: [...arr], prefix: [prefix[0]], meta: { index: 0 }, description: `prefix[0] = ${prefix[0]}` });
  
  for (let i = 1; i < arr.length; i++) {
    prefix[i] = prefix[i - 1] + arr[i];
    steps.push({ arr: [...arr], prefix: [...prefix.slice(0, i + 1)], meta: { index: i }, description: `prefix[${i}] = prefix[${i-1}] + arr[${i}] = ${prefix[i]}` });
  }
  
  steps.push({ arr: [...arr], prefix: [...prefix], meta: { complete: true }, description: 'Prefix sum complete' });
  return steps;
}

function genRotateArray(a, k) {
  const arr = [...a];
  k = k % arr.length;
  const steps = [{ arr: [...arr], meta: {}, description: `Rotate right by ${k}` }];
  
  // Reverse entire array
  reverse(arr, 0, arr.length - 1, steps, 'Reverse all');
  // Reverse first k
  reverse(arr, 0, k - 1, steps, 'Reverse first k');
  // Reverse remaining
  reverse(arr, k, arr.length - 1, steps, 'Reverse remaining');
  
  steps.push({ arr: [...arr], meta: { complete: true }, description: 'Rotation complete!' });
  return steps;
}

function reverse(arr, l, r, steps, desc) {
  while (l < r) {
    [arr[l], arr[r]] = [arr[r], arr[l]];
    steps.push({ arr: [...arr], meta: { swapped: [l, r] }, description: `${desc}: swap ${l} and ${r}` });
    l++;
    r--;
  }
}

function genKnapsack(str) {
  const parts = String(str).split('|');
  if (parts.length !== 3) {
    return [{ meta: {}, description: 'Format: values|weights|capacity (e.g., 60,100,120|10,20,30|50)' }];
  }
  
  const values = parts[0].split(',').map(Number);
  const weights = parts[1].split(',').map(Number);
  const capacity = Number(parts[2]);
  const n = values.length;
  
  const steps = [{ meta: { values, weights, capacity }, description: '0/1 Knapsack problem' }];
  const dp = Array(n + 1).fill(null).map(() => Array(capacity + 1).fill(0));
  
  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(values[i - 1] + dp[i - 1][w - weights[i - 1]], dp[i - 1][w]);
        steps.push({ dp: dp.map(row => [...row]), meta: { i, w, choice: 'include' }, description: `Item ${i-1}: Include or exclude?` });
      } else {
        dp[i][w] = dp[i - 1][w];
        steps.push({ dp: dp.map(row => [...row]), meta: { i, w, choice: 'exclude' }, description: `Item ${i-1}: Too heavy, exclude` });
      }
    }
  }
  
  steps.push({ dp: dp.map(row => [...row]), meta: { complete: true, maxValue: dp[n][capacity] }, description: `Max value: ${dp[n][capacity]}` });
  return steps;
}

function genLCS(str) {
  const parts = String(str).split(',');
  if (parts.length !== 2) {
    return [{ meta: {}, description: 'Provide two strings separated by comma' }];
  }
  
  const s1 = parts[0].trim();
  const s2 = parts[1].trim();
  const m = s1.length;
  const n = s2.length;
  
  const steps = [{ meta: { s1, s2 }, description: 'Longest Common Subsequence' }];
  const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        steps.push({ dp: dp.map(row => [...row]), meta: { i, j, match: true }, description: `Match: ${s1[i-1]}` });
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        steps.push({ dp: dp.map(row => [...row]), meta: { i, j, match: false }, description: `No match: take max` });
      }
    }
  }
  
  steps.push({ dp: dp.map(row => [...row]), meta: { complete: true, lcsLength: dp[m][n] }, description: `LCS length: ${dp[m][n]}` });
  return steps;
}

function genLIS(a) {
  const arr = [...a];
  const n = arr.length;
  const dp = new Array(n).fill(1);
  const steps = [{ arr: [...arr], dp: [...dp], meta: {}, description: 'Longest Increasing Subsequence' }];
  
  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (arr[j] < arr[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
        steps.push({ arr: [...arr], dp: [...dp], meta: { i, j }, description: `dp[${i}] updated to ${dp[i]}` });
      }
    }
  }
  
  const maxLIS = Math.max(...dp);
  steps.push({ arr: [...arr], dp: [...dp], meta: { complete: true, maxLIS }, description: `LIS length: ${maxLIS}` });
  return steps;
}

function genCoinChange(str) {
  const parts = String(str).split('|');
  if (parts.length !== 2) {
    return [{ meta: {}, description: 'Format: coins|amount (e.g., 1,2,5|11)' }];
  }
  
  const coins = parts[0].split(',').map(Number);
  const amount = Number(parts[1]);
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  
  const steps = [{ dp: [...dp], meta: { coins, amount }, description: 'Coin Change - Min coins' }];
  
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
        steps.push({ dp: [...dp.map(v => v === Infinity ? '∞' : v)], meta: { i, coin }, description: `Amount ${i}, using coin ${coin}` });
      }
    }
  }
  
  const result = dp[amount] === Infinity ? -1 : dp[amount];
  steps.push({ dp: [...dp.map(v => v === Infinity ? '∞' : v)], meta: { complete: true, result }, description: `Min coins: ${result}` });
  return steps;
}

function genDijkstra(adjStr) {
  // Parse weighted adjacency list: 0:1:4,2:8;1:0:4,2:8
  const adj = [];
  const parts = String(adjStr).split(';');
  
  for (const part of parts) {
    const [from, ...rest] = part.split(':');
    const fromNode = Number(from);
    adj[fromNode] = [];
    
    for (let i = 0; i < rest.length; i += 2) {
      if (i + 1 < rest.length) {
        adj[fromNode].push({ to: Number(rest[i]), weight: Number(rest[i + 1]) });
      }
    }
  }
  
  const n = adj.length;
  const dist = new Array(n).fill(Infinity);
  const visited = new Array(n).fill(false);
  dist[0] = 0;
  
  const steps = [{ adj, dist: [...dist], visited: [...visited], meta: {}, description: 'Dijkstra shortest path' }];
  
  for (let i = 0; i < n; i++) {
    let u = -1;
    for (let j = 0; j < n; j++) {
      if (!visited[j] && (u === -1 || dist[j] < dist[u])) u = j;
    }
    
    if (dist[u] === Infinity) break;
    visited[u] = true;
    steps.push({ adj, dist: [...dist], visited: [...visited], meta: { visiting: u }, description: `Visit node ${u}, dist=${dist[u]}` });
    
    for (const { to, weight } of adj[u] || []) {
      if (dist[u] + weight < dist[to]) {
        dist[to] = dist[u] + weight;
        steps.push({ adj, dist: [...dist], visited: [...visited], meta: { updating: to, from: u }, description: `Update dist[${to}] = ${dist[to]}` });
      }
    }
  }
  
  steps.push({ adj, dist: [...dist], visited: [...visited], meta: { complete: true }, description: 'Shortest paths found' });
  return steps;
}

function genTopologicalSort(adj) {
  const n = adj.length;
  const visited = new Array(n).fill(false);
  const stack = [];
  const steps = [{ adj, meta: {}, description: 'Topological Sort (DFS)' }];
  
  function dfs(u) {
    visited[u] = true;
    steps.push({ adj, meta: { visiting: u, stack: [...stack] }, description: `Visit ${u}` });
    
    for (const v of adj[u]) {
      if (!visited[v]) dfs(v);
    }
    
    stack.push(u);
    steps.push({ adj, meta: { pushed: u, stack: [...stack] }, description: `Push ${u} to stack` });
  }
  
  for (let i = 0; i < n; i++) {
    if (!visited[i]) dfs(i);
  }
  
  stack.reverse();
  steps.push({ adj, meta: { complete: true, order: [...stack] }, description: `Topological order: ${stack.join(' → ')}` });
  return steps;
}

function genCycleDetection(adj) {
  const n = adj.length;
  const visited = new Array(n).fill(false);
  const recStack = new Array(n).fill(false);
  const steps = [{ adj, meta: {}, description: 'Graph Cycle Detection' }];
  
  function dfs(u) {
    visited[u] = true;
    recStack[u] = true;
    steps.push({ adj, meta: { visiting: u, recStack: [...recStack] }, description: `Visit ${u}` });
    
    for (const v of adj[u]) {
      if (!visited[v]) {
        if (dfs(v)) return true;
      } else if (recStack[v]) {
        steps.push({ adj, meta: { cycleFound: [u, v] }, description: `Cycle detected: ${u} → ${v}!` });
        return true;
      }
    }
    
    recStack[u] = false;
    return false;
  }
  
  for (let i = 0; i < n; i++) {
    if (!visited[i]) {
      if (dfs(i)) {
        steps.push({ adj, meta: { complete: true, hasCycle: true }, description: 'Graph has cycle!' });
        return steps;
      }
    }
  }
  
  steps.push({ adj, meta: { complete: true, hasCycle: false }, description: 'No cycle found' });
  return steps;
}

function genActivitySelection(str) {
  const parts = String(str).split('|');
  if (parts.length !== 2) {
    return [{ meta: {}, description: 'Format: starts|ends (e.g., 1,3,0,5,8,5|2,4,6,7,9,9)' }];
  }
  
  const starts = parts[0].split(',').map(Number);
  const ends = parts[1].split(',').map(Number);
  const activities = starts.map((s, i) => ({ start: s, end: ends[i], id: i }));
  
  activities.sort((a, b) => a.end - b.end);
  const steps = [{ activities, meta: {}, description: 'Sort by end time' }];
  
  const selected = [activities[0]];
  steps.push({ activities, selected: [...selected], meta: { selecting: 0 }, description: `Select activity 0` });
  
  let last = 0;
  for (let i = 1; i < activities.length; i++) {
    steps.push({ activities, selected: [...selected], meta: { considering: i }, description: `Consider activity ${i}` });
    
    if (activities[i].start >= activities[last].end) {
      selected.push(activities[i]);
      last = i;
      steps.push({ activities, selected: [...selected], meta: { selecting: i }, description: `Select activity ${i}` });
    }
  }
  
  steps.push({ activities, selected: [...selected], meta: { complete: true }, description: `Selected ${selected.length} activities` });
  return steps;
}

function genFractionalKnapsack(str) {
  const parts = String(str).split('|');
  if (parts.length !== 3) {
    return [{ meta: {}, description: 'Format: values|weights|capacity (e.g., 60,100,120|10,20,30|50)' }];
  }
  
  const values = parts[0].split(',').map(Number);
  const weights = parts[1].split(',').map(Number);
  const capacity = Number(parts[2]);
  
  const items = values.map((v, i) => ({ value: v, weight: weights[i], ratio: v / weights[i], id: i }));
  items.sort((a, b) => b.ratio - a.ratio);
  
  const steps = [{ items, meta: { capacity }, description: 'Sort by value/weight ratio' }];
  
  let totalValue = 0;
  let remaining = capacity;
  const taken = [];
  
  for (let i = 0; i < items.length; i++) {
    if (remaining === 0) break;
    
    const take = Math.min(items[i].weight, remaining);
    const fraction = take / items[i].weight;
    totalValue += items[i].value * fraction;
    remaining -= take;
    taken.push({ ...items[i], fraction, value: items[i].value * fraction });
    
    steps.push({ items, taken: [...taken], meta: { i, totalValue, remaining }, description: `Take ${fraction.toFixed(2)} of item ${i}` });
  }
  
  steps.push({ items, taken: [...taken], meta: { complete: true, totalValue }, description: `Total value: ${totalValue.toFixed(2)}` });
  return steps;
}

function genBitOps(str) {
  const nums = String(str).split(',').map(Number);
  if (nums.length < 2) {
    return [{ meta: {}, description: 'Provide two numbers (e.g., 5,3)' }];
  }
  
  const a = nums[0];
  const b = nums[1];
  const steps = [{ meta: { a, b }, description: `Bit operations on ${a} and ${b}` }];
  
  const and = a & b;
  steps.push({ meta: { a, b, result: and, op: 'AND' }, description: `${a} AND ${b} = ${and} (${and.toString(2)})` });
  
  const or = a | b;
  steps.push({ meta: { a, b, result: or, op: 'OR' }, description: `${a} OR ${b} = ${or} (${or.toString(2)})` });
  
  const xor = a ^ b;
  steps.push({ meta: { a, b, result: xor, op: 'XOR' }, description: `${a} XOR ${b} = ${xor} (${xor.toString(2)})` });
  
  const notA = ~a;
  steps.push({ meta: { a, result: notA, op: 'NOT' }, description: `NOT ${a} = ${notA} (${(notA >>> 0).toString(2)})` });
  
  const leftShift = a << 1;
  steps.push({ meta: { a, result: leftShift, op: 'LEFT_SHIFT' }, description: `${a} << 1 = ${leftShift} (${leftShift.toString(2)})` });
  
  const rightShift = a >> 1;
  steps.push({ meta: { a, result: rightShift, op: 'RIGHT_SHIFT' }, description: `${a} >> 1 = ${rightShift} (${rightShift.toString(2)})` });
  
  steps.push({ meta: { complete: true }, description: 'Bit operations complete' });
  return steps;
}

function genBSTInsert(a) {
  const arr = [...a];
  const steps = [{ meta: { values: arr }, description: 'Build Binary Search Tree' }];
  
  let root = null;
  const nodes = [];
  
  for (let i = 0; i < arr.length; i++) {
    const val = arr[i];
    steps.push({ tree: JSON.parse(JSON.stringify(nodes)), meta: { inserting: val }, description: `Insert ${val}` });
    
    if (root === null) {
      root = 0;
      nodes.push({ id: 0, val, left: null, right: null });
    } else {
      let curr = root;
      let parent = null;
      let isLeft = false;
      
      while (curr !== null) {
        parent = curr;
        if (val < nodes[curr].val) {
          curr = nodes[curr].left;
          isLeft = true;
        } else {
          curr = nodes[curr].right;
          isLeft = false;
        }
      }
      
      const newId = nodes.length;
      nodes.push({ id: newId, val, left: null, right: null });
      
      if (isLeft) nodes[parent].left = newId;
      else nodes[parent].right = newId;
    }
    
    steps.push({ tree: JSON.parse(JSON.stringify(nodes)), meta: { inserted: val }, description: `${val} inserted` });
  }
  
  steps.push({ tree: JSON.parse(JSON.stringify(nodes)), meta: { complete: true }, description: 'BST complete' });
  return steps;
}

function genNQueens(n) {
  n = Number(n);
  if (n < 1 || n > 8) n = 4;
  
  const steps = [{ meta: { n, board: [] }, description: `${n}-Queens Problem` }];
  const board = Array(n).fill(null).map(() => Array(n).fill('.'));
  const solutions = [];
  
  function isSafe(row, col) {
    for (let i = 0; i < row; i++) {
      if (board[i][col] === 'Q') return false;
    }
    for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
      if (board[i][j] === 'Q') return false;
    }
    for (let i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
      if (board[i][j] === 'Q') return false;
    }
    return true;
  }
  
  function solve(row) {
    if (row === n) {
      solutions.push(board.map(r => [...r]));
      steps.push({ meta: { n, board: board.map(r => [...r]), solution: true }, description: `Solution ${solutions.length} found!` });
      return true; // Return first solution for visualization
    }
    
    for (let col = 0; col < n; col++) {
      steps.push({ meta: { n, board: board.map(r => [...r]), trying: [row, col] }, description: `Try queen at (${row}, ${col})` });
      
      if (isSafe(row, col)) {
        board[row][col] = 'Q';
        steps.push({ meta: { n, board: board.map(r => [...r]), placed: [row, col] }, description: `Place queen at (${row}, ${col})` });
        
        if (solve(row + 1)) return true;
        
        board[row][col] = '.';
        steps.push({ meta: { n, board: board.map(r => [...r]), backtrack: [row, col] }, description: `Backtrack from (${row}, ${col})` });
      }
    }
    return false;
  }
  
  solve(0);
  steps.push({ meta: { n, board: board.map(r => [...r]), complete: true, solutions: solutions.length }, description: `Found ${solutions.length} solution(s)` });
  return steps;
}

function genPermutations(a) {
  const arr = [...a];
  const steps = [{ meta: { arr }, description: 'Generate permutations' }];
  const result = [];
  
  function permute(current, remaining) {
    if (remaining.length === 0) {
      result.push([...current]);
      steps.push({ meta: { current: [...current], result: result.map(r => [...r]) }, description: `Found: [${current.join(', ')}]` });
      return;
    }
    
    for (let i = 0; i < remaining.length; i++) {
      const newCurrent = [...current, remaining[i]];
      const newRemaining = remaining.filter((_, idx) => idx !== i);
      steps.push({ meta: { current: [...newCurrent], exploring: remaining[i] }, description: `Add ${remaining[i]}` });
      permute(newCurrent, newRemaining);
      steps.push({ meta: { current: [...current], backtrack: remaining[i] }, description: `Backtrack from ${remaining[i]}` });
    }
  }
  
  permute([], arr);
  steps.push({ meta: { complete: true, result: result.map(r => [...r]), total: result.length }, description: `Total: ${result.length} permutations` });
  return steps;
}

function genTrieInsert(str) {
  const words = String(str).split(',').map(w => w.trim());
  const steps = [{ meta: { words }, description: 'Build Trie (Prefix Tree)' }];
  
  const trie = { children: {}, isEnd: false };
  
  for (const word of words) {
    let node = trie;
    steps.push({ trie: JSON.parse(JSON.stringify(trie)), meta: { inserting: word }, description: `Insert "${word}"` });
    
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      if (!node.children[char]) {
        node.children[char] = { children: {}, isEnd: false };
      }
      node = node.children[char];
      steps.push({ trie: JSON.parse(JSON.stringify(trie)), meta: { inserting: word, at: i, char }, description: `Add '${char}' (${i + 1}/${word.length})` });
    }
    
    node.isEnd = true;
    steps.push({ trie: JSON.parse(JSON.stringify(trie)), meta: { inserted: word }, description: `"${word}" complete` });
  }
  
  steps.push({ trie: JSON.parse(JSON.stringify(trie)), meta: { complete: true }, description: `Trie with ${words.length} words` });
  return steps;
}

/* ---------- DSAVisualizer component ---------- */

export default function DSAVisualizer() {
  const concepts = useMemo(() => ({
    Sorting: ['Bubble', 'Selection', 'Insertion', 'Merge', 'Quick', 'Heap Sort', 'Counting Sort'],
    Searching: ['Linear', 'Binary', 'Two Sum'],
    'Two Pointers / Sliding Window': ['Reverse Vowels', 'Max Window Sum (k)'],
    'Arrays': ['Prefix Sum', 'Rotate Array'],
    'Strings': ['Palindrome Check', 'Anagram Check', 'KMP Pattern Match'],
    'Linked List': ['LinkedList Reverse', 'Floyd Cycle Detection'],
    'Data Structures': ['Stack', 'Queue', 'Heapify', 'Trie Insert'],
    'Bit Manipulation': ['Bit Operations'],
    Graphs: ['BFS', 'DFS', 'Dijkstra', 'Topological Sort', 'Graph Cycle Detection'],
    Trees: ['Binary Tree Traversals', 'BST Insert', 'LCA'],
    'Dynamic Programming': ['Fibonacci DP', 'Kadane (Max Subarray)', '0/1 Knapsack', 'LCS', 'LIS', 'Coin Change'],
    'Greedy Algorithms': ['Activity Selection', 'Fractional Knapsack'],
    'Backtracking': ['N Queens', 'Generate Permutations']
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
  
  // Tab and sidebar state
  const [activeTab, setActiveTab] = useState('visualization'); // 'explanation', 'code', 'visualization'
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('cpp'); // 'cpp', 'java', 'python'

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
    if (algorithm === 'Reverse Vowels' || concept === 'Strings' || algorithm === 'Trie Insert') {
      setInputStr(info.example);
    }
    
    // For Stack and Queue operations
    if (algorithm === 'Stack' || algorithm === 'Queue') {
      setInputOpsString(info.example);
    }
    
    // For graph algorithms
    if (concept === 'Graphs') {
      setInputAdjString(info.example);
    }
    
    // For Fibonacci and N-Queens
    if (algorithm === 'Fibonacci DP' || algorithm === 'N Queens') {
      setFibN(Number(info.example));
    }
    
    // For algorithms that need special string format (DP, Greedy)
    if (algorithm === '0/1 Knapsack' || algorithm === 'LCS' || algorithm === 'Coin Change' || 
        algorithm === 'Activity Selection' || algorithm === 'Fractional Knapsack' || 
        algorithm === 'KMP Pattern Match' || algorithm === 'Anagram Check') {
      setInputStr(info.example);
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
          case 'Heap Sort': s = genHeapSort(arr); break;
          case 'Counting Sort': s = genCountingSort(arr); break;
          default: s = genBubbleSort(arr);
        }
      } else if (concept === 'Searching') {
        if (arr.length === 0) throw new Error('Provide input array.');
        if (algorithm === 'Two Sum') {
          if (tgt === null || !Number.isFinite(tgt)) throw new Error('Provide numeric target.');
          s = genTwoSum(arr, tgt);
        } else {
          if (tgt === null || !Number.isFinite(tgt)) throw new Error('Provide numeric target.');
          if (algorithm === 'Linear') s = genLinearSearch(arr, tgt); 
          else s = genBinarySearch(arr, tgt);
        }
      } else if (concept === 'Two Pointers / Sliding Window') {
        if (algorithm === 'Reverse Vowels') {
          if (!inputStr) throw new Error('Provide a string for Reverse Vowels.');
          s = genReverseVowels(inputStr);
        } else {
          if (arr.length === 0) throw new Error('Provide input array.');
          s = genMaxSubarrayWindow(arr, Number(kWindow));
        }
      } else if (concept === 'Arrays') {
        if (arr.length === 0) throw new Error('Provide input array.');
        if (algorithm === 'Prefix Sum') s = genPrefixSum(arr);
        else if (algorithm === 'Rotate Array') s = genRotateArray(arr, Number(kWindow));
      } else if (concept === 'Strings') {
        if (algorithm === 'Palindrome Check') {
          if (!inputStr) throw new Error('Provide a string.');
          s = genPalindromeCheck(inputStr);
        } else if (algorithm === 'Anagram Check') {
          if (!inputStr) throw new Error('Provide two strings separated by comma.');
          s = genAnagramCheck(inputStr);
        } else if (algorithm === 'KMP Pattern Match') {
          if (!inputStr) throw new Error('Provide text,pattern separated by comma.');
          s = genKMP(inputStr);
        }
      } else if (concept === 'Linked List') {
        if (arr.length === 0) throw new Error('Provide input array to create list nodes.');
        if (algorithm === 'LinkedList Reverse') s = genLinkedListReverse(arr);
        else if (algorithm === 'Floyd Cycle Detection') s = genFloydCycle(arr);
      } else if (concept === 'Data Structures') {
        if (algorithm === 'Stack') { 
          if (ops.length === 0) throw new Error('Provide operations for Stack (e.g. push:1,push:2,pop).'); 
          s = genStackOps(ops); 
        } else if (algorithm === 'Queue') { 
          if (ops.length === 0) throw new Error('Provide operations for Queue (e.g. enqueue:1,enqueue:2,dequeue).'); 
          s = genQueueOps(ops); 
        } else if (algorithm === 'Heapify') { 
          if (arr.length === 0) throw new Error('Provide input array.'); 
          s = genHeapify(arr); 
        } else if (algorithm === 'Trie Insert') {
          if (!inputStr) throw new Error('Provide comma-separated words.');
          s = genTrieInsert(inputStr);
        }
      } else if (concept === 'Bit Manipulation') {
        if (arr.length < 2) throw new Error('Provide two numbers.');
        s = genBitOps(inputArrayString);
      } else if (concept === 'Graphs') {
        if (!adj) throw new Error('Provide adjacency list (format: 0:1,2;1:0) or JSON array.');
        if (algorithm === 'BFS') s = genGraphBFS(adj, 0);
        else if (algorithm === 'DFS') s = genGraphDFS(adj, 0);
        else if (algorithm === 'Dijkstra') s = genDijkstra(inputAdjString);
        else if (algorithm === 'Topological Sort') s = genTopologicalSort(adj);
        else if (algorithm === 'Graph Cycle Detection') s = genCycleDetection(adj);
      } else if (concept === 'Trees') {
        if (algorithm === 'Binary Tree Traversals') {
          if (arr.length === 0) throw new Error('Provide input array to build a complete binary tree.');
          const n = arr.length;
          const sampleTree = arr.map((v, i) => ({ id: i, val: v, left: 2 * i + 1 < n ? 2 * i + 1 : null, right: 2 * i + 2 < n ? 2 * i + 2 : null }));
          s = genBinaryTreeTraversal(sampleTree);
        } else if (algorithm === 'BST Insert') {
          if (arr.length === 0) throw new Error('Provide input array.');
          s = genBSTInsert(arr);
        } else if (algorithm === 'LCA') {
          if (arr.length === 0) throw new Error('Provide input array.');
          const n = arr.length;
          const sampleTree = arr.map((v, i) => ({ id: i, val: v, left: 2 * i + 1 < n ? 2 * i + 1 : null, right: 2 * i + 2 < n ? 2 * i + 2 : null }));
          s = genBinaryTreeTraversal(sampleTree); // Reuse for now
        }
      } else if (concept === 'Dynamic Programming') {
        if (algorithm === 'Fibonacci DP') {
          if (!Number.isFinite(Number(fibN)) || fibN < 0) throw new Error('Provide a non-negative integer n for Fibonacci DP.');
          s = genFibDP(Number(fibN));
        } else if (algorithm === 'Kadane (Max Subarray)') {
          if (arr.length === 0) throw new Error('Provide input array.');
          s = genKadane(arr);
        } else if (algorithm === '0/1 Knapsack') {
          if (!inputStr) throw new Error('Provide format: values|weights|capacity');
          s = genKnapsack(inputStr);
        } else if (algorithm === 'LCS') {
          if (!inputStr) throw new Error('Provide two strings separated by comma.');
          s = genLCS(inputStr);
        } else if (algorithm === 'LIS') {
          if (arr.length === 0) throw new Error('Provide input array.');
          s = genLIS(arr);
        } else if (algorithm === 'Coin Change') {
          if (!inputStr) throw new Error('Provide format: coins|amount');
          s = genCoinChange(inputStr);
        }
      } else if (concept === 'Greedy Algorithms') {
        if (algorithm === 'Activity Selection') {
          if (!inputStr) throw new Error('Provide format: starts|ends');
          s = genActivitySelection(inputStr);
        } else if (algorithm === 'Fractional Knapsack') {
          if (!inputStr) throw new Error('Provide format: values|weights|capacity');
          s = genFractionalKnapsack(inputStr);
        }
      } else if (concept === 'Backtracking') {
        if (algorithm === 'N Queens') {
          const n = Number(fibN) || 4;
          s = genNQueens(n);
        } else if (algorithm === 'Generate Permutations') {
          if (arr.length === 0) throw new Error('Provide input array.');
          s = genPermutations(arr);
        }
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
        {order.map((n) => (
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

  const togglePlay = useCallback(() => {
    if (steps.length === 0) return;
    setPlaying(p => !p);
  }, [steps.length]);

  const stepForward = useCallback(() => {
    setIndex(i => Math.min(i + 1, Math.max(0, steps.length - 1)));
    setPlaying(false);
  }, [steps.length]);

  const stepBack = useCallback(() => {
    setIndex(i => Math.max(0, i - 1));
    setPlaying(false);
  }, []);

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
  }, [steps.length, playing, togglePlay, stepForward, stepBack]);

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
    <div className={`min-h-screen w-full transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex flex-col min-h-screen">
        {/* Modern Compact Header */}
        <header className={`flex-none py-3 px-4 md:px-6 border-b backdrop-blur-md transition-colors duration-300 ${darkMode ? 'bg-gray-800/95 border-gray-700/50 shadow-lg shadow-black/5' : 'bg-white/95 border-gray-200 shadow-sm'}`}>
          <div className="max-w-full flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${darkMode ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white' : 'bg-gradient-to-br from-blue-600 to-cyan-600 text-white'} shadow-lg`}>
                DSA
              </div>
              <div>
                <h1 className={`text-xl md:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>DSA Visualizer</h1>
                <p className={`text-xs md:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Master algorithms through visualization</p>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-all duration-200 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-3 md:p-4">
          <div className="flex gap-3 md:gap-4 h-full">
            {/* Collapsible Sidebar - More Compact */}
            <div className={`transition-all duration-300 flex-shrink-0 ${sidebarCollapsed ? 'w-0' : 'w-full md:w-80 lg:w-96'} overflow-hidden`}>
              <div className={`flex flex-col h-full ${sidebarCollapsed ? 'hidden' : 'block'}`}>
                <div className={`flex-1 rounded-xl border p-4 shadow-xl h-full transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700/50' : 'bg-white border-gray-200'}`}>
                <div className="flex flex-col h-full">
                  <div className="flex gap-2 mb-3">
                    <select value={concept} onChange={(e) => setConcept(e.target.value)} className={`flex-1 px-3 py-2 text-sm rounded-lg border outline-none transition-all font-medium ${darkMode ? 'bg-gray-700 text-gray-100 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' : 'bg-gray-50 text-gray-800 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'}`}>
                      {Object.keys(concepts).map((c) => (<option key={c} value={c}>{c}</option>))}
                    </select>
                    <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)} className={`flex-1 px-3 py-2 text-sm rounded-lg border outline-none transition-all font-medium ${darkMode ? 'bg-gray-700 text-gray-100 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' : 'bg-gray-50 text-gray-800 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'}`}>
                      {concepts[concept].map((alg) => (<option key={alg} value={alg}>{alg}</option>))}
                    </select>
                  </div>

                  {/* Compact Algorithm Info */}
                  {algorithmInfo[algorithm] && (
                    <div className={`mb-3 p-3 rounded-lg border transition-all ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="flex items-start gap-2 mb-2">
                        <BookOpen size={16} className={darkMode ? 'text-blue-400 mt-0.5' : 'text-blue-600 mt-0.5'} />
                        <div className="flex-1">
                          <h3 className={`font-bold text-sm mb-1 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{algorithm}</h3>
                          <p className={`text-xs leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{algorithmInfo[algorithm].description}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className={`flex items-center gap-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          <Zap size={12} className={darkMode ? 'text-yellow-400' : 'text-orange-500'} />
                          <span className="font-medium">Time:</span>
                          <code className={`px-1.5 py-0.5 rounded font-mono ${darkMode ? 'bg-gray-800 text-blue-300' : 'bg-white text-blue-700 border border-gray-200'}`}>{algorithmInfo[algorithm].timeComplexity}</code>
                        </div>
                        <div className={`flex items-center gap-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          <Info size={12} className={darkMode ? 'text-green-400' : 'text-green-600'} />
                          <span className="font-medium">Space:</span>
                          <code className={`px-1.5 py-0.5 rounded font-mono ${darkMode ? 'bg-gray-800 text-blue-300' : 'bg-white text-blue-700 border border-gray-200'}`}>{algorithmInfo[algorithm].spaceComplexity}</code>
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
                    {(concept === 'Sorting' || concept === 'Searching' || concept === 'Arrays' || concept === 'Linked List' || 
                      (concept === 'Data Structures' && ['Heapify'].includes(algorithm)) || 
                      (concept === 'Dynamic Programming' && ['Kadane (Max Subarray)', 'LIS'].includes(algorithm)) || 
                      (concept === 'Trees') || 
                      (concept === 'Two Pointers / Sliding Window' && algorithm === 'Max Window Sum (k)') ||
                      (concept === 'Backtracking' && algorithm === 'Generate Permutations')) && (
                      <div>
                        <label className={`block mb-2 text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Input Array</label>
                        <input type="text" value={inputArrayString} onChange={(e) => setInputArrayString(e.target.value)} className={`w-full px-3 py-2 rounded-lg border outline-none transition-all ${darkMode ? 'bg-gray-700 text-gray-100 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder-gray-400' : 'bg-gray-50 text-gray-800 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder-gray-400'}`} placeholder={concept === 'Searching' ? 'e.g. 2,3,4,10,40' : concept === 'Dynamic Programming' ? 'e.g. -2,1,-3,4,-1,2,1' : concept === 'Trees' ? 'e.g. 1,2,3,4,5,6,7' : concept === 'Linked List' ? 'e.g. 1,2,3,4,5' : 'e.g. 5,3,8,1,2'} />
                      </div>
                    )}

                    {concept === 'Searching' && (
                      <div>
                        <label className={`block mb-2 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Target Value</label>
                        <input type="text" value={target} onChange={(e) => setTarget(e.target.value)} className={`w-full px-3 py-2 rounded-lg border outline-none transition-all ${darkMode ? 'bg-gray-700 text-gray-100 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder-gray-400' : 'bg-gray-50 text-gray-800 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder-gray-400'}`} placeholder="e.g. 3" />
                      </div>
                    )}

                    {(concept === 'Strings' || concept === 'Dynamic Programming' && ['LCS', '0/1 Knapsack', 'Coin Change'].includes(algorithm) || 
                      concept === 'Greedy Algorithms' || concept === 'Data Structures' && algorithm === 'Trie Insert' ||
                      concept === 'Two Pointers / Sliding Window' && algorithm === 'Reverse Vowels') && (
                      <div>
                        <label className={`block mb-2 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                          {algorithm === 'Palindrome Check' ? 'Input String' : 
                           algorithm === 'Anagram Check' ? 'Two Strings (comma separated)' :
                           algorithm === 'KMP Pattern Match' ? 'Text,Pattern (comma separated)' :
                           algorithm === 'LCS' ? 'Two Strings (comma separated)' :
                           algorithm === '0/1 Knapsack' ? 'Values|Weights|Capacity' :
                           algorithm === 'Coin Change' ? 'Coins|Amount' :
                           algorithm === 'Activity Selection' ? 'Start Times|End Times' :
                           algorithm === 'Fractional Knapsack' ? 'Values|Weights|Capacity' :
                           algorithm === 'Trie Insert' ? 'Words (comma separated)' :
                           'Input String'}
                        </label>
                        <input type="text" value={inputStr} onChange={(e) => setInputStr(e.target.value)} className={`w-full px-3 py-2 rounded-lg border outline-none transition-all ${darkMode ? 'bg-gray-700 text-gray-100 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder-gray-400' : 'bg-gray-50 text-gray-800 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder-gray-400'}`} placeholder={
                          algorithm === 'Palindrome Check' ? 'e.g. racecar' :
                          algorithm === 'Anagram Check' ? 'e.g. listen,silent' :
                          algorithm === 'KMP Pattern Match' ? 'e.g. ababcababa,aba' :
                          algorithm === 'LCS' ? 'e.g. ABCDGH,AEDFHR' :
                          algorithm === '0/1 Knapsack' ? 'e.g. 60,100,120|10,20,30|50' :
                          algorithm === 'Coin Change' ? 'e.g. 1,2,5|11' :
                          algorithm === 'Activity Selection' ? 'e.g. 1,3,0,5|2,4,6,7' :
                          algorithm === 'Fractional Knapsack' ? 'e.g. 60,100,120|10,20,30|50' :
                          algorithm === 'Trie Insert' ? 'e.g. cat,car,card,dog' :
                          'e.g. hello world'
                        } />
                        {(algorithm === '0/1 Knapsack' || algorithm === 'Coin Change' || algorithm === 'Activity Selection' || algorithm === 'Fractional Knapsack') && (
                          <p className={`text-xs mt-1.5 ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                            {algorithm === '0/1 Knapsack' || algorithm === 'Fractional Knapsack' ? 'Format: values|weights|capacity' :
                             algorithm === 'Coin Change' ? 'Format: coins|amount' :
                             'Format: start_times|end_times'}
                          </p>
                        )}
                      </div>
                    )}

                    {((concept === 'Two Pointers / Sliding Window' && algorithm === 'Max Window Sum (k)') || 
                      (concept === 'Arrays' && algorithm === 'Rotate Array')) && (
                      <div>
                        <label className={`block mb-2 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                          {algorithm === 'Rotate Array' ? 'Rotation Count (k)' : 'Window Size (k)'}
                        </label>
                        <input type="number" value={kWindow} onChange={(e) => setKWindow(Number(e.target.value))} className={`w-full px-3 py-2 rounded-lg border outline-none transition-all ${darkMode ? 'bg-gray-700 text-gray-100 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder-gray-400' : 'bg-gray-50 text-gray-800 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder-gray-400'}`} placeholder="e.g. 3" />
                      </div>
                    )}

                    {concept === 'Data Structures' && ['Stack', 'Queue'].includes(algorithm) && (
                      <div>
                        <label className={`block mb-2 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Operations ({algorithm})</label>
                        <input type="text" value={inputOpsString} onChange={(e) => setInputOpsString(e.target.value)} className={`w-full px-3 py-2 rounded-lg border outline-none transition-all ${darkMode ? 'bg-gray-700 text-gray-100 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder-gray-400' : 'bg-gray-50 text-gray-800 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder-gray-400'}`} placeholder={algorithm === 'Stack' ? 'e.g. push:1,push:2,push:3,pop' : 'e.g. enqueue:1,enqueue:2,dequeue'} />
                        <p className={`text-xs mt-1.5 ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>Format: {algorithm === 'Stack' ? 'push:value, pop' : 'enqueue:value, dequeue'}</p>
                      </div>
                    )}

                    {concept === 'Graphs' && (
                      <div>
                        <label className={`block mb-2 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Adjacency List</label>
                        <input type="text" value={inputAdjString} onChange={(e) => setInputAdjString(e.target.value)} className={`w-full px-3 py-2 rounded-lg border outline-none transition-all ${darkMode ? 'bg-gray-700 text-gray-100 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder-gray-400' : 'bg-gray-50 text-gray-800 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder-gray-400'}`} placeholder={algorithm === 'Dijkstra' ? 'e.g. 0:1:4,2:8;1:0:4,2:8;2:0:8,1:8' : 'e.g. 0:1,2;1:0,3;2:0;3:1'} />
                        <p className={`text-xs mt-1.5 ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                          {algorithm === 'Dijkstra' ? 'Format: from:to:weight;...' : 'Format: node:neighbor1,neighbor2;... or JSON: [[1,2],[0,3],[0],[1]]'}
                        </p>
                      </div>
                    )}

                    {(concept === 'Dynamic Programming' && algorithm === 'Fibonacci DP' || concept === 'Backtracking' && algorithm === 'N Queens') && (
                      <div>
                        <label className={`block mb-2 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                          {algorithm === 'N Queens' ? 'Board Size (N)' : 'n for Fibonacci DP'}
                        </label>
                        <input type="number" value={fibN} onChange={(e) => setFibN(Number(e.target.value))} className={`w-full px-3 py-2 rounded-lg border outline-none transition-all ${darkMode ? 'bg-gray-700 text-gray-100 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder-gray-400' : 'bg-gray-50 text-gray-800 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder-gray-400'}`} placeholder={algorithm === 'N Queens' ? 'e.g. 4' : 'e.g. 8'} />
                      </div>
                    )}

                    {concept === 'Bit Manipulation' && (
                      <div>
                        <label className={`block mb-2 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Two Numbers (comma separated)</label>
                        <input type="text" value={inputArrayString} onChange={(e) => setInputArrayString(e.target.value)} className={`w-full px-3 py-2 rounded-lg border outline-none transition-all ${darkMode ? 'bg-gray-700 text-gray-100 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder-gray-400' : 'bg-gray-50 text-gray-800 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder-gray-400'}`} placeholder="e.g. 5,3" />
                      </div>
                    )}
                  </div>

                  <div className="mt-auto flex gap-2 justify-center flex-wrap">
                    <button onClick={loadExample} className={`px-4 py-2 rounded-lg font-semibold border transition-all flex items-center gap-2 text-sm ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600 hover:border-gray-500' : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300 hover:border-gray-400'}`}>
                      <Info size={16} />
                      Load Example
                    </button>
                    <button onClick={handleApply} className={`px-5 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all text-sm text-white ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'}`}>Apply</button>
                    <button onClick={resetAll} className={`px-5 py-2 rounded-lg font-semibold border transition-all text-sm ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600 hover:border-gray-500' : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300 hover:border-gray-400'}`}>Reset</button>
                  </div>
                </div>
              </div>
            </div>
            </div>

            {/* Toggle Sidebar Button */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`fixed left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-lg shadow-lg transition-all ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700' : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm'}`}
              title={sidebarCollapsed ? 'Show sidebar' : 'Hide sidebar'}
            >
              {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>

            {/* Main Content Area with Tabs */}
            <div className="flex-1 flex flex-col gap-3 h-full min-w-0">
              <div className={`rounded-xl border shadow-lg flex flex-col h-full transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700/50' : 'bg-white border-gray-200'}`}>
                {/* Tab Navigation */}
                <div className={`flex border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <button
                    onClick={() => setActiveTab('explanation')}
                    className={`flex-1 px-4 py-3 font-semibold flex items-center justify-center gap-2 transition-all text-sm ${
                      activeTab === 'explanation'
                        ? darkMode ? 'bg-gray-700/50 text-blue-400 border-b-2 border-blue-400' : 'bg-gray-50 text-blue-600 border-b-2 border-blue-600'
                        : darkMode ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/30' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    <FileText size={18} />
                    <span className="hidden sm:inline">Explanation</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('code')}
                    className={`flex-1 px-4 py-3 font-semibold flex items-center justify-center gap-2 transition-all text-sm ${
                      activeTab === 'code'
                        ? darkMode ? 'bg-gray-700/50 text-blue-400 border-b-2 border-blue-400' : 'bg-gray-50 text-blue-600 border-b-2 border-blue-600'
                        : darkMode ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/30' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    <Code size={18} />
                    <span className="hidden sm:inline">Code</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('visualization')}
                    className={`flex-1 px-4 py-3 font-semibold flex items-center justify-center gap-2 transition-all text-sm ${
                      activeTab === 'visualization'
                        ? darkMode ? 'bg-gray-700/50 text-blue-400 border-b-2 border-blue-400' : 'bg-gray-50 text-blue-600 border-b-2 border-blue-600'
                        : darkMode ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/30' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    <Eye size={18} />
                    <span className="hidden sm:inline">Visualization</span>
                  </button>
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-auto p-4">
                  {/* Explanation Tab */}
                  {activeTab === 'explanation' && (
                    <div className="space-y-5">
                      {algorithmWalkthroughs[algorithm] ? (
                        <>
                          <div>
                            <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Overview</h3>
                            <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              {algorithmWalkthroughs[algorithm].overview}
                            </p>
                          </div>

                          <div>
                            <h3 className={`text-lg font-bold mb-3 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>How It Works</h3>
                            <div className="space-y-2">
                              {algorithmWalkthroughs[algorithm].howItWorks.map((step, idx) => (
                                <div key={idx} className={`flex gap-3 ${step === '' ? 'mt-3' : ''}`}>
                                  {step !== '' && (
                                    <>
                                      <div className={`flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2 ${darkMode ? 'bg-blue-400' : 'bg-blue-500'}`} />
                                      <p className={`flex-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{step}</p>
                                    </>
                                  )}
                                  {step === '' && <div className="h-2" />}
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h3 className={`text-lg font-bold mb-3 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Key Insights</h3>
                            <div className="space-y-2">
                              {algorithmWalkthroughs[algorithm].keyInsights.map((insight, idx) => (
                                <div key={idx} className="flex gap-3">
                                  <div className={`flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2 ${darkMode ? 'bg-green-400' : 'bg-green-600'}`} />
                                  <p className={`flex-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{insight}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h3 className={`text-lg font-bold mb-3 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Common Use Cases</h3>
                            <div className="space-y-2">
                              {algorithmWalkthroughs[algorithm].commonUseCases.map((useCase, idx) => (
                                <div key={idx} className="flex gap-3">
                                  <div className={`flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2 ${darkMode ? 'bg-orange-400' : 'bg-orange-500'}`} />
                                  <p className={`flex-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{useCase}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className={`mt-5 p-4 rounded-lg border ${darkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className={`font-bold mb-1 text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Time Complexity</h4>
                                <code className={`text-base font-mono ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>{algorithmInfo[algorithm]?.timeComplexity}</code>
                              </div>
                              <div>
                                <h4 className={`font-bold mb-1 text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Space Complexity</h4>
                                <code className={`text-base font-mono ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>{algorithmInfo[algorithm]?.spaceComplexity}</code>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <p className={`text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Walkthrough not available for this algorithm yet.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Code Tab */}
                  {activeTab === 'code' && (
                    <div className="space-y-3">
                      <div className="flex gap-2 mb-3">
                        <button
                          onClick={() => setSelectedLanguage('cpp')}
                          className={`px-4 py-1.5 rounded-lg font-semibold transition-all text-sm ${
                            selectedLanguage === 'cpp'
                              ? darkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
                              : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          C++
                        </button>
                        <button
                          onClick={() => setSelectedLanguage('java')}
                          className={`px-4 py-1.5 rounded-lg font-semibold transition-all text-sm ${
                            selectedLanguage === 'java'
                              ? darkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
                              : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          Java
                        </button>
                        <button
                          onClick={() => setSelectedLanguage('python')}
                          className={`px-4 py-1.5 rounded-lg font-semibold transition-all text-sm ${
                            selectedLanguage === 'python'
                              ? darkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
                              : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          Python
                        </button>
                      </div>

                      {codeExamples[algorithm] && codeExamples[algorithm][selectedLanguage] ? (
                        <pre className={`p-4 rounded-lg overflow-x-auto ${darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-50 text-gray-800'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                          <code className="text-xs md:text-sm font-mono leading-relaxed">{codeExamples[algorithm][selectedLanguage]}</code>
                        </pre>
                      ) : (
                        <p className={`text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Code example not available for this algorithm in {selectedLanguage === 'cpp' ? 'C++' : selectedLanguage === 'java' ? 'Java' : 'Python'}.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Visualization Tab */}
                  {activeTab === 'visualization' && (
                    <div>
                      <div className="flex-1 w-full flex items-center justify-center mb-3 overflow-auto">
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

                        {/* Visualization Controls */}
                        <div className={`w-full p-3 rounded-lg border transition-colors duration-300 ${darkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <button onClick={stepBack} title="Previous step (or press left arrow)" className={`p-2 rounded-lg border transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'}`}><SkipBack size={18} /></button>
                        <button onClick={togglePlay} title={playing ? "Pause animation (or press space)" : "Play animation (or press space)"} className={`p-2.5 rounded-lg text-white transition-all shadow-sm ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'}`}>{playing ? <Pause size={18} /> : <Play size={18} />}</button>
                        <button onClick={stepForward} title="Next step (or press right arrow)" className={`p-2 rounded-lg border transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'}`}><SkipForward size={18} /></button>

                        <div className="ml-3 flex items-center gap-2">
                          <div className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Speed (ms)</div>
                          <input type="number" value={speed} onChange={handleSpeedChange} title="Animation speed in milliseconds" className={`w-16 px-2 py-1 text-xs rounded-lg border outline-none transition-all ${darkMode ? 'bg-gray-700 text-gray-100 border-gray-600 focus:border-blue-500' : 'bg-white text-gray-800 border-gray-300 focus:border-blue-500'}`} />
                        </div>
                      </div>

                      <div>
                        <input
                          type="range"
                          min={0}
                          max={Math.max(0, (steps.length - 1))}
                          value={index}
                          onChange={handleIndexChange}
                          className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${darkMode ? 'bg-gray-600 accent-blue-500' : 'bg-gray-200 accent-blue-500'}`}
                        />
                        <div className={`flex justify-between text-xs mt-1 font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          <div>0</div>
                          <div>{steps.length > 0 ? steps.length - 1 : 0}</div>
                        </div>

                        <div className="mt-2 text-center">
                          <div className={`font-semibold text-sm ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{cur.description || 'No step'}</div>
                          <div className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{`Step ${index} of ${Math.max(0, steps.length - 1)}`}</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className={`border p-3 rounded-lg transition-colors duration-300 ${darkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                        <h3 className={`font-bold text-sm mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Legend</h3>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 bg-blue-400 border border-blue-600 rounded" />
                            <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Window / Pointer</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 bg-pink-400 border border-pink-600 rounded" />
                            <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Pivot</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 bg-orange-400 border border-orange-600 rounded" />
                            <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Swapping</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 bg-green-400 border border-green-600 rounded" />
                            <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Best / Result</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    </div>
                  )}
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
