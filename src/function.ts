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

    bfs(): number[] {
        const result: number[] = [];
        const queue: (TreeNode | null)[] = [this.root];
        while (queue.length) {
            const node = queue.shift();
            if (node) {
                result.push(node.value);
                queue.push(node.left, node.right);
            }
        }
        return result;
    }

    dfsInOrder(node: TreeNode | null = this.root, result: number[] = []): number[] {
        if (node) {
            this.dfsInOrder(node.left, result);
            result.push(node.value);
            this.dfsInOrder(node.right, result);
        }
        return result;
    }

    dfsPreOrder(node: TreeNode | null = this.root, result: number[] = []): number[] {
        if (node) {
            result.push(node.value);
            this.dfsPreOrder(node.left, result);
            this.dfsPreOrder(node.right, result);
        }
        return result;
    }

    dfsPostOrder(node: TreeNode | null = this.root, result: number[] = []): number[] {
        if (node) {
            this.dfsPostOrder(node.left, result);
            this.dfsPostOrder(node.right, result);
            result.push(node.value);
        }
        return result;
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
    readline.question("Введите команду (insert <число>, delete <число>, bfs, dfs-in, dfs-pre, dfs-post, exit): ", (cmd: string) => {
        const [operation, arg] = cmd.split(" ");
        const value = Number(arg);

        switch (operation) {
            case "insert":
                if (!isNaN(value)) tree.insert(value);
                break;
            case "delete":
                if (!isNaN(value)) tree.delete(value);
                break;
            case "bfs":
                console.log("BFS:", tree.bfs());
                break;
            case "dfs-in":
                console.log("DFS In-Order:", tree.dfsInOrder());
                break;
            case "dfs-pre":
                console.log("DFS Pre-Order:", tree.dfsPreOrder());
                break;
            case "dfs-post":
                console.log("DFS Post-Order:", tree.dfsPostOrder());
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
