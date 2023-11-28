// Load the third-party library echarts via $.getScript //

var getScriptPromisify = (src) => {
  return new Promise((resolve) => {
    $.getScript(src, resolve);
  });
};

(function () {

// Parse dimensions, measures, data from data binding results //

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

// Append the data of total. Because the custom widget will not return the data of the total amount of all the dimension members. It returns the data per dimension member. The sankey chart needs the total value //

  const appendTotal = (data) => {
    data = JSON.parse(JSON.stringify(data))
    const superRoot = {
      dimensions_0: { id: 'total', label: 'Total' },
      measures_0: { raw: 0 }
    }
    data.forEach(data => {
      if (data.dimensions_0?.parentId) { return }
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

// Adding the data binding function //

    async render (dataBinding, props) {
      await getScriptPromisify("https://cdn.staticfile.org/echarts/5.3.0/echarts.min.js");
      this.dispose()

      if (dataBinding.state !== 'success') { return }

      let { data, metadata } = dataBinding
      const { dimensions, measures } = parseMetadata(metadata)

      const [dimension] = dimensions
      const [measure] = measures
      const nodes = []
      const links = []

//get the nodes and links for the sankey chart options//

      data = appendTotal(data)
      data.forEach(d => {
        const { label, id, parentId } = d[dimension.key]
        const { raw } = d[measure.key]
        nodes.push({ name: label})

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

// Convert the parsed results into an Sankey EChart option //

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
                  color: props.depth0Settings.itemColor || '#fbb4ae'
                },
                lineStyle: {
                  color: 'source',
                  opacity: props.depth0Settings.lineOpacity//0.6
                }
              },
              {
                depth: 1,
                itemStyle: {
                  color: props.depth1Settings.itemColor || '#b3cde3'
                },
                lineStyle: {
                  color: 'source',
                  opacity: props.depth1Settings.lineOpacity//0.4
                }
              },
              {
                depth: 2,
                itemStyle: {
                  color: props.depth2Settings.itemColor || '#ccebc5'
                },
                lineStyle: {
                  color: 'source',
                  opacity: props.depth2Settings.lineOpacity//0.2
                }
              },
              {
                depth: 3,
                itemStyle: {
                  color: props.depth3Settings.itemColor || '#decbe4'
                },
                lineStyle: {
                  color: 'source',
                  opacity: props.depth3Settings.lineOpacity//0.1
                }
              }
            ],
            lineStyle: {
              curveness: 0.7
            }
          }
        ]
      })

      const that = this;
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
      this._props = {}
      this._renderer = new Renderer(this._root)
    }

// Lifecycle Functions  //
    async onCustomWidgetBeforeUpdate (changedProps) {
      this._props = { ...this._props, ...changedProps };
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
      render () {
      if (!document.contains(this)) {
        // Delay the render to assure the custom widget is appended on dom
        setTimeout(this.render.bind(this), 0)
        return
      }

      this._renderer.render(this.dataBinding, this._props)
    }

    dispose () {
      this._renderer.dispose()
    }
  }
  customElements.define('com-sap-sac-sample-echarts-sankey', Main)
})()