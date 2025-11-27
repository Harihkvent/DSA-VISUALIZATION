# DSA Visualizer

An interactive web application for visualizing data structures and algorithms. Built with React and Vite, this educational tool helps students and developers understand how various algorithms work through step-by-step visual demonstrations.

## ✨ Features

- **18 Algorithm Implementations** across 7 categories
- **Step-by-step visualization** with play/pause controls
- **Dark mode support** for comfortable viewing
- **Interactive input** - test with your own data
- **Beautiful animations** and color-coded states
- **Responsive design** works on all screen sizes
- **Educational descriptions** for each step

## 📚 Algorithms Included

### Sorting (5 algorithms)
- Bubble Sort
- Selection Sort
- Insertion Sort
- Merge Sort
- Quick Sort

### Searching (2 algorithms)
- Linear Search
- Binary Search

### Two Pointers / Sliding Window (2 algorithms)
- Reverse Vowels
- Max Window Sum (k)

### Data Structures (4 operations)
- Stack (LIFO)
- Queue (FIFO)
- LinkedList Reverse
- Heapify (Max Heap)

### Graphs (2 algorithms)
- BFS (Breadth-First Search)
- DFS (Depth-First Search)

### Trees (4 traversals)
- Preorder Traversal
- Inorder Traversal
- Postorder Traversal
- Level-order (BFS)

### Classic Algorithms (2)
- Kadane's Algorithm (Max Subarray)
- Fibonacci with Dynamic Programming

## 🚀 Quick Start

### Prerequisites

- **Node.js** (version 16 or higher recommended)
- **npm** or **yarn** or **pnpm**

### Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Harihkvent/DSA-VISUALIZATION.git
    cd DSA-VISUALIZATION
    cd reverse-vowels-visualizer
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Start the development server**
    ```bash
    npm run dev
    ```

4.  **Open your browser**
    Navigate to `http://localhost:5173/` (or the port shown in console)

## 🎮 How to Use

1. **Select a Concept** - Choose from Sorting, Searching, Graphs, etc.
2. **Select an Algorithm** - Pick the specific algorithm you want to visualize
3. **Enter Input** - Provide data in the format shown in the placeholder
4. **Click Apply** - Generate the visualization
5. **Control Playback**:
   - ▶️ Play/Pause - Auto-advance through steps
   - ⏮️ Step Back - Go to previous step
   - ⏭️ Step Forward - Go to next step
   - 🎚️ Speed Control - Adjust animation speed (ms)
   - 📊 Slider - Jump to any step directly

## 📝 Input Format Examples

### Arrays (Sorting, Searching, etc.)
```
5,3,8,1,2
```

### String (Reverse Vowels)
```
hello world
```

### Stack Operations
```
push:1,push:2,push:3,pop,push:4
```

### Queue Operations
```
enqueue:1,enqueue:2,dequeue,enqueue:3
```

### Graph Adjacency List
String format:
```
0:1,2;1:0,3;2:0;3:1
```

JSON format:
```
[[1,2],[0,3],[0],[1]]
```

See [TESTING_GUIDE.md](TESTING_GUIDE.md) for comprehensive examples and test cases.

## 🛠️ Building for Production

To create an optimized production build:

```bash
npm run build

The built files will be in the `dist/` directory.

##  Color Legend

- **Blue**: Active window/pointer, comparing elements
- **Pink/Gray**: Pivot elements
- **Orange/Amber**: Swapping or shifting elements  
- **Green**: Best result or found element
- **Cyan (Dark Mode)**: Highlighted active states

##  Testing

Comprehensive test cases and examples are available in [TESTING_GUIDE.md](TESTING_GUIDE.md).

##  Documentation

- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Complete testing checklist with examples
- **[IMPROVEMENTS_SUMMARY.md](IMPROVEMENTS_SUMMARY.md)** - Summary of fixes and enhancements

##  Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

##  Contact

Built by **Harihk** (Hari Kiran) - Send feedback through the contact form in the app footer

##  License

This project is open source and available under the MIT License.

##  Acknowledgments

- Built with React, Vite, and Tailwind CSS
- Icons from Lucide React
- Form handling by Formspree

---

**Enjoy learning data structures and algorithms! **
