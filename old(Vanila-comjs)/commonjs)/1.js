const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question("Введите 3 числа через пробел: ", (input) => {
    let numbers = input.split(" ").map(Number);
    if (numbers.length !== 3 || numbers.some(isNaN)) {
        console.log("Ошибка! Нужно ввести ровно 3 числа.");
    } else {
        sum(numbers);
    }
    rl.close();
});

function sum(numbers) {
    const [a, b, c] = numbers
    if ((a + b > 0) || (a + c > 0) || (b + c > 0)) {
        console.log("Хотя бы одна сумма положительна");
    } else {
        console.log("Есть отрицательная сумма");
    }
}
