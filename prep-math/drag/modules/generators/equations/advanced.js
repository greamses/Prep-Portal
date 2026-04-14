import { rnd, pick, eqQ } from './utils.js';

export function exponentialEq() {
    const templates = [
        () => { const p=rnd(1,4); return eqQ(`2^x=${Math.pow(2,p)}`,`x=${p}`,`Express RHS as a power of 2: 2^${p}. Then x=${p}.`); },
        () => { const p=rnd(1,3); return eqQ(`3^(2*x-1)=${Math.pow(3,2*p-1)}`,`x=${p}`,`Set exponents equal: 2x-1=${2*p-1}, so x=${p}.`); },
        () => { const p=rnd(1,3); return eqQ(`4^x-2^(x+1)=0`,`x=1`,`Rewrite 4^x as 2^(2x): 2^(2x)=2^(x+1), so 2x=x+1.`); },
    ];
    return pick(templates)();
}

export function logarithmicEq() {
    const templates = [
        () => { const b=pick([2,3,5,10]),p=rnd(1,4); return eqQ(`log${b}x=${p}`,`x=${Math.pow(b,p)}`,`Convert: x=${b}^${p}=${Math.pow(b,p)}.`); },
        () => { const p=rnd(2,5); return eqQ(`log(x)+log(x-1)=log(${p*(p-1)})`,`x=${p}`,`Combine logs: log(x(x-1))=log(${p*(p-1)}). Solve x²-x-${p*(p-1)}=0.`); },
    ];
    return pick(templates)();
}

export function trigEq() {
    const angles = [30,45,60,90,0];
    const θ = pick(angles);
    const sinVal = Math.round(Math.sin(θ * Math.PI/180) * 100) / 100;
    return eqQ(`sin(x)=${sinVal}`, `x=${θ}`,
        `sin(${θ}°)=${sinVal}. In [0°,360°]: x=${θ}° and x=${180-θ}°.`);
}

export function suRdEq() {
    const c = rnd(1, 6), aVal = rnd(3, 8);
    const xSol = aVal * aVal - c;
    return eqQ(`sqrt(x+${c})=${aVal}`, `x=${xSol}`,
        `Square both sides: x+${c}=${aVal*aVal}. So x=${xSol}.`);
}