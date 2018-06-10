import {Observer} from '../core/observer';
import {EventEnum} from '../enums/event_enums';
import {unicodeToValue} from '../helpers/unicode_value';

export interface IModelCalculationResult {
    text: string,
    result: number
}
export interface IModelCalculationPartialDisplay {
    value: string
}

const DEFAULT_DISPLAY: string = '0';
const DEFAULT_VALUE: number = 0;

export class CalculatorModel extends Observer {
    private visibleText: string = DEFAULT_DISPLAY;
    private partialResult: string = DEFAULT_DISPLAY;
    private result: number = DEFAULT_VALUE;

    public updateOperations(value: string): CalculatorModel {

        if (DEFAULT_DISPLAY === this.visibleText) {
            this.visibleText = value;
            this.partialResult = unicodeToValue(value);
        } else {
            this.visibleText += value;
            this.partialResult += unicodeToValue(value);
        }

        this.notify(EventEnum.CALCULATOR_MODEL_UPDATED, {value: value});
        return this;
    }
    public getVisibleDisplay(): string {
        return this.visibleText;
    }
    public getResult(): number {
        return this.result;
    }
    public forceSetResult(result: number): void {
        this.result = result;
        this.notify(EventEnum.CALCULATOR_MODEL_SCORE_CALCULATED);
    }
    public reset(silent: boolean = false) {
        this.visibleText = DEFAULT_DISPLAY;
        this.partialResult = DEFAULT_DISPLAY;
        this.result = DEFAULT_VALUE;
        if (!silent) {
            this.notify(EventEnum.CALCULATOR_MODEL_RESET);
        }
    }
    public getPartialResult(): string {
        return this.partialResult;
    }
    public setPartialResult(partialResult: string): void {
        this.partialResult = partialResult;
    }
    public calculateScore() {
        const lastCalculation = this.visibleText;
        try {
            this.result = eval(this.partialResult); //TODO get rid of eval
            this.visibleText = this.result.toString();
        } catch (e) {
            this.result = NaN;
        }

        this.notify(EventEnum.CALCULATOR_MODEL_SCORE_CALCULATED, {
            text: lastCalculation,
            result: this.result
        });
    }
}