import {specialFunctionFromMath} from '../enums/special_functions';

interface ICalculationResult {
    value: number,
    index: number
}

function isInteger(num: number): boolean {
    return num % 1 === 0;
}

export function calculateFactorial(partialResult: string): ICalculationResult {
    const lastFunctionOccurence: number = partialResult.lastIndexOf('!');
    const factorialNumberArray: string[] = [];
    let factorialNumberFirstIndex: number = 0;
    let factorialNumber: number;
    let i: number;

    for (i=lastFunctionOccurence - 1; i>=0; i--) {
        if (/[0-9.]/.test(partialResult.charAt(i))) {
            factorialNumberArray.unshift(partialResult.charAt(i));
            factorialNumberFirstIndex = i;
        } else {
            break;
        }
    }
    factorialNumber = Number(factorialNumberArray.join(''));

    return {
        value: isInteger(factorialNumber) ? specialFunctionFromMath['!'](factorialNumber) : NaN,
        index: i
    };
}
export function calculateLogarithm(partialResult: string): number {
    console.log(partialResult);
    const firstBracketsContent: string = partialResult.substring(
        partialResult.indexOf('(') + 1,
        partialResult.indexOf(')')
    );
    const secondBracketsContent: string = partialResult.substring(
        partialResult.lastIndexOf('(') + 1,
        partialResult.lastIndexOf(')')
    );
    return (specialFunctionFromMath['log'](eval(firstBracketsContent))
        / specialFunctionFromMath['log'](eval(secondBracketsContent)));
}
export function calculatePower(partialResult: string): ICalculationResult {
    const lastFunctionOccurence: number = partialResult.lastIndexOf('^');
    const bracketsContent: string = partialResult.substring(
        partialResult.indexOf('(') + 1,
        partialResult.indexOf(')')
    );
    let beforeFunctionFirstValueIndex: number = lastFunctionOccurence - 1;
    let beforeFunctionFirstValue: string;
    let result: number;
    let i: number;

    for (i = beforeFunctionFirstValueIndex; i >= 0; i--) {
        if (/[0-9.]/.test(partialResult.charAt(i))) {
            beforeFunctionFirstValueIndex = i;
        } else {
            if (i === 0) {
                beforeFunctionFirstValueIndex = 0;
            }
            break;
        }
    }
    beforeFunctionFirstValue = partialResult.substring(
        beforeFunctionFirstValueIndex,
        lastFunctionOccurence
    );
    result = specialFunctionFromMath['^'](
        eval(beforeFunctionFirstValue),
        eval(bracketsContent)
    );

    return {
        value: result,
        index: i
    }
}