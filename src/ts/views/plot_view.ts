import {Observer} from '../core/observer';
import * as domHelper from "../helpers/dom_helper";

export class PlotView extends Observer {
    private svgElement: HTMLElement = <HTMLElement>document.getElementById('plot');
    private textColour: string = '#FFFFFF';
    private axisColour: string = '#AAAAAA';
    private svgWidth: number;
    private svgHeight: number;

    constructor() {
        super();
        const svgClientRect: ClientRect = this.svgElement.getBoundingClientRect();

        this.svgWidth = svgClientRect.width;
        this.svgHeight = svgClientRect.height;

        this.svgElement.style.fill = this.textColour;

        this.createDisplay();
    }
    createDisplay(): void {
        const startAxis: SVGPathElement = this.createAxis();
        const middleWidth: number = Math.floor(this.svgWidth / 2);
        const middleHeight: number = Math.floor(this.svgHeight / 2);
        const xAxisText = this.createText(this.svgWidth - 20, middleHeight + 15, 'x');
        const yAxisText = this.createText(middleWidth + 10, 20, 'f(x)');

        this.svgElement.appendChild(startAxis);
        this.svgElement.appendChild(xAxisText);
        this.svgElement.appendChild(yAxisText);
    }
    createAxis(): SVGPathElement {
        const middleWidth: number = Math.floor(this.svgWidth / 2);
        const middleHeight: number = Math.floor(this.svgHeight / 2);
        const width: number = this.svgWidth;
        const height: number = this.svgHeight;
        const path: SVGPathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const pathParam: string = `M 2 ${middleHeight} L ${width - 2} ${middleHeight} M ${middleWidth} 2 L ${middleWidth} ${height - 2}
        M ${width - 5} ${middleHeight - 3} L ${width - 2} ${middleHeight} L ${width - 5} ${middleHeight + 3} M ${middleWidth - 3} 5 L ${middleWidth} 2
        L ${middleWidth + 3} 5`;

        path.setAttribute('d', pathParam);
        path.setAttribute('stroke', this.axisColour);
        path.setAttribute('stroke-width', '1');
        path.setAttribute('fill', 'none');

        return path;
    }
    createText(x: number, y: number, text: string): SVGTextElement {
        const textElement: SVGTextElement = document.createElementNS("http://www.w3.org/2000/svg", 'text');

        textElement.setAttribute('x', `${x}`);
        textElement.setAttribute('y', `${y}`);
        textElement.textContent = text;

        return textElement;
    }
    clearDisplay(): void {
        domHelper.removeNodeChildren(this.svgElement);
        this.createDisplay();
    }
}