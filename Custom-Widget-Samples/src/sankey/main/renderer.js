import * as echarts from 'echarts'

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

  render (dataBinding) {
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
        text: 'Sankey Diagram'
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
                color: '#354a5f'
              },
              lineStyle: {
                color: 'source',
                opacity: 0.6
              }
            },
            {
              depth: 1,
              itemStyle: {
                color: '#354a5f'
              },
              lineStyle: {
                color: 'source',
                opacity: 0.4
              }
            },
            {
              depth: 2,
              itemStyle: {
                color: '#354a5f'
              },
              lineStyle: {
                color: 'source',
                opacity: 0.2
              }
            },
            {
              depth: 3,
              itemStyle: {
                color: '#354a5f'
              },
              lineStyle: {
                color: 'source',
                opacity: 0.2
              }
            }
          ],
          lineStyle: {
            curveness: 0.5
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

export default Renderer
