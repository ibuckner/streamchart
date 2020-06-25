import { TMargin } from "@buckneri/spline";
export declare type TStreamAxisLabel = {
    x: string;
    y?: string;
};
export declare type TStreamLabels = {
    series: string[];
    axis: TStreamAxisLabel;
};
export declare type TStreamSeries = {
    period: string | Date;
    sum?: number;
    values: number[];
};
export declare type TStream = {
    colors?: string[];
    labels: TStreamLabels;
    series: TStreamSeries[];
};
export declare type TStreamchartOptions = {
    container: HTMLElement;
    data: TStream;
    formatY?: Intl.NumberFormat;
    locale?: string;
    margin: TMargin;
    ticksX?: number;
};
export declare class Streamchart {
    container: HTMLElement;
    formatY: Intl.NumberFormat;
    h: number;
    locale: string;
    margin: TMargin;
    rh: number;
    rw: number;
    ticksX: number;
    w: number;
    private _area;
    private _axis;
    private _canvas;
    private _color;
    private _data;
    private _dataStacked;
    private _extentX;
    private _extentY;
    private _fp;
    private _id;
    private _marker;
    private _scaleX;
    private _scaleY;
    private _selected;
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
     * Serialise the Streamchart data
     */
    toString(): string;
    private _canvasMouseMoveHandler;
    private _clearMarker;
    private _drawAxes;
    private _drawCanvas;
    private _drawMarker;
    private _drawStream;
    private _moveMarker;
    private _streamClickHandler;
    /**
     * Calculates the chart scale
     */
    private _scaling;
    /**
     * Determines the minimum and maximum extent values used by scale
     */
    private _scalingExtent;
}
