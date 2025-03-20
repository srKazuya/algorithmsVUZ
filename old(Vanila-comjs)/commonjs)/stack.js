const { log } = require('console');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question("Введите строку со скобками: ", (input) => {
    if (!/[()\[\]{}]/.test(input)) {
        console.log("Ошибка! Строка должна содержать хотя бы одну скобку.");
    } else {
        console.log(`Проверка стеком равна ${stack(input)}`);
        console.log(`Проверка очередью равна ${queue(input)}`);
    }
    rl.close();
});

function stack(str) {
    const stack = [];
    for (const char of str) {
        if (char === '(' || char === '[' || char === '{') {
            stack.push(char);
        } else if (char === ')' || char === ']' || char === '}') {
            if (stack.length === 0) return false;
            const last = stack.pop();
            if (
                (char === ')' && last !== '(') ||
                (char === ']' && last !== '[') ||
                (char === '}' && last !== '{')
            ) {
                return false;
            }
        }
    }

    return stack.length === 0;
}

function queue(str) {
    const queue = [];
    const queue2 = [];

    for (const char of str) {
        if (char === '(' || char === '[' || char === '{') {
            queue.push(char);
        } else if (char === ')' || char === ']' || char === '}') {
            queue2.push(char);
        }
    }

    console.log("Открывающие скобки:", queue);
    console.log("Закрывающие скобки:", queue2);

    if (queue.length !== queue2.length) {
        return false;
    }

    while (queue.length > 0) {
        const open = queue.pop();
        const close = queue2.shift();

        if (
            (open === '(' && close !== ')') ||
            (open === '[' && close !== ']') ||
            (open === '{' && close !== '}')
        ) {
            return false;
        }
    }
    return true;
}
