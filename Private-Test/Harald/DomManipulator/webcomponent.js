(function()  {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
    `;

    customElements.define('com-sap-sample-dom-manipulator', class DomManipulator extends HTMLElement {


		constructor() {
            console.log("> DomManipulator.constructor()");
			super(); 
			this._shadowRoot = this.attachShadow({mode: "open"});
            this._shadowRoot.appendChild(tmpl.content.cloneNode(true));
            this._firstConnection = false;
            this._tagContainer;
            this._tagType = "h1";
            this._tagText = "Hello World";

            //Adding event handler for click events
			this.addEventListener("click", event => {
				var event = new Event("onClick");
				this.dispatchEvent(event);
            });
		}

        //Fired when the widget is added to the html DOM of the page
        connectedCallback(){
            console.log("> DomManipulator.connectedCallback()");
			this._firstConnection = true;
            this.redraw(); 
        }

         //Fired when the widget is removed from the html DOM of the page (e.g. by hide)
        disconnectedCallback(){
            console.log("> DomManipulator.disconnectedCallback()");
        }

         //When the custom widget is updated, the Custom Widget SDK framework executes this function first
		onCustomWidgetBeforeUpdate(oChangedProperties) {
            console.log("> DomManipulator.onCustomWidgetBeforeUpdate("+oChangedProperties+")");

		}

        //When the custom widget is updated, the Custom Widget SDK framework executes this function after the update
		onCustomWidgetAfterUpdate(oChangedProperties) {
            console.log("> DomManipulator.onCustomWidgetAfterUpdate("+oChangedProperties+")");
            if (this._firstConnection){
                this.redraw();
            } else {
	            console.log("> DomManipulator.onCustomWidgetAfterUpdate() - subsequent call!");
			}
        }
        
        //When the custom widget is removed from the canvas or the analytic application is closed
        onCustomWidgetDestroy(){
            console.log("> DomManipulator.onCustomWidgetDestroy()");
        }

        
        //When the custom widget is resized on the canvas, the Custom Widget SDK framework executes the following JavaScript function call on the custom widget
        // Commented out by default
        onCustomWidgetResize(width, height){
           console.log("> DomManipulator.onCustomWidgetResize("+width+","+height+")");
        }

        //Getters and Setters
        get widgetText() {
 			console.log("> getWidgetText() returning "+this._tagText);
            return this._tagText;
        }

        set widgetText(value) {
			console.log("> setWidgetText("+value+") called.");
			this._tagText = value;
        }


        get headingType() {
 			console.log("> getHeadingType() returning "+this._tagType);
           return this._tagType;
            }

        set headingType(value) {
			console.log("> setHeadingType("+value+") called.");
            this._tagType = value;
        }

        // End - Getters and Setters

        redraw(){
           console.log("> DomManipulator.redraw()");
           if (this._tagContainer){
                this._tagContainer.parentNode.removeChild(this._tagContainer);
            }

            var shadow = window.getSelection(this._shadowRoot);
            this._tagContainer = document.createElement(this._tagType);
            var theText = document.createTextNode(this._tagText);    
            this._tagContainer.appendChild(theText); 
            this._shadowRoot.appendChild(this._tagContainer);
			
			// now try the DOM Manipulation:
			console.log("> DomManipulator.redraw() - Now trying the DOM Manipulation...");
			try {
				
				var searchElems = $("text.contextmenu-supported > tspan");
				
				console.log("> DomManipulator.redraw() - Search done, looping results now...");
				
				for (let i = 0; i < searchElems.length; i++) {
					console.log("-- searching "+searchElems[i]+" with textContent "+searchElems[i].textContent+" now...");
					if (searchElems[i].textContent=="#" || searchElems[i].textContent=="Not assigned") {
						console.log("++ Found at index "+i);
						searchElems[i].textContent = "Others";
					}
				}
			}
			catch (e) {
				console.error("!! Exception occured: "+e);
			}

        }
    
    
    });
        
})();