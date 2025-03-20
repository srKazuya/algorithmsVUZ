const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question("Введите размер массива: ", (input) => {
    let size = parseInt(input);
    if (isNaN(size) || size <= 0) {
        console.log("Ошибка! Нужно ввести положительное число");
        rl.close();
    } else {
        generateArray(size);
    }
});

function generateArray(size) {
    const array = [];
    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * 1000));
    }
    console.log("Сгенерированный массив:", array);
    askForNumber(array);
}


function askForNumber(array) {
    rl.question("Введите число для поиска: ", (numInput) => {
        let number = parseInt(numInput);
        if (isNaN(number)) {
            console.log("Ошибка! Нужно ввести допустимое число");
            rl.close();
        } else {
            findNumber(array, number);
        }
    });
}

function findNumber(array, number) {
    let index = array.indexOf(number);
    if (index !== -1) {
        console.log(`Число ${number} найдено по индексу ${index}`);
    } else {
        console.log(`Число ${number} не найдено в массиве`);
    }
    askForAdd(array);
}

function askForAdd(array) {
    rl.question("Введите число для добавления: ", (numInput) => {
        let number = parseInt(numInput);
        if (isNaN(number)) {
            console.log("Ошибка! Нужно ввести допустимое число");
        } else {
            array.push(number);
            console.log(`Число ${number} добавлено. Новый массив:`, array);
        }
        askForRemove(array);
    });
}

function askForRemove(array) {
    rl.question("Введите число для удаления: ", (numInput) => {
        let number = parseInt(numInput);
        if (isNaN(number)) {
            console.log("Ошибка! Нужно ввести допустимое число");
        } else {
            let index = array.indexOf(number);
            if (index !== -1) {
                array.splice(index, 1);
                console.log(`Число ${number} удалено. Новый массив:`, array);
            } else {
                console.log(`Число ${number} не найдено в массиве`);
            }
        }
        rl.close();
    });
}

