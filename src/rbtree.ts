import { createInterface } from "readline";

enum Color {
    Red = 'Red',
    Black = 'Black'
}

class TreeNode {
    value: number;
    color: Color;
    left: TreeNode | null = null;
    right: TreeNode | null = null;
    parent: TreeNode | null = null;

    constructor(value: number) {
        this.value = value;
        this.color = Color.Red; 
    }
}

class RedBlackTree {
    root: TreeNode | null = null;

    private rotateLeft(x: TreeNode): void {
        const y = x.right;
        if (!y) return; 

        x.right = y.left;
        if (y.left !== null) {
            y.left.parent = x;
        }
        y.parent = x.parent;
        if (x.parent === null) {
            this.root = y;
        } else if (x === x.parent.left) {
            x.parent.left = y;
        } else {
            x.parent.right = y;
        }
        y.left = x;
        x.parent = y;
    }

    private rotateRight(x: TreeNode): void {
        const y = x.left;
        if (!y) return; 

        x.left = y.right;
        if (y.right !== null) {
            y.right.parent = x;
        }
        y.parent = x.parent;
        if (x.parent === null) {
            this.root = y;
        } else if (x === x.parent.right) {
            x.parent.right = y;
        } else {
            x.parent.left = y;
        }
        y.right = x;
        x.parent = y;
    }

    private fixInsert(node: TreeNode): void {
        while (node !== this.root && node.parent?.color === Color.Red) {
            const parent = node.parent;
            const grandparent = parent.parent;

            if (!grandparent) break; 

            if (parent === grandparent.left) {
                const uncle = grandparent.right;
                if (uncle?.color === Color.Red) {
                    parent.color = Color.Black;
                    uncle.color = Color.Black;
                    grandparent.color = Color.Red;
                    node = grandparent;
                } else {
                    if (node === parent.right) {
                        node = parent;
                        this.rotateLeft(node);
                    }

                    parent.color = Color.Black;
                    grandparent.color = Color.Red;
                    this.rotateRight(grandparent);
                }
            } else {
                const uncle = grandparent.left;
                if (uncle?.color === Color.Red) {
                    parent.color = Color.Black;
                    uncle.color = Color.Black;
                    grandparent.color = Color.Red;
                    node = grandparent;
                } else {
                    if (node === parent.left) {
                        node = parent;
                        this.rotateRight(node);
                    }
                    parent.color = Color.Black;
                    grandparent.color = Color.Red;
                    this.rotateLeft(grandparent);
                }
            }
        }
        if (this.root) {
            this.root.color = Color.Black;
        }
    }

    insert(value: number): void {
        const newNode = new TreeNode(value);
        if (this.root === null) {
            this.root = newNode;
            this.root.color = Color.Black;
            return;
        }

        let current: TreeNode | null = this.root;
        let parent: TreeNode | null = null;
        while (current !== null) {
            parent = current;
            if (value < current.value) {
                current = current.left;
            } else {
                current = current.right;
            }
        }

        newNode.parent = parent;
        if (parent) {
            if (value < parent.value) {
                parent.left = newNode;
            } else {
                parent.right = newNode;
            }
        }

        this.fixInsert(newNode);
    }

    delete(value: number): void {
        const nodeToDelete = this.findNode(value);
        if (!nodeToDelete) {
            console.log(`Число ${value} не найдено в дереве.`);
            return;
        }

        let y = nodeToDelete;
        let yOriginalColor = y.color;
        let x: TreeNode | null;

        if (nodeToDelete.left === null) {
            x = nodeToDelete.right;
            this.transplant(nodeToDelete, nodeToDelete.right);
        } else if (nodeToDelete.right === null) {
            x = nodeToDelete.left;
            this.transplant(nodeToDelete, nodeToDelete.left);
        } else {
            y = this.minimum(nodeToDelete.right);
            yOriginalColor = y.color;
            x = y.right;

            if (y.parent === nodeToDelete) {
                if (x) x.parent = y;
            } else {
                this.transplant(y, y.right);
                y.right = nodeToDelete.right;
                if (y.right) y.right.parent = y;
            }

            this.transplant(nodeToDelete, y);
            y.left = nodeToDelete.left;
            if (y.left) y.left.parent = y;
            y.color = nodeToDelete.color;
        }

        if (yOriginalColor === Color.Black && x) {
            this.fixDelete(x);
        }
    }

    private fixDelete(x: TreeNode): void {
        while (x !== this.root && x.color === Color.Black) {
            if (x === x.parent?.left) {
                let w = x.parent.right;
                if (w?.color === Color.Red) {
                    w.color = Color.Black;
                    x.parent.color = Color.Red;
                    this.rotateLeft(x.parent);
                    w = x.parent.right;
                }
                if ((w?.left?.color ?? Color.Black) === Color.Black && (w?.right?.color ?? Color.Black) === Color.Black) {
                    if (w) w.color = Color.Red;
                    x = x.parent!;
                } else {
                    if ((w?.right?.color ?? Color.Black) === Color.Black) {
                        if (w?.left) w.left.color = Color.Black;
                        if (w) w.color = Color.Red;
                        if (w) this.rotateRight(w);
                        w = x.parent?.right ?? null;
                    }
                    if (w) w.color = x.parent?.color ?? Color.Black;
                    if (x.parent) x.parent.color = Color.Black;
                    if (w?.right) w.right.color = Color.Black;
                    if (x.parent) this.rotateLeft(x.parent);
                    x = this.root!;
                }
            } else {
                let w = x.parent?.left ?? null;
                if (w?.color === Color.Red) {
                    w.color = Color.Black;
                    if (x.parent) x.parent.color = Color.Red;
                    if (x.parent) this.rotateRight(x.parent);
                    w = x.parent?.left ?? null;
                }
                if ((w?.right?.color ?? Color.Black) === Color.Black && (w?.left?.color ?? Color.Black) === Color.Black) {
                    if (w) w.color = Color.Red;
                    if (x.parent) {
                        x = x.parent;
                    } else {
                        break;
                    }
                } else {
                    if ((w?.left?.color ?? Color.Black) === Color.Black) {
                        if (w?.right) w.right.color = Color.Black;
                        if (w) w.color = Color.Red;
                        if (w) this.rotateLeft(w);
                        w = x.parent?.left ?? null;
                    }
                    if (w) w.color = x.parent?.color ?? Color.Black;
                    if (x.parent) x.parent.color = Color.Black;
                    if (w?.left) w.left.color = Color.Black;
                    if (x.parent) this.rotateRight(x.parent);
                    x = this.root!;
                }
            }
        }
        x.color = Color.Black;
    }

    private transplant(u: TreeNode, v: TreeNode | null): void {
        if (u.parent === null) {
            this.root = v;
        } else if (u === u.parent.left) {
            u.parent.left = v;
        } else {
            u.parent.right = v;
        }
        if (v) v.parent = u.parent;
    }

    private minimum(node: TreeNode): TreeNode {
        while (node.left !== null) {
            node = node.left;
        }
        return node;
    }

    private findNode(value: number): TreeNode | null {
        let current = this.root;
        while (current !== null) {
            if (value === current.value) {
                return current;
            } else if (value < current.value) {
                current = current.left;
            } else {
                current = current.right;
            }
        }
        return null;
    }

    printTree(node: TreeNode | null = this.root, prefix: string = "", isLeft: boolean = true): void {
        if (node === null) return;

        const color = node.color === Color.Red ? "\x1b[31m" : "\x1b[30m"; 
        const resetColor = "\x1b[0m"; 

        console.log(prefix + (isLeft ? "├── " : "└── ") + `${color}${node.value}${resetColor}`);

        this.printTree(node.left, prefix + (isLeft ? "│   " : "    "), true);
        this.printTree(node.right, prefix + (isLeft ? "│   " : "    "), false);
    }


    createUnbalancedTree(values: number[]): void {
        this.root = null;
        let current: TreeNode | null = null;

        for (const value of values) {
            const newNode = new TreeNode(value);
            newNode.color = Color.Black; 

            if (this.root === null) {
                this.root = newNode;
                current = this.root;
            } else {
                current!.right = newNode;
                newNode.parent = current;
                current = newNode;
            }
        }
    }

    balanceTree(): void {
        const values: number[] = [];
        this.inOrderTraversal(this.root, values); 
        this.root = null; 
        for (const value of values) {
            this.insert(value);
        }
        console.log("Дерево сбалансировано с использованием поворотов.");
    }

    private inOrderTraversal(node: TreeNode | null, values: number[]): void {
        if (node === null) return;
        this.inOrderTraversal(node.left, values);
        values.push(node.value);
        this.inOrderTraversal(node.right, values);
    }


    private buildBalancedTree(values: number[], start: number, end: number): void {
        if (start > end) return;

        const mid = Math.floor((start + end) / 2);
        this.insert(values[mid]); 
        this.buildBalancedTree(values, start, mid - 1);
        this.buildBalancedTree(values, mid + 1, end);
    }
}


const rbt = new RedBlackTree();


const initialValues = [10, 20, 30, 40, 50, 60, 70, 75];
rbt.createUnbalancedTree(initialValues);

const readline = createInterface({
    input: process.stdin,
    output: process.stdout
});

function ask() {
    readline.question(
        "Введите команду (balance, insert <число>, delete <число>, exit): ",
        (cmd: string) => {
            const [operation, arg] = cmd.split(" ");
            const value = Number(arg);

            switch (operation) {
                case "balance":
                    rbt.balanceTree();
                    break;
                case "insert":
                    if (!isNaN(value)) {
                        rbt.insert(value);
                        console.log(`Число ${value} добавлено в дерево.`);
                    } else {
                        console.log("Ошибка: введите корректное число.");
                    }
                    break;
                case "delete":
                    if (!isNaN(value)) {
                        rbt.delete(value);
                        console.log(`Число ${value} удалено из дерева.`);
                    } else {
                        console.log("Ошибка: введите корректное число.");
                    }
                    break;
                case "exit":
                    console.log("Выход из программы.");
                    readline.close();
                    return;
                default:
                    console.log("Неизвестная команда. Попробуйте снова.");
            }
            console.log("Текущее состояние дерева:");
            rbt.printTree();
            ask();
        }
    );
}

// Запуск программы
console.log("Изначально несбалансированное дерево:");
rbt.printTree();
ask();
