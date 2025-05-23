# Visual PCF Component

This directory contains a sample PowerApps Component Framework (PCF) control that renders different chart types using Chart.js. The control allows rendering the following visuals:

- Donut chart
- Stacked bar chart
- Heatmap (matrix)
- Line chart

The control uses a dataset input for label/value pairs and an input property `visualType` to choose the desired visual.


Each dataset record must include a `label` field (string) and a `value` field (number). For example:

```json
[
  { "label": "Category A", "value": 10 },
  { "label": "Category B", "value": 25 }
]
```

This is a skeleton implementation intended for demonstration purposes.

