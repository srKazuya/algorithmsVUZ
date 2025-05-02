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
        let index = this.hash(value);
        const startIndex = index;

        while (this.table[index] !== null && this.table[index] !== DELETED) {
            if (this.table[index] === value) {
                console.warn(`Элемент "${value}" уже существует по индексу ${index}`);
                return;
            }
            index = (index + 1) % this.size;
            if (index === startIndex) {
                console.log("Хеш-таблица заполнена.");
                this.print()
                return
            }
        }

        this.table[index] = value;
        console.log(`"${value}" вставлен по индексу ${index}`);
        this.print();
    }

    removeByValue(value: string): void {
        let index = this.hash(value);
        const startIndex = index;

        while (this.table[index] !== null) {
            if (this.table[index] === value) {
                this.table[index] = DELETED;
                console.log(`"${value}" помечен как удалённый на индексе ${index}`);
                this.print();
                return;
            }
            index = (index + 1) % this.size;
            if (index === startIndex) break;
        }
        this.print();
        return console.log("Элемент не найден.");
        
    }

    removeByIndex(index: number): void {
        if (index < 0 || index >= this.size) {
            console.log("Недопустимый индекс.");
            return;
        }
        if (this.table[index] !== null && this.table[index] !== DELETED) {
            console.log(`"${this.table[index]}" помечен как удалённый на индексе ${index}`);
            this.table[index] = DELETED;
        } else {
            console.log(`Индекс ${index} уже пуст или удалён.`);
        }
        this.print();
    }

    getByIndex(index: number): void {
        if (index < 0 || index >= this.size) {
            console.log("Недопустимый индекс.");
            return;
        }
        const value = this.table[index];
        if (value === null || value === DELETED) {
            console.log(`Индекс ${index} пуст.`);
        } else {
            console.log(`По индексу ${index}: "${value}"`);
        }
        this.print();
    }

    getIndexByValue(value: string): void {
        let index = this.hash(value);
        const startIndex = index;

        while (this.table[index] !== null) {
            if (this.table[index] === value) {
                console.log(`"${value}" найден по индексу ${index}`);
                return;
            }
            index = (index + 1) % this.size;
            if (index === startIndex) break;
        }

        console.log("Элемент не найден.");
        this.print();
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

const ht = new HashTable(2);

function ask(): void {
    rl.question(
        "Команды: insert <знач>, remove <знач>, removeAt <индекс>, get <знач>, getAt <индекс>, print, exit\n> ",
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
