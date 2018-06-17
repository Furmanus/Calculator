import {CalculatorController} from './calculator_controller';
import {PlotController} from './plot_controller';

export class MainController {
    private calculatorController: CalculatorController = new CalculatorController();
    private plotController: PlotController = new PlotController();
}