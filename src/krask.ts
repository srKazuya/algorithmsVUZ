import { createInterface } from "readline";

class Graph {
    private adjacencyMatrix: number[][];
    private size: number;
    private valid: boolean;

    constructor(matrix: number[][]) {
        this.adjacencyMatrix = matrix;
        this.size = matrix.length;
        this.valid = this.validateMatrix(matrix);
        if (!this.valid) {
            console.log("Ошибка: Матрица должна быть квадратной и не иметь петель.");
        }
    }

    private validateMatrix(matrix: number[][]): boolean {
        const size = matrix.length;
        for (let i = 0; i < size; i++) {
            if (matrix[i].length !== size) return false;
            if (matrix[i][i] !== Infinity) return false;
            for (let j = 0; j < size; j++) {
                const value = matrix[i][j];
                if (value < 0) return false; 
            }
        }
        return true;
    }


    show(): void {
        if (!this.valid) return console.log("Матрица некорректна.");
        console.log("Связи графа:");
        const seen = new Set<string>();
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const weight = this.adjacencyMatrix[i][j];
                if (weight !== Infinity) {
                    const key = `${Math.min(i, j)}-${Math.max(i, j)}`;
                    if (!seen.has(key)) {
                        console.log(`${i} <-> ${j} (вес: ${weight})`);
                        seen.add(key);
                    }
                }
            }
        }
    }

    findMSTKruskal(): void {
        if (!this.valid) return console.log("Матрица некорректна.");

        const parent = Array.from({ length: this.size }, (_, i) => i);
        const find = (x: number): number => x === parent[x] ? x : (parent[x] = find(parent[x]));
        const union = (x: number, y: number): boolean => {
            const rootX = find(x), rootY = find(y);
            if (rootX === rootY) return false;
            parent[rootY] = rootX;
            return true;
        };

        const edges: { u: number; v: number; weight: number }[] = [];

        for (let i = 0; i < this.size; i++) {
            for (let j = i + 1; j < this.size; j++) {
                const w = this.adjacencyMatrix[i][j];
                if (w !== Infinity) {
                    edges.push({ u: i, v: j, weight: w });
                }
            }
        }

        edges.sort((a, b) => a.weight - b.weight);

        const mst: typeof edges = [];
        let totalWeight = 0;

        for (const edge of edges) {
            if (union(edge.u, edge.v)) {
                mst.push(edge);
                totalWeight += edge.weight;
            }
        }

        console.log("Остовное дерево (Краскал):");
        for (const { u, v, weight } of mst) {
            console.log(`${u} — ${v} (вес: ${weight})`);
        }
        console.log("Общий вес:", totalWeight);
    }

    findMSTPrim(): void {
        if (!this.valid) return console.log("Матрица некорректна.");

        const selected = new Array(this.size).fill(false);
        const edgeTo = new Array(this.size).fill(-1);
        const minWeight = new Array(this.size).fill(Infinity);
        minWeight[0] = 0;

        for (let i = 0; i < this.size; i++) {
            let u = -1;
            let min = Infinity;
            for (let j = 0; j < this.size; j++) {
                if (!selected[j] && minWeight[j] < min) {
                    min = minWeight[j];
                    u = j;
                }
            }

            if (u === -1) break;

            selected[u] = true;

            for (let v = 0; v < this.size; v++) {
                const weight = this.adjacencyMatrix[u][v];
                if (!selected[v] && weight < minWeight[v]) {
                    minWeight[v] = weight;
                    edgeTo[v] = u;
                }
            }
        }

        let total = 0;
        console.log("Остовное дерево (Прим):");
        for (let v = 1; v < this.size; v++) {
            const u = edgeTo[v];
            if (u !== -1) {
                const w = this.adjacencyMatrix[u][v];
                console.log(`${u} — ${v} (вес: ${w})`);
                total += w;
            }
        }
        console.log("Общий вес:", total);
    }
}

const defaultMatrix: number[][] = [
    [Infinity, 5, 2, Infinity],
    [5, Infinity, 1, 3],
    [2, 1, Infinity, 4],
    [Infinity, 3, 4, Infinity],
];

const graph = new Graph(defaultMatrix);
const rl = createInterface({ input: process.stdin, output: process.stdout });

function ask() {
    rl.question("Команды: show, kruskal, prim, exit\n> ", (cmd) => {
        switch (cmd.trim()) {
            case "show":
                graph.show();
                break;
            case "kruskal":
                graph.findMSTKruskal();
                break;
            case "prim":
                graph.findMSTPrim();
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
