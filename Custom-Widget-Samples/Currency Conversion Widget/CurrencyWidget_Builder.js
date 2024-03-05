
(function () {
      let template = document.createElement("template");
      template.innerHTML = `
<br>
<style>
    #form {
        font-family: Arial, sans-serif;
        width: 400px;
        margin: 0 auto;
    }

    a {
        text-decoration: none;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 10px;
    }

    td {
        padding: 1px;
        text-align: left;
        font-size: 13px;
    }

    input {
        width: 100%;
        padding: 10px;
        border: 2px solid #ccc;
        border-radius: 5px;
        font-size: 13px;
        box-sizing: border-box;
        margin-bottom: 10px;
    }


    input[type="color"] {
	-webkit-appearance: none;
	border: none;
	width: 32px;
	height: 32px;
}
input[type="color"]::-webkit-color-swatch-wrapper {
	padding: 0;
}
input[type="color"]::-webkit-color-swatch {
	border: none;
}


    select {
        width: 100%;
        padding: 10px;
        border: 2px solid #ccc;
        border-radius: 5px;
        font-size: 13px;
        box-sizing: border-box;
        margin-bottom: 10px;
    }

    input[type="submit"] {
        background-color: #487cac;
        color: white;
        padding: 10px;
        border: none;
        border-radius: 5px;
        font-size: 14px;
        cursor: pointer;
        width: 100%;
    }

    #label {
        width: 140px;
    }
</style>
<form id="form">
    <table>
        <tr>
    <td>
    <p>Source Currency Code</p>
    <input id="builder_from" type="text" placeholder="Enter Source Currency Code">
    </td>
    </tr>
    <tr>
    <td>
    <p>Target Currency Code</p>
    <input id="builder_to" type="text" placeholder="Enter Target Currency Code">
    </td>
    </tr>
    <tr>
    <td>
    <p>Amount to Calculate</p>
    <input id="builder_amount" type="number" placeholder="Enter Amount to Calculate">
    </td>
    </tr>
    <tr>
    <td>
    <p>Decimal Values</p>
    <input id="builder_decimalPlaces" type="number" placeholder="Enter Decimal Values">
    </td>
    </tr>
    
    </table>
    <input value="Update Settings" type="submit">
    <br>
    <p>Developed by <a target="_blank" href="https://linkedin.com/in/itsrohitchouhan">Rohit Chouhan</a></p>
</form>
`;
      class CurrencyWidgetBuilderPanel extends HTMLElement {
         constructor() {
            super();
            this._shadowRoot = this.attachShadow({
               mode: "open"
            });
            this._shadowRoot.appendChild(template.content.cloneNode(true));
            this._shadowRoot
               .getElementById("form")
               .addEventListener("submit", this._submit.bind(this));
         }
         _submit(e) {
               e.preventDefault();
               this.dispatchEvent(
                  new CustomEvent("propertiesChanged", {
                     detail: {
                        properties: {
                           from: this.from,to: this.to,amount: this.amount,decimalPlaces: this.decimalPlaces
                        },
                     },
                  })
               );
            }

            set from(_from) {
                    this._shadowRoot.getElementById("builder_from").value = _from;
                 }
                 get from() {
                    return this._shadowRoot.getElementById("builder_from").value;
                 }
        
                 set to(_to) {
                    this._shadowRoot.getElementById("builder_to").value = _to;
                 }
                 get to() {
                    return this._shadowRoot.getElementById("builder_to").value;
                 }
        
                 set amount(_amount) {
                    this._shadowRoot.getElementById("builder_amount").value = _amount;
                 }
                 get amount() {
                    return this._shadowRoot.getElementById("builder_amount").value;
                 }
        
                 set decimalPlaces(_decimalPlaces) {
                    this._shadowRoot.getElementById("builder_decimalPlaces").value = _decimalPlaces;
                 }
                 get decimalPlaces() {
                    return this._shadowRoot.getElementById("builder_decimalPlaces").value;
                 }
        
                    }
   customElements.define("com-rohitchouhan-sap-currencywidget-builder", 
      CurrencyWidgetBuilderPanel
   );
})();