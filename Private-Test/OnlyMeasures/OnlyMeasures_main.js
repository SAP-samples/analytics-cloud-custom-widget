var getScriptPromisify = (src) => {
  return new Promise(resolve => {
    $.getScript(src, resolve)
  })
}

(function () {
  const prepared = document.createElement('template')
  prepared.innerHTML = `
      <style>
      </style>
      <div id="root" style="width: 100%; height: 100%;">
      </div>
    `
  class OnlyMeasureChart extends HTMLElement {
    constructor () {
		console.log("> OnlyMeasureChart.constructor called");
		super()

		this._shadowRoot = this.attachShadow({ mode: 'open' })
		this._shadowRoot.appendChild(prepared.content.cloneNode(true))

		this._root = this._shadowRoot.getElementById('root')

		this.addEventListener("click", event => {
			var event = new Event("onClick");
			this.dispatchEvent(event);
		});

		this._props = {}

		this.render()
    }

    onCustomWidgetResize (width, height) {
		console.log("> onCustomWidgetResize()");
		this.render()
    }


    onCustomWidgetBeforeUpdate (oChangedProperties) {
		console.log("> onCustomWidgetBeforeUpdate("+oChangedProperties+")");
    }

    onCustomWidgetAfterUpdate (oChangedProperties) {
		console.log("> onCustomWidgetAfterUpdate("+oChangedProperties+")");
    }


    set myDataSource (dataBinding) {
      this._myDataSource = dataBinding
      this.render()
    }

    async render () {
  	  console.log(">> render()");
      await getScriptPromisify('https://cdn.bootcdn.net/ajax/libs/echarts/5.0.0/echarts.min.js')

      if (!this._myDataSource || this._myDataSource.state !== 'success') {
		console.log("!! render() - _myDataSource is NOT defined yet!");
        return
      }
	  

		// Added by HM now:
		console.log("-- render() - _myDataSource is defined now!");
		
		try {

			// Loop through dimensions:
			/*
			for (const feedEntry of this._myDataSource.metadata.feeds.dimensions.values) {
				//const dimensionEntry = '${d[feedEntry].label}';
				const dimensionEntryId = this._myDataSource.metadata.dimensions[feedEntry].id;
				const dimensionEntryDescr = this._myDataSource.metadata.dimensions[feedEntry].description;
				console.log("- Dimension feedEntry "+feedEntry+" has dimensionEntryId: "+dimensionEntryId+", dimensionEntryDescr: "+dimensionEntryDescr);
			}
			*/
			
			// Loop through measures:
			for (const feedEntry of this._myDataSource.metadata.feeds.measures.values) {
				const measureId = this._myDataSource.metadata.mainStructureMembers[feedEntry].id;
				const measureLabel = this._myDataSource.metadata.mainStructureMembers[feedEntry].label;
				//const measureEntry = '${measureLabel} ${d[feedEntry].raw || d[feedEntry].formatted}';
				console.log("- Measure feedEntry: "+feedEntry+" has measureId: "+measureId+", measureLabel: "+measureLabel);
			}

			// Loop though data:
			for (const d of this._myDataSource.data) {

				console.log("-- Data "+d+" has follwing entries:");
				/*
				for (const feedEntryDim of this._myDataSource.metadata.feeds.dimensions.values) {
					const dimValId = d[feedEntryDim].id;
					const dimValLabel = d[feedEntryDim].label;
					
					console.log("--- Dimension feedEntry "+feedEntryDim+" has dimValId: "+dimValId+", dimValLabel: "+dimValLabel);
				}
				*/
				for (const feedEntryMeas of this._myDataSource.metadata.feeds.measures.values) {
					const measValRaw = d[feedEntryMeas].raw;
					const measValFormatted = d[feedEntryMeas].formatted;
					
					console.log("--- Measure feedEntry "+feedEntryMeas+" has measValRaw: "+measValRaw+", measValFormatted: "+measValFormatted);
				}
			}
		}
		catch (e) {
			console.error("!! Exception occured: "+e);
		}
   
      // This picks out the first dimension and the first measure and creates the dataset (data) out of it for displaying on the chart:
/*
	  const dimension = this._myDataSource.metadata.feeds.dimensions.values[0]
      const measure = this._myDataSource.metadata.feeds.measures.values[0]
      const data = this._myDataSource.data.map(data => {
        return {
          name: data[dimension].label,
          value: data[measure].raw
        }
      })
*/
/*
      const myChart = echarts.init(this._root)
//      const myChart = echarts.init(this._root, 'wight')
      const option = {
       tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '2%',
          left: 'center'
        },
        series: [
          {
            name: '',
            type: 'pie',
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 4
            },
            label: {
              show: true,
              position: 'outside',
			  formatter: '{b}: {c} ({d})'
            },
			  emphasis: {
				itemStyle: {
				  shadowBlur: 10,
				  shadowOffsetX: 0,
				  shadowColor: 'rgba(0, 0, 0, 0.5)'
				}
			  },
            labelLine: {
              show: true
            },
            data
          }
        ]
      }
      myChart.setOption(option)
	
*/
    }

  }

  customElements.define('com-sap-sample-om-pie_chart', OnlyMeasureChart)
})()
