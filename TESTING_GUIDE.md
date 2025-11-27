# DSA Visualizer - Testing Guide

This document provides test cases for all algorithms implemented in the DSA Visualizer.

## How to Test
1. Start the development server: `npm run dev`
2. Open http://localhost:5173/ in your browser
3. For each algorithm below:
   - Select the **Concept** category
   - Select the **Algorithm**
   - Enter the **Input** as specified
   - Click **Apply**
   - Use **Play/Pause** and step controls to verify visualization

---

## 1. Sorting Algorithms

### Bubble Sort
- **Input Array**: `5,3,8,1,2`
- **Expected**: Should show comparisons and swaps, largest values bubble to the right
- **Verification**: Final array should be `1,2,3,5,8`

### Selection Sort
- **Input Array**: `64,25,12,22,11`
- **Expected**: Should find minimum and swap to front
- **Verification**: Final array should be `11,12,22,25,64`

### Insertion Sort
- **Input Array**: `12,11,13,5,6`
- **Expected**: Should show shifting elements to insert in sorted position
- **Verification**: Final array should be `5,6,11,12,13`

### Merge Sort
- **Input Array**: `38,27,43,3,9,82,10`
- **Expected**: Should show divide and merge steps
- **Verification**: Final array should be `3,9,10,27,38,43,82`

### Quick Sort
- **Input Array**: `10,7,8,9,1,5`
- **Expected**: Should show pivot selection and partitioning
- **Verification**: Final array should be `1,5,7,8,9,10`

---

## 2. Searching Algorithms

### Linear Search
- **Input Array**: `2,3,4,10,40`
- **Target Value**: `10`
- **Expected**: Should check each element sequentially
- **Verification**: Should find target at index 3

### Binary Search
- **Input Array**: `2,3,4,10,40` (will be sorted automatically)
- **Target Value**: `10`
- **Expected**: Should divide search space in half each time
- **Verification**: Should find target efficiently

---

## 3. Two Pointers / Sliding Window

### Reverse Vowels
- **Input String**: `hello world`
- **Expected**: Should swap vowels from both ends
- **Verification**: Result should show vowels reversed

### Max Window Sum (k)
- **Input Array**: `1,4,2,10,2,3,1,0,20`
- **Window Size (k)**: `3`
- **Expected**: Should slide window and calculate sums
- **Verification**: Should find window with maximum sum

---

## 4. Data Structures

### Stack
- **Operations**: `push:1,push:2,push:3,pop,push:4,pop`
- **Expected**: Should show LIFO behavior (Last In First Out)
- **Verification**: Final stack should be `[1, 2]`

### Queue
- **Operations**: `enqueue:1,enqueue:2,enqueue:3,dequeue,enqueue:4,dequeue`
- **Expected**: Should show FIFO behavior (First In First Out)
- **Verification**: Final queue should be `[3, 4]`

### LinkedList Reverse
- **Input Array**: `1,2,3,4,5`
- **Expected**: Should reverse link pointers
- **Verification**: Should show reversal of linked list structure

### Heapify
- **Input Array**: `4,10,3,5,1`
- **Expected**: Should build max-heap structure
- **Verification**: Should satisfy max-heap property (parent >= children)

---

## 5. Graph Algorithms

### BFS (Breadth-First Search)
- **Adjacency List**: `0:1,2;1:0,3,4;2:0,5;3:1;4:1;5:2`
- **Expected**: Should visit nodes level by level from node 0
- **Verification**: Should discover all connected nodes

### DFS (Depth-First Search)
- **Adjacency List**: `0:1,2;1:0,3,4;2:0,5;3:1;4:1;5:2`
- **Expected**: Should visit nodes by going deep into branches
- **Verification**: Should visit all connected nodes depth-first

**Alternative Format (JSON)**:
```json
[[1,2],[0,3,4],[0,5],[1],[1],[2]]
```

---

## 6. Trees

### Binary Tree Traversals
- **Input Array**: `1,2,3,4,5,6,7`
- **Expected**: Should show preorder, inorder, postorder, and BFS traversals
- **Verification**: 
  - Preorder: root-left-right
  - Inorder: left-root-right
  - Postorder: left-right-root
  - BFS: level-by-level

---

## 7. Algorithms

### Kadane (Max Subarray)
- **Input Array**: `-2,1,-3,4,-1,2,1,-5,4`
- **Expected**: Should find maximum sum contiguous subarray
- **Verification**: Maximum sum should be 6 (subarray: [4,-1,2,1])

### Fibonacci DP
- **n**: `8`
- **Expected**: Should build DP table for Fibonacci sequence
- **Verification**: fib(8) should be 21

---

## Common Issues to Check

### ✅ Input Validation
- [ ] Error messages appear when inputs are missing
- [ ] Error messages are clear and helpful
- [ ] Invalid inputs are handled gracefully

### ✅ Visualization
- [ ] Colors update correctly for different states
- [ ] Step descriptions are accurate
- [ ] Array/structure renders correctly at each step
- [ ] Dark mode works properly

### ✅ Controls
- [ ] Play/Pause toggles correctly
- [ ] Step Forward/Back works
- [ ] Speed control adjusts animation speed
- [ ] Slider syncs with current step
- [ ] Reset clears visualization

### ✅ Responsiveness
- [ ] Layout works on different screen sizes
- [ ] Text is readable
- [ ] Controls are accessible

---

## Edge Cases to Test

1. **Empty inputs**: Should show appropriate error messages
2. **Single element**: `5` - should handle gracefully
3. **Already sorted**: `1,2,3,4,5` - should still visualize
4. **Reverse sorted**: `5,4,3,2,1` - maximum comparisons
5. **Duplicates**: `3,3,3,3` - should handle correctly
6. **Negative numbers**: `-5,-2,0,3,7` - should work
7. **Large numbers**: `1000,500,2000` - should display properly

---

## Bugs Found During Testing
(Document any issues discovered)

---

## Testing Checklist

### Sorting (5 algorithms)
- [ ] Bubble Sort
- [ ] Selection Sort
- [ ] Insertion Sort
- [ ] Merge Sort
- [ ] Quick Sort

### Searching (2 algorithms)
- [ ] Linear Search
- [ ] Binary Search

### Two Pointers / Sliding Window (2 algorithms)
- [ ] Reverse Vowels
- [ ] Max Window Sum (k)

### Data Structures (4 operations)
- [ ] Stack
- [ ] Queue
- [ ] LinkedList Reverse
- [ ] Heapify

### Graphs (2 algorithms)
- [ ] BFS
- [ ] DFS

### Trees (1 algorithm with 4 traversals)
- [ ] Binary Tree Traversals

### Algorithms (2 algorithms)
- [ ] Kadane (Max Subarray)
- [ ] Fibonacci DP

**Total: 18 algorithm implementations**
