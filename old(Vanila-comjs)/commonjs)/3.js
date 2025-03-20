const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const { performance } = require('perf_hooks'); 

const generateArray = (size) => {
    return Array.from({ length: size }, () => Math.floor(Math.random() * 1000));
};

const sortArray = (arr) => arr.slice().sort((a, b) => a - b);

function linSearch(array, target, isSorted = false) {
    let start = performance.now();
    let found = false;

    for (let i = 0; i < array.length; i++) {
        if (array[i] === target) {
            found = true;
        }
        if (isSorted && array[i] > target) {
            break;
        }
    }
    
    let timeTaken = (performance.now() - start).toFixed(6);
    
    if (found) {
        console.log(`Линейный поиск: число ${target} найдено`);
    } else {
        console.log(`Линейный поиск: число ${target} не найдено`);
    }
    
    console.log(`Время: ${timeTaken} ms`);
}


function binSearch(array, target) {
    array.sort((a, b) => a - b);

    let start = performance.now();
    let left = 0, right = array.length - 1;

    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        if (array[mid] === target) {
            console.log(`Бинарный поиск: число ${target} найдено`);
            console.log(`Время: ${(performance.now() - start).toFixed(6)} ms`);
            return mid;
        } else if (array[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    console.log(`Бинарный поиск: число ${target} не найдено`);
    console.log(`Время: ${(performance.now() - start).toFixed(6)} ms`);
    return -1;
}


function insertNumberFunc(array, num) {
    let start = performance.now();
    array.push(num);
    console.log(`Число ${num} добавлено`);
    console.log(` Время: ${(performance.now() - start).toFixed(6)} ms`);
}


function insertSorted(array, num) {
    let start = performance.now();
    let index = array.findIndex(el => el > num);
    if (index === -1) array.push(num);
    else array.splice(index, 0, num);
    console.log(`Число ${num} вставлено (в отсортированный)`);
    console.log(` Время: ${(performance.now() - start).toFixed(6)} ms`);
    console.log(array)
}

function deleteNumberFunc(array, num) {
    let start = performance.now();
    let index = array.indexOf(num);
    if (index !== -1) {
        array.splice(index, 1);
        console.log(`Число ${num} удалено`);
        console.log(array);
    } else {
        console.log(`Число ${num} не найдено`);
    }
    console.log(`Время: ${(performance.now() - start).toFixed(6)} ms`);
    
}

rl.question("Введите размер массива: ", (input) => {
    let size = parseInt(input);
    if (isNaN(size) || size <= 0) {
        console.log("Ошибка! Введите положительное число");
        rl.close();
        return;
    }

    let unorderedArray = generateArray(size); 
    let orderedArray = sortArray(unorderedArray); 

    console.log("\n Исходный массив (неупорядоченный):", unorderedArray);

    rl.question("\nВведите число для поиска: ", (searchNum) => {
        searchNum = parseInt(searchNum);
        linSearch(unorderedArray, searchNum);
        linSearch(orderedArray, searchNum);
        binSearch(orderedArray, searchNum);

        rl.question("\nВведите число для вставки: ", (insertNum) => {
            insertNum = parseInt(insertNum);
            insertNumberFunc(unorderedArray, insertNum);
            insertSorted(orderedArray, insertNum);

            rl.question("\nВведите число для удаления: ", (deleteNum) => {
                deleteNum = parseInt(deleteNum);
                deleteNumberFunc(unorderedArray, deleteNum);
                deleteNumberFunc(orderedArray, deleteNum);
                rl.close();
            });
        });
    });
});
