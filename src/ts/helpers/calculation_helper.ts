import {specialFunctionFromMath} from '../enums/special_functions';

interface ICalculationResult {
    value: number | string,
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
    let factorialString: string;
    let factorialResult: string | number;
    let i: number;

    for (i=lastFunctionOccurence - 1; i>=0; i--) {
        if (/[0-9.x]/.test(partialResult.charAt(i))) {
            factorialNumberArray.unshift(partialResult.charAt(i));
            factorialNumberFirstIndex = i;
        } else {
            break;
        }
    }
    factorialString = factorialNumberArray.join('');

    if (/x/.test(factorialString)) {
        factorialResult = factorialString
    } else {
        factorialNumber = Number(factorialString);
        factorialResult = isInteger(factorialNumber) ? specialFunctionFromMath['!'](factorialNumber) : NaN;
    }

    return {
        value: factorialResult,
        index: i
    };
}
export function calculateLogarithm(partialResult: string): number {
    const lastOpeningBracket = partialResult.lastIndexOf('(');
    const lastClosingBracket = partialResult.lastIndexOf(')');
    const beforeLastOpeningBracket = partialResult.lastIndexOf('(', lastOpeningBracket - 1);
    const beforeLastClosingBracket = partialResult.lastIndexOf(')', lastClosingBracket - 1);
    const firstBracketsContent: string = partialResult.substring(
        beforeLastOpeningBracket + 1,
        beforeLastClosingBracket
    );
    const secondBracketsContent: string = partialResult.substring(
        lastOpeningBracket + 1,
        lastClosingBracket
    );
    const evaluatedFirstBrackets = !/x/.test(firstBracketsContent) && eval(firstBracketsContent) || firstBracketsContent;
    const evaluatedSecondBrackets = !/x/.test(secondBracketsContent) && eval(secondBracketsContent) || secondBracketsContent;

    return (specialFunctionFromMath['log'](evaluatedFirstBrackets)
        / specialFunctionFromMath['log'](evaluatedSecondBrackets));
}
export function calculatePower(partialResult: string): ICalculationResult {
    const lastFunctionOccurence: number = partialResult.lastIndexOf('^');
    const bracketsContent: string = partialResult.substring(
        partialResult.lastIndexOf('(') + 1,
        partialResult.lastIndexOf(')')
    );
    let beforeFunctionFirstValueIndex: number = lastFunctionOccurence - 1;
    let beforeFunctionFirstValue: string;
    let result: number | string;
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

    if (/x/.test(beforeFunctionFirstValue) || /x/.test(bracketsContent)) {
        result = /x/.test(beforeFunctionFirstValue) ? `(${beforeFunctionFirstValue})` : eval(beforeFunctionFirstValue) + '^';
        result += /x/.test(bracketsContent) ? `(${bracketsContent})` : eval(bracketsContent);
    } else {
        result = specialFunctionFromMath['^']( eval(beforeFunctionFirstValue), eval(bracketsContent));
    }

    return {
        value: result,
        index: i
    }
}
export function findBeforePowerFunctionValuesIndex(result: string, functionIndex: number): number {
    let isBeforeFunctionValueNumber: boolean;
    let examinedChar: string;
    let closingBracketsCounter: number = 0;
    let index: number | undefined;

    if (0 === functionIndex) {
        return 0;
    }

    isBeforeFunctionValueNumber = ')' !== result.charAt(functionIndex - 1);

    !isBeforeFunctionValueNumber && closingBracketsCounter++;

    for(let i = functionIndex - 1; i >= 0; i--) {
        examinedChar = result.charAt(i);

        if (isBeforeFunctionValueNumber) {
            if (/[0-9]/.test(examinedChar)) {
                index = i;
            } else {
                break;
            }
        } else {
            if (')' === examinedChar) {
                closingBracketsCounter++;
            }
            if ('(' === examinedChar) {
                closingBracketsCounter--;
                if (0 === closingBracketsCounter) {
                    index = i;
                    break;
                }
            }
        }
    }

    return undefined === index ? -1 : index;
}
function findOpeningParenthesisIndexForClosed(closeIndex: number, expression: string): number {
    return 1;
}