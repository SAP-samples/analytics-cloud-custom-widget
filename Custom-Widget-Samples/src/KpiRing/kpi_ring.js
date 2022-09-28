import * as echarts from 'echarts'
import html from './kpi_ring.html'

import { parseMetadata } from '../utils/data-binding/parse'

(function () {
  const template = document.createElement('template')
  template.innerHTML = html
  class SampleRingKpi extends HTMLElement {
    constructor () {
      super()

      this._shadowRoot = this.attachShadow({ mode: 'open' })
      this._shadowRoot.appendChild(template.content.cloneNode(true))

      this._root = this._shadowRoot.getElementById('root')

      this._props = {}

      this.render()
    }

    onCustomWidgetResize (width, height) {
      this.render()
    }

    set myDataSource (dataBinding) {
      this._myDataSource = dataBinding
      this.render()
    }

    async render () {
      if (!this._myDataSource || this._myDataSource.state !== 'success') {
        return
      }

      const { data, metadata } = this._myDataSource
      const { dimensions, measures } = parseMetadata(metadata)

      const myChart = echarts.init(this._root, 'wight')

      const option = {
        series: [
          {
            type: 'gauge',
            data: measures.map((measure, i) => {
              return {
                value: data[0][measure.key].raw,
                name: measure.label,
                title: {
                  offsetCenter: ['-0%', `${-30 + i * 30}%`]
                },
                detail: {
                  valueAnimation: true,
                  offsetCenter: ['0%', `${-20 + i * 30}%`]
                }
              }
            }),
            startAngle: 90,
            endAngle: -270,
            pointer: {
              show: false
            },
            progress: {
              show: true,
              overlap: false,
              roundCap: true,
              clip: false,
              itemStyle: {
                borderWidth: 1,
                borderColor: '#464646'
              }
            },
            axisLine: {
              lineStyle: {
                width: 40
              }
            },
            splitLine: {
              show: false,
              distance: 0,
              length: 10
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false,
              distance: 50
            },
            title: {
              fontSize: 14
            },
            detail: {
              width: 50,
              height: 14,
              fontSize: 14,
              color: 'auto',
              borderColor: 'auto',
              borderRadius: 20,
              borderWidth: 1,
              formatter: '{value}%'
            }
          }
        ]
      }
      myChart.setOption(option)
    }
  }

  customElements.define('com-sap-sample-echarts-ring_kpi', SampleRingKpi)
})()
