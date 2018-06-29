import {Observer} from '../core/observer';
import {PlotView} from '../views/plot_view';
import {PlotModel} from '../model/plot_model';

export class PlotController extends Observer {
    private view: PlotView = new PlotView();
    private model: PlotModel = new PlotModel();

    public plotFunction(func: string): void {
        console.log(func);
    }
}