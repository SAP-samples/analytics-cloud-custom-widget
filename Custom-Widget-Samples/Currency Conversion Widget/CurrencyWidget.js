(function () {
  let template = document.createElement("template");
  template.innerHTML = `
       <style>
         :host {}
       </style>
       <div>
         <p>Current Conversion Rate: <span id="conversionRate"></span></p>
       </div>
     `;

  class CurrencyWidget extends HTMLElement {
    constructor() {
      super();
      let shadowRoot = this.attachShadow({
        mode: "open"
      });
      shadowRoot.appendChild(template.content.cloneNode(true));
      this._props = {};
    }

    async connectedCallback() {
      this.updateConversionRate();
      this.interval = setInterval(() => {
        this.updateConversionRate();
      }, 4000);
    }

    disconnectedCallback() {
      clearInterval(this.interval);
    }

    async updateConversionRate() {
      const from = this._props.from || "USD";
      const to = this._props.to || "INR";
      const amount = this._props.amount || 1;
      const decimalPlaces = this._props.decimalPlaces || 2;
      //const price= this._props.amountprice|| 0;

      const url = `https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`;
      const response = await fetch(url);
      const data = await response.json();

      const conversionRate = data.result.toFixed(decimalPlaces);
      const conversionRateElement = this.shadowRoot.getElementById("conversionRate");
      conversionRateElement.innerText = `${conversionRate} ${to}/${from}`;
      const getprice = conversionRate.toString();
      this.setValues(getprice);
    }

    onCustomWidgetBeforeUpdate(changedProperties) {
      this._props = {
        ...this._props,
        ...changedProperties
      };
    }

    setValues(_price) {
      const calculatedRate = _price;
      this.dispatchEvent(new CustomEvent("propertiesChanged", {
        detail: {
          properties: {
            calculatedRate: calculatedRate
          }
        }
      }));
    }

    onCustomWidgetAfterUpdate(changedProperties) {
    }
  }

  customElements.define("com-rohitchouhan-sap-currencywidget", CurrencyWidget);
})();
