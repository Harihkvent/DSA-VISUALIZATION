// Code examples for all algorithms in C++, Java, and Python

export const codeExamples = {
  'Bubble': {
    cpp: `// Bubble Sort in C++
void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
            }
        }
    }
}

// Time: O(n²), Space: O(1)`,
    java: `// Bubble Sort in Java
public static void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}

// Time: O(n²), Space: O(1)`,
    python: `# Bubble Sort in Python
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

# Time: O(n²), Space: O(1)`
  },
  'Selection': {
    cpp: `// Selection Sort in C++
void selectionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        swap(arr[i], arr[minIdx]);
    }
}

// Time: O(n²), Space: O(1)`,
    java: `// Selection Sort in Java
public static void selectionSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        int temp = arr[i];
        arr[i] = arr[minIdx];
        arr[minIdx] = temp;
    }
}

// Time: O(n²), Space: O(1)`,
    python: `# Selection Sort in Python
def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr

# Time: O(n²), Space: O(1)`
  },
  'Insertion': {
    cpp: `// Insertion Sort in C++
void insertionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}

// Time: O(n²), Space: O(1)`,
    java: `// Insertion Sort in Java
public static void insertionSort(int[] arr) {
    int n = arr.length;
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}

// Time: O(n²), Space: O(1)`,
    python: `# Insertion Sort in Python
def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr

# Time: O(n²), Space: O(1)`
  },
  'Merge': {
    cpp: `// Merge Sort in C++
void merge(vector<int>& arr, int l, int mid, int r) {
    vector<int> temp;
    int i = l, j = mid + 1;
    
    while (i <= mid && j <= r) {
        if (arr[i] <= arr[j]) temp.push_back(arr[i++]);
        else temp.push_back(arr[j++]);
    }
    while (i <= mid) temp.push_back(arr[i++]);
    while (j <= r) temp.push_back(arr[j++]);
    
    for (int k = 0; k < temp.size(); k++) {
        arr[l + k] = temp[k];
    }
}

void mergeSort(vector<int>& arr, int l, int r) {
    if (l < r) {
        int mid = (l + r) / 2;
        mergeSort(arr, l, mid);
        mergeSort(arr, mid + 1, r);
        merge(arr, l, mid, r);
    }
}

// Time: O(n log n), Space: O(n)`,
    java: `// Merge Sort in Java
public static void merge(int[] arr, int l, int mid, int r) {
    int n1 = mid - l + 1, n2 = r - mid;
    int[] L = new int[n1], R = new int[n2];
    
    for (int i = 0; i < n1; i++) L[i] = arr[l + i];
    for (int j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];
    
    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) arr[k++] = L[i++];
        else arr[k++] = R[j++];
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}

public static void mergeSort(int[] arr, int l, int r) {
    if (l < r) {
        int mid = (l + r) / 2;
        mergeSort(arr, l, mid);
        mergeSort(arr, mid + 1, r);
        merge(arr, l, mid, r);
    }
}

// Time: O(n log n), Space: O(n)`,
    python: `# Merge Sort in Python
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    result.extend(left[i:])
    result.extend(right[j:])
    return result

# Time: O(n log n), Space: O(n)`
  },
  'Quick': {
    cpp: `// Quick Sort in C++
int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return i + 1;
}

void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

// Time: O(n log n) avg, O(n²) worst
// Space: O(log n)`,
    java: `// Quick Sort in Java
public static int partition(int[] arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    return i + 1;
}

public static void quickSort(int[] arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

// Time: O(n log n) avg, O(n²) worst
// Space: O(log n)`,
    python: `# Quick Sort in Python
def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    
    pivot = arr[-1]
    left = [x for x in arr[:-1] if x < pivot]
    right = [x for x in arr[:-1] if x >= pivot]
    
    return quick_sort(left) + [pivot] + quick_sort(right)

# Time: O(n log n) avg, O(n²) worst
# Space: O(log n)`
  },
  'Linear': {
    cpp: `// Linear Search in C++
int linearSearch(vector<int>& arr, int target) {
    for (int i = 0; i < arr.size(); i++) {
        if (arr[i] == target) {
            return i;
        }
    }
    return -1; // Not found
}

// Time: O(n), Space: O(1)`,
    java: `// Linear Search in Java
public static int linearSearch(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == target) {
            return i;
        }
    }
    return -1; // Not found
}

// Time: O(n), Space: O(1)`,
    python: `# Linear Search in Python
def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1  # Not found

# Time: O(n), Space: O(1)`
  },
  'Binary': {
    cpp: `// Binary Search in C++
int binarySearch(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1; // Not found
}

// Time: O(log n), Space: O(1)
// Note: Array must be sorted`,
    java: `// Binary Search in Java
public static int binarySearch(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1; // Not found
}

// Time: O(log n), Space: O(1)
// Note: Array must be sorted`,
    python: `# Binary Search in Python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1  # Not found

# Time: O(log n), Space: O(1)
# Note: Array must be sorted`
  },
  'Reverse Vowels': {
    cpp: `// Reverse Vowels in C++
bool isVowel(char c) {
    return (c == 'a' || c == 'e' || c == 'i' || 
            c == 'o' || c == 'u' || c == 'A' || 
            c == 'E' || c == 'I' || c == 'O' || c == 'U');
}

string reverseVowels(string s) {
    int left = 0, right = s.length() - 1;
    
    while (left < right) {
        while (left < right && !isVowel(s[left])) {
            left++;
        }
        while (left < right && !isVowel(s[right])) {
            right--;
        }
        if (left < right) {
            swap(s[left], s[right]);
            left++;
            right--;
        }
    }
    return s;
}

// Time: O(n), Space: O(1)`,
    java: `// Reverse Vowels in Java
public static boolean isVowel(char c) {
    return "aeiouAEIOU".indexOf(c) != -1;
}

public static String reverseVowels(String s) {
    char[] chars = s.toCharArray();
    int left = 0, right = chars.length - 1;
    
    while (left < right) {
        while (left < right && !isVowel(chars[left])) {
            left++;
        }
        while (left < right && !isVowel(chars[right])) {
            right--;
        }
        if (left < right) {
            char temp = chars[left];
            chars[left] = chars[right];
            chars[right] = temp;
            left++;
            right--;
        }
    }
    return new String(chars);
}

// Time: O(n), Space: O(n)`,
    python: `# Reverse Vowels in Python
def reverse_vowels(s):
    vowels = set('aeiouAEIOU')
    s = list(s)
    left, right = 0, len(s) - 1
    
    while left < right:
        while left < right and s[left] not in vowels:
            left += 1
        while left < right and s[right] not in vowels:
            right -= 1
        if left < right:
            s[left], s[right] = s[right], s[left]
            left += 1
            right -= 1
    
    return ''.join(s)

# Time: O(n), Space: O(n)`
  },
  'Max Window Sum (k)': {
    cpp: `// Max Window Sum in C++
int maxWindowSum(vector<int>& arr, int k) {
    if (k > arr.size()) return -1;
    
    int windowSum = 0;
    for (int i = 0; i < k; i++) {
        windowSum += arr[i];
    }
    
    int maxSum = windowSum;
    for (int i = k; i < arr.size(); i++) {
        windowSum += arr[i] - arr[i - k];
        maxSum = max(maxSum, windowSum);
    }
    
    return maxSum;
}

// Time: O(n), Space: O(1)`,
    java: `// Max Window Sum in Java
public static int maxWindowSum(int[] arr, int k) {
    if (k > arr.length) return -1;
    
    int windowSum = 0;
    for (int i = 0; i < k; i++) {
        windowSum += arr[i];
    }
    
    int maxSum = windowSum;
    for (int i = k; i < arr.length; i++) {
        windowSum += arr[i] - arr[i - k];
        maxSum = Math.max(maxSum, windowSum);
    }
    
    return maxSum;
}

// Time: O(n), Space: O(1)`,
    python: `# Max Window Sum in Python
def max_window_sum(arr, k):
    if k > len(arr):
        return -1
    
    window_sum = sum(arr[:k])
    max_sum = window_sum
    
    for i in range(k, len(arr)):
        window_sum += arr[i] - arr[i - k]
        max_sum = max(max_sum, window_sum)
    
    return max_sum

# Time: O(n), Space: O(1)`
  },
  'Stack': {
    cpp: `// Stack Implementation in C++
class Stack {
    vector<int> stack;
public:
    void push(int val) {
        stack.push_back(val);
    }
    
    int pop() {
        if (stack.empty()) return -1;
        int val = stack.back();
        stack.pop_back();
        return val;
    }
    
    int top() {
        if (stack.empty()) return -1;
        return stack.back();
    }
    
    bool empty() {
        return stack.empty();
    }
};

// All operations: O(1)`,
    java: `// Stack Implementation in Java
import java.util.ArrayList;

class Stack {
    private ArrayList<Integer> stack = new ArrayList<>();
    
    public void push(int val) {
        stack.add(val);
    }
    
    public int pop() {
        if (stack.isEmpty()) return -1;
        return stack.remove(stack.size() - 1);
    }
    
    public int top() {
        if (stack.isEmpty()) return -1;
        return stack.get(stack.size() - 1);
    }
    
    public boolean isEmpty() {
        return stack.isEmpty();
    }
}

// All operations: O(1)`,
    python: `# Stack Implementation in Python
class Stack:
    def __init__(self):
        self.stack = []
    
    def push(self, val):
        self.stack.append(val)
    
    def pop(self):
        if not self.stack:
            return None
        return self.stack.pop()
    
    def top(self):
        if not self.stack:
            return None
        return self.stack[-1]
    
    def is_empty(self):
        return len(self.stack) == 0

# All operations: O(1)`
  },
  'Queue': {
    cpp: `// Queue Implementation in C++
class Queue {
    vector<int> queue;
public:
    void enqueue(int val) {
        queue.push_back(val);
    }
    
    int dequeue() {
        if (queue.empty()) return -1;
        int val = queue.front();
        queue.erase(queue.begin());
        return val;
    }
    
    int front() {
        if (queue.empty()) return -1;
        return queue.front();
    }
    
    bool empty() {
        return queue.empty();
    }
};

// enqueue: O(1), dequeue: O(n)
// Better: use deque for O(1) dequeue`,
    java: `// Queue Implementation in Java
import java.util.LinkedList;

class Queue {
    private LinkedList<Integer> queue = new LinkedList<>();
    
    public void enqueue(int val) {
        queue.addLast(val);
    }
    
    public int dequeue() {
        if (queue.isEmpty()) return -1;
        return queue.removeFirst();
    }
    
    public int front() {
        if (queue.isEmpty()) return -1;
        return queue.getFirst();
    }
    
    public boolean isEmpty() {
        return queue.isEmpty();
    }
}

// All operations: O(1)`,
    python: `# Queue Implementation in Python
from collections import deque

class Queue:
    def __init__(self):
        self.queue = deque()
    
    def enqueue(self, val):
        self.queue.append(val)
    
    def dequeue(self):
        if not self.queue:
            return None
        return self.queue.popleft()
    
    def front(self):
        if not self.queue:
            return None
        return self.queue[0]
    
    def is_empty(self):
        return len(self.queue) == 0

# All operations: O(1)`
  },
  'LinkedList Reverse': {
    cpp: `// Reverse Linked List in C++
struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* curr = head;
    
    while (curr != nullptr) {
        ListNode* next = curr->next;
        curr->next = prev;
        prev = curr;
        curr = next;
    }
    
    return prev;
}

// Time: O(n), Space: O(1)`,
    java: `// Reverse Linked List in Java
class ListNode {
    int val;
    ListNode next;
    ListNode(int x) { val = x; }
}

public static ListNode reverseList(ListNode head) {
    ListNode prev = null;
    ListNode curr = head;
    
    while (curr != null) {
        ListNode next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    
    return prev;
}

// Time: O(n), Space: O(1)`,
    python: `# Reverse Linked List in Python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head):
    prev = None
    curr = head
    
    while curr:
        next_node = curr.next
        curr.next = prev
        prev = curr
        curr = next_node
    
    return prev

# Time: O(n), Space: O(1)`
  },
  'Heapify': {
    cpp: `// Max Heapify in C++
void heapify(vector<int>& arr, int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;
    
    if (left < n && arr[left] > arr[largest])
        largest = left;
    
    if (right < n && arr[right] > arr[largest])
        largest = right;
    
    if (largest != i) {
        swap(arr[i], arr[largest]);
        heapify(arr, n, largest);
    }
}

void buildMaxHeap(vector<int>& arr) {
    int n = arr.size();
    for (int i = n / 2 - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }
}

// Time: O(n), Space: O(1)`,
    java: `// Max Heapify in Java
public static void heapify(int[] arr, int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;
    
    if (left < n && arr[left] > arr[largest])
        largest = left;
    
    if (right < n && arr[right] > arr[largest])
        largest = right;
    
    if (largest != i) {
        int temp = arr[i];
        arr[i] = arr[largest];
        arr[largest] = temp;
        heapify(arr, n, largest);
    }
}

public static void buildMaxHeap(int[] arr) {
    int n = arr.length;
    for (int i = n / 2 - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }
}

// Time: O(n), Space: O(1)`,
    python: `# Max Heapify in Python
def heapify(arr, n, i):
    largest = i
    left = 2 * i + 1
    right = 2 * i + 2
    
    if left < n and arr[left] > arr[largest]:
        largest = left
    
    if right < n and arr[right] > arr[largest]:
        largest = right
    
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)

def build_max_heap(arr):
    n = len(arr)
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)

# Time: O(n), Space: O(1)`
  },
  'BFS': {
    cpp: `// BFS Traversal in C++
vector<int> bfs(vector<vector<int>>& adj, int start) {
    vector<int> result;
    vector<bool> visited(adj.size(), false);
    queue<int> q;
    
    q.push(start);
    visited[start] = true;
    
    while (!q.empty()) {
        int node = q.front();
        q.pop();
        result.push_back(node);
        
        for (int neighbor : adj[node]) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                q.push(neighbor);
            }
        }
    }
    
    return result;
}

// Time: O(V + E), Space: O(V)`,
    java: `// BFS Traversal in Java
public static List<Integer> bfs(List<List<Integer>> adj, int start) {
    List<Integer> result = new ArrayList<>();
    boolean[] visited = new boolean[adj.size()];
    Queue<Integer> queue = new LinkedList<>();
    
    queue.add(start);
    visited[start] = true;
    
    while (!queue.isEmpty()) {
        int node = queue.poll();
        result.add(node);
        
        for (int neighbor : adj.get(node)) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                queue.add(neighbor);
            }
        }
    }
    
    return result;
}

// Time: O(V + E), Space: O(V)`,
    python: `# BFS Traversal in Python
from collections import deque

def bfs(adj, start):
    result = []
    visited = [False] * len(adj)
    queue = deque([start])
    visited[start] = True
    
    while queue:
        node = queue.popleft()
        result.append(node)
        
        for neighbor in adj[node]:
            if not visited[neighbor]:
                visited[neighbor] = True
                queue.append(neighbor)
    
    return result

# Time: O(V + E), Space: O(V)`
  },
  'DFS': {
    cpp: `// DFS Traversal in C++
void dfsHelper(vector<vector<int>>& adj, int node, 
               vector<bool>& visited, vector<int>& result) {
    visited[node] = true;
    result.push_back(node);
    
    for (int neighbor : adj[node]) {
        if (!visited[neighbor]) {
            dfsHelper(adj, neighbor, visited, result);
        }
    }
}

vector<int> dfs(vector<vector<int>>& adj, int start) {
    vector<int> result;
    vector<bool> visited(adj.size(), false);
    dfsHelper(adj, start, visited, result);
    return result;
}

// Time: O(V + E), Space: O(V)`,
    java: `// DFS Traversal in Java
public static void dfsHelper(List<List<Integer>> adj, int node,
                             boolean[] visited, List<Integer> result) {
    visited[node] = true;
    result.add(node);
    
    for (int neighbor : adj.get(node)) {
        if (!visited[neighbor]) {
            dfsHelper(adj, neighbor, visited, result);
        }
    }
}

public static List<Integer> dfs(List<List<Integer>> adj, int start) {
    List<Integer> result = new ArrayList<>();
    boolean[] visited = new boolean[adj.size()];
    dfsHelper(adj, start, visited, result);
    return result;
}

// Time: O(V + E), Space: O(V)`,
    python: `# DFS Traversal in Python
def dfs_helper(adj, node, visited, result):
    visited[node] = True
    result.append(node)
    
    for neighbor in adj[node]:
        if not visited[neighbor]:
            dfs_helper(adj, neighbor, visited, result)

def dfs(adj, start):
    result = []
    visited = [False] * len(adj)
    dfs_helper(adj, start, visited, result)
    return result

# Time: O(V + E), Space: O(V)`
  },
  'Binary Tree Traversals': {
    cpp: `// Binary Tree Traversals in C++
struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

// Inorder: Left -> Root -> Right
void inorder(TreeNode* root, vector<int>& result) {
    if (!root) return;
    inorder(root->left, result);
    result.push_back(root->val);
    inorder(root->right, result);
}

// Preorder: Root -> Left -> Right
void preorder(TreeNode* root, vector<int>& result) {
    if (!root) return;
    result.push_back(root->val);
    preorder(root->left, result);
    preorder(root->right, result);
}

// Postorder: Left -> Right -> Root
void postorder(TreeNode* root, vector<int>& result) {
    if (!root) return;
    postorder(root->left, result);
    postorder(root->right, result);
    result.push_back(root->val);
}

// Level-order (BFS)
vector<int> levelOrder(TreeNode* root) {
    vector<int> result;
    if (!root) return result;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        TreeNode* node = q.front();
        q.pop();
        result.push_back(node->val);
        if (node->left) q.push(node->left);
        if (node->right) q.push(node->right);
    }
    return result;
}

// Time: O(n), Space: O(h) for recursive`,
    java: `// Binary Tree Traversals in Java
class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int x) { val = x; }
}

// Inorder: Left -> Root -> Right
public static void inorder(TreeNode root, List<Integer> result) {
    if (root == null) return;
    inorder(root.left, result);
    result.add(root.val);
    inorder(root.right, result);
}

// Preorder: Root -> Left -> Right
public static void preorder(TreeNode root, List<Integer> result) {
    if (root == null) return;
    result.add(root.val);
    preorder(root.left, result);
    preorder(root.right, result);
}

// Postorder: Left -> Right -> Root
public static void postorder(TreeNode root, List<Integer> result) {
    if (root == null) return;
    postorder(root.left, result);
    postorder(root.right, result);
    result.add(root.val);
}

// Level-order (BFS)
public static List<Integer> levelOrder(TreeNode root) {
    List<Integer> result = new ArrayList<>();
    if (root == null) return result;
    Queue<TreeNode> queue = new LinkedList<>();
    queue.add(root);
    while (!queue.isEmpty()) {
        TreeNode node = queue.poll();
        result.add(node.val);
        if (node.left != null) queue.add(node.left);
        if (node.right != null) queue.add(node.right);
    }
    return result;
}

// Time: O(n), Space: O(h) for recursive`,
    python: `# Binary Tree Traversals in Python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

# Inorder: Left -> Root -> Right
def inorder(root, result):
    if not root:
        return
    inorder(root.left, result)
    result.append(root.val)
    inorder(root.right, result)

# Preorder: Root -> Left -> Right
def preorder(root, result):
    if not root:
        return
    result.append(root.val)
    preorder(root.left, result)
    preorder(root.right, result)

# Postorder: Left -> Right -> Root
def postorder(root, result):
    if not root:
        return
    postorder(root.left, result)
    postorder(root.right, result)
    result.append(root.val)

# Level-order (BFS)
def level_order(root):
    result = []
    if not root:
        return result
    queue = [root]
    while queue:
        node = queue.pop(0)
        result.append(node.val)
        if node.left:
            queue.append(node.left)
        if node.right:
            queue.append(node.right)
    return result

# Time: O(n), Space: O(h) for recursive`
  },
  'Kadane (Max Subarray)': {
    cpp: `// Kadane's Algorithm in C++
int maxSubArray(vector<int>& nums) {
    int maxSoFar = nums[0];
    int currentMax = nums[0];
    
    for (int i = 1; i < nums.size(); i++) {
        currentMax = max(nums[i], currentMax + nums[i]);
        maxSoFar = max(maxSoFar, currentMax);
    }
    
    return maxSoFar;
}

// Time: O(n), Space: O(1)`,
    java: `// Kadane's Algorithm in Java
public static int maxSubArray(int[] nums) {
    int maxSoFar = nums[0];
    int currentMax = nums[0];
    
    for (int i = 1; i < nums.length; i++) {
        currentMax = Math.max(nums[i], currentMax + nums[i]);
        maxSoFar = Math.max(maxSoFar, currentMax);
    }
    
    return maxSoFar;
}

// Time: O(n), Space: O(1)`,
    python: `# Kadane's Algorithm in Python
def max_subarray(nums):
    max_so_far = nums[0]
    current_max = nums[0]
    
    for i in range(1, len(nums)):
        current_max = max(nums[i], current_max + nums[i])
        max_so_far = max(max_so_far, current_max)
    
    return max_so_far

# Time: O(n), Space: O(1)`
  },
  'Fibonacci DP': {
    cpp: `// Fibonacci with DP in C++
int fibonacci(int n) {
    if (n <= 1) return n;
    
    vector<int> dp(n + 1);
    dp[0] = 0;
    dp[1] = 1;
    
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    
    return dp[n];
}

// Time: O(n), Space: O(n)
// Can optimize to O(1) space using two variables`,
    java: `// Fibonacci with DP in Java
public static int fibonacci(int n) {
    if (n <= 1) return n;
    
    int[] dp = new int[n + 1];
    dp[0] = 0;
    dp[1] = 1;
    
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    
    return dp[n];
}

// Time: O(n), Space: O(n)
// Can optimize to O(1) space using two variables`,
    python: `# Fibonacci with DP in Python
def fibonacci(n):
    if n <= 1:
        return n
    
    dp = [0] * (n + 1)
    dp[0] = 0
    dp[1] = 1
    
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    
    return dp[n]

# Time: O(n), Space: O(n)
# Can optimize to O(1) space using two variables`
  }
};
