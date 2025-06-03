import { createInterface } from "readline";

class Graph {
    private adjacencyList: Map<number, number[]>;

    constructor(size: number) {
        this.adjacencyList = new Map();
        for (let i = 0; i < size; i++) {
            this.adjacencyList.set(i, []);
        }
        this.generateRandomEdges(size);
    }

    private generateRandomEdges(size: number): void {
        const maxEdges = size * (size - 1) / 2;
        const edgeCount = Math.floor(maxEdges * 0.1);

        const edges = new Set<string>();

        while (edges.size < edgeCount) {
            const from = Math.floor(Math.random() * size);
            const to = Math.floor(Math.random() * size);
            const key = `${Math.min(from, to)}-${Math.max(from, to)}`;

            if (from !== to && !edges.has(key)) {
                this.adjacencyList.get(from)!.push(to);
                this.adjacencyList.get(to)!.push(from);
                edges.add(key);
            }
        }

        console.log(`Сгенерировано ${edges.size} случайных рёбер.`);
    }

    bfs(start: number): void {
        console.time("BFS время");
        const visited = new Set<number>();
        const queue: number[] = [start];
        const result: number[] = [];

        while (queue.length > 0) {
            const node = queue.shift()!;
            if (visited.has(node)) continue;
            visited.add(node);
            result.push(node);

            for (const neighbor of this.adjacencyList.get(node)!) {
                if (!visited.has(neighbor)) {
                    queue.push(neighbor);
                }
            }
        }

        console.timeEnd("BFS время");
        console.log(`BFS от узла ${start}:`, result.length, "узлов");
    }

    dfs(start: number): void {
        console.time("DFS время");
        const visited = new Set<number>();
        const stack: number[] = [start];
        const result: number[] = [];

        while (stack.length > 0) {
            const node = stack.pop()!;
            if (visited.has(node)) continue;
            visited.add(node);
            result.push(node);

            for (const neighbor of this.adjacencyList.get(node)!.slice().reverse()) {
                if (!visited.has(neighbor)) {
                    stack.push(neighbor);
                }
            }
        }

        console.timeEnd("DFS время");
        console.log(`DFS от узла ${start}:`, result.length, "узлов");
    }

    show(): void {
        console.log("Связи графа:");
        for (const [from, neighbors] of this.adjacencyList.entries()) {
            for (const to of neighbors) {
                if (from < to) {
                    console.log(`${from} <-> ${to}`);
                }
            }
        }
    }
}

const rl = createInterface({ input: process.stdin, output: process.stdout });

console.log("Введите количество вершин графа:");

let graph: Graph;

rl.on("line", (input) => {
    if (!graph) {
        const size = Number(input.trim());
        if (!Number.isInteger(size) || size <= 1) {
            console.log("Введите корректное целое число > 1");
            return;
        }
        graph = new Graph(size);
        console.log("Граф сгенерирован. Введите команду: bfs <номер>, dfs <номер>, show, exit");
    } else {
        const [cmd, arg] = input.trim().split(" ");
        const start = Number(arg);

        switch (cmd) {
            case "bfs":
                if (!isNaN(start)) graph.bfs(start);
                else console.log("Укажите корректный узел.");
                break;
            case "dfs":
                if (!isNaN(start)) graph.dfs(start);
                else console.log("Укажите корректный узел.");
                break;
            case "show":
                graph.show();
                break;
            case "exit":
                rl.close();
                break;
            default:
                console.log("Неизвестная команда.");
        }
    }
});
