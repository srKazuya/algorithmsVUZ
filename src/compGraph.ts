const V1 = 100;
const E1 = 495;    
const T1 = 0.366;       

const V2 = 1000;
const E2 = 49952;  
const T2 = 125.677;      

const logT1 = Math.log10(T1);
const logT2 = Math.log10(T2);

const logSize1 = Math.log10(V1 + E1);
const logSize2 = Math.log10(V2 + E2);

const k = (logT2 - logT1) / (logSize2 - logSize1);

console.log(`Эмпирический показатель степени k ≈ ${k.toFixed(3)}`);
