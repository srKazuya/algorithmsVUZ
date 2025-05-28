import { createInterface } from "readline";

class Graph {
    private adjacencyMatrix: number[][];
    private valid: boolean;

    constructor(matrix: number[][]) {
        this.adjacencyMatrix = matrix;
        this.valid = this.validateMatrix(matrix);
        if (!this.valid) {
            console.log("Ошибка: Матрица должна содержать только 0 и 1, и не иметь петель.");
        }
    }

    private validateMatrix(matrix: number[][]): boolean {
        const size = matrix.length;
        for (let i = 0; i < size; i++) {
            if (matrix[i].length !== size) return false;
            for (let j = 0; j < size; j++) {
                const value = matrix[i][j];
                if (value !== 0 && value !== 1) return false;
                if (i === j && value !==0) return false
            }
        }
        return true;
    }

    bfs(start: number): void {
        if (!this.valid) return console.log("Невозможно выполнить BFS: матрица некорректна.");
        const visited = new Set<number>();
        const queue: number[] = [start];
        const result: number[] = [];

        while (queue.length > 0) {
            const node = queue.shift()!;
            if (visited.has(node)) continue;
            visited.add(node);
            result.push(node);

            for (let i = 0; i < this.adjacencyMatrix[node].length; i++) {
                if (this.adjacencyMatrix[node][i] === 1 && !visited.has(i)) {
                    queue.push(i);
                }
            }
        }

        console.log(`BFS с узла ${start}:`, result);
    }

    dfs(start: number): void {
        if (!this.valid) return console.log("Невозможно выполнить DFS: матрица некорректна.");
        const visited = new Set<number>();
        const stack: number[] = [start];
        const result: number[] = [];

        while (stack.length > 0) {
            const node = stack.pop()!;
            if (visited.has(node)) continue;
            visited.add(node);
            result.push(node);

            for (let i = this.adjacencyMatrix[node].length - 1; i >= 0; i--) {
                if (this.adjacencyMatrix[node][i] === 1 && !visited.has(i)) {
                    stack.push(i);
                }
            }
        }

        console.log(`DFS с узла ${start}:`, result);
    }

    show(): void {
        if (!this.valid) return console.log("Невозможно отобразить связи: матрица некорректна.");
        console.log("Связи графа:");
        const seen = new Set<string>();
        for (let from = 0; from < this.adjacencyMatrix.length; from++) {
            for (let to = 0; to < this.adjacencyMatrix[from].length; to++) {
                if (this.adjacencyMatrix[from][to] === 1) {
                    const key = `${Math.min(from, to)}-${Math.max(from, to)}`;
                    if (!seen.has(key)) {
                        console.log(`${from} <-> ${to}`);
                        seen.add(key);
                    }
                }
            }
        }
    }
}

// const defaultMatrix: number[][] = [
// //     [0, 0, 0, 1, 1, 0, -1],
// //     [0, 0, 1, 0, 0, 0, 1],
// //     [0, 1, 0, 0, 0, 0, 0],
// //     [1, 0, 0, 0, 0, 0, 0],
// //     [0, 0, 1, 0, 0, 1, 0],
// //     [1, 0, 1, 1, 1, 1, 1],
// //     [0, 1, 0, 0, 0, 1, 0],
// // ];

const defaultMatrix: number[][] = [
    [0, 1, 0, 1, 1, 0, 0],
    [1, 0, 1, 0, 0, 0, 1],
    [0, 1, 0, 0, 0, 1, 0],
    [1, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 1, 0],
    [0, 0, 1, 0, 1, 0, 1],
    [0, 1, 0, 0, 0, 1, 0],
];


const graph = new Graph(defaultMatrix);
const rl = createInterface({ input: process.stdin, output: process.stdout });

function ask() {
    rl.question("Команды: bfs <номер>, dfs <номер>, show, exit\n> ", (cmd) => {
        const [op, arg] = cmd.trim().split(" ");
        const start = Number(arg);

        switch (op) {
            case "bfs":
                if (!isNaN(start)) graph.bfs(start);
                else console.log("Укажите корректный стартовый узел.");
                break;
            case "dfs":
                if (!isNaN(start)) graph.dfs(start);
                else console.log("Укажите корректный стартовый узел.");
                break;
            case "show":
                graph.show();
                break;
            case "exit":
                rl.close();
                return;
            default:
                console.log("Неизвестная команда.");
        }
        ask();
    });
}

ask();
