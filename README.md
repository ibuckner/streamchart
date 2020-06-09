# streamchart

My take on building a stream chart. The build includes a starter CSS file, and two javascript versions for ES modules and current browsers. No serious attempt has been made towards ie11 compatibility.

## Installation

```shell
npm i --save @buckneri/streamchart
```

## API

### Constructor

```javascript
const streamchart = new Streamchart({
  container: document.getElementById("chart"),
  data: data,
  margin: { bottom: 20, left: 20, right: 20, top: 20 }
});
```

### Events

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

streamchart.initialise();
// (re)calculates the internal values

streamchart.toString();
// serialises the internal data
```

### Properties

```javascript
streamchart.container;
// parent element for chart

streamchart.h;
// height of chart

streamchart.margin;
// defines the border zone around the canvas

streamchart.rh;
// relative height, height - margins

streamchart.rw;
// relative width, width - margins

streamchart.w;
// width of chart
```
