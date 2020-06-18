# streamchart

My take on building a stream chart. The build includes a starter CSS file, and two javascript versions for ES modules and current browsers. No serious attempt has been made towards ie11 compatibility.

## Installation

```shell
npm i --save @buckneri/streamchart
```

## API

### Data frame schema

Receives a JSON object as described below:

```javascript
{
  labels: {
    // optional labels for the axes
    axis: {
      x: string,
      y: string
    },
    // optional field "colors": an array of CSS compatible color values to be applied to the series labels.
    // If not supplied, this is generated by the library.
    colors: string[],
    // these labels should be in the same order as the values found in the series[n].values array
    series: string[]
  },
  // each series member is a point on the x-axis timeline
  series: [
    {
      // this describes the point in time e.g. year "2020" or other valid Javascript date
      period: string,
      // an array of single numbers relating to each stream at this point in time.
      // These are in the same sort order as descriptors in labels.series.
      values: number[]
    }
  ]
}

// Example data
{
  labels: {
    axis: {
      x: "year"
    }
    colors: ["green", "yellow", "purple"]
    series: ["apple", "banana", "grape"]
  },
  series: [
    { period: "1880", values: [241,117,12] },
    { period: "1881", values: [263,112,14] },
    { period: "1882", values: [288,123,15] },
    { period: "1883", values: [287,120,16] }
  ]
}
```

### Constructor

```javascript
const streamchart = new Streamchart({
  container: document.getElementById("chart"),
  data: data,
  margin: { bottom: 20, left: 20, right: 20, top: 20 }
});
```

### Events

stream-selected - emitted when user clicks on stream

### Methods

```javascript
streamchart.clearSelection();
// clears selection from chart elements

streamchart.data(nodes, links);
// stores and initialises data

streamchart.destroy();
// self-destruct

streamchart.draw();
// draws chart to DOM

streamchart.toString();
// serialises the internal data
```

### Properties

```javascript
streamchart.container;
// parent element for chart

streamchart.formatY
// Intl.NumberFormat instance. Default is decimal

streamchart.h;
// height of chart

streamchart.local
// locale for formatting values. Default is en-GB

streamchart.margin;
// defines the border zone around the canvas

streamchart.rh;
// relative height, height - margins

streamchart.rw;
// relative width, width - margins

streamchart.ticksX
// Default is 5. Sets detail level on x axis

streamchart.w;
// width of chart
```
