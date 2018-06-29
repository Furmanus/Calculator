import {CalculatorController} from './calculator_controller';
import {PlotController} from './plot_controller';
import {EventEnum} from '../enums/event_enums';
import {Observer} from '../core/observer';

export class MainController extends Observer{
    private calculatorController: CalculatorController = new CalculatorController();
    private plotController: PlotController = new PlotController();

    public constructor() {
        super();

        this.attachEvents();
    }

    private attachEvents(): void {
        this.calculatorController.on(this, EventEnum.CALCULATOR_SOLVE_CLICKED, this.onCalculatorSolveClick.bind(this))
    }
    private onCalculatorSolveClick(partialResult: string): void {
        this.plotController.plotFunction(partialResult);
    }
}