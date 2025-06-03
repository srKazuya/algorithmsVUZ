class TreeNode {
  value: number;
  left: TreeNode | null = null;
  right: TreeNode | null = null;

  constructor(value: number) {
    this.value = value;
  }
}

class BinaryTree {
  root: TreeNode | null = null;

  insert(value: number) {
    const newNode = new TreeNode(value);
    if (!this.root) {
      this.root = newNode;
      return;
    }
    let current: TreeNode | null = this.root;
    while (current) {
      if (value < current.value) {
        if (!current.left) {
          current.left = newNode;
          return;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = newNode;
          return;
        }
        current = current.right;
      }
    }
  }

  insertRandom(n: number) {
    console.time(`Вставка ${n} случайных чисел`);
    for (let i = 0; i < n; i++) {
      const val = Math.floor(Math.random() * 10000) + 1;
      this.insert(val);
    }
    console.timeEnd(`Вставка ${n} случайных чисел`);
  }

  delete(value: number): void {
    console.time("Удаление");
    this.root = this._deleteNode(this.root, value);
    console.timeEnd("Удаление");
  }

  private _deleteNode(root: TreeNode | null, value: number): TreeNode | null {
    if (!root) return null;

    if (value < root.value) {
      root.left = this._deleteNode(root.left, value);
    } else if (value > root.value) {
      root.right = this._deleteNode(root.right, value);
    } else {
      if (!root.left) return root.right;
      if (!root.right) return root.left;

      const minNode = this._findMin(root.right);
      root.value = minNode.value;
      root.right = this._deleteNode(root.right, minNode.value);
    }
    return root;
  }

  private _findMin(node: TreeNode): TreeNode {
    while (node.left) {
      node = node.left;
    }
    return node;
  }

  bfs(target?: number): void {
    console.time("BFS (итеративный)");
    if (!this.root) {
      console.log("Дерево пустое.");
      console.timeEnd("BFS (итеративный)");
      return;
    }

    const queue: TreeNode[] = [this.root];
    const result: number[] = [];

    while (queue.length) {
      const node = queue.shift()!;
      result.push(node.value);

      if (target !== undefined && node.value === target) {
        console.log(`Найдено: ${node.value}`);
        console.timeEnd("BFS (итеративный)");
        console.log("Результат:", result);
        return;
      }

      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    console.timeEnd("BFS (итеративный)");
    console.log("Результат:", result);
  }

  bfsRecursive(target?: number): void {
    console.time("BFS (рекурсивный)");
    if (!this.root) {
      console.log("Дерево пустое.");
      console.timeEnd("BFS (рекурсивный)");
      return;
    }

    function traverse(queue: TreeNode[], result: number[]): void {
      if (!queue.length) return;

      const node = queue.shift()!;
      result.push(node.value);

      if (target !== undefined && node.value === target) {
        console.log(`Найдено: ${node.value}`);
        return;
      }

      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);

      traverse(queue, result);
    }

    const result: number[] = [];
    traverse([this.root], result);
    console.timeEnd("BFS (рекурсивный)");
    console.log("Результат:", result);
  }

  dfsIterative(target?: number): void {
    console.time("DFS Pre-Order (итеративный)");
    if (!this.root) {
      console.log("Дерево пустое.");
      console.timeEnd("DFS Pre-Order (итеративный)");
      return;
    }

    const stack: TreeNode[] = [this.root];
    const result: number[] = [];
    let found: number | null = null;

    while (stack.length) {
      const node = stack.pop()!;
      result.push(node.value);
      if (node.value === target) found = node.value;

      if (node.right) stack.push(node.right);
      if (node.left) stack.push(node.left);
    }

    console.timeEnd("DFS Pre-Order (итеративный)");
    console.log("Результат:", result);
    if (target !== undefined) {
      console.log(
        found !== null ? `Найдено: ${found}` : `Число ${target} не найдено.`
      );
    }
  }

  dfsInOrder(target?: number): void {
    console.time("DFS In-Order");
    const result: number[] = [];
    let found: number | null = null;

    function traverse(node: TreeNode | null) {
      if (!node || found !== null) return;
      traverse(node.left);
      result.push(node.value);
      if (node.value === target) found = node.value;
      traverse(node.right);
    }

    traverse(this.root);
    console.timeEnd("DFS In-Order");
    console.log("Результат:", result);
    if (target !== undefined) {
      console.log(
        found !== null ? `Найдено: ${found}` : `Число ${target} не найдено.`
      );
    }
  }

  dfsPreOrder(target?: number): void {
    console.time("DFS Pre-Order");
    const result: number[] = [];
    let found: number | null = null;

    function traverse(node: TreeNode | null) {
      if (!node || found !== null) return;
      result.push(node.value);
      if (node.value === target) found = node.value;
      traverse(node.left);
      traverse(node.right);
    }

    traverse(this.root);
    console.timeEnd("DFS Pre-Order");
    console.log("Результат:", result);
    if (target !== undefined) {
      console.log(
        found !== null ? `Найдено: ${found}` : `Число ${target} не найдено.`
      );
    }
  }

  dfsPostOrder(target?: number): void {
    console.time("DFS Post-Order");
    const result: number[] = [];
    let found: number | null = null;

    function traverse(node: TreeNode | null) {
      if (!node || found !== null) return;
      traverse(node.left);
      traverse(node.right);
      result.push(node.value);
      if (node.value === target) found = node.value;
    }

    traverse(this.root);
    console.timeEnd("DFS Post-Order");
    console.log("Результат:", result);
    if (target !== undefined) {
      console.log(
        found !== null ? `Найдено: ${found}` : `Число ${target} не найдено.`
      );
    }
  }

  printTree(
    node: TreeNode | null = this.root,
    prefix: string = "",
    isLeft: boolean = true
  ) {
    if (!node) return;
    console.log(prefix + (isLeft ? "├── " : "└── ") + node.value);
    this.printTree(node.left, prefix + (isLeft ? "│   " : "    "), true);
    this.printTree(node.right, prefix + (isLeft ? "│   " : "    "), false);
  }
}

import { createInterface } from "readline";

const tree = new BinaryTree();

const readline = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask() {
  readline.question(
    "Введите команду (insert <n>, insert-random <n>, delete <n>, bfs-it <n>, bfs-rec <n>, dfs-it <n>, dfs-in <n>, dfs-pre <n>, dfs-post <n>, exit): ",
    (cmd: string) => {
      const [operation, arg] = cmd.split(" ");
      const value = Number(arg);

      tree.printTree();

      switch (operation) {
        case "insert":
          if (!isNaN(value)) {
            console.time(`Вставка ${value}`);
            tree.insert(value);
            console.timeEnd(`Вставка ${value}`);
          }
          break;
        case "insert-random":
          if (!isNaN(value)) tree.insertRandom(value);
          break;
        case "delete":
          if (!isNaN(value)) tree.delete(value);
          break;
        case "bfs-it":
          tree.bfs(isNaN(value) ? undefined : value);
          break;
        case "bfs-rec":
          tree.bfsRecursive(isNaN(value) ? undefined : value);
          break;
        case "dfs-it":
          tree.dfsIterative(isNaN(value) ? undefined : value);
          break;
        case "dfs-in":
          tree.dfsInOrder(isNaN(value) ? undefined : value);
          break;
        case "dfs-pre":
          tree.dfsPreOrder(isNaN(value) ? undefined : value);
          break;
        case "dfs-post":
          tree.dfsPostOrder(isNaN(value) ? undefined : value);
          break;
        case "exit":
          readline.close();
          return;
        default:
          console.log("Неизвестная команда");
      }

      ask();
    }
  );
}

ask();
