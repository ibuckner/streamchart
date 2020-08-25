import { bisector, extent } from "d3-array";
import { axisBottom } from "d3-axis";
import { pointer, select, selectAll } from "d3-selection";
import { scaleLinear, scaleTime } from "d3-scale";
import { area, stack, stackOffsetSilhouette } from "d3-shape";
import { Basechart, TMargin } from "@buckneri/spline";

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
  formatY?: Intl.NumberFormat,
  locale?: string,
  margin: TMargin,
  ticksX?: number
};

export class Streamchart extends Basechart {
  public formatY: Intl.NumberFormat;
  public ticksX: number = 10;

  private _area: any;
  private _axis: any;
  private _data: TStream = { labels: { axis: { x: "" }, series: [] }, series: []};
  private _dataStacked: any;
  private _extentX: [Date, Date] = [new Date(), new Date()];
  private _extentY: [number, number] = [0, 0];
  private _fp: Intl.NumberFormat;
  private _marker: any;
  private _tip: any;

  constructor(options: TStreamchartOptions) {
    super(options);

    if (options.formatY !== undefined) {
      this.formatY = options.formatY;
    } else {
      this.formatY = new Intl.NumberFormat(this.locale, { maximumFractionDigits: 2, style: "decimal" });
    }

    if (options.ticksX !== undefined) {
      this.ticksX = options.ticksX;
    }

    this._fp = new Intl.NumberFormat(this.locale, { maximumFractionDigits: 2, style: "percent" });
    
    this.data(options.data);
  }

  /**
   * Clears selection from Streamchart
   */
  public clearSelection(): Streamchart {
    super.clearSelection();

    this.canvas.select(".stream-tip").text("");
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
        this._data.colors?.push(this.scale.color(label));
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
      .x((d: any) => this.scale.x(d.data.period))
      .y0((d: any) => this.scale.y(d[0]))
      .y1((d: any) => this.scale.y(d[1]));

    return this;
  }

  /**
   * draws the Streamchart
   */
  public draw(): Streamchart {
    super.draw();
    
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

  private _canvasMouseMoveHandler(event: any): void {
    const selected = this.canvas.select(".selected");
    if (selected.empty()) {
      this._clearMarker();
    } else {
      this._moveMarker(event);
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
      this._axis = this.canvas.append("g")
        .attr("class", "stream-axis")
        .attr("transform", `translate(0,${this.rh * 0.9})`);
    }

    this._axis.call(
      axisBottom(this.scale.x).tickSize(-this.rh * 0.7)
    ).select(".domain").remove();

    let xAxisLabel = this.canvas.select("text.stream-xaxis-text");
    if (xAxisLabel.empty()) {
      xAxisLabel = this.canvas.append("text")
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
    
    this._tip = this.canvas.select("text.stream-tip");
    if (this._tip.empty()) {
      this._tip = this.canvas.append("text")
        .attr("class", "stream-tip")
        .attr("x", 0)
        .attr("y", (this.margin.top * 2) + 1);
    }

    return this;
  }

  private _drawCanvas(): Streamchart {
    this.id = "streamchart" + Array.from(document.querySelectorAll(".streamchart")).length;
    const svg = this.container.querySelector("svg");
    if (svg) {
      svg.classList.add("streamchart");
      svg.id = this.id;
    }
    select(svg)
      .on("mousemove", (event) => this._canvasMouseMoveHandler(event));
    return this;
  }

  private _drawMarker(): Streamchart {
    if (this._marker === undefined) {
      this._marker = this.canvas.append("g")
        .attr("id", (d: any, i: number) => `${this.id}_mark${i}`);

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

    let g = this.canvas.select("g.streams");
    if (g.empty()) {
      g = this.canvas.append("g").attr("class", "streams");
    }

    g.selectAll("path.streamchart")
      .data(this._dataStacked)
      .join(
        (enter: any) => {
          streams = enter.append("path")
            .attr("id", (d: any, i: number) => `${this.id}_p${i}`)
            .attr("class", "streamchart")
            .attr("d", this._area as any)
            .style("fill", () => this._data.colors ? this._data.colors[n++] : "whitesmoke")
            .on("click", (event: any) => this._streamClickHandler(event))
            .on("mousemove", (event: any) => {
              event.stopPropagation();
              this._moveMarker(event);
            });
          streams.append("title").text((d: any) => `${d.key}`);
        },
        (update: any) => {
          update.attr("id", (d: any, i: number) => `${this.id}_p${i}`)
            .attr("d", this._area as any)
            .style("fill", () => this._data.colors ? this._data.colors[n++] : "whitesmoke");
          update.select("title").text((d: any) => `${d.key}`);
        },
        (exit: any) => exit.remove()
      );

    return this;
  }

  private _moveMarker(event: any): void {
    const selected = this.canvas.select(".selected");
    const el = (selected.empty() ? event.target : selected.node()) as SVGElement;
    const [x, y] = pointer(event);
    const d: any = select(el).datum();
    const mouseDate = this.scale.x.invert(x);
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
      .attr("x1", this.scale.x(dt.data.period))
      .attr("x2", this.scale.x(dt.data.period))
      .attr("y1", this.scale.y(dt[0]))
      .attr("y2", this.scale.y(dt[1]));

    this._marker.select("circle.first")
      .attr("r", 5)
      .attr("cx", this.scale.x(dt.data.period))
      .attr("cy", this.scale.y(dt[0]));
    
    this._marker.select("circle.second")
      .attr("r", 5)
      .attr("cx", this.scale.x(dt.data.period))
      .attr("cy", this.scale.y(dt[1]));
  }

  private _streamClickHandler(event: any): void {
    event.stopPropagation();
    const el = event.target;

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

  /**
   * Calculates the chart scale
   */
  private _scaling(): Streamchart {
    this.scale.x = scaleTime().domain(this._extentX).range([0, this.rw]).nice(this.ticksX);
    this.scale.y = scaleLinear().domain(this._extentY).range([this.rh, 0]);
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