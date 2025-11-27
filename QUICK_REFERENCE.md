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
| **Reverse Vowels** | Text string | `hello world` |
| **Max Window** | Numbers + Window size | Array: `1,4,2,10,2,3`<br>k: `3` |
| **Stack** | Operations | `push:1,push:2,pop,push:3` |
| **Queue** | Operations | `enqueue:1,enqueue:2,dequeue` |
| **LinkedList** | Numbers | `1,2,3,4,5` |
| **Heapify** | Numbers | `4,10,3,5,1` |
| **Graphs** | Adjacency list | `0:1,2;1:0,3;2:0;3:1`<br>or JSON: `[[1,2],[0,3],[0],[1]]` |
| **Trees** | Level-order array | `1,2,3,4,5,6,7` |
| **Kadane** | Numbers (can be negative) | `-2,1,-3,4,-1,2,1` |
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

### 🔄 Sorting (5)
- Bubble, Selection, Insertion, Merge, Quick

### 🔍 Searching (2)
- Linear, Binary

### 👉 Two Pointers (2)
- Reverse Vowels, Max Window Sum

### 📦 Data Structures (4)
- Stack, Queue, LinkedList Reverse, Heapify

### 🕸️ Graphs (2)
- BFS, DFS

### 🌳 Trees (4 traversals)
- Preorder, Inorder, Postorder, Level-order

### 🧮 Algorithms (2)
- Kadane (Max Subarray), Fibonacci DP

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
