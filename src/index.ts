import { event, select, selectAll } from "d3-selection";
import { scaleLinear } from "d3-scale";
import { transition } from "d3-transition";
import { formatNumber, measure, svg, TMargin } from "@buckneri/spline";

export type TStreamchartOptions = {
  container: HTMLElement,
  data: any,
  margin: TMargin
};

export class Streamchart {
  public container: HTMLElement = document.querySelector("body") as HTMLElement;
  public h: number = 200;
  public margin: TMargin = { bottom: 20, left: 20, right: 30, top: 20 };
  public rh: number = 160;
  public rw: number = 150;
  public w: number = 200;

  private _data: any;
  private _extent: [number, number] = [0, 0]; // min/max node values
  private _scale: any;

  constructor(options: TStreamchartOptions) {
    if (options.margin !== undefined) {
      let m = options.margin;
      m.left = isNaN(m.left) ? 0 : m.left;
      m.right = isNaN(m.right) ? 0 : m.right;
      m.top = isNaN(m.top) ? 0 : m.top;
      m.bottom = isNaN(m.bottom) ? 0 : m.bottom;
      this.margin = m;
    }

    if (options.container !== undefined) {
      this.container = options.container;
      const box: DOMRect = measure(this.container);
      this.h = box.height;
      this.w = box.width;
      this.rh = this.h - this.margin.top - this.margin.bottom;
      this.rw = this.w - this.margin.left - this.margin.right;
    }
    
    this.data(options.data)
        .initialise();
  }

  /**
   * Clears selection from Streamchart
   */
  public clearSelection(): Streamchart {
    selectAll(".selected").classed("selected", false);
    return this;
  }

  /**
   * Saves data into Streamchart
   * @param data - Streamchart data
   */
  public data(data: any): Streamchart {
    this._data = data;
    return this;
  }

  /**
   * Removes this chart from the DOM
   */
  public destroy(): Streamchart {
    select(this.container).select("svg").remove();
    return this;
  }

  /**
   * draws the Streamchart
   */
  public draw(): Streamchart {
    this._drawCanvas();
    return this;
  }

  /**
   * Recalculate internal values
   */
  public initialise(): Streamchart {
    this._scaling();
    return this;
  }

  /**
   * Serialise the Streamchart data
   */
  public toString(): string {
    let dt: string = this._data.map((n: any) => `${n}`).join("\n");
    return `data:\n${dt}`;
  }

  // ***** PRIVATE METHODS

  private _drawCanvas(): Streamchart {
    const sg: SVGElement = svg(this.container, {
      height: this.h, 
      margin: this.margin,
      width: this.w
    }) as any;
    sg.classList.add("streamchart");
    sg.id = "streamchart" + Array.from(document.querySelectorAll(".streamchart")).length;

    const s = select(sg);
    s.on("click", () => this.clearSelection());

    return this;
  }

  /**
   * Calculates the chart scale
   */
  private _scaling(): Streamchart {
    const rng: [number, number] = [0, this.rh];
    this._scale = scaleLinear().domain(this._extent).range(rng);
    return this;
  }
}