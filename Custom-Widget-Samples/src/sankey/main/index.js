import Renderer from './renderer'
import html from './template.html'

const template = document.createElement('template')
template.innerHTML = html

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

customElements.define('com-sap-sac-sample-echarts-sankey', Main)
