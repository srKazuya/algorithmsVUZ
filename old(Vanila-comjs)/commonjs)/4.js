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
        let arr = [];
        generateArray(size, arr);

        arr = shuffleArray(arr);
        console.time("Пузырьковая сортировка");
        arr = bubbleSort(arr);
        console.timeEnd("Пузырьковая сортировка");
        // console.log("Отсортированный массив пузырьком : ", arr);

        arr = shuffleArray(arr);
        console.time("Сортировка выбором");
        arr = selectionSort(arr);
        console.timeEnd("Сортировка выбором");
        // console.log("Отсортированный массив выбором : ", arr);

        arr = shuffleArray(arr);
        console.time("Сортировка вставками");
        arr = insertionSort(arr);
        console.timeEnd("Сортировка вставками");
        // console.log("Отсортированный массив вставкой : ", arr);

        arr = shuffleArray(arr);
        console.time("Быстрая сортировка");
        arr = quickSort(arr);
        console.timeEnd("Быстрая сортировка");
        // console.log("Отсортированный массив быстрой : ", arr);

        arr = shuffleArray(arr);
        console.time("Сортировка слиянием");
        arr = mergeSort(arr);
        console.timeEnd("Сортировка слиянием");
        // console.log("Отсортированный массив слиянием : ", arr);
    }
    rl.close();
});

function generateArray(size, arr) {
    for (let i = 0; i < size; i++) {
        arr.push(Math.floor(Math.random() * 1000));
    }

    console.log(arr);
    return arr;
}

function bubbleSort(arr) {
    let n = arr.length;
    let swapped;
    do {
        swapped = false;
        for (let i = 1; i < n; i++) {
            if (arr[i - 1] > arr[i]) {
                let temp = arr[i - 1];
                arr[i - 1] = arr[i];
                arr[i] = temp;
                swapped = true;
            }
        }
        n--;
    } while (swapped);
    return arr;
}
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); 
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function selectionSort(arr) {
    let n = arr.length;

    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        if (minIndex !== i) {
            let temp = arr[minIndex];
            arr[minIndex] = arr[i];
            arr[i] = temp;
        }
    }
    return arr;
}
function insertionSort(arr) {
    let n = arr.length;
    for (let i = 1; i < n; i++) {
        let current = arr[i];
        let j = i - 1;
        while (j >=0 && arr[j] > current) {
            arr[j+1] = arr[j];
            j--
        }
        arr[j+1] = current;
    }
    // console.log("Отсортированный массив вставкой: ", arr);
    return arr;
}
function quickSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }
    const pivot = arr[Math.floor(arr.length / 2)]; 

    const left = arr.filter(el => el < pivot);
    const middle = arr.filter(el => el === pivot);
    const right = arr.filter(el => el > pivot);
    
    arr = [...quickSort(left), ...middle, ...quickSort(right)];

    return arr;
}

function mergeSort(arr) {
    if (arr.length <= 1) return arr; 

    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid)); 

    return merge(left, right);
}

function merge(left, right) {
    let sortedArray = [];
    let i = 0, j = 0;

    while (i < left.length && j < right.length) {
        if (left[i] < right[j]) {
            sortedArray.push(left[i]);
            i++;
        } else {
            sortedArray.push(right[j]);
            j++;
        }
    }

    return sortedArray.concat(left.slice(i)).concat(right.slice(j));
}
