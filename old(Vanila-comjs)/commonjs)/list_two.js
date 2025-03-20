const readline = require('readline');

class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
        this.prev = null;
    }
}

class DoublyLinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }

    insertAt(value, index) {
        if (index < 0 || index > this.size) {
            console.log("Некорректный индекс");
            return;
        }

        const newNode = new Node(value);
        if (index === 0) {
            if (!this.head) {
                this.head = this.tail = newNode;
            } else {
                newNode.next = this.head;
                this.head.prev = newNode;
                this.head = newNode;
            }
        } else if (index === this.size) {
            this.append(value);
            return;
        } else {
            let current = this.head;
            for (let i = 0; i < index; i++) {
                current = current.next;
            }
            newNode.next = current;
            newNode.prev = current.prev;
            current.prev.next = newNode;
            current.prev = newNode;
        }
        this.size++;
    }

    insertAfter(value, afterValue) {
        let current = this.head;
        while (current) {
            if (current.value === afterValue) {
                const newNode = new Node(value);
                newNode.next = current.next;
                newNode.prev = current;
                if (current.next) {
                    current.next.prev = newNode;
                } else {
                    this.tail = newNode;
                }
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

        let current;
        if (index === 0) {
            current = this.head;
            this.head = this.head.next;
            if (this.head) {
                this.head.prev = null;
            } else {
                this.tail = null;
            }
        } else if (index === this.size - 1) {
            current = this.tail;
            this.tail = this.tail.prev;
            this.tail.next = null;
        } else {
            current = this.head;
            for (let i = 0; i < index; i++) {
                current = current.next;
            }
            current.prev.next = current.next;
            current.next.prev = current.prev;
        }
        this.size--;
    }

    deleteByValue(value) {
        let current = this.head;
        while (current) {
            if (current.value === value) {
                if (current === this.head) {
                    this.head = current.next;
                    if (this.head) {
                        this.head.prev = null;
                    }
                } else if (current === this.tail) {
                    this.tail = current.prev;
                    this.tail.next = null;
                } else {
                    current.prev.next = current.next;
                    current.next.prev = current.prev;
                }
                this.size--;
                return;
            }
            current = current.next;
        }
    }

    findAt(index) {
        if (index < 0 || index >= this.size) {
            console.log("Некорректный индекс");
            return null;
        }
        let current = this.head;
        for (let i = 0; i < index; i++) {
            current = current.next;
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
        console.log(` Элемент со значением ${value} не найден.`);
    }

    print() {
        let current = this.head;
        let result = "";
        while (current) {
            result += current.value + " <-> ";
            current = current.next;
        }
        console.log(result + "null");
    }

    append(value) {
        const newNode = new Node(value);
        if (!this.head) {
            this.head = this.tail = newNode;
        } else {
            this.tail.next = newNode;
            newNode.prev = this.tail;
            this.tail = newNode;
        }
        this.size++;
    }
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const list = new DoublyLinkedList();

rl.question("Введите узлы для вставки через пробел: ", (input) => {
    let numbers = input.split(" ").map(Number);
    if (numbers.some(isNaN)) {
        console.log("Ошибка! Нужно ввести числа.");
        rl.close();
    } else {
        numbers.forEach((num) => list.append(num));
        list.print();
        promptCommand();
    }
});

function promptCommand() {
    rl.question("Введите команду (insertAt, insertAfter, deleteAt, deleteByValue, findAt, findByValue, print, exit): ", (command) => {
        switch (command) {
            case 'insertAt':
                rl.question("Введите значение и индекс через пробел: ", (input) => {
                    const [value, index] = input.split(' ');
                    list.insertAt(Number(value), parseInt(index));
                    list.print();
                    promptCommand();
                });
                break;
            case 'insertAfter':
                rl.question("Введите значение и значение после которого вставить через пробел: ", (input) => {
                    const [value, afterValue] = input.split(' ');
                    list.insertAfter(Number(value), Number(afterValue));
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
                    list.deleteByValue(Number(value));
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
                    console.log(list.findByValue(Number(value)));
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
