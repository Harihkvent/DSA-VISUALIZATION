# Quick Reference Card - DSA Visualizer

## 🎯 Quick Start
1. Select **Concept** → Select **Algorithm**
2. Enter **Input** → Click **Apply**
3. Use **Play/Pause/Step** controls to visualize

---

## 📋 Input Formats Cheat Sheet

| Algorithm Type | Input Format | Example |
|----------------|--------------|---------|
| **Sorting** | Numbers (comma-separated) | `5,3,8,1,2` |
| **Searching** | Numbers + Target | Array: `2,3,4,10,40`<br>Target: `10` |
| **Two Sum** | Numbers + Target | Array: `2,7,11,15`<br>Target: `9` |
| **Reverse Vowels** | Text string | `hello world` |
| **Max Window** | Numbers + Window size | Array: `1,4,2,10,2,3`<br>k: `3` |
| **Prefix Sum** | Numbers | `1,2,3,4,5` |
| **Rotate Array** | Numbers + k | Array: `1,2,3,4,5,6,7`<br>k: `3` |
| **Palindrome** | Text string | `racecar` |
| **Anagram** | Two strings (comma-separated) | `listen,silent` |
| **KMP Pattern** | Text,Pattern (comma-separated) | `ababcababa,aba` |
| **Stack** | Operations | `push:1,push:2,pop,push:3` |
| **Queue** | Operations | `enqueue:1,enqueue:2,dequeue` |
| **LinkedList** | Numbers | `1,2,3,4,5` |
| **Heapify** | Numbers | `4,10,3,5,1` |
| **Trie** | Words (comma-separated) | `cat,car,card,dog` |
| **Bit Operations** | Two numbers | `5,3` |
| **Graphs** | Adjacency list | `0:1,2;1:0,3;2:0;3:1`<br>or JSON: `[[1,2],[0,3],[0],[1]]` |
| **Dijkstra** | Weighted adjacency | `0:1:4,2:8;1:0:4,2:8;2:0:8,1:8` |
| **Trees** | Level-order array | `1,2,3,4,5,6,7` |
| **BST Insert** | Numbers to insert | `50,30,70,20,40,60,80` |
| **Kadane** | Numbers (can be negative) | `-2,1,-3,4,-1,2,1` |
| **LIS** | Numbers | `10,9,2,5,3,7,101,18` |
| **0/1 Knapsack** | Values\|Weights\|Capacity | `60,100,120\|10,20,30\|50` |
| **LCS** | Two strings (comma-separated) | `ABCDGH,AEDFHR` |
| **Coin Change** | Coins\|Amount | `1,2,5\|11` |
| **Activity Selection** | Starts\|Ends | `1,3,0,5\|2,4,6,7` |
| **Fractional Knapsack** | Values\|Weights\|Capacity | `60,100,120\|10,20,30\|50` |
| **N Queens** | Board size | `4` |
| **Permutations** | Numbers | `1,2,3` |
| **Fibonacci** | Single number | `8` |

---

## 🎨 Color Meanings

| Color | Meaning |
|-------|---------|
| 🔵 Blue | Comparing / Window / Pointer |
| 🟢 Green | Found / Best Result |
| 🟠 Orange | Swapping / Moving |
| 🩷 Pink | Pivot (QuickSort) |
| ⚪ Gray | Default / Not active |

---

## ⌨️ Controls

| Control | Action |
|---------|--------|
| **Apply** | Generate visualization from input |
| **Play ▶️** | Auto-advance through steps |
| **Pause ⏸️** | Stop auto-advance |
| **Step Back ⏮️** | Go to previous step |
| **Step Forward ⏭️** | Go to next step |
| **Speed** | Adjust animation delay (ms) |
| **Slider** | Jump to specific step |
| **Reset** | Clear all and start over |
| **🌙 / ☀️** | Toggle dark/light mode |

---

## ✅ Algorithm Categories

### 🔄 Sorting (7)
- Bubble, Selection, Insertion, Merge, Quick, Heap Sort, Counting Sort

### 🔍 Searching (3)
- Linear, Binary, Two Sum

### 👉 Two Pointers (2)
- Reverse Vowels, Max Window Sum

### 📊 Arrays (2)
- Prefix Sum, Rotate Array

### 📝 Strings (3)
- Palindrome Check, Anagram Check, KMP Pattern Match

### 🔗 Linked List (2)
- LinkedList Reverse, Floyd Cycle Detection

### 📦 Data Structures (4)
- Stack, Queue, Heapify, Trie Insert

### 💻 Bit Manipulation (1)
- Bit Operations (AND, OR, XOR, NOT, shifts)

### 🕸️ Graphs (5)
- BFS, DFS, Dijkstra, Topological Sort, Cycle Detection

### 🌳 Trees (3)
- Binary Tree Traversals, BST Insert, LCA

### 🧮 Dynamic Programming (6)
- Fibonacci DP, Kadane, 0/1 Knapsack, LCS, LIS, Coin Change

### 💰 Greedy Algorithms (2)
- Activity Selection, Fractional Knapsack

### 🔙 Backtracking (2)
- N-Queens, Generate Permutations

**Total: 43+ algorithms across 13 categories**

---

## 💡 Pro Tips

✅ **Use the placeholder examples** - They show the correct format  
✅ **Watch in steps** - Use Step Forward/Back to understand each move  
✅ **Try edge cases** - Single element, sorted, reverse-sorted  
✅ **Adjust speed** - Slow down for complex algorithms  
✅ **Dark mode** - Easier on the eyes for extended use  

---

## ⚠️ Common Mistakes

❌ **Spaces in arrays**: Use `5,3,8` not `5, 3, 8` (spaces are trimmed but avoid)  
❌ **Wrong format**: Check placeholder for exact format  
❌ **Forgetting Apply**: Must click Apply after entering input  
❌ **Invalid numbers**: Non-numeric values are filtered out  

---

## 🆘 Error Messages

| Error | Meaning | Fix |
|-------|---------|-----|
| "Provide a comma-separated list..." | No input array | Enter numbers like `5,3,8,1,2` |
| "Provide numeric target" | Missing search target | Enter a number in Target field |
| "Provide a string for Reverse Vowels" | No text input | Enter text like `hello` |
| "Provide operations for Stack..." | No operations | Use format `push:1,pop` |
| "Provide adjacency list..." | No graph input | Use `0:1,2;1:0` format |

---

## 📖 Learn More

- Full examples: [TESTING_GUIDE.md](TESTING_GUIDE.md)
- All improvements: [IMPROVEMENTS_SUMMARY.md](IMPROVEMENTS_SUMMARY.md)
- Project info: [README.md](README.md)

---

**Happy Visualizing! 🚀**
