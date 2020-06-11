import { bisector, extent } from "d3-array";
import { axisBottom } from "d3-axis";
import { event, mouse, select, selectAll } from "d3-selection";
import { scaleLinear, scaleOrdinal, scaleTime } from "d3-scale";
import { schemePaired } from "d3-scale-chromatic";
import { area, stack, stackOffsetSilhouette } from "d3-shape";
import { measure, svg, TMargin } from "@buckneri/spline";

export type TStreamLabels = {
  series: string[],
  xaxis: string
};

export type TStreamSeries = {
  label: string,
  sum?: number,
  values: number[]
};

export type TStream = {
  colors?: string[],
  labels?: TStreamLabels,
  series: TStreamSeries[]
};

export type TStreamchartOptions = {
  container: HTMLElement,
  data: TStream[],
  margin: TMargin
};

export class Streamchart {
  public container: HTMLElement = document.querySelector("body") as HTMLElement;
  public h: number = 200;
  public margin: TMargin = { bottom: 20, left: 20, right: 30, top: 20 };
  public rh: number = 160;
  public rw: number = 150;
  public w: number = 200;

  private _canvas: any;
  private _color = scaleOrdinal(schemePaired);
  private _data: TStream = { series: []};
  private _extentX: [Date, Date] = [new Date(), new Date()];
  private _extentY: [number, number] = [0, 0];
  private _fp = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 2, style: "percent" }).format;
  private _marker: any;
  private _scaleX: any;
  private _scaleY: any;
  private _svg: any;
  private _tip: any;

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
    selectAll(".fade").classed("fade", false);
    select(".stream-tip").text("");
    return this;
  }

  /**
   * Saves data into Streamchart
   * @param data - Streamchart data
   */
  public data(data: any): Streamchart {
    this._data = data;
    if (this._data.colors === undefined) {
      this._data.colors = [];
    }
    if (this._data.colors.length === 0 && this._data.labels) {
      this._data.labels.series.forEach((label: string) => {
        this._data.colors?.push(this._color(label));
      });
    }
    const sum = (accumulator: number, currentValue: number) => accumulator + currentValue;
    this._data.series.forEach(s => {
      s.sum = s.values.map(v => v).reduce(sum);
    });
    this._scalingExtent();
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
    this._drawCanvas()
      ._drawAxes()
      ._drawStream();
    
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
    let dt: string = this._data.series.map((n: any) => `${n}`).join("\n");
    return `data:\n${dt}`;
  }

  // ***** PRIVATE METHODS

  private _drawAxes(): Streamchart {
    this._canvas.append("g")
      .attr("transform", `translate(0,${this.rh * 0.9})`)
      .call(
        axisBottom(this._scaleX).tickSize(-this.rh * 0.7)
      ).select(".domain").remove();

    this._canvas.append("text")
      .attr("text-anchor", "end")
      .attr("x", this.rw)
      .attr("y", this.rh - 30 )
      .text(`Time (${this._data.labels?.xaxis})`);
    
    this._tip = this._canvas.append("text")
      .attr("class", "stream-tip")
      .attr("x", 0)
      .attr("y", (this.margin.top * 2) + 1);

    return this;
  }

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

    this._svg = s;
    this._canvas = s.select(".canvas");

    return this;
  }

  private _drawStream(): Streamchart {
    const id: string = (this._svg.node() as SVGElement).id;

    const st = stack()
      .offset(stackOffsetSilhouette)
      .keys(this._data.labels?.series as string[])
      // @ts-ignore
      .value((d: any, key: string) => {
        let i: number = this._data.labels?.series.indexOf(key) as number;
        return d.values[i];
      });
  
    const stackedData = st(this._data.series as any);
    
    const ar = area()
      .x((d: any, i: number) => this._scaleX(new Date(d.data.label)))
      .y0((d: any, i: number) => this._scaleY(d[0]))
      .y1((d: any, i: number) => this._scaleY(d[1]));

    let n = 0;
    const streams = this._canvas.selectAll("path.streamchart")
      .data(stackedData)
      .enter()
        .append("path")
          .attr("id", (d: any, i: number) => `${id}_p${i}`)
          .attr("class", "streamchart")
          .attr("d", ar as any)
          .style("fill", () => this._data.colors ? this._data.colors[n++] : "whitesmoke");

    streams
      .on("click", () => this._streamClickHandler(event.target))
      .on("mousemove", (d: any, i: number, n: Node[]) => this._streamMouseMoveHandler(d, i, n))
      .on("mouseout", (d: any, i: number, n: Node[]) => this._streamMouseLeaveHandler(d, i, n));

    streams.append("title")
      .text((d: any) => `${d.key}`);

    this._marker = this._canvas.append("g")
      .attr("id", (d: any, i: number) => `${id}_mark${i}`);

    this._marker.append("line")
      .attr("class", "stream-marker")
      .attr("x1", 0).attr("x2", 0)
      .attr("y1", 0).attr("y2", 0);

    this._marker.append("circle")
      .attr("class", "stream-marker first")
      .attr("r", 0).attr("cx", 0).attr("cy", 0);

    this._marker.append("circle")
      .attr("class", "stream-marker second")
      .attr("r", 0).attr("cx", 0).attr("cy", 0);

    return this;
  }

  private _streamClickHandler(el: Element): void {
    event.stopPropagation();
    this.clearSelection();
    window.dispatchEvent(new CustomEvent("stream-selected", { detail: el }));
    selectAll("path.streamchart")
      .each((d: any, i: number, n: any) => {
        if (n[i] === el) {
          select(el).classed("selected", true);
        } else {
          select(n[i]).classed("fade", true);
        }
      });
  }

  private _streamMouseLeaveHandler(d: any, i: number, nodes: any[]): void {
    this._marker.select("line")
      .attr("x1", 0)
      .attr("x2", 0)
      .attr("y1", 0)
      .attr("y2", 0);

    this._marker.selectAll("circle")
      .attr("r", 0)
      .attr("cx", 0)
      .attr("cy", 0);
  }

  private _streamMouseMoveHandler(d: any, i: number, nodes: any[]): void {
    const mxy = mouse(nodes[i]);
    const mouseDate = this._scaleX.invert(mxy[0]);
    const dates = this._data.series.map(s => [new Date(s.label), s.sum]);

    const bisect = bisector((d: any) => d[0]);
    let m = bisect.left(dates, mouseDate);
    if (m === 0) {
      m = 1;
    }

    const d0 = d[m - 1];
    const d1 = d[m];
    const t0: any = new Date(d0.data.label);
    const t1: any = new Date(d1.data.label);
    const dt: any = mouseDate - t0 > t1 - mouseDate ? d1 : d0;
    const v: number = Math.abs(dt[1] - dt[0]);
    const perc = this._fp((v / dt.data.sum));
    this._tip.text(`${d.key}: ${v} (${perc} of total for ${dt.data.label})`);

    this._marker.select("line")
      .attr("x1", mxy[0]-1)
      .attr("x2", mxy[0]-1)
      .attr("y1", this._scaleY(dt[0]))
      .attr("y2", this._scaleY(dt[1]));

    this._marker.select("circle.first")
      .attr("r", 5)
      .attr("cx", mxy[0]-1)
      .attr("cy", this._scaleY(dt[0]));
    
    this._marker.select("circle.second")
      .attr("r", 5)
      .attr("cx", mxy[0]-1)
      .attr("cy", this._scaleY(dt[1]));
  }

  /**
   * Calculates the chart scale
   */
  private _scaling(): Streamchart {
    this._scaleX = scaleTime().domain(this._extentX).range([0, this.rw]);
    this._scaleY = scaleLinear().domain(this._extentY).range([this.rh, 0]);
    return this;
  }

  /**
   * Determines the minimum and maximum extent values used by scale
   */
  private _scalingExtent(): Streamchart {
    let max: number | undefined = undefined;   
    this._extentX = extent(this._data.series, (d: TStreamSeries) => new Date(d.label)) as [Date, Date];
    this._data.series.forEach((d: TStreamSeries) => max = Math.max(max === undefined ? 0 : max, ...d.values));
    this._extentY = [-(max === undefined ? 0 : max), max === undefined ? 0 : max];
    return this;
  }
}