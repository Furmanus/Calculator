import {Observer} from '../core/observer';
import {EventEnum} from '../enums/event_enums';
import {specialFunctions} from "../enums/special_functions";
import {replaceLast, replaceNth} from "../helpers/misc_helper";
import * as config from '../globals/config';



export class CalculatorView extends Observer{
    private buttons: NodeList;
    private display: HTMLDivElement | null;
    private lastOperationText: HTMLParagraphElement | null;
    private subscriptOpen: number = 0;
    private maxSubscriptOpen: number = 0;
    private superscriptOpen: number = 0;
    private maxSuperscriptOpen: number = 0;
    private lastSpecialDisplay: string[] = [];

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
            } else if ('x' === calcButtonValue) {
                button.addEventListener('click', this.onVariableButtonClick.bind(this));
            } else if ('plot' === calcButtonValue) {
                button.addEventListener('click', this.onSolveButtonClick.bind(this));
            } else {
                button.addEventListener('click', this.onCalculatorButtonNumberClick.bind(this, calcButtonValue));
            }

            button.removeAttribute('data-calc-button');
        });
    }
    public resetDisplay(): void {
        this.getDisplay().innerHTML = '';
    }
    public addToDisplay(value: string): void {
        const innerHtml: string = this.getDisplay().innerHTML;
        const lastSpecialDisplay: string = this.lastSpecialDisplay[this.lastSpecialDisplay.length - 1];
        const sub: number = this.subscriptOpen;
        const sup: number = this.superscriptOpen;
        const maxSub: number = this.maxSubscriptOpen;
        const maxSup: number = this.maxSuperscriptOpen;
        let valueOccurence;
        if ('sub' === lastSpecialDisplay && sub) {
            valueOccurence = (maxSub === sub) ? 1 : maxSub;
            this.getDisplay().innerHTML = replaceNth(valueOccurence, innerHtml,'</sub>', `${value}</sub>`);
        } else if ('sup' === lastSpecialDisplay && sup) {
            valueOccurence = (maxSup === sup) ? 1 : maxSup;
            this.getDisplay().innerHTML = replaceNth(valueOccurence, innerHtml,'</sup>', `${value}</sup>`);
        }else {
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
        const innerHtml: string = this.getDisplay().innerHTML;
        let fontSize: number = config.DISPLAY_FONT_SIZE;
        const subStyle: string = `"font-size: ${(fontSize /= (this.subscriptOpen + 1) * 2) + 2}px !important;"`;
        this.lastSpecialDisplay.push('sub');

        if (this.subscriptOpen) {
            this.getDisplay().innerHTML = replaceLast(
                innerHtml,
                `</sub>`,
                `<sub style=${subStyle}></sub></sub>`
            );
        } else {
            this.getDisplay().innerHTML += `<sub style=${subStyle}></sub>`;
        }
        this.subscriptOpen++;
        this.maxSubscriptOpen++;
    }
    public stopSubscript(): void {
        this.subscriptOpen--;
        this.lastSpecialDisplay.pop();
        if (0 === this.subscriptOpen) {
            this.maxSubscriptOpen = 0;
        }
    }
    public startSuperscript(): void {
        const innerHtml: string = this.getDisplay().innerHTML;
        let fontSize: number = config.DISPLAY_FONT_SIZE;
        const supStyle: string = `"font-size: ${(fontSize /= (this.subscriptOpen + 1) * 2) + 2}px !important;"`;
        this.lastSpecialDisplay.push('sup');

        if (this.superscriptOpen) {
            this.getDisplay().innerHTML = replaceLast(
                innerHtml,
                `</sup>`,
                `<sup style=${supStyle}></sup></sup>`
            );
        } else {
            this.getDisplay().innerHTML += `<sup style=${supStyle}></sup>`;
        }
        this.superscriptOpen++;
        this.maxSuperscriptOpen++;
    }
    public stopSuperscript(): void {
        this.superscriptOpen--;
        this.lastSpecialDisplay.pop();
        if (0 === this.superscriptOpen) {
            this.maxSuperscriptOpen = 0;
        }
    }
    public resetSubSupCount(): void {
        this.subscriptOpen = 0;
        this.maxSubscriptOpen = 0;
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
    private onVariableButtonClick(): void {
        this.notify(EventEnum.CALCULATOR_VARIABLE_CLICKED);
    }
    private onSolveButtonClick(): void {
        this.notify(EventEnum.CALCULATOR_SOLVE_CLICKED);
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