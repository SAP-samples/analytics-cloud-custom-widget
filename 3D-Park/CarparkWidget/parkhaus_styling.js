(function()  {
	let template = document.createElement("template");
	template.innerHTML = `
		<form id="form">
			<fieldset>
				<legend>Colored Box Properties</legend>
				<table>
					<tr>
						<td>Color</td>
						<td><input id="styling_color" type="text" size="40" maxlength="40"></td>
					</tr>
				</table>
				<input type="submit" style="display:none;">
			</fieldset>
		</form>
	`;

	class testwidgetStylingPanel extends HTMLElement {
		constructor() {
			super();
			this._shadowRoot = this.attachShadow({mode: "open"});
			this._shadowRoot.appendChild(template.content.cloneNode(true));
			this._shadowRoot.getElementById("form").addEventListener("submit", this._submit.bind(this));
		}

		_submit(e) {
			e.preventDefault();
			this.dispatchEvent(new CustomEvent("propertiesChanged", {
					detail: {
						properties: {
							color: this.color
						}
					}
			}));
		}

		set color(newColor) {
			this._shadowRoot.getElementById("styling_color").value = newColor;
		}

		get color() {
			return this._shadowRoot.getElementById("styling_color").value;
		}
	}

	customElements.define("com-sample-parkhaus-styling", testwidgetStylingPanel);
})();