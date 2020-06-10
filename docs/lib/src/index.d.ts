import { TMargin } from "@buckneri/spline";
export declare type TStreamLabels = {
    series: string[];
    xaxis: string;
};
export declare type TStreamSeries = {
    label: string;
    sum?: number;
    values: number[];
};
export declare type TStream = {
    colors?: string[];
    labels?: TStreamLabels;
    series: TStreamSeries[];
};
export declare type TStreamchartOptions = {
    container: HTMLElement;
    data: TStream[];
    margin: TMargin;
};
export declare class Streamchart {
    container: HTMLElement;
    h: number;
    margin: TMargin;
    rh: number;
    rw: number;
    w: number;
    private _canvas;
    private _color;
    private _data;
    private _extentX;
    private _extentY;
    private _fp;
    private _scaleX;
    private _scaleY;
    private _selectedLabel;
    private _svg;
    private _tip;
    constructor(options: TStreamchartOptions);
    /**
     * Clears selection from Streamchart
     */
    clearSelection(): Streamchart;
    /**
     * Saves data into Streamchart
     * @param data - Streamchart data
     */
    data(data: any): Streamchart;
    /**
     * Removes this chart from the DOM
     */
    destroy(): Streamchart;
    /**
     * draws the Streamchart
     */
    draw(): Streamchart;
    /**
     * Recalculate internal values
     */
    initialise(): Streamchart;
    /**
     * Serialise the Streamchart data
     */
    toString(): string;
    private _drawAxes;
    private _drawCanvas;
    private _drawStream;
    private _streamClickHandler;
    private _streamMouseMoveHandler;
    /**
     * Calculates the chart scale
     */
    private _scaling;
    /**
     * Determines the minimum and maximum extent values used by scale
     */
    private _scalingExtent;
}
