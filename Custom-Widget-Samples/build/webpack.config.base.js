const path = require('path')

module.exports = {
  entry: [
    './src/GaugeChart/GrogressGauge.js',
    './src/gaugegrade/main/index.js',
    './src/gaugegrade/styling/index.js',
    './src/KpiRing/kpi_ring.js',
    './src/sankey/main/index.js',
    './src/wordcloudbyinput/main/index.js',
    './src/wordcloudbyinput/builder/index.js'
  ],
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader'
      }
    ]
  },
  plugins: [
  ],
  output: {
    filename: 'main.bundle.js',
    path: path.resolve(__dirname, '../dist')
  }
}
