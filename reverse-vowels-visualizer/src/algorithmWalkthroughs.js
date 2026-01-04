// Comprehensive walkthroughs for all algorithms

export const algorithmWalkthroughs = {
  'Bubble': {
    overview: 'Bubble Sort is a simple comparison-based sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.',
    howItWorks: [
      '1. Start from the beginning of the array',
      '2. Compare each pair of adjacent elements',
      '3. Swap them if they are in wrong order (left > right for ascending)',
      '4. After each pass, the largest element "bubbles up" to its correct position',
      '5. Repeat the process for remaining unsorted elements',
      '6. Continue until no more swaps are needed'
    ],
    keyInsights: [
      'The algorithm gets its name from the way larger elements "bubble" to the top',
      'Each pass through the array guarantees one more element in its final position',
      'Can be optimized with a flag to detect when array is already sorted',
      'Stable sort - maintains relative order of equal elements'
    ],
    commonUseCases: [
      'Educational purposes - easy to understand and implement',
      'Small datasets where simplicity is more important than efficiency',
      'Nearly sorted data - can be optimized to O(n) in best case',
      'When memory is extremely limited (in-place sorting)'
    ]
  },
  'Selection': {
    overview: 'Selection Sort divides the array into sorted and unsorted regions, repeatedly selecting the minimum element from the unsorted region and moving it to the sorted region.',
    howItWorks: [
      '1. Divide array into sorted (initially empty) and unsorted regions',
      '2. Find the minimum element in the unsorted region',
      '3. Swap it with the first element of the unsorted region',
      '4. Move the boundary between sorted and unsorted regions one position right',
      '5. Repeat until the entire array is sorted'
    ],
    keyInsights: [
      'Always performs exactly n(n-1)/2 comparisons regardless of input',
      'Performs at most n swaps - useful when swap operations are expensive',
      'Not stable - may change relative order of equal elements',
      'Simple to implement but not efficient for large datasets'
    ],
    commonUseCases: [
      'When the cost of swapping is very high (e.g., swapping large records)',
      'Small arrays where O(n²) is acceptable',
      'When memory writes are expensive but reads are cheap',
      'Educational purposes for understanding sorting concepts'
    ]
  },
  'Insertion': {
    overview: 'Insertion Sort builds the final sorted array one item at a time by inserting each element into its proper position in the already-sorted portion.',
    howItWorks: [
      '1. Start with the second element (first element is considered sorted)',
      '2. Pick the current element (key)',
      '3. Compare key with elements in the sorted portion (moving backwards)',
      '4. Shift larger elements one position to the right',
      '5. Insert the key at its correct position',
      '6. Repeat for all elements'
    ],
    keyInsights: [
      'Efficient for small datasets and nearly sorted arrays',
      'Best case: O(n) when array is already sorted',
      'Stable sort - maintains relative order of equal elements',
      'Online algorithm - can sort array as it receives data',
      'Adaptive - performance adapts to initial order of elements'
    ],
    commonUseCases: [
      'Small datasets (typically n < 10-20 elements)',
      'Nearly sorted or partially sorted data',
      'Online sorting where data arrives continuously',
      'As part of more complex algorithms like TimSort and Introsort'
    ]
  },
  'Merge': {
    overview: 'Merge Sort is a divide-and-conquer algorithm that divides the array into halves, recursively sorts them, and then merges the sorted halves.',
    howItWorks: [
      '1. Divide: Split the array into two halves',
      '2. Conquer: Recursively sort both halves',
      '3. Base case: Arrays with 1 element are already sorted',
      '4. Merge: Combine two sorted halves into one sorted array',
      '5. During merge, compare elements from both halves and pick smaller one',
      '6. Continue until all elements are merged'
    ],
    keyInsights: [
      'Guaranteed O(n log n) time complexity in all cases',
      'Stable sort - preserves relative order of equal elements',
      'Requires O(n) extra space for merging',
      'Excellent for sorting linked lists (no extra space needed)',
      'Parallelizable - different parts can be sorted independently'
    ],
    commonUseCases: [
      'When stable sorting is required',
      'Sorting linked lists efficiently',
      'External sorting (data doesn\'t fit in memory)',
      'When worst-case O(n log n) guarantee is needed',
      'Parallel computing applications'
    ]
  },
  'Quick': {
    overview: 'Quick Sort is a divide-and-conquer algorithm that picks a pivot element, partitions the array around it, and recursively sorts the partitions.',
    howItWorks: [
      '1. Choose a pivot element (often the last element)',
      '2. Partition: Rearrange array so elements < pivot are on left, > pivot on right',
      '3. Place pivot in its final sorted position',
      '4. Recursively apply quicksort to left partition',
      '5. Recursively apply quicksort to right partition',
      '6. Base case: partitions with 0-1 elements are already sorted'
    ],
    keyInsights: [
      'Average case: O(n log n), Worst case: O(n²) when pivot is always min/max',
      'In-place sorting - requires only O(log n) extra space for recursion',
      'Not stable - may change relative order of equal elements',
      'Pivot selection strategy greatly affects performance',
      'Cache-friendly due to good locality of reference'
    ],
    commonUseCases: [
      'General-purpose sorting - used in many standard libraries',
      'When average-case performance is more important than worst-case',
      'Large datasets where in-place sorting is beneficial',
      'Systems with limited memory (compared to merge sort)',
      'When stability is not required'
    ]
  },
  'Linear': {
    overview: 'Linear Search is a simple search algorithm that checks every element in the list sequentially until the target is found or the list ends.',
    howItWorks: [
      '1. Start from the first element of the array',
      '2. Compare current element with the target value',
      '3. If match found, return the current index',
      '4. If not, move to the next element',
      '5. Repeat until target is found or array ends',
      '6. Return -1 if target is not found'
    ],
    keyInsights: [
      'Works on both sorted and unsorted arrays',
      'Best case: O(1) when target is first element',
      'Worst case: O(n) when target is last or not present',
      'No preprocessing required',
      'Simple to implement with minimal code'
    ],
    commonUseCases: [
      'Small datasets where O(n) is acceptable',
      'Unsorted data where sorting would be more expensive',
      'When searching is infrequent',
      'Linked lists where random access is not available',
      'When simplicity and reliability are priorities'
    ]
  },
  'Binary': {
    overview: 'Binary Search is an efficient search algorithm that works on sorted arrays by repeatedly dividing the search interval in half.',
    howItWorks: [
      '1. Start with the entire sorted array',
      '2. Find the middle element',
      '3. If middle element equals target, return its index',
      '4. If target < middle, search in left half',
      '5. If target > middle, search in right half',
      '6. Repeat until target is found or interval is empty'
    ],
    keyInsights: [
      'Requires array to be sorted',
      'Time complexity: O(log n) - very efficient for large datasets',
      'Eliminates half of remaining elements in each step',
      'Can be implemented iteratively or recursively',
      'Foundation for many advanced algorithms'
    ],
    commonUseCases: [
      'Searching in large sorted datasets',
      'Database indexing and search operations',
      'Finding insertion position for new elements',
      'Implementing lower_bound and upper_bound operations',
      'Any problem that can be reduced to "is X possible?" questions'
    ]
  },
  'Reverse Vowels': {
    overview: 'This algorithm uses the two-pointer technique to reverse only the vowels in a string while keeping consonants in their original positions.',
    howItWorks: [
      '1. Initialize two pointers: left at start, right at end',
      '2. Move left pointer right until a vowel is found',
      '3. Move right pointer left until a vowel is found',
      '4. Swap the vowels at left and right pointers',
      '5. Move both pointers inward',
      '6. Repeat until pointers meet or cross'
    ],
    keyInsights: [
      'Two-pointer technique is efficient for string manipulation',
      'Only vowels are swapped; consonants remain in place',
      'Works in O(n) time with single pass through string',
      'Case-sensitive - treats uppercase and lowercase vowels separately',
      'In-place modification possible with mutable strings'
    ],
    commonUseCases: [
      'String manipulation problems',
      'Learning two-pointer technique',
      'Interview questions on string algorithms',
      'Text processing with specific character constraints',
      'Problems requiring selective element manipulation'
    ]
  },
  'Max Window Sum (k)': {
    overview: 'The Sliding Window technique efficiently finds the maximum sum of any contiguous subarray of size k by maintaining a window that slides through the array.',
    howItWorks: [
      '1. Calculate sum of first k elements (initial window)',
      '2. Slide window one position right',
      '3. Add new element entering window, subtract element leaving window',
      '4. Update maximum sum if current sum is larger',
      '5. Repeat until window reaches end of array',
      '6. Return the maximum sum found'
    ],
    keyInsights: [
      'Avoids recalculating sum from scratch for each window',
      'Time complexity: O(n) instead of O(n*k) with brute force',
      'Classic example of the sliding window pattern',
      'Can be extended to variable-size windows',
      'Foundation for many optimization problems'
    ],
    commonUseCases: [
      'Finding maximum/minimum sum of fixed-size subarray',
      'Stock price analysis (best k-day trading period)',
      'Signal processing (moving average calculations)',
      'Network packet analysis',
      'Any problem involving contiguous sequences'
    ]
  },
  'Stack': {
    overview: 'A Stack is a Last-In-First-Out (LIFO) data structure where elements are added and removed from the same end, called the top.',
    howItWorks: [
      '1. Push: Add element to top of stack',
      '2. Pop: Remove and return top element',
      '3. Top/Peek: View top element without removing',
      '4. isEmpty: Check if stack is empty',
      '5. All operations work on the same end (top)',
      '6. Elements below top are not accessible directly'
    ],
    keyInsights: [
      'All operations are O(1) - constant time',
      'Natural fit for problems with nested structures',
      'Can be implemented with array or linked list',
      'Used internally in function call management',
      'LIFO property is key to many algorithms'
    ],
    commonUseCases: [
      'Function call stack and recursion',
      'Expression evaluation and syntax parsing',
      'Undo/Redo operations in editors',
      'Browser back/forward navigation',
      'Depth-First Search (DFS) in graphs',
      'Backtracking algorithms'
    ]
  },
  'Queue': {
    overview: 'A Queue is a First-In-First-Out (FIFO) data structure where elements are added at the rear and removed from the front.',
    howItWorks: [
      '1. Enqueue: Add element to rear of queue',
      '2. Dequeue: Remove and return front element',
      '3. Front: View front element without removing',
      '4. isEmpty: Check if queue is empty',
      '5. Elements are processed in order of arrival',
      '6. First element added is first to be removed'
    ],
    keyInsights: [
      'All operations should be O(1)',
      'Models real-world queues (waiting lines)',
      'Can be implemented with circular array or linked list',
      'Priority queue variant allows custom ordering',
      'FIFO property ensures fairness in processing'
    ],
    commonUseCases: [
      'Task scheduling and job processing',
      'Breadth-First Search (BFS) in graphs',
      'Buffering in data streams',
      'Request handling in servers',
      'Print queue management',
      'Level-order tree traversal'
    ]
  },
  'LinkedList Reverse': {
    overview: 'Reversing a linked list involves changing the direction of all next pointers so the list traversal order is reversed.',
    howItWorks: [
      '1. Initialize three pointers: prev = null, curr = head, next',
      '2. Save next node before changing pointer',
      '3. Reverse current node\'s pointer to point to prev',
      '4. Move prev and curr one step forward',
      '5. Repeat until curr becomes null',
      '6. prev becomes the new head'
    ],
    keyInsights: [
      'In-place reversal - O(1) space complexity',
      'Single pass through list - O(n) time',
      'Classic pointer manipulation problem',
      'Important to save next pointer before reversing',
      'Can be solved iteratively or recursively'
    ],
    commonUseCases: [
      'Linked list manipulation problems',
      'Reversing parts of a list (reverse between positions)',
      'Palindrome checking in linked lists',
      'Interview questions on pointer manipulation',
      'Understanding pointer mechanics'
    ]
  },
  'Heapify': {
    overview: 'Heapify transforms an array into a heap data structure, where each parent node is greater (max-heap) or smaller (min-heap) than its children.',
    howItWorks: [
      '1. Start from last non-leaf node (n/2 - 1)',
      '2. For each node, compare with left and right children',
      '3. Find largest among node and its children',
      '4. If largest is not the node, swap and recursively heapify',
      '5. Move backwards to process all non-leaf nodes',
      '6. Result is a valid heap structure'
    ],
    keyInsights: [
      'Building heap from array: O(n) time - better than n insertions',
      'Heap property: parent ≥ children (max-heap)',
      'Used in heap sort and priority queues',
      'In-place - no extra space needed',
      'Foundation for many optimization algorithms'
    ],
    commonUseCases: [
      'Priority queue implementation',
      'Heap sort algorithm',
      'Finding k largest/smallest elements',
      'Median maintenance in streaming data',
      'Graph algorithms (Dijkstra, Prim)',
      'Job scheduling systems'
    ]
  },
  'BFS': {
    overview: 'Breadth-First Search explores a graph level by level, visiting all neighbors of a node before moving to the next level.',
    howItWorks: [
      '1. Start from source node, mark it visited',
      '2. Add source to queue',
      '3. Dequeue a node and process it',
      '4. For each unvisited neighbor, mark visited and enqueue',
      '5. Repeat until queue is empty',
      '6. All reachable nodes from source are visited'
    ],
    keyInsights: [
      'Uses queue (FIFO) to maintain order',
      'Finds shortest path in unweighted graphs',
      'Level-by-level traversal pattern',
      'Time: O(V + E), Space: O(V)',
      'Visits nodes in order of distance from source'
    ],
    commonUseCases: [
      'Shortest path in unweighted graphs',
      'Level-order tree traversal',
      'Finding all connected components',
      'Web crawling (same-depth pages first)',
      'Social network analysis (degrees of separation)',
      'Network broadcasting algorithms'
    ]
  },
  'DFS': {
    overview: 'Depth-First Search explores a graph by going as deep as possible along each branch before backtracking.',
    howItWorks: [
      '1. Start from source node, mark it visited',
      '2. For each unvisited neighbor, recursively apply DFS',
      '3. Explore as far as possible before backtracking',
      '4. When no unvisited neighbors, backtrack to previous node',
      '5. Continue until all reachable nodes are visited',
      '6. Can use explicit stack instead of recursion'
    ],
    keyInsights: [
      'Uses stack (LIFO) - implicit via recursion or explicit',
      'Goes deep before going wide',
      'Time: O(V + E), Space: O(V)',
      'Natural for problems with backtracking',
      'Can be used to detect cycles'
    ],
    commonUseCases: [
      'Topological sorting',
      'Cycle detection in graphs',
      'Path finding (may not be shortest)',
      'Maze solving',
      'Strongly connected components',
      'Puzzle solving with backtracking'
    ]
  },
  'Binary Tree Traversals': {
    overview: 'Tree traversals are systematic ways to visit all nodes in a tree, with different orders producing different results.',
    howItWorks: [
      'Inorder (Left-Root-Right):',
      '1. Recursively traverse left subtree',
      '2. Visit root',
      '3. Recursively traverse right subtree',
      '',
      'Preorder (Root-Left-Right):',
      '1. Visit root',
      '2. Recursively traverse left subtree',
      '3. Recursively traverse right subtree',
      '',
      'Postorder (Left-Right-Root):',
      '1. Recursively traverse left subtree',
      '2. Recursively traverse right subtree',
      '3. Visit root',
      '',
      'Level-order (BFS):',
      '1. Visit nodes level by level using queue'
    ],
    keyInsights: [
      'Inorder gives sorted sequence for BST',
      'Preorder useful for copying/serializing trees',
      'Postorder used in deletion operations',
      'Level-order gives breadth-first view',
      'All have O(n) time, O(h) space (recursive)'
    ],
    commonUseCases: [
      'Inorder: BST validation, sorted output',
      'Preorder: Tree copying, prefix expressions',
      'Postorder: Tree deletion, postfix expressions',
      'Level-order: Level-wise processing, shortest path in tree',
      'Expression evaluation',
      'Serialization/deserialization'
    ]
  },
  'Kadane (Max Subarray)': {
    overview: 'Kadane\'s Algorithm finds the maximum sum of a contiguous subarray using dynamic programming principles.',
    howItWorks: [
      '1. Initialize: maxSoFar = first element, currentMax = first element',
      '2. For each element from index 1 to n-1:',
      '3. currentMax = max(element, currentMax + element)',
      '4. This decides: start new subarray or extend current one',
      '5. maxSoFar = max(maxSoFar, currentMax)',
      '6. Return maxSoFar as the result'
    ],
    keyInsights: [
      'Classic dynamic programming problem',
      'Key decision: extend or start new at each position',
      'Handles all negative arrays correctly',
      'Single pass through array - O(n) time',
      'Can be extended to track subarray indices',
      'Greedy approach with optimal substructure'
    ],
    commonUseCases: [
      'Stock trading (maximum profit period)',
      'Finding best consecutive days for any metric',
      'Signal processing (maximum energy segment)',
      'Performance analysis (best consecutive period)',
      'Introduction to dynamic programming',
      'Interview questions on arrays'
    ]
  },
  'Fibonacci DP': {
    overview: 'Computing Fibonacci numbers using Dynamic Programming avoids redundant calculations by storing previously computed values.',
    howItWorks: [
      '1. Create array dp of size n+1',
      '2. Initialize base cases: dp[0] = 0, dp[1] = 1',
      '3. For i from 2 to n:',
      '4. dp[i] = dp[i-1] + dp[i-2]',
      '5. Each value computed once and reused',
      '6. Return dp[n]'
    ],
    keyInsights: [
      'Classic DP problem - bottom-up approach',
      'Reduces exponential O(2ⁿ) to linear O(n)',
      'Demonstrates memoization concept',
      'Space can be optimized to O(1) using two variables',
      'Shows overlapping subproblems property',
      'Foundation for more complex DP problems'
    ],
    commonUseCases: [
      'Introduction to dynamic programming',
      'Teaching recursion optimization',
      'Fibonacci sequence in mathematics/nature',
      'Understanding time-space tradeoffs',
      'Interview questions on DP basics',
      'Matrix chain multiplication (similar pattern)'
    ]
  }
};
