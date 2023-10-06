var getScriptPromisify = (src) => {
  return new Promise((resolve) => {
    $.getScript(src, resolve)
  })
}

var parseMetadata = metadata => {
  const { dimensions: dimensionsMap, mainStructureMembers: measuresMap } = metadata
  const dimensions = []
  for (const key in dimensionsMap) {
    const dimension = dimensionsMap[key]
    dimensions.push({ key, ...dimension })
  }
  const measures = []
  for (const key in measuresMap) {
    const measure = measuresMap[key]
    measures.push({ key, ...measure })
  }
  return { dimensions, measures, dimensionsMap, measuresMap }
}

(function () {
  const template = document.createElement('template')
  template.innerHTML = `
        <style>
        </style>
        <div id="root" style="width: 100%; height: 100%;">
        </div>
      `
  class Main extends HTMLElement {
    constructor () {
      super()

      this._shadowRoot = this.attachShadow({ mode: 'open' })
      this._shadowRoot.appendChild(template.content.cloneNode(true))

      this._root = this._shadowRoot.getElementById('root')

      this._eChart = null
    }

    onCustomWidgetResize (width, height) {
      this.render()
    }

    onCustomWidgetAfterUpdate (changedProps) {
      this.render()
    }

    onCustomWidgetDestroy () {
      if (this._eChart && echarts) { echarts.dispose(this._eChart) }
    }

    setSeriesType (seriesType) {
      this.seriesType = seriesType
      this.dispatchEvent(new CustomEvent('propertiesChanged', { detail: { properties: { seriesType } } }))
      this.render()
    }

    async render () {
      const dataBinding = this.dataBinding
      if (!dataBinding || dataBinding.state !== 'success') { return }

      await getScriptPromisify('https://cdn.staticfile.org/echarts/5.0.0/echarts.min.js')

      const { data, metadata } = dataBinding
      const { dimensions, measures } = parseMetadata(metadata)
      // dimension
      const categoryData = []

      // measures
      const series = measures.map(measure => {
        return {
          id: measure.id,
          name: measure.label,
          data: [],
          key: measure.key,
          type: this.seriesType || 'line',
          smooth: true
        }
      })

      data.forEach(row => {
        categoryData.push(dimensions.map(dimension => {
          return row[dimension.key].label
        }).join('/')) // dimension
        series.forEach(series => {
          series.data.push(row[series.key].raw)
        }) // measures
      })

      if (this._eChart) { echarts.dispose(this._eChart) }
      const eChart = this._eChart = echarts.init(this._root, 'main')
      const option = {
        xAxis: { type: 'category', data: categoryData },
        yAxis: { type: 'value' },
        tooltip: { trigger: 'axis' },
        series
      }
      eChart.setOption(option)
    }
  }

  customElements.define('com-sap-sac-exercise-username-main', Main)
})()
