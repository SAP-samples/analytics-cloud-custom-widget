import 'echarts-wordcloud'

import * as echarts from 'echarts'

class Renderer {
  constructor (root) {
    this._root = root

    this._echart = null
  }

  async render (phrase) {
    this.dispose()

    // https://www.npmjs.com/package/echarts-wordcloudbyinput
    const series = [{
      data: phrase.map(p => {
        return {
          name: p.phrase,
          value: p.count
        }
      }),
      type: 'wordCloud',
      shape: 'circle',
      // A silhouette image which the white area will be excluded from drawing texts.
      // The shape option will continue to apply as the shape of the cloud to grow.
      // maskImage: maskImage,
      // Folllowing left/top/width/height/right/bottom are used for positioning the word cloud
      // Default to be put in the center and has 75% x 80% size.
      left: 'center',
      top: 'center',
      width: '100%',
      height: '100%',
      right: null,
      bottom: null,
      // Text size range which the value in data will be mapped to.
      // Default to have minimum 12px and maximum 60px size.
      sizeRange: [12, 60],
      // Text rotation range and step in degree. Text will be rotated randomly in range [-90, 90] by rotationStep 45
      rotationRange: [-90, 90],
      rotationStep: 45,
      // size of the grid in pixels for marking the availability of the canvas
      // the larger the grid size, the bigger the gap between words.
      gridSize: 8,
      // set to true to allow word being draw partly outside of the canvas.
      // Allow word bigger than the size of the canvas to be drawn
      drawOutOfBound: false,
      // If perform layout animation.
      // NOTE disable it will lead to UI blocking when there is lots of words.
      layoutAnimation: true,
      // Global text style
      textStyle: {
        fontFamily: 'sans-serif',
        fontWeight: 'bold',
        // Color can be a callback function or a color string
        color: function () {
          // Random color
          return 'rgb(' + [
            Math.round(Math.random() * 160),
            Math.round(Math.random() * 160),
            Math.round(Math.random() * 160)
          ].join(',') + ')'
        }
      },
      emphasis: {
        focus: 'self',
        textStyle: {
          shadowBlur: 10,
          shadowColor: '#333'
        }
      }
    }]

    this._echart = echarts.init(this._root)
    // https://echarts.apache.org/en/option.html
    this._echart.setOption({
      series
    })
  }

  dispose () {
    if (this._echart) {
      echarts.dispose(this._echart)
    }
  }
}

export default Renderer
