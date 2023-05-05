import * as echarts from 'echarts'
import html from './GrogressGauge.html'

import { parseMetadata } from '../utils/data-binding/parse'

(function () {
  const template = document.createElement('template')
  template.innerHTML = html
  class GrogressGauge extends HTMLElement {
    constructor () {
      super()

      this._shadowRoot = this.attachShadow({ mode: 'open' })
      this._shadowRoot.appendChild(template.content.cloneNode(true))

      this._root = this._shadowRoot.getElementById('root')

      this._props = {}

      this._echart = undefined
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
      this.dispose()

      if (!this._myDataSource || this._myDataSource.state !== 'success') {
        return
      }

      const { data, metadata } = this._myDataSource
      const { dimensions, measures } = parseMetadata(metadata)

      this._echart = echarts.init(this._root, 'wight')
      const option = {
        series: [
          {
            type: 'gauge',
            startAngle: 180,
            endAngle: 0,
            min: 0,
            max: 240,
            splitNumber: 12,
            itemStyle: {
              color: '#008FD3',
              shadowColor: 'rgba(0,0,0,0)',
              shadowBlur: 0,
              shadowOffsetX: 0,
              shadowOffsetY: 0
            },
            progress: {
              show: true,
              roundCap: true,
              width: 18
            },
            pointer: {
              icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
              length: '75%',
              width: 16,
              offsetCenter: [0, '5%']
            },
            axisLine: {
              roundCap: true,
              lineStyle: {
                width: 18
              }
            },
            axisTick: {
              splitNumber: 2,
              lineStyle: {
                width: 2,
                color: '#999'
              }
            },
            splitLine: {
              length: 6,
              lineStyle: {
                width: 4,
                color: '#999'
              }
            },
            axisLabel: {
              distance: 30,
              color: '#999',
              fontSize: 16
            },
            title: {
              show: false
            },
            detail: {
              backgroundColor: '#fff',
              borderColor: '#999',
              borderWidth: 1,
              width: '60%',
              lineHeight: 40,
              height: 40,
              borderRadius: 4,
              offsetCenter: [0, '35%'],
              valueAnimation: true,
              formatter: function (value) {
                return '{value|' + value.toFixed(0) + '}'
              },
              rich: {
                value: {
                  fontSize: 35,
                  fontWeight: 'bolder',
                  color: '#777'
                },
                unit: {
                  fontSize: 20,
                  color: '#999',
                  padding: [0, 0, -20, 10]
                }
              }
            },
            data: [
              {
                value: data[0][measures[0].key].raw
              }
            ]
          }
        ]
      }
      this._echart.setOption(option)
    }

    dispose () {
      if (this._echart) {
        echarts.dispose(this._echart)
      }
    }
  }

  customElements.define('com-sap-sample-echarts-grogress_gauge', GrogressGauge)
})()
