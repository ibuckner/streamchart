import { bisector, extent } from "d3-array";
import { axisBottom } from "d3-axis";
import { event, mouse, select, selectAll } from "d3-selection";
import { scaleLinear, scaleOrdinal, scaleTime } from "d3-scale";
import { schemePaired } from "d3-scale-chromatic";
import { area, stack, stackOffsetSilhouette } from "d3-shape";
import { svg, TMargin } from "@buckneri/spline";

export type TStreamAxisLabel = {
  x: string,
  y?: string
};

export type TStreamLabels = {
  series: string[],
  axis: TStreamAxisLabel
};

export type TStreamSeries = {
  period: string | Date,
  sum?: number,
  values: number[]
};

export type TStream = {
  colors?: string[],
  labels: TStreamLabels,
  series: TStreamSeries[]
};

export type TStreamchartOptions = {
  container: HTMLElement,
  data: TStream[],
  margin: TMargin
};

export class Streamchart {
  public container: HTMLElement = document.querySelector("body") as HTMLElement;
  public formatY: Intl.NumberFormat;
  public h: number = 200;
  public locale: string = "en-GB";
  public margin: TMargin = { bottom: 20, left: 20, right: 30, top: 20 };
  public rh: number = 160;
  public rw: number = 150;
  public ticksX: number = 5;
  public w: number = 200;

  private _area: any;
  private _axis: any;
  private _canvas: any;
  private _color = scaleOrdinal(schemePaired);
  private _data: TStream = { labels: { axis: { x: "" }, series: [] }, series: []};
  private _dataStacked: any;
  private _extentX: [Date, Date] = [new Date(), new Date()];
  private _extentY: [number, number] = [0, 0];
  private _fp: Intl.NumberFormat;
  private _id: string = "";
  private _marker: any;
  private _scaleX: any;
  private _scaleY: any;
  private _selected: SVGElement | undefined;
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
    }

    const box: DOMRect = this.container.getBoundingClientRect();
    this.h = box.height;
    this.w = box.width;
    this.rh = this.h - this.margin.top - this.margin.bottom;
    this.rw = this.w - this.margin.left - this.margin.right;

    this.formatY = new Intl.NumberFormat(this.locale, { maximumFractionDigits: 2, style: "decimal" });
    this._fp = new Intl.NumberFormat(this.locale, { maximumFractionDigits: 2, style: "percent" });
    
    this.data(options.data);
  }

  /**
   * Clears selection from Streamchart
   */
  public clearSelection(): Streamchart {
    selectAll(".selected").classed("selected", false);
    selectAll(".fade").classed("fade", false);
    select(".stream-tip").text("");
    this._selected = undefined;
    this._clearMarker();
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
    const isDate: Function = (dd: any) => dd instanceof Date;
    this._data.series.forEach(s => {
      if (!isDate(s.period)) {
        s.period = new Date(s.period);
      }
      s.sum = s.values.map(v => v).reduce(sum);
    });
  
    this._scalingExtent();
    this._scaling();

    const st = stack()
      .offset(stackOffsetSilhouette)
      .keys(this._data.labels?.series as string[])
      // @ts-ignore
      .value((d: any, key: string) => {
        let i: number = this._data.labels?.series.indexOf(key) as number;
        return d.values[i];
      });

    this._dataStacked = st(this._data.series as any);

    this._area = area()
      .x((d: any) => this._scaleX(d.data.period))
      .y0((d: any) => this._scaleY(d[0]))
      .y1((d: any) => this._scaleY(d[1]));

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
      ._drawStream()
      ._drawMarker();
    
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

  private _canvasMouseMoveHandler(): void {
    if (this._selected === undefined) {
      this._clearMarker();
    } else {
      this._moveMarker(this._selected);
    }
  }

  private _clearMarker(): void {
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

  private _drawAxes(): Streamchart {
    if (this._axis === undefined) {
      this._axis = this._canvas.append("g")
        .attr("class", "stream-axis")
        .attr("transform", `translate(0,${this.rh * 0.9})`);
    }

    this._axis.call(
      axisBottom(this._scaleX).tickSize(-this.rh * 0.7)
    ).select(".domain").remove();

    let xAxisLabel = this._canvas.select("text.stream-xaxis-text");
    if (xAxisLabel.empty()) {
      xAxisLabel = this._canvas.append("text")
        .attr("class", "stream-xaxis-text")
        .attr("text-anchor", "end")
        .attr("x", this.rw)
        .attr("y", this.rh - 30 )
        .on("click", () => {
          this.ticksX = this.ticksX > 10 ? 5 : this.ticksX + 1;
          this._scaling().draw();
        });

      xAxisLabel.append("title").text("Click to increase detail on the x axis");
    }
    xAxisLabel.text(this._data.labels?.axis.x);
    
    this._tip = this._canvas.select("text.stream-tip");
    if (this._tip.empty()) {
      this._tip = this._canvas.append("text")
        .attr("class", "stream-tip")
        .attr("x", 0)
        .attr("y", (this.margin.top * 2) + 1);
    }

    return this;
  }

  private _drawCanvas(): Streamchart {
    if (select(this.container).select("svg.streamchart").empty()) {
      this._id = "streamchart" + Array.from(document.querySelectorAll(".streamchart")).length;
      let sg: SVGElement | null = svg(this.container, {
        class: "streamchart",
        height: this.h,
        id: this._id,
        margin: this.margin,
        width: this.w
      }) as SVGElement;
      this._svg = select(sg)
        .on("click", () => this.clearSelection())
        .on("mousemove", () => this._canvasMouseMoveHandler());
      this._canvas = this._svg.select(".canvas");
    }

    return this;
  }

  private _drawMarker(): Streamchart {
    if (this._marker === undefined) {
      this._marker = this._canvas.append("g")
        .attr("id", (d: any, i: number) => `${this._id}_mark${i}`);

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
    }

    return this;
  }

  private _drawStream(): Streamchart {
    let n: number = 0;
    let streams: any;

    let g = this._canvas.select("g.streams");
    if (g.empty()) {
      g = this._canvas.append("g").attr("class", "streams");
    }

    g.selectAll("path.streamchart")
      .data(this._dataStacked)
      .join(
        (enter: any) => {
          streams = enter.append("path")
            .attr("id", (d: any, i: number) => `${this._id}_p${i}`)
            .attr("class", "streamchart")
            .attr("d", this._area as any)
            .style("fill", () => this._data.colors ? this._data.colors[n++] : "whitesmoke")
            .on("click", () => this._streamClickHandler(event.target))
            .on("mousemove", (d: any, i: number, n: Node[]) => {
              event.stopPropagation();
              this._moveMarker((this._selected ? this._selected : n[i]) as SVGElement);
            });
          streams.append("title").text((d: any) => `${d.key}`);
        },
        (update: any) => {
          update.attr("id", (d: any, i: number) => `${this._id}_p${i}`)
            .attr("d", this._area as any)
            .style("fill", () => this._data.colors ? this._data.colors[n++] : "whitesmoke");
          update.select("title").text((d: any) => `${d.key}`);
        },
        (exit: any) => exit.remove()
      );

    return this;
  }

  private _moveMarker(el: SVGElement): void {
    const d: any = select(el).datum();
    const mxy = mouse(el as any);
    const mouseDate = this._scaleX.invert(mxy[0]);
    if (mouseDate === undefined) {
      return;
    }
    const dates = this._data.series.map(s => [s.period, s.sum]);

    const bisect = bisector((d: any) => d[0]);
    let m = bisect.left(dates, mouseDate);
    if (m === 0) {
      m = 1;
    } else if (m > d.length - 1) {
      m = d.length - 1; 
    }

    const d0 = d[m - 1];
    const d1 = d[m];
    const dt: any = mouseDate - d0.data.period > d1.data.period - mouseDate ? d1 : d0;
    const v: number = Math.abs(dt[1] - dt[0]);
    const perc = this._fp.format((v / dt.data.sum));
    this._tip.text(`${d.key}: ${this.formatY.format(v)} (${perc} of total for ${(dt.data.period as Date).toLocaleDateString(this.locale)})`);

    this._marker.select("line")
      .attr("x1", this._scaleX(dt.data.period))
      .attr("x2", this._scaleX(dt.data.period))
      .attr("y1", this._scaleY(dt[0]))
      .attr("y2", this._scaleY(dt[1]));

    this._marker.select("circle.first")
      .attr("r", 5)
      .attr("cx", this._scaleX(dt.data.period))
      .attr("cy", this._scaleY(dt[0]));
    
    this._marker.select("circle.second")
      .attr("r", 5)
      .attr("cx", this._scaleX(dt.data.period))
      .attr("cy", this._scaleY(dt[1]));
  }

  private _streamClickHandler(el: Element): void {
    event.stopPropagation();
    this.clearSelection();
    window.dispatchEvent(new CustomEvent("stream-selected", { detail: el }));
    selectAll("path.streamchart")
      .each((d: any, i: number, n: any) => {
        if (n[i] === el) {
          select(el).classed("selected", true);
          this._selected = n[i];
        } else {
          select(n[i]).classed("fade", true);
        }
      });
  }

  /**
   * Calculates the chart scale
   */
  private _scaling(): Streamchart {
    this._scaleX = scaleTime().domain(this._extentX).range([0, this.rw]).nice(this.ticksX);
    this._scaleY = scaleLinear().domain(this._extentY).range([this.rh, 0]);
    return this;
  }

  /**
   * Determines the minimum and maximum extent values used by scale
   */
  private _scalingExtent(): Streamchart {
    let max: number | undefined = undefined;   
    this._extentX = extent(this._data.series, (d: TStreamSeries) => (d.period as Date)) as [Date, Date];
    this._data.series.forEach((d: TStreamSeries) => max = Math.max(max === undefined ? 0 : max, d.sum as number));
    this._extentY = [max === undefined ? 0 : -max, max === undefined ? 0 : max];
    return this;
  }
}