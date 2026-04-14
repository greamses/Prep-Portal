import { rnd, pick, expQ } from './utils.js';

export function partialFractions() {
    const p=rnd(1,4), q=rnd(p+1,6), A=rnd(1,5), B=rnd(1,5);
    const num1=A+B, num2=A*q+B*p;
    return expQ(
        `(${num1}*x+${num2})/((x+${p})*(x+${q}))`,
        `${A}/(x+${p})+${B}/(x+${q})`,
        `Set up: ${num1}x+${num2} = A(x+${q}) + B(x+${p}). Solve: when x=-${p}, get A=${A}; when x=-${q}, get B=${B}.`
    );
}

export function logExpression() {
    const a=rnd(2,5), b=rnd(2,5);
    const expressions = [
        expQ(`log(${a*b})`, `log(${a})+log(${b})`, `Product rule: log(ab)=log a+log b.`),
        expQ(`log(${Math.pow(a,2)})`, `2*log(${a})`, `Power rule: log(a²)=2 log a.`),
        expQ(`log(${a})+log(${b})`, `log(${a*b})`, `Combine: log ${a}+log ${b}=log(${a}×${b})=log ${a*b}.`),
        expQ(`2*log(${a})-log(${b})`, `log(${a*a}/${b})`, `Use power rule: 2log(${a})=log(${a}²), then quotient rule.`),
    ];
    return pick(expressions);
}

export function complexNumbers() {
    const a=rnd(1,6), b=rnd(1,6), c=rnd(1,6), d=rnd(1,6);
    const expressions = [
        expQ(`(${a}+${b}*i)+(${c}+${d}*i)`, `${a+c}+${b+d}*i`, `Add real parts and imaginary parts separately.`),
        expQ(`(${a}+${b}*i)*(${c}+${d}*i)`, `${a*c-b*d}+${a*d+b*c}*i`, `FOIL: remember i²=-1. Real part=${a*c}-${b*d}=${a*c-b*d}, imaginary=${a*d+b*c}.`),
        expQ(`i^2`, `-1`, `By definition: i=√(-1), so i²=-1.`),
        expQ(`(${a}+${b}*i)*(${a}-${b}*i)`, `${a*a+b*b}`, `Conjugate product: a²+b²=${a*a+b*b}. Always a real number.`),
    ];
    return pick(expressions);
}

export function matrices() {
    const a=rnd(1,5),b=rnd(1,5),c=rnd(1,5),d=rnd(1,5);
    const det = a*d - b*c;
    const expressions = [
        expQ(`det([[${a},${b}],[${c},${d}]])`, `${det}`, `det = ad-bc = ${a}×${d}-${b}×${c} = ${det}.`),
        expQ(`[[${a},${b}],[${c},${d}]]+[[${rnd(1,4)},${rnd(1,4)}],[${rnd(1,4)},${rnd(1,4)}]]`, `[[${a+rnd(1,4)},${b+rnd(1,4)}],[${c+rnd(1,4)},${d+rnd(1,4)}]]`, `Matrix addition: add corresponding entries.`),
    ];
    return pick(expressions);
}