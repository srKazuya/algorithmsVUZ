import { createInterface } from "readline";

class Heap {
    private data: number[] = [];
    private isMinHeap: boolean;

    constructor(isMinHeap = true) {
        this.isMinHeap = isMinHeap;
    }

    private compare(a: number, b: number): boolean {
        return this.isMinHeap ? a < b : a > b;
    }

    private swap(i: number, j: number) {
        [this.data[i], this.data[j]] = [this.data[j], this.data[i]];
    }

    private heapifyDown(index: number): void {
        const left = 2 * index + 1;
        const right = 2 * index + 2; 
        let extreme = index;

    
        if (left < this.data.length && this.compare(this.data[left], this.data[extreme])) {
            extreme = left;
        }

        if (right < this.data.length && this.compare(this.data[right], this.data[extreme])) {
            extreme = right;
        }

        if (extreme !== index) {
            this.swap(index, extreme);
            this.heapifyDown(extreme);
        }
    }

    private heapifyUp(index: number): void {
        const parent = Math.floor((index - 1) / 2); 
        if (index > 0 && this.compare(this.data[index], this.data[parent])) {
            this.swap(index, parent);
            this.heapifyUp(parent); 
        }
    }

    buildHeap(values: number[]): void {
        this.data = values;
        console.log("Неупорядоченная куча:");
        // this.printTree();
    }

    heapify(isMinHeap: boolean): void {
        this.isMinHeap = isMinHeap;
        for (let i = Math.floor(this.data.length / 2) - 1; i >= 0; i--) {
            this.heapifyDown(i);
        }
        console.log(`Куча преобразована в ${isMinHeap ? "минимальную" : "максимальную"}:`);
        // this.printTree();
    }

    insert(value: number): void {
        this.data.push(value);
        this.heapifyUp(this.data.length - 1); 
        // this.printTree();
    }

    // Удаление элемента из пирамиды
    delete(value: number): void {
        const index = this.data.indexOf(value);
        if (index === -1) return;
        this.swap(index, this.data.length - 1);
        this.data.pop(); 
        this.heapifyDown(index);
        // this.printTree();
    }


    search(value: number): boolean {
        return this.data.includes(value);
    }

    heapSort(): number[] {
        console.time(`Сортировка`);
        const copied = [...this.data];
        const sorted: number[] = [];
        const tempHeap = new Heap(this.isMinHeap);
        tempHeap.buildHeap([...this.data]);

        // const start = performance.now();
        while (tempHeap.data.length > 0) {
            sorted.push(tempHeap.extractRoot());
        }
        // const end = performance.now();

        // console.log(`Сортировка заняла ${(end - start).toFixed(2)} мс`);
        console.timeEnd(`Сортировка`);
        return sorted;
    }

    extractRoot(): number {
        if (this.data.length === 0) throw new Error("Куча пуста");
        const root = this.data[0];
        this.delete(root);
        return root;
    }

    // printTree(index: number = 0, prefix: string = "", isLeft: boolean = true): void {
    //     if (index >= this.data.length) return;

    //     console.log(prefix + (isLeft ? "├── " : "└── ") + this.data[index]);

    //     const left = 2 * index + 1;
    //     const right = 2 * index + 2;

    //     const nextPrefix = prefix + (isLeft ? "│   " : "    ");
    //     this.printTree(left, nextPrefix, true);
    //     this.printTree(right, nextPrefix, false);
    // }
}

const heap = new Heap();
const initialValues = Array.from({ length: 1000000 }, () => Math.floor(Math.random() * 1000000));
console.log("Изначальный массив:", initialValues);
heap.buildHeap(initialValues);

const readline = createInterface({
    input: process.stdin,
    output: process.stdout,
});

function ask() {
    readline.question("Введите команду (heapify <min|max>, insert <число>, delete <число>, search <число>, sort, exit): ", (cmd) => {
        const [operation, arg] = cmd.trim().split(" ");
        const value = Number(arg);

        switch (operation) {
            case "heapify":
                if (arg === "min") {
                    heap.heapify(true); 
                } else if (arg === "max") {
                    heap.heapify(false); 
                } else {
                    console.log("Неверный аргумент. Используйте 'min' или 'max'.");
                }
                break;
            case "insert":
                if (!isNaN(value)) heap.insert(value);
                break;
            case "delete":
                if (!isNaN(value)) heap.delete(value);
                break;
            case "search":
                if (!isNaN(value)) {
                    const found = heap.search(value);
                    console.log(found ? "Найдено." : "Не найдено.");
                }
                break;
            case "sort":
                heap.heapSort()
                // console.log("Результат сортировки:", heap.heapSort());
                break;
            case "exit":
                readline.close();
                return;
            default:
                console.log("Неизвестная команда");
        }
        ask();
    });
}

ask();