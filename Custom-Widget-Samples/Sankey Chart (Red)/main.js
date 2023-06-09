var getScriptPromisify = (src) => {
  return new Promise((resolve) => {
    $.getScript(src, resolve);
  });
};

(function () {
  const parseMetadata = metadata => {
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

  const appendTotal = (data) => {
    data = JSON.parse(JSON.stringify(data))
    const superRoot = {
      dimensions_0: { id: 'total', label: 'Total' },
      measures_0: { raw: 0 }
    }
    data.forEach(data => {
      if (data.dimensions_0.parentId) { return }
      data.dimensions_0.parentId = 'total'
      superRoot.measures_0.raw += data.measures_0.raw
    })
    return [superRoot].concat(data)
  }

  class Renderer {
    constructor (root) {
      this._root = root
      this._echart = null
    }

    async render (dataBinding) {
      await getScriptPromisify("https://cdn.staticfile.org/echarts/5.3.0/echarts.min.js");
      this.dispose()

      if (dataBinding.state !== 'success') { return }

      let { data, metadata } = dataBinding
      const { dimensions, measures } = parseMetadata(metadata)

      const [dimension] = dimensions
      const [measure] = measures
      const nodes = []
      const links = []

      data = appendTotal(data)
      data.forEach(d => {
        const { label, id, parentId } = d[dimension.key]
        const { raw } = d[measure.key]
        nodes.push({ name: label })

        const dParent = data.find(d => {
          const { id } = d[dimension.key]
          return id === parentId
        })
        if (dParent) {
          const { label: labelParent } = dParent[dimension.key]
          links.push({
            source: labelParent,
            target: label,
            value: raw
          })
        }
      })
      this._echart = echarts.init(this._root)
      // https://echarts.apache.org/examples/en/editor.html?c=sankey-levels
      // https://echarts.apache.org/en/option.html
      this._echart.setOption({
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove'
        },
        series: [
          {
            type: 'sankey',
            data: nodes,
            links: links,
            emphasis: {
              focus: 'adjacency'
            },
            levels: [
              {
                depth: 0,
                itemStyle: {
                  color: '#f24269'
                },
                lineStyle: {
                  color: 'source',
                  opacity: 0.6
                }
              },
              {
                depth: 1,
                itemStyle: {
                  color: '#f24269'
                },
                lineStyle: {
                  color: 'source',
                  opacity: 0.4
                }
              },
              {
                depth: 2,
                itemStyle: {
                  color: '#f24269'
                },
                lineStyle: {
                  color: 'source',
                  opacity: 0.2
                }
              },
              {
                depth: 3,
                itemStyle: {
                  color: '#f24269'
                },
                lineStyle: {
                  color: 'source',
                  opacity: 0.1
                }
              }
            ],
            lineStyle: {
              curveness: 0.7
            }
          }
        ]
      })
    }

    dispose () {
      if (this._echart) {
        echarts.dispose(this._echart)
      }
    }
  }

  const template = document.createElement('template')
  template.innerHTML = `
  <style>
      #chart {
          width: 100%;
          height: 100%;
      }
  </style>
  <div id="root" style="width: 100%; height: 100%;">
      <div id="chart"></div>
  </div>
  `

  class Main extends HTMLElement {
    constructor () {
      super()

      this._shadowRoot = this.attachShadow({ mode: 'open' })
      this._shadowRoot.appendChild(template.content.cloneNode(true))
      this._root = this._shadowRoot.getElementById('root')
      this._renderer = new Renderer(this._root)
    }

    // ------------------
    // LifecycleCallbacks
    // ------------------
    async onCustomWidgetBeforeUpdate (changedProps) {
    }

    async onCustomWidgetAfterUpdate (changedProps) {
      this.render()
    }

    async onCustomWidgetResize (width, height) {
      this.render()
    }

    async onCustomWidgetDestroy () {
      this.dispose()
    }

    // ------------------
    //
    // ------------------
    render () {
      if (!document.contains(this)) {
        // Delay the render to assure the custom widget is appended on dom
        setTimeout(this.render.bind(this), 0)
        return
      }

      this._renderer.render(this.dataBinding)
    }

    dispose () {
      this._renderer.dispose()
    }
  }

  customElements.define('com-sap-sac-sample-echarts-sankeyy', Main)
})()
