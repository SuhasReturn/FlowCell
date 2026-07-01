import type { ExampleSnippet } from '../types';

export const examples: ExampleSnippet[] = [
  // ── JavaScript ────────────────────────────────────────────
  {
    key: 'factorial',
    label: 'Recursive Factorial',
    language: 'javascript',
    code: `// Recursive factorial with a result variable
const limit = 10;

function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

function printResult(value) {
  console.log("Result:", value);
}

const result = factorial(limit);
printResult(result);`,
  },
  {
    key: 'array-processing',
    label: 'Array Pipeline',
    language: 'javascript',
    code: `// Array processing with chained function calls
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const threshold = 5;

function filterAbove(arr) {
  return arr.filter(n => n > threshold);
}

function doubleValues(arr) {
  return arr.map(n => n * 2);
}

function sumArray(arr) {
  return arr.reduce((a, b) => a + b, 0);
}

function processData(data) {
  const filtered = filterAbove(data);
  const doubled = doubleValues(filtered);
  return sumArray(doubled);
}

const total = processData(numbers);`,
  },
  {
    key: 'callbacks',
    label: 'Callback Pattern',
    language: 'javascript',
    code: `// Simulated async with callbacks
const apiUrl = "/api/data";
let lastError = null;

function fetchData(url, onSuccess, onError) {
  const data = { name: "FlowCell" };
  if (data) {
    onSuccess(data);
  } else {
    onError("No data found");
  }
}

function handleSuccess(data) {
  formatOutput(data);
}

function handleError(message) {
  lastError = message;
  logError(message);
}

function formatOutput(data) {
  console.log("Formatted:", data);
}

function logError(msg) {
  console.error("Error:", msg);
}

fetchData(apiUrl, handleSuccess, handleError);`,
  },
  {
    key: 'counter',
    label: 'Counter Module',
    language: 'javascript',
    code: `// Simple counter module pattern
let count = 0;
const step = 1;
const maxCount = 100;

function increment() {
  if (count < maxCount) {
    count = count + step;
  }
  return count;
}

function decrement() {
  count = count - step;
  return count;
}

function reset() {
  count = 0;
  return count;
}

function getStatus() {
  const value = increment();
  if (value >= maxCount) {
    reset();
  }
  return count;
}

getStatus();`,
  },
  {
    key: 'fibonacci',
    label: 'Fibonacci',
    language: 'javascript',
    code: `// Fibonacci sequence with memoization
const memo = {};

function fibonacci(n) {
  if (n <= 1) return n;
  if (memo[n]) return memo[n];
  const result = fibonacci(n - 1) + fibonacci(n - 2);
  memo[n] = result;
  return result;
}

function printSequence(count) {
  for (let i = 0; i < count; i++) {
    console.log(fibonacci(i));
  }
}

const limit = 10;
printSequence(limit);`,
  },
  {
    key: 'linked-list',
    label: 'Linked List',
    language: 'javascript',
    code: `// Simple linked list operations
let head = null;
let size = 0;

function createNode(value) {
  return { value, next: null };
}

function append(value) {
  const node = createNode(value);
  if (!head) {
    head = node;
  } else {
    let current = head;
    while (current.next) {
      current = current.next;
    }
    current.next = node;
  }
  size = size + 1;
}

function find(value) {
  let current = head;
  while (current) {
    if (current.value === value) return current;
    current = current.next;
  }
  return null;
}

function printList() {
  let current = head;
  while (current) {
    console.log(current.value);
    current = current.next;
  }
}

append(1);
append(2);
append(3);
const found = find(2);
printList();`,
  },
  {
    key: 'event-emitter',
    label: 'Event Emitter',
    language: 'javascript',
    code: `// Simple event emitter pattern
const listeners = {};

function on(event, callback) {
  if (!listeners[event]) {
    listeners[event] = [];
  }
  listeners[event].push(callback);
}

function emit(event, data) {
  if (listeners[event]) {
    listeners[event].forEach(cb => cb(data));
  }
}

function off(event, callback) {
  if (listeners[event]) {
    listeners[event] = listeners[event].filter(cb => cb !== callback);
  }
}

function logMessage(msg) {
  console.log("Received:", msg);
}

function formatMessage(msg) {
  return msg.toUpperCase();
}

on("message", logMessage);
emit("message", "hello world");`,
  },
  {
    key: 'state-machine',
    label: 'State Machine',
    language: 'javascript',
    code: `// Traffic light state machine
let currentState = "red";
const duration = 3000;

function toGreen() {
  currentState = "green";
  console.log("Light is GREEN");
}

function toYellow() {
  currentState = "yellow";
  console.log("Light is YELLOW");
}

function toRed() {
  currentState = "red";
  console.log("Light is RED");
}

function transition() {
  if (currentState === "red") {
    toGreen();
  } else if (currentState === "green") {
    toYellow();
  } else {
    toRed();
  }
}

function getState() {
  return currentState;
}

transition();
transition();
const state = getState();`,
  },

  // ── Java ──────────────────────────────────────────────────
  {
    key: 'java-hello',
    label: 'Hello World',
    language: 'java',
    code: `// Simple Java Hello World
public class Main {
    static String greeting = "Hello";
    static String target = "World";

    public static void main(String[] args) {
        String message = buildMessage();
        printMessage(message);
    }

    static String buildMessage() {
        return greeting + ", " + target + "!";
    }

    static void printMessage(String msg) {
        System.out.println(msg);
    }
}`,
  },
  {
    key: 'java-calculator',
    label: 'Calculator',
    language: 'java',
    code: `// Simple calculator with operations
public class Calculator {
    double result = 0;
    int operationCount = 0;

    double add(double a, double b) {
        result = a + b;
        operationCount = operationCount + 1;
        log(result);
        return result;
    }

    double subtract(double a, double b) {
        result = a - b;
        operationCount = operationCount + 1;
        log(result);
        return result;
    }

    double multiply(double a, double b) {
        result = a * b;
        operationCount = operationCount + 1;
        log(result);
        return result;
    }

    void reset() {
        result = 0;
        operationCount = 0;
    }

    void log(double value) {
        System.out.println("Result: " + value);
    }
}`,
  },
  {
    key: 'java-sort',
    label: 'Bubble Sort',
    language: 'java',
    code: `// Bubble sort implementation
public class Sorting {
    int comparisons = 0;
    int swaps = 0;

    void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                comparisons = comparisons + 1;
                if (compare(arr[j], arr[j + 1]) > 0) {
                    swap(arr, j, j + 1);
                }
            }
        }
        printStats();
    }

    int compare(int a, int b) {
        return a - b;
    }

    void swap(int[] arr, int i, int j) {
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
        swaps = swaps + 1;
    }

    void printStats() {
        System.out.println("Comparisons: " + comparisons);
        System.out.println("Swaps: " + swaps);
    }
}`,
  },
  {
    key: 'java-stack',
    label: 'Stack',
    language: 'java',
    code: `// Stack data structure
public class Stack {
    int[] elements = new int[100];
    int top = -1;
    int capacity = 100;

    void push(int value) {
        if (isFull()) {
            System.out.println("Stack overflow");
            return;
        }
        top = top + 1;
        elements[top] = value;
    }

    int pop() {
        if (isEmpty()) {
            System.out.println("Stack underflow");
            return -1;
        }
        int value = elements[top];
        top = top - 1;
        return value;
    }

    int peek() {
        if (isEmpty()) return -1;
        return elements[top];
    }

    boolean isEmpty() {
        return top == -1;
    }

    boolean isFull() {
        return top == capacity - 1;
    }

    int size() {
        return top + 1;
    }
}`,
  },
];

export function getExampleByKey(key: string): ExampleSnippet | undefined {
  return examples.find((e) => e.key === key);
}

export function getExamplesByLanguage(language: string): ExampleSnippet[] {
  return examples.filter((e) => e.language === language);
}
