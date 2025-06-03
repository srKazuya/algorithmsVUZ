import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(question: string): Promise<string> {
  return new Promise(resolve => rl.question(question, resolve));
}

type Graph = number[][];


function isConnected(graph: Graph): boolean {
  const visited = new Set<number>();
  function dfs(v: number) {
    visited.add(v);
    for (let i = 0; i < graph.length; i++) {
      if (graph[v][i] > 0 && !visited.has(i)) {
        dfs(i);
      }
    }
  }
  dfs(0);
  return visited.size === graph.length;
}

function tspGreedy(graph: Graph): { path: number[]; cost: number } | null {
  const n = graph.length;
  const visited = new Set<number>();
  const path = [0];
  let totalCost = 0;
  let current = 0;

  visited.add(0);

  for (let step = 1; step < n; step++) {
    let next = -1;
    let minDist = Infinity;
    
    for (let i = 0; i < n; i++) {
      if (!visited.has(i) && graph[current][i] > 0 && graph[current][i] < minDist) {
        minDist = graph[current][i];
        next = i;
      }
    }
    if (next === -1) return null;
    path.push(next);
    totalCost += minDist;
    visited.add(next);
    current = next;
  }

  if (graph[current][0] > 0) {
    totalCost += graph[current][0];
    path.push(0); 
    return { path, cost: totalCost };
  }

  return null;
}

async function main() {
  const n = parseInt(await prompt('Введите количество вершин: '));
  if (n < 3) {
    console.log('Для гамильтонова цикла нужно минимум 3 вершины.');
    rl.close();
    return;
  }

  const graph: Graph = [];
  console.log('Введите матрицу смежности:');
  for (let i = 0; i < n; i++) {
    const row = (await prompt(`Вершина ${i + 1}: `))
      .split(' ')
      .map(Number);
    if (row.length !== n) {
      console.log('Ошибка: неправильное количество элементов.');
      rl.close();
      return;
    }
    graph.push(row);
  }

  if (!isConnected(graph)) {
    console.log('Граф не связный — гамильтонов цикл невозможен.');
    rl.close();
    return;
  }

  const result = tspGreedy(graph);
  if (result) {
    console.log('Найден гамильтонов цикл (приближённый):');
    console.log('Путь:', result.path.join(' -> '));
    console.log('Стоимость:', result.cost);
  } else {
    console.log('Не удалось построить гамильтонов цикл.');
  }

  rl.close();
}

main();
