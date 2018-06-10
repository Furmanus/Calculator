interface ISpecialFunctions {
    [key: string]: string
}
interface ISpecialFunctionsFromMath {
    [key: string]: (...args: number[]) => number
}

export const specialFunctions: ISpecialFunctions = {
    sin: 'sin',
    cos: 'cos',
    tg: 'tg',
    ln: 'ln',
    log: 'log',
    '^': '^',
    '(': '(',
    ')': ')',
    '!': '!'
};

export const specialFunctionFromMath: ISpecialFunctionsFromMath = {
    sin: Math.sin,
    cos: Math.cos,
    tg: Math.tan,
    ln: Math.log,
    log: Math.log10,
    '^': Math.pow,
    '!': calculateFactorial
};

function calculateFactorial(num: number): number {
    if (0 === num || 1 === num) {
        return 1;
    } else {
        return calculateFactorial(num - 1) * num;
    }
}
