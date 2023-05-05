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
    if (changedProps.text) {
      this.render()
    }
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
  // setText (text) {
  //   debugger
  //   // this._text = text
  //   this.dispatchEvent(new CustomEvent('propertiesChanged', { detail: { properties: { text } } }))
  //   // this.render()
  //   // this._text = '' // TODO
  //
  //   // this.text = text
  // }

  dispose () {
    this._renderer.dispose()
  }

  async render () {
    if (!document.contains(this)) {
      // Delay the render to assure the custom widget is appended on dom
      setTimeout(this.render.bind(this), 0)
      return
    }
    this._renderer.dispose()

    const text = this._text || this.text

    const byPhrase = {}
    text.toLowerCase().split(' ').map(word => {
      byPhrase[word] = byPhrase[word] || {
        phrase: word,
        count: 0
      }
      byPhrase[word].count++
    })

    const phrase = []
    for (const word in byPhrase) {
      phrase.push(byPhrase[word])
    }

    this._renderer.render(phrase)
  }
}

customElements.define('com-sap-sac-sample-echarts-wordcloudbyinput', Main)
