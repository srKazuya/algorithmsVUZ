import { createInterface } from "readline";

class Graph {
    private adjacencyMatrix: number[][];

    constructor(matrix: number[][]) {
        this.adjacencyMatrix = matrix;
    }

    bfs(start: number): void {
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

    showDFS(start: number = 0): void {
        const visited = new Set<number>();
    
        const dfs = (node: number, prefix: string = "", isLeft: boolean = true) => {
            if (visited.has(node)) return;
            visited.add(node);
    
            const connector = isLeft ? "├── " : "└── ";
            console.log(prefix + connector + node);
    
            const neighbors = this.adjacencyMatrix[node]
                .map((val, idx) => (val ? idx : -1))
                .filter(idx => idx !== -1);
    
            for (let i = 0; i < neighbors.length; i++) {
                const isLast = i === neighbors.length - 1;
                dfs(neighbors[i], prefix + (isLeft ? "│   " : "    "), !isLast);
            }
        };
    
        console.log("DFS-представление графа:");
        dfs(start, "", false);
    }
    
}


const defaultMatrix: number[][] = [
    [0, 1, 1, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0],
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
                graph.showDFS();
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
