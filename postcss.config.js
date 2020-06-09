module.exports = {
  plugins: [
    require("postcss-sorting")({
      "order": [
        "custom-properties",
        "dollar-variables",
        "declarations",
        "at-rules",
        "rules"
      ],
      "properties-order": "alphabetical",
      "unspecified-properties-position": "bottom"
    }),
    require("autoprefixer")
  ]  
};