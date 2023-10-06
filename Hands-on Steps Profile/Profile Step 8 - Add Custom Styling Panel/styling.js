(function () {
  const template = document.createElement('template')
  template.innerHTML = `
    <style>
      #root label {
        height: 24px;
        display: block;
        font-size: .875rem;
        color: #999;
      }
      #root label:not(:first-child) {
        margin-top: 16px;
      }
      #root select {
        font-size: 14px;
        width: 120px;
      }
      #root button {
        display: block;
        margin-top: 16px;
      }
    </style>
    <div id="root" style="width: 100%; height: 100%;">
      <label for="seriesType-dropdown">SeriesType</label>
      <select id="seriesType-dropdown">
        <option value="line">LineChart</option>
        <option value="bar">BarChart</option>
      </select>

      <button id="button">Apply</button>
    </div>
    `

  class Styling extends HTMLElement {
    constructor () {
      super()

      this._shadowRoot = this.attachShadow({ mode: 'open' })
      this._shadowRoot.appendChild(template.content.cloneNode(true))
      this._root = this._shadowRoot.getElementById('root')

      this._button = this._shadowRoot.getElementById('button')
      this._button.addEventListener('click', () => {
        const seriesType = this._shadowRoot.getElementById('seriesType-dropdown').value
        this.dispatchEvent(new CustomEvent('propertiesChanged', { detail: { properties: { seriesType } } }))
      })
    }

    async onCustomWidgetAfterUpdate (changedProps) {
      if (changedProps.seriesType) {
        let seriesType = changedProps.seriesType
        if (seriesType !== 'line' && seriesType !== 'bar') { seriesType = 'line' }
        this._shadowRoot.getElementById('seriesType-dropdown').value = seriesType
      }
    }
  }

  customElements.define('com-sap-sac-exercise-username-styling', Styling)
})()
