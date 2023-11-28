(function() {
    let template = document.createElement("template");
    template.innerHTML = `
      <style>
     
      </div>
    `;

    class SankeyChartStylingPanel extends HTMLElement {
        constructor() {
            super();
            console.log("styling: constructor()");
            this._shadowRoot = this.attachShadow({mode: "open"});
            this._shadowRoot.appendChild(template.content.cloneNode(true));

            


            this._props = {};
        }

        connectedCallback() {}

        disconnectedCallback() {}

        onCustomWidgetBeforeUpdate(changedProps) {
            this._props = { ...this._props, ...changedProps };
            if ("depth0Settings" in changedProps) {
                this.updateDepthSettings(changedProps["depth0Settings"], 0);
            }

            if ("depth1Settings" in changedProps) {
                this.updateDepthSettings(changedProps["depth1Settings"], 1);
            }

            if ("depth2Settings" in changedProps) {
                this.updateDepthSettings(changedProps["depth2Settings"], 2);
            }

            if ("depth3Settings" in changedProps) {
                this.updateDepthSettings(changedProps["depth3Settings"], 3);
            }
        }

        onCustomWidgetAfterUpdate(changedProps) {}

        onCustomWidgetDestroy() {}

        updateDepthSettings(settings, depth) {
            this[`depth${depth}Color`] = settings.itemColor;
            this[`depth${depth}Opacity`] = settings.lineOpacity;
        }

        onDepthSettingsChanged(depth, event) {
          
        }
        
        
    }

    customElements.define("com-sap-sac-sample-echarts-sankey-styling", SankeyChartStylingPanel);
})();