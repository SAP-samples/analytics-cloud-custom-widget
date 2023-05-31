const plotareaFormTemplate = document.createElement("template");
plotareaFormTemplate.innerHTML = `
    <form id="form">
        <fieldset>
            <legend>Plotarea Properties</legend>
            <table>
                <tr>
                    <td>Rounded Marker</td>
                    <td><input id="bps_rounded" type="checkbox" checked></td>
                </tr>
                <tr>
                    <td>Increate Size</td>
                    <td><input id="bps_size_increment" type="number" value="0">%</td>
                </tr>
                <tr>
                    <td>Axis Label Color</td>
                    <td><input id="bps_axis_label_color" type="text" size="10" maxlength="10" value="#333"></td>
                </tr>
            </table>
            <input type="submit" style="display:none;">
        </fieldset>
    </form>
    <style>
    :host {
        display: block;
        padding: 1em 1em 1em 1em;
    }
    </style>
`;

class VizPlotareaBuilderPanel extends HTMLElement {
    constructor() {
        super();
        this._shadowRoot = this.attachShadow({mode: "open"});
        this._shadowRoot.appendChild(plotareaFormTemplate.content.cloneNode(true));
        this._shadowRoot.getElementById("form").addEventListener("submit", this._submit.bind(this));
        this._shadowRoot.getElementById('bps_rounded').addEventListener('change', this._submit.bind(this));
        this._shadowRoot.getElementById('bps_size_increment').addEventListener('change', this._submit.bind(this));
        this._shadowRoot.getElementById('bps_axis_label_color').addEventListener('change', this._submit.bind(this));
    }

    _submit(e) {
        e.preventDefault();
        this.dispatchEvent(new CustomEvent("propertiesChanged", {
                detail: {
                    properties: {
                        rounded: this.rounded,
                        sizeIncrement: this.sizeIncrement,
                        axisLabelColor: this.axisLabelColor,
                    }
                }
        }));
    }

    set rounded(value) {
        (this._shadowRoot.getElementById("bps_rounded")).checked = !!value;
    }

    get rounded() {
        return (this._shadowRoot.getElementById("bps_rounded")).checked;
    }

    set sizeIncrement(value) {
        (this._shadowRoot.getElementById("bps_size_increment")).value = value;
    }

    get sizeIncrement() {
        return (this._shadowRoot.getElementById("bps_size_increment")).value;
    }

    set axisLabelColor(value) {
        (this._shadowRoot.getElementById("bps_axis_label_color")).value = value;
    }

    get axisLabelColor() {
        return (this._shadowRoot.getElementById("bps_axis_label_color")).value;
    }

    set settings(settings) {
        this.rounded = settings?.rounded || this.rounded;
        this.sizeIncrement = settings?.sizeIncrement || this.sizeIncrement;
        this.axisLabelColor = settings?.axisLabelColor || this.axisLabelColor;
    }
}

customElements.define("viz-plotarea-build", VizPlotareaBuilderPanel);