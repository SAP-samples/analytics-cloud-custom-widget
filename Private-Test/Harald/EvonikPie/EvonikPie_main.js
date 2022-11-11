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
  class EvonikPieChart extends HTMLElement {
    constructor () {
		console.log("> EvonikPieChart.constructor called");
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
		//console.log("> onCustomWidgetBeforeUpdate("+oChangedProperties+")");
    }

    onCustomWidgetAfterUpdate (oChangedProperties) {
		//console.log("> onCustomWidgetAfterUpdate("+oChangedProperties+")");
    }


    set myDataSource (dataBinding) {
		console.log("> set myDataSource("+dataBinding+")");
      this._myDataSource = dataBinding
      this.render()
    }

    async render () {
  	  //console.log(">> render()");
      await getScriptPromisify('https://cdn.bootcdn.net/ajax/libs/echarts/5.3.1/echarts.min.js')

      if (!this._myDataSource || this._myDataSource.state !== 'success') {
		console.log("!! render() - _myDataSource is NOT defined yet!");
        return
      }
	  

		// Added by HM now:
		console.log("-- render() - _myDataSource is defined now!");
		
		// Counters
		var dimCounter = 0;
		var measureCounter = 0;
		var dataCounter = 0;
			
		// Objects to hold the data points:
		var measureLabels = [];
		var dataValuesRaw = [];
		var dataValuesFormatted = [];
	    var chartTitle = "";


		try {
			
			// Loop through dimensions:
			for (const feedEntry of this._myDataSource.metadata.feeds.dimensions.values) {
				//const dimensionEntry = '${d[feedEntry].label}';
				const dimensionEntryId = this._myDataSource.metadata.dimensions[feedEntry].id;
				const dimensionEntryDescr = this._myDataSource.metadata.dimensions[feedEntry].description;
				console.log("- "+dimCounter+". Dimension feedEntry "+feedEntry+" has dimensionEntryId: "+dimensionEntryId+", dimensionEntryDescr: "+dimensionEntryDescr);
				dimCounter++;
			}
		
			// Loop through measures:
			for (const feedEntry of this._myDataSource.metadata.feeds.measures.values) {
				const measureId = this._myDataSource.metadata.mainStructureMembers[feedEntry].id;
				const measureLabel = this._myDataSource.metadata.mainStructureMembers[feedEntry].label;
				//const measureEntry = '${measureLabel} ${d[feedEntry].raw || d[feedEntry].formatted}';
				console.log("- "+measureCounter+". Measure feedEntry: "+feedEntry+" has measureId: "+measureId+", measureLabel: "+measureLabel);
				measureLabels.push(measureLabel);
				measureCounter++;
			}

			// Loop though data:
			for (const d of this._myDataSource.data) {

				
				console.log("-- "+dataCounter+". Data row "+d+" has follwing entries:");
				
				for (const feedEntryDim of this._myDataSource.metadata.feeds.dimensions.values) {
					const dimValId = d[feedEntryDim].id;
					const dimValLabel = d[feedEntryDim].label;
					
					console.log("--- Dimension feedEntry "+feedEntryDim+" has dimValId: "+dimValId+", dimValLabel: "+dimValLabel);
					if (dataCounter==0) {
						chartTitle = dimValLabel;
					}					
				}
				
				for (const feedEntryMeas of this._myDataSource.metadata.feeds.measures.values) {
					const measValRaw = d[feedEntryMeas].raw;
					const measValFormatted = d[feedEntryMeas].formatted;
					
					console.log("--- Measure feedEntry "+feedEntryMeas+" has measValRaw: "+measValRaw+", measValFormatted: "+measValFormatted);
					dataValuesRaw.push(measValRaw);
					dataValuesFormatted.push(measValFormatted);
					
				}
				
				dataCounter++;
			}
		}
		catch (e) {
			console.error("!! Exception occured: "+e);
		}
   
   /*

-- render() - _myDataSource is defined now!
app.chunk.main-chunk.f3e72cb6da8729554299.js:2 - Dimension feedEntry dimensions_0 has dimensionEntryId: 0CALYEAR, dimensionEntryDescr: Calendar Year
app.chunk.main-chunk.f3e72cb6da8729554299.js:2 - Measure feedEntry: measures_0 has measureId: 4VGQIK77R2ZV4DIR7Y6M2TG43, measureLabel: Profit
app.chunk.main-chunk.f3e72cb6da8729554299.js:2 - Measure feedEntry: measures_1 has measureId: 4VGQIK77R2ZV4DIR7Y6M2T9SJ, measureLabel: Net Revenue
app.chunk.main-chunk.f3e72cb6da8729554299.js:2 - Measure feedEntry: measures_2 has measureId: 4VGQIK77R2ZV4DIR7Y6M2T3GZ, measureLabel: Gross Revenue
app.chunk.main-chunk.f3e72cb6da8729554299.js:2 -- Data [object Object] has follwing entries:
app.chunk.main-chunk.f3e72cb6da8729554299.js:2 --- Dimension feedEntry dimensions_0 has dimValId: 2020, dimValLabel: 2020
app.chunk.main-chunk.f3e72cb6da8729554299.js:2 --- Measure feedEntry measures_0 has measValRaw: 119633, measValFormatted: 119.633,00
app.chunk.main-chunk.f3e72cb6da8729554299.js:2 --- Measure feedEntry measures_1 has measValRaw: 341822, measValFormatted: 341.822,00
app.chunk.main-chunk.f3e72cb6da8729554299.js:2 --- Measure feedEntry measures_2 has measValRaw: 525846, measValFormatted: 525.846,00
*/
 
 
//////////////////////////
// Original data-picker:
//////////////////////////   
/*
      // This picks out the first dimension and the first measure and creates the dataset (data) out of it for displaying on the chart:
	  const dimension = this._myDataSource.metadata.feeds.dimensions.values[0]
      const measure = this._myDataSource.metadata.feeds.measures.values[0]
      const data = this._myDataSource.data.map(data => {
        return {
          name: data[dimension].label,
          value: data[measure].raw
        }
      })
*/
	  //const dimensionZero = this._myDataSource.metadata.feeds.dimensions.values[0];
	  
	  const noMeasures = this._myDataSource.metadata.feeds.measures.values.length;
	  console.log("+-+- noMeasures: "+noMeasures+", chartTitle: "+chartTitle);
	  
	 // const chartTitle = this._myDataSource.data[dimensionZero].label;
	  
		var dataJson = {};
		var data = [];
		for (let i = 0; i < measureCounter; i++) {
			dataJson.value = dataValuesRaw[i];
			dataJson.name = measureLabels[i];
			data.push({...dataJson});
		}
		
		console.log("+-+ data is: "+JSON.stringify(data));


/*
Data should be:
data: [
        { value: 119633, name: 'Profit' },
        { value: 341822, name: 'Net Revenue' },
        { value: 525846, name: 'Gross Revenue' }
      ]

Title should be "2020"
*/
      const myChart = echarts.init(this._root)
//      const myChart = echarts.init(this._root, 'wight')
      const option = {
		title: {
			text: chartTitle,
			left: 'center'
		},
		tooltip: {
          trigger: 'item'
        },
		legend: {
			orient: 'vertical',
			left: 'left'
		},
        series: [
          {
			name: chartTitle,
			radius: '60%',
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
			  formatter: '{c} ({d}%)'
			  //formatter: '{b}: {c} ({d}%)'
            },
			emphasis: {
				itemStyle: {
				  shadowBlur: 10,
				  shadowOffsetX: 0,
				  shadowColor: 'rgba(0, 0, 0, 0.5)'
				}
			},
/*
            emphasis: {
              label: {
                show: true,
                fontSize: '25',
                fontWeight: 'bold'
              }
            },
*/
            labelLine: {
              show: true
            },
            data
          }
        ]
      }
      myChart.setOption(option)
	
    }
  }

  customElements.define('com-sap-sample-evonik-pie_chart', EvonikPieChart)
})()
