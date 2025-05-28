import { createInterface } from "readline";

class Graph {
    private adjacencyMatrix: number[][];
    private valid: boolean;
    private size: number;

    constructor(matrix: number[][]) {
        this.adjacencyMatrix = matrix;
        this.size = matrix.length;
        this.valid = this.validateMatrix(matrix);
        if (!this.valid) {
            console.log("Ошибка: Матрица должна быть квадратной, симметричной, с неотрицательными весами и без петель.");
        }
    }

    private validateMatrix(matrix: number[][]): boolean {
        const size = matrix.length;
        for (let i = 0; i < size; i++) {
            if (matrix[i].length !== size) return false;
            for (let j = 0; j < size; j++) {
                const value = matrix[i][j];
                if (value < 0 || (i === j && value !== 0)) return false;
                if (matrix[i][j] !== matrix[j][i]) return false;
            }
        }

        return this.isConnected();
    }

    private isConnected(): boolean {
        const visited = new Set<number>();
        const stack: number[] = [0];

        while (stack.length > 0) {
            const node = stack.pop()!;
            if (visited.has(node)) continue;
            visited.add(node);
            for (let i = 0; i < this.size; i++) {
                if (this.adjacencyMatrix[node][i] > 0 && !visited.has(i)) {
                    stack.push(i);
                }
            }
        }
        return visited.size === this.size;
    }

    kruskal(): void {
        if (!this.valid) {
            console.log("Невозможно выполнить алгоритм Крfскала: матрица некорректна.");
            return;
        }


        interface Edge {
            from: number;
            to: number;
            weight: number;
        }
        const edges: Edge[] = [];
        for (let i = 0; i < this.size; i++) {
            for (let j = i + 1; j < this.size; j++) {
                if (this.adjacencyMatrix[i][j] > 0) {
                    edges.push({ from: i, to: j, weight: this.adjacencyMatrix[i][j] });
                }
            }
        }
        edges.sort((a, b) => a.weight - b.weight);


        const parent: number[] = Array.from({ length: this.size }, (_, i) => i);
        const rank: number[] = new Array(this.size).fill(0);

        const find = (x: number): number => {
            if (parent[x] !== x) {
                parent[x] = find(parent[x]); 
            }
            return parent[x];
        };

        const union = (x: number, y: number): void => {
            const px = find(x);
            const py = find(y);
            if (px === py) return;
            if (rank[px] < rank[py]) {
                parent[px] = py;
            } else if (rank[px] > rank[py]) {
                parent[py] = px;
            } else {
                parent[py] = px;
                rank[px]++;
            }
        };


        const mst: Edge[] = [];
        let totalWeight = 0;
        for (const edge of edges) {
            if (find(edge.from) !== find(edge.to)) {
                union(edge.from, edge.to);
                mst.push(edge);
                totalWeight += edge.weight;
            }
        }

        console.log("Минимальное остовное дерево (Краскал):");
        for (const edge of mst) {
            console.log(`${edge.from} -- ${edge.to} (вес: ${edge.weight})`);
        }
        console.log(`Общий вес: ${totalWeight}`);
    }

    prim(): void {
        if (!this.valid) {
            console.log("Невозможно выполнить алгоритм Прима: матрица некорректна.");
            return;
        }

        const visited: boolean[] = new Array(this.size).fill(false);
        const minEdge: number[] = new Array(this.size).fill(Infinity);
        const parent: (number | null)[] = new Array(this.size).fill(null);
        minEdge[0] = 0; 

        const mst: { from: number; to: number; weight: number }[] = [];
        let totalWeight = 0;

        for (let i = 0; i < this.size; i++) {
            let min = Infinity;
            let minNode = -1;
            for (let j = 0; j < this.size; j++) {
                if (!visited[j] && minEdge[j] < min) {
                    min = minEdge[j];
                    minNode = j;
                }
            }

            if (minNode === -1) break; 
            visited[minNode] = true;
            if (parent[minNode] !== null) {
                mst.push({ from: parent[minNode]!, to: minNode, weight: min });
                totalWeight += min;
            }

            for (let j = 0; j < this.size; j++) {
                if (this.adjacencyMatrix[minNode][j] > 0 && !visited[j]) {
                    if (this.adjacencyMatrix[minNode][j] < minEdge[j]) {
                        minEdge[j] = this.adjacencyMatrix[minNode][j];
                        parent[j] = minNode;
                    }
                }
            }
        }

        console.log("Минимальное остовное дерево (Прим):");
        for (const edge of mst) {
            console.log(`${edge.from} -- ${edge.to} (вес: ${edge.weight})`);
        }
        console.log(`Общий вес: ${totalWeight}`);
    }

    show(): void {
        if (!this.valid) return console.log("Невозможно отобразить связи: матрица некорректна.");
        console.log("Связи графа (вес ребра):");
        for (let from = 0; from < this.size; from++) {
            for (let to = from + 1; to < this.size; to++) {
                if (this.adjacencyMatrix[from][to] > 0) {
                    console.log(`${from} -- ${to} (вес: ${this.adjacencyMatrix[from][to]})`);
                }
            }
        }
    }
}


const defaultMatrix: number[][] = [
    [0, 4, 0, 1, 3],
    [4, 0, 2, 0, 0],
    [0, 2, 0, 0, 3],
    [1, 0, 0, 0, 2],
    [3, 0, 3, 2, 0],
];

const graph = new Graph(defaultMatrix);
const rl = createInterface({ input: process.stdin, output: process.stdout });

function ask() {
    rl.question("Команды: kruskal, prim, show, exit\n> ", (cmd) => {
        const op = cmd.trim();

        switch (op) {
            case "kruskal":
                graph.kruskal();
                break;
            case "prim":
                graph.prim();
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