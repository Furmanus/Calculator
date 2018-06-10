import {Observer} from '../core/observer';
import {EventEnum} from '../enums/event_enums';
import {specialFunctions} from "../enums/special_functions";
import {replaceLast} from "../helpers/misc_helper";



export class CalculatorView extends Observer{
    private buttons: NodeList;
    private display: HTMLDivElement | null;
    private lastOperationText: HTMLParagraphElement | null;
    private subscriptOpen: boolean = false;

    public constructor() {
        super();
        this.buttons = document.querySelectorAll('[data-calc-button]');
        this.display = document.querySelector('.calculator-display');
        this.lastOperationText = document.querySelector('.last-operation');

        this.prepareButtons();
    }
    private prepareButtons(): void {
        Array.prototype.forEach.call(this.buttons, (button: HTMLElement) => {
            const calcButtonValue: string | undefined = button.dataset.calcButton;

            if ('cancel' === calcButtonValue) {
                button.addEventListener('click', this.onCancelButtonClick.bind(this));
            } else if ('=' === calcButtonValue) {
                button.addEventListener('click', this.onEqualButtonClick.bind(this));
            } else if (calcButtonValue && specialFunctions[calcButtonValue]) {
                button.addEventListener('click', this.onCalculatorSpecialFunctionClick.bind(this, calcButtonValue));
            }else {
                button.addEventListener('click', this.onCalculatorButtonNumberClick.bind(this, calcButtonValue));
            }

            button.removeAttribute('data-calc-button');
        });
    }
    public resetDisplay(): void {
        this.getDisplay().innerHTML = '';
    }
    public addToDisplay(value: string): void {
        const innerHtml = this.getDisplay().innerHTML;
        if (this.subscriptOpen) {
            this.getDisplay().innerHTML = replaceLast(innerHtml,'</sub>', `${value}</sub>`);
        } else {
            this.getDisplay().innerHTML += value;
        }
    }
    public updateDisplay(value: string): void {
        this.getDisplay().innerHTML = value;
    }
    public updateLastOperation(): void {
        this.getLastOperation().innerHTML = this.getDisplay().innerHTML;
    }
    public resetLastOperation(): void {
        this.getLastOperation().innerHTML = '';
    }
    public startSubscript(): void {
        this.subscriptOpen = true;
        this.getDisplay().innerHTML += '<sub></sub>';
    }
    public stopSubscript(): void {
        this.subscriptOpen = false;
    }
    private onCalculatorButtonNumberClick(value: string): void {
        this.notify(EventEnum.CALCULATOR_BUTTON_CLICKED, {value: value});
    }
    private onCalculatorSpecialFunctionClick(value: string): void {
        this.notify(EventEnum.CALCULATOR_SPECIAL_FUNCTION_CLICKED, {value: value});
    }
    private onCancelButtonClick(): void {
        this.notify(EventEnum.CALCULATOR_CANCEL_CLICKED);
    }
    private onEqualButtonClick(): void {
        this.notify(EventEnum.CALCULATOR_EQUAL_CLICKED);
    }
    private getDisplay(): HTMLDivElement {
        if (this.display) {
            return this.display;
        } else {
            throw new Error('Calculator display element not found');
        }
    }
    private getLastOperation(): HTMLParagraphElement {
        if (this.lastOperationText) {
            return this.lastOperationText;
        } else {
            throw new Error('Calculator last operation element not found');
        }
    }
}