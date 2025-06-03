import readline from "readline";

const DELETED = Symbol("DELETED");

class HashTable {
    private table: (string | typeof DELETED | null)[];
    private size: number;

    constructor(size: number) {
        this.size = size;
        this.table = new Array(size).fill(null);
    }

    private hash(value: string): number {
        let hash = 0;
        for (let i = 0; i < value.length; i++) {
            hash += value.charCodeAt(i) * (i + 1);
        }
        return hash % this.size;
    }

    insert(value: string): void {
        console.time(`insert "${value}"`);
        let index = this.hash(value);
        const startIndex = index;

        while (this.table[index] !== null && this.table[index] !== DELETED) {
            if (this.table[index] === value) {
                console.warn(`Элемент "${value}" уже существует по индексу ${index}`);
                console.timeEnd(`insert "${value}"`);
                return;
            }
            index = (index + 1) % this.size;
            if (index === startIndex) {
                console.log("Хеш-таблица заполнена.");
                this.print();
                console.timeEnd(`insert "${value}"`);
                return;
            }
        }

        this.table[index] = value;
        console.log(`"${value}" вставлен по индексу ${index}`);
        console.timeEnd(`insert "${value}"`);
    }

    removeByValue(value: string): void {
        console.time(`remove "${value}"`);
        let index = this.hash(value);
        const startIndex = index;

        while (this.table[index] !== null) {
            if (this.table[index] === value) {
                this.table[index] = DELETED;
                console.log(`"${value}" помечен как удалённый на индексе ${index}`);
                console.timeEnd(`remove "${value}"`);
                return;
            }
            index = (index + 1) % this.size;
            if (index === startIndex) break;
        }

        console.log("Элемент не найден.");
        console.timeEnd(`remove "${value}"`);
    }

    removeByIndex(index: number): void {
        console.time(`removeAt ${index}`);
        if (index < 0 || index >= this.size) {
            console.log("Недопустимый индекс.");
            console.timeEnd(`removeAt ${index}`);
            return;
        }
        if (this.table[index] !== null && this.table[index] !== DELETED) {
            console.log(`"${this.table[index]}" помечен как удалённый на индексе ${index}`);
            this.table[index] = DELETED;
        } else {
            console.log(`Индекс ${index} уже пуст или удалён.`);
        }
        console.timeEnd(`removeAt ${index}`);
    }

    getByIndex(index: number): void {
        console.time(`getAt ${index}`);
        if (index < 0 || index >= this.size) {
            console.log("Недопустимый индекс.");
            console.timeEnd(`getAt ${index}`);
            return;
        }
        const value = this.table[index];
        if (value === null || value === DELETED) {
            console.log(`Индекс ${index} пуст.`);
        } else {
            console.log(`По индексу ${index}: "${value}"`);
        }
        console.timeEnd(`getAt ${index}`);
    }

    getIndexByValue(value: string): void {
        console.time(`get "${value}"`);
        let index = this.hash(value);
        const startIndex = index;

        while (this.table[index] !== null) {
            if (this.table[index] === value) {
                console.log(`"${value}" найден по индексу ${index}`);
                console.timeEnd(`get "${value}"`);
                return;
            }
            index = (index + 1) % this.size;
            if (index === startIndex) break;
        }

        console.log("Элемент не найден.");
        console.timeEnd(`get "${value}"`);
    }

    insertRandom(n: number): void {
        console.time(`Вставка ${n} случайных элементов`);
        for (let i = 0; i < n; i++) {
            const val = Math.floor(Math.random() * 100000).toString();
            this.insert(val);
        }
        console.timeEnd(`Вставка ${n} случайных элементов`);
    }

    print(): void {
        const result: Record<string, string> = {};
        this.table.forEach((v, i) => {
            if (v === null) result[i] = "null";
            else if (v === DELETED) result[i] = "DELETED";
            else result[i] = `"${v}"`;
        });
        console.table(result);
    }
}


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const ht = new HashTable(10100); 

function ask(): void {
    rl.question(
        "Команды: insert <знач>, remove <знач>, removeAt <индекс>, get <знач>, getAt <индекс>, insertRandom <n>, print, exit\n> ",
        (cmd) => {
            const [operation, arg] = cmd.trim().split(" ");
            const index = parseInt(arg);

            switch (operation) {
                case "insert":
                    if (arg) ht.insert(arg);
                    break;
                case "remove":
                    if (arg) ht.removeByValue(arg);
                    break;
                case "removeAt":
                    if (!isNaN(index)) ht.removeByIndex(index);
                    break;
                case "get":
                    if (arg) ht.getIndexByValue(arg);
                    break;
                case "getAt":
                    if (!isNaN(index)) ht.getByIndex(index);
                    break;
                case "insertRandom":
                    if (!isNaN(index)) ht.insertRandom(index);
                    break;
                case "print":
                    ht.print();
                    break;
                case "exit":
                    rl.close();
                    return;
                default:
                    console.log("Неизвестная команда.");
            }

            ask();
        }
    );
}

ask();
