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

    delete(value: number): void {
        this.root = this._deleteNode(this.root, value);
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
        if (!this.root) {
            console.log("Дерево пустое.");
            return;
        }

        const queue: TreeNode[] = [this.root];
        const result: number[] = [];

        while (queue.length) {
            const node = queue.shift()!;
            result.push(node.value);

            if (target !== undefined && node.value === target) {
                console.log(`BFS (итеративный): ${result}, Найдено: ${node.value}`);
                return;
            }

            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        

        console.log("BFS (итеративный):", result);
        if (target !== undefined) console.log(`Число ${target} не найдено.`);
    }

    bfsRecursive(target?: number): void {
        if (!this.root) {
            console.log("Дерево пустое.");
            return;
        }

        function traverse(queue: TreeNode[], result: number[]): void {
            if (!queue.length) return;

            const node = queue.shift()!;
            result.push(node.value);

            if (target !== undefined && node.value === target) {
                console.log(`BFS (рекурсивный): ${result}, Найдено: ${node.value}`);
                return;
            }

            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);

            traverse(queue, result);
        }

        const result: number[] = [];
        traverse([this.root], result);
        console.log("BFS (рекурсивный):", result);
        if (target !== undefined) console.log(`Число ${target} не найдено.`);
    }

    dfsIterative(target?: number): void {
        if (!this.root) {
            console.log("Дерево пустое.");
            return;
        }

        const stack: TreeNode[] = [this.root];
        const result: number[] = [];
        let found: number | null = null;

        while (stack.length) {
            const node = stack.pop()!;
            result.push(node.value);
            if (node.value === target) {
                found = node.value;
            }

            if (node.right) stack.push(node.right);
            if (node.left) stack.push(node.left);
        }

        console.log("DFS Pre-Order (итеративный):", result);
        if (target !== undefined) {
            console.log(found !== null ? `Найдено: ${found}` : `Число ${target} не найдено.`);
        }
    }


    dfsInOrder(target?: number): void {
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

        console.log("DFS In-Order:", result);
        if (target !== undefined) {
            if (found !== null) {
                console.log(`Найдено: ${found}`);
            } else {
                console.log(`Число ${target} не найдено.`);
            }
        }
    }

    dfsPreOrder(target?: number): void {
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

        console.log("DFS Pre-Order:", result);
        if (target !== undefined) {
            if (found !== null) {
                console.log(`Найдено: ${found}`);
            } else {
                console.log(`Число ${target} не найдено.`);
            }
        }
    }

    dfsPostOrder(target?: number): void {
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

        console.log("DFS Post-Order:", result);
        if (target !== undefined) {
            if (found !== null) {
                console.log(`Найдено: ${found}`);
            } else {
                console.log(`Число ${target} не найдено.`);
            }
        }
    }

    printTree(node: TreeNode | null = this.root, prefix: string = "", isLeft: boolean = true) {
        if (!node) return;
        console.log(prefix + (isLeft ? "├── " : "└── ") + node.value);
        this.printTree(node.left, prefix + (isLeft ? "│   " : "    "), true);
        this.printTree(node.right, prefix + (isLeft ? "│   " : "    "), false);
    }
}

const tree = new BinaryTree();
import { createInterface } from "readline";

const readline = createInterface({
    input: process.stdin,
    output: process.stdout
});

function ask() {
    readline.question("Введите команду (insert <число>, delete <число>, bfs-it <число>, bfc-rec <число>, dfs-it <число> dfs-in <число>, dfs-pre <число>, dfs-post <число>, exit): ", (cmd: string) => {
        const [operation, arg] = cmd.split(" ");
        const value = Number(arg);

        switch (operation) {
            case "insert":
                if (!isNaN(value)) tree.insert(value);
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
        tree.printTree();
        ask();
    });
}

ask();
