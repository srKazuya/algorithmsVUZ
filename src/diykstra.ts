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
            console.log("Ошибка: Матрица должна быть квадратной, не содержать отрицательных весов и петель.");
        }
    }

    private validateMatrix(matrix: number[][]): boolean {
        const size = matrix.length;
        for (let i = 0; i < size; i++) {
            if (matrix[i].length !== size) return false;
            for (let j = 0; j < size; j++) {
                const value = matrix[i][j];
                
                if (value < 0) return false;
                
                if (i === j && value !== 0) return false;
            }
        }
        return true;
    }

    dijkstra(start: number, target?: number): void {
        if (!this.valid) {
            console.log("Невозможно выполнить алгоритм Дейкстры: матрица некорректна.");
            return;
        }
        if (start < 0 || start >= this.size) {
            console.log("Укажите корректный стартовый узел.");
            return;
        }
        if (target !== undefined && (target < 0 || target >= this.size)) {
            console.log("Укажите корректный целевой узел.");
            return;
        }


        const distances: number[] = new Array(this.size).fill(Infinity);
        const visited: boolean[] = new Array(this.size).fill(false);
        const previous: (number | null)[] = new Array(this.size).fill(null);
        distances[start] = 0;


        while (true) {

            let minDistance = Infinity;
            let minNode = -1;
            for (let i = 0; i < this.size; i++) {
                if (!visited[i] && distances[i] < minDistance) {
                    minDistance = distances[i];
                    minNode = i;
                }
            }

            if (minNode === -1 || (target !== undefined && minNode === target)) break;

            visited[minNode] = true;
            for (let i = 0; i < this.size; i++) {
                const weight = this.adjacencyMatrix[minNode][i];
                if (weight > 0 && !visited[i]) {
                    const newDistance = distances[minNode] + weight;
                    if (newDistance < distances[i]) {
                        distances[i] = newDistance;
                        previous[i] = minNode;
                    }
                }
            }
        }

        if (target !== undefined) {
            if (distances[target] === Infinity) {
                console.log(`Нет пути из узла ${start} в узел ${target}.`);
                return;
            }
            const path: number[] = [];
            let current: number | null = target;
            while (current !== null) {
                path.unshift(current);
                current = previous[current];
            }
            console.log(`Кратчайший путь из ${start} в ${target}: ${path.join(" -> ")}`);
            console.log(`Длина пути: ${distances[target]}`);
        } else {
            console.log(`Кратчайшие расстояния от узла ${start}:`);
            for (let i = 0; i < this.size; i++) {
                if (distances[i] === Infinity) {
                    console.log(`До узла ${i}: нет пути`);
                } else {
                    console.log(`До узла ${i}: ${distances[i]}`);
                }
            }
        }
    }

    show(): void {
        if (!this.valid) return console.log("Невозможно отобразить связи: матрица некорректна.");
        console.log("Связи графа (вес ребра):");
        for (let from = 0; from < this.adjacencyMatrix.length; from++) {
            for (let to = 0; to < this.adjacencyMatrix[from].length; to++) {
                if (this.adjacencyMatrix[from][to] > 0) {
                    console.log(`${from} -> ${to} (вес: ${this.adjacencyMatrix[from][to]})`);
                }
            }
        }
    }
}


const defaultMatrix: number[][] = [
    [0, 4, 0, 1, 3, 0, 0],
    [4, 0, 2, 0, 0, 0, 5],
    [0, 2, 0, 0, 0, 3, 0],
    [1, 0, 0, 0, 0, 0, 0],
    [3, 0, 0, 0, 0, 2, 0],
    [0, 0, 3, 0, 2, 0, 1],
    [0, 5, 0, 0, 0, 1, 0],
];

const graph = new Graph(defaultMatrix);
const rl = createInterface({ input: process.stdin, output: process.stdout });

function ask() {
    rl.question("Команды: dijkstra <start> [target], show, exit\n> ", (cmd) => {
        const parts = cmd.trim().split(" ");
        const op = parts[0];
        const start = Number(parts[1]);
        const target = parts[2] !== undefined ? Number(parts[2]) : undefined;

        switch (op) {
            case "dijkstra":
                if (!isNaN(start)) {
                    graph.dijkstra(start, target);
                } else {
                    console.log("Укажите корректный стартовый узел.");
                }
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