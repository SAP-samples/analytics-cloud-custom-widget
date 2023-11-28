// Load the third-party library echarts via $.getScript //



(function () {

// Parse dimensions, measures, data from data binding results //




// Append the data of total. Because the custom widget will not return the data of the total amount of all the dimension members. It returns the data per dimension member. The sankey chart needs the total value //


 
  class Renderer {
    constructor (root) {
      this._root = root
      this._echart = null
    }

// Adding the data binding function //
    async render (dataBinding, props) {
      

//get the nodes and links for the sankey chart options//



      this._echart = echarts.init(this._root)

// Convert the parsed results into a Sankey EChart option //
      this._echart.setOption({
       
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

