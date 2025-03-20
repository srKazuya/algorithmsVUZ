const readline = require('readline');

class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }

    insertAt(value, index) {
        if (index < 0 || index > this.size) {
            console.log("Некорректный индекс");
            return;
        }

        const newNode = new Node(value);

        if (index === 0) {
            newNode.next = this.head;
            this.head = newNode;
        } else {
            let current = this.head;
            let previous = null;
            let i = 0;

            while (i < index) {
                previous = current;
                current = current.next;
                i++;
            }

            newNode.next = current;
            previous.next = newNode;
        }

        this.size++;
    }

    insertAfter(value, afterValue) {
        if (!this.head) return;

        let current = this.head;
        while (current) {
            if (String(current.value) === String(afterValue)) {
                const newNode = new Node(value);
                newNode.next = current.next;
                current.next = newNode;
                this.size++;
                return;
            }
            current = current.next;
        }
    }

    deleteAt(index) {
        if (index < 0 || index >= this.size) {
            console.log("Некорректный индекс");
            return;
        }

        let current = this.head;

        if (index === 0) {
            this.head = this.head.next;
        } else {
            let previous = null;
            let i = 0;

            while (i < index) {
                previous = current;
                current = current.next;
                i++;
            }

            previous.next = current.next;
        }

        this.size--;
    }

    deleteByValue(value) {
        if (!this.head) {
            console.log("⚠️ Список пуст. Удаление невозможно.");
            return;
        }

        if (this.head.value === value) {
            this.head = this.head.next;
            this.size--;
            return;
        }

        let current = this.head;
        let previous = null;

        while (current && current.value !== Number(value)) {
            previous = current;
            current = current.next;
        }

        if (current && current.value === Number(value)) {
            previous.next = current.next;
            this.size--;
        } else {
            console.log(`Значение ${value} не найдено.`);
        }
    }

    findAt(index) {
        if (index < 0 || index >= this.size) {
            console.log("Некорректный индекс");
            return null;
        }

        let current = this.head;
        let i = 0;

        while (i < index) {
            current = current.next;
            i++;
        }

        return current.value;
    }

    findByValue(value) {
        let current = this.head;
        let index = 0;

        while (current) {
            if (Number(current.value) === Number(value)) {
                return index;
            }

            current = current.next;
            index++;
        }

        return -1;
    }

    print() {
        let current = this.head;
        let result = "";
        while (current) {
            result += current.value + " -> ";
            current = current.next;
        }
        console.log(result + "null");
    }

    append(value) {
        const newNode = new Node(value);
        if (!this.head) {
            this.head = newNode;
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = newNode;
        }
        this.size++;
    }
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const list = new LinkedList();

function promptCommand() {
    rl.question("Введите команду (insertAt, insertAfter, deleteAt, deleteByValue, findAt, findByValue, print, exit): ", (command) => {
        switch (command) {
            case 'insertAt':
                rl.question("Введите значение и индекс через пробел: ", (input) => {
                    const [value, index] = input.split(' ');
                    list.insertAt(value, parseInt(index));
                    list.print();
                    promptCommand();
                });
                break;
            case 'insertAfter':
                rl.question("Введите значение и значение после которого вставить через пробел: ", (input) => {
                    const [value, afterValue] = input.split(' ');
                    list.insertAfter(value, afterValue);
                    list.print();
                    promptCommand();
                });
                break;
            case 'deleteAt':
                rl.question("Введите индекс: ", (index) => {
                    list.deleteAt(parseInt(index));
                    list.print();
                    promptCommand();
                });
                break;
            case 'deleteByValue':
                rl.question("Введите значение: ", (value) => {
                    list.deleteByValue(value);
                    list.print();
                    promptCommand();
                });
                break;
            case 'findAt':
                rl.question("Введите индекс: ", (index) => {
                    console.log(list.findAt(parseInt(index)));
                    promptCommand();
                });
                break;
            case 'findByValue':
                rl.question("Введите значение: ", (value) => {
                    console.log(list.findByValue(value));
                    promptCommand();
                });
                break;
            case 'print':
                list.print();
                promptCommand();
                break;
            case 'exit':
                rl.close();
                break;
            default:
                console.log("Неизвестная команда");
                promptCommand();
                break;
        }
    });
}

rl.question("Введите узлы для вставки через пробел: ", (input) => {
    let numbers = input.split(" ").map(Number);
    if (numbers.some(isNaN)) {
        console.log("Ошибка! Нужно ввести числа.");
        rl.close();
    } else {
        numbers.forEach((num) => {
            list.append(num);
        });
        list.print();
        promptCommand();
    }
});


