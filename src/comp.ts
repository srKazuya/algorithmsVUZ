import * as readline from 'readline';


const ns = [100, 1000, 10000];
const logNs = ns.map(n => Math.log10(n));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("Введите 3 времени выполнения (в мс) через пробел для n = 100, 1000, 10000:");

rl.question("> ", (input: string) => {
  const times = input.trim().split(/\s+/).map(Number);

  if (times.length !== 3 || times.some(isNaN)) {
    console.error("Нужно ввести ровно 3 числовых значения.");
    rl.close();
    return;
  }


  const logTimes = times.map(t => Math.log10(t));


  const x̄ = average(logNs);
  const ȳ = average(logTimes);

  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < 3; i++) {
    const dx = logNs[i] - x̄;
    const dy = logTimes[i] - ȳ;
    numerator += dx * dy;
    denominator += dx * dx;
  }

  const k = numerator / denominator;

  console.log(`\nЭмпирический показатель степени k ≈ ${k.toFixed(3)}`);
  rl.close();
});

function average(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}
