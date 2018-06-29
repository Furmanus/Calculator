import {CalculatorView} from '../views/calculator_view';
import {Observer} from '../core/observer';
import {EventEnum} from "../enums/event_enums";
import {CalculatorModel, IModelCalculationPartialDisplay, IModelCalculationResult} from '../model/calculator_model';
import {ButtonEnum} from "../enums/button_enums";
import {specialFunctionFromMath} from '../enums/special_functions';
import * as calculationHelper from '../helpers/calculation_helper';

export class CalculatorController extends Observer{
    private view: CalculatorView;
    private model: CalculatorModel;
    private specialFunctionOpened: string[] = [];
    private subscriptOpen: number = 0;
    private superscriptOpen: number = 0;
    private plotMode: boolean = false;

    constructor() {
        super();

        this.view = new CalculatorView();
        this.model = new CalculatorModel();
        this.attachEvents();
    }
    private attachEvents(): void {
        this.view.on(this, EventEnum.CALCULATOR_BUTTON_CLICKED, this.onCalcButtonClick.bind(this));
        this.view.on(this, EventEnum.CALCULATOR_CANCEL_CLICKED, this.onCalcCancelButtonClick.bind(this));
        this.view.on(this, EventEnum.CALCULATOR_EQUAL_CLICKED, this.onEqualButtonClick.bind(this));
        this.view.on(this, EventEnum.CALCULATOR_SPECIAL_FUNCTION_CLICKED, this.onSpecialFunctionButtonClick.bind(this));
        this.view.on(this, EventEnum.CALCULATOR_VARIABLE_CLICKED, this.onVariableButtonClick.bind(this));
        this.view.on(this, EventEnum.CALCULATOR_SOLVE_CLICKED, this.onSolveButtonClick.bind(this));

        this.model.on(this, EventEnum.CALCULATOR_MODEL_UPDATED, this.onCalcOperationsModelUpdated.bind(this));
        this.model.on(this, EventEnum.CALCULATOR_MODEL_SCORE_CALCULATED, this.onCalcModelScoreCalculated.bind(this));
        this.model.on(this, EventEnum.CALCULATOR_MODEL_RESET, this.onCalcModelReset.bind(this));
    }
    private onCalcButtonClick(data: {value: string}): void {
        this.model.updateOperations(data.value);
    }
    private onCalcCancelButtonClick(): void {
        this.view.resetLastOperation();
        this.view.resetSubSupCount();
        this.model.reset();
    }
    private onEqualButtonClick(): void {
        if (this.plotMode) {
            this.model.forceSetResult(NaN);
        } else {
            this.model.calculateScore();
        }
    }
    private onVariableButtonClick(): void {
        this.model.updateOperations('x');
        this.plotMode = true;
    }
    private onSolveButtonClick(): void {
        const modelFunction = this.model.getPartialResult();

        if (this.plotMode) {
            this.notify(EventEnum.CALCULATOR_SOLVE_CLICKED, modelFunction);
        }
    }
    private onCalcModelReset(): void {
        this.view.resetDisplay();
    }
    private onSpecialFunctionButtonClick(data: {value: string}): void {
        switch (data.value) {
            case '(':
                this.specialFunctionOpened.push(data.value);
                this.model.updateOperations(data.value);
                break;
            case ')':
                if ('second_argument' === this.specialFunctionOpened[this.specialFunctionOpened.length - 1]) {
                    this.specialFunctionOpened.pop();
                    if (this.subscriptOpen > 0) {
                        this.model.updateOperations(')');
                        this.view.stopSubscript();
                        this.model.updateOperations('(');
                        this.subscriptOpen--;
                    }
                } else if (this.specialFunctionOpened.length > 0) {
                    this.model.updateOperations(data.value);
                    this.performPartialCalculation(<string>this.specialFunctionOpened.pop());
                    
                    if (this.superscriptOpen > 0) {
                        this.view.stopSuperscript();
                        this.superscriptOpen--;
                    }
                }
                break;
            case '!':
                this.specialFunctionOpened.push(data.value);
                this.model.updateOperations(`${data.value}`);
                this.performPartialCalculation(<string>this.specialFunctionOpened.pop());
                break;
            case 'log':
                if (this.subscriptOpen < 2) {
                    this.specialFunctionOpened.push(data.value);
                    this.specialFunctionOpened.push('second_argument');
                    this.model.updateOperations(`${data.value}`);
                    this.view.startSubscript();
                    this.subscriptOpen++;
                    this.model.updateOperations('(');
                }
                break;
            case '^':
                if (this.superscriptOpen < 2) {
                    this.specialFunctionOpened.push(data.value);
                    this.superscriptOpen++;
                    this.view.startSuperscript();
                    this.model.updateOperations(`${data.value}(`);
                }
                break;
            default:
                this.specialFunctionOpened.push(data.value);
                this.model.updateOperations(`${data.value}(`);
        }
    }
    private onCalcOperationsModelUpdated(data: IModelCalculationPartialDisplay): void {
        const filteredValue = data.value.replace(/[\^]/g, function (match) {
            return '';
        });
        this.view.addToDisplay(filteredValue);
    }
    private performPartialCalculation(value: string): void {
        const modelPartialResult: string = this.model.getPartialResult();
        const lastFunctionOccurence: number = modelPartialResult.lastIndexOf(value);
        const lastClosingBracketOccurence: number = modelPartialResult.lastIndexOf(')');
        let partialResultToEval: string = modelPartialResult.substring(lastFunctionOccurence, lastClosingBracketOccurence + 1);
        let evaluatedPartialResult: number | string;
        let bracketsContent: string;

        if ('(' === value) {
            evaluatedPartialResult = eval(partialResultToEval);
        } else {
            bracketsContent = partialResultToEval.substring(
                partialResultToEval.indexOf('(') + 1,
                partialResultToEval.indexOf(')')
            );
            if ('^' === value) {
                const powerCalculationResult = calculationHelper.calculatePower(modelPartialResult);

                evaluatedPartialResult = powerCalculationResult.value;
                partialResultToEval = modelPartialResult.substring(
                    powerCalculationResult.index + 1,
                    lastClosingBracketOccurence + 1
                );
            } else if ('log' === value) {
                evaluatedPartialResult = calculationHelper.calculateLogarithm(modelPartialResult);
            } else if ('!' === value) {
                const factorialCalculationResult = calculationHelper.calculateFactorial(modelPartialResult);

                evaluatedPartialResult = factorialCalculationResult.value;
                partialResultToEval = modelPartialResult.substring(
                    factorialCalculationResult.index + 1,
                    lastFunctionOccurence + 1
                );
            } else {
                if (/x/.test(bracketsContent)) {
                    evaluatedPartialResult = `${value}(${bracketsContent})`;
                } else {
                    evaluatedPartialResult = specialFunctionFromMath[value](eval(bracketsContent));
                }
            }
        }
        this.model.setPartialResult(modelPartialResult.replace(
            partialResultToEval,
            evaluatedPartialResult.toString()
        ));
    }
    private onCalcModelScoreCalculated(data: IModelCalculationResult): void {
        const {
            result
        } = data;

        if (isNaN(result)) {
            this.model.reset();
            this.view.updateDisplay('Syntax error');
        } else {
            this.view.updateLastOperation();
            this.view.updateDisplay(result.toString());
        }
    }
    private isVariablePresentInPartialResult(partialResult: string): boolean {
        return /x+/g.test(partialResult);
    }
}