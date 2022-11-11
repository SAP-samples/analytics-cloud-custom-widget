var getScriptPromisify = (src) => {
  return new Promise(resolve => {
    $.getScript(src, resolve)
  })
}

(function () {
  const parseMetadata = metadata => {
	console.log("> EvonikBarChart.parseMetadata called");
    const { dimensions: dimensionsMap, mainStructureMembers: measuresMap } = metadata
    const dimensions = []
    for (const key in dimensionsMap) {
      const dimension = dimensionsMap[key]
      dimensions.push({ key, ...dimension })
    }
    const measures = []
    for (const key in measuresMap) {
      const measure = measuresMap[key]
      measures.push({ key, ...measure })
    }
    return { dimensions, measures, dimensionsMap, measuresMap }
  }

  const parseDataBinding = (dataBinding) => {
	console.log("> EvonikBarChart.parseDataBinding called");
    const { data, metadata } = dataBinding
    const { dimensions, measures } = parseMetadata(metadata)

    // dimension
    const categoryData = []
    // measures
    const series = measures.map(measure => {
      return {
        data: [],
        key: measure.key
      }
    })
    data.forEach(row => {
    // dimension
      categoryData.push(dimensions.map(dimension => {
		var actDimLabel = row[dimension.key].label;
		//console.log("-- Looping dimension data: "+ actDimLabel);
		if (actDimLabel=="#" || actDimLabel=="Not assigned") {
			actDimLabel = "Others";
		}
		return actDimLabel;
      }).join('/'))
      // measures
      series.forEach(series => {
        series.data.push(row[series.key].raw)
      })
    })
    return { data: series[0].data, dataAxis: categoryData }
  }
  const getOption = (dataBinding) => {
	console.log("> EvonikBarChart.getOption called");
    const { data, dataAxis } = parseDataBinding(dataBinding)
    let yMax = 0
    data.forEach(y => {
      yMax = Math.max(y, yMax)
    })
    const dataShadow = []
    for (let i = 0; i < data.length; i++) {
      dataShadow.push(yMax)
    }
    const option = {
		title: {
			text: ''
		},
		grid: {
		    left: '15px',
			right: '15px',
			top: '40px',
			bottom: '40px'
		},
		tooltip: {
			trigger: 'item'
		},
		xAxis: {
			type: 'category',
			data: dataAxis,
			axisLabel: {
				color: 'rgb(53, 74, 95)'
			},
			axisLine: {
				lineStyle: {
					color: 'rgb(0, 0, 0)',
					width: '3',
				}
			},
			axisTick: {
				show: false
			},
			z: 99
		},
    
		yAxis: {
			type: 'value',
			show: false
		},
      
		dataZoom: [
			{
				type: 'inside'
			}
		],
      
		series: [
			{
				data: data,
				type: 'bar',
				label: {
					show: true,
					position: 'outside',
					color: 'rgb(88,89,91)',
					fontSize: 10,
					formatter: function(params) {return params.value.toLocaleString('en-US')}
				},
				itemStyle: {
					color: 'rgb(157, 195, 230)',
				}
			}
		]
    }
    return { option, data, dataAxis }
  }

  const template = document.createElement('template')
  template.innerHTML = `
      <style>
      </style>
      <div id="root" style="width: 100%; height: 100%;">
      </div>
    `
  class EvonikBarChart extends HTMLElement {
    constructor () {
		console.log("> EvonikBarChart.constructor called");
      super()

      this._shadowRoot = this.attachShadow({ mode: 'open' })
      this._shadowRoot.appendChild(template.content.cloneNode(true))

      this._root = this._shadowRoot.getElementById('root')

      this._props = {}

      this.render()
    }

    onCustomWidgetResize (width, height) {
      this.render()
    }

    onCustomWidgetAfterUpdate (changedProps) {
      this.render()
    }

    async render () {
		console.log("> EvonikBarChart.render called");
		
		try {

			if (!window.echarts) {
				await getScriptPromisify('https://cdn.bootcdn.net/ajax/libs/echarts/5.3.1/echarts.min.js')
			}
			console.log("- EvonikBarChart.render echarts loaded.");

			if (this._myChart) {
				echarts.dispose(this._myChart)
				console.log("- EvonikBarChart.render echarts disposed.");
			}
			if (!this.myDataBinding || this.myDataBinding.state !== 'success') { 
				console.log("- EvonikBarChart.render DataBindung NOT Successful.");
				return
			}

			console.log("- EvonikBarChart.render DataBindung successful.");

			const myChart = this._myChart = echarts.init(this._root)

			console.log("- EvonikBarChart.render myChart initialized.");
			
			const { option, data, dataAxis } = getOption(this.myDataBinding)
			myChart.setOption(option)

			console.log("- EvonikBarChart.render myChart options were set.");

			// Enable data zoom when user click bar.
			const zoomSize = 6
			myChart.on('click', function (params) {
				console.log(dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)])
				myChart.dispatchAction({
					type: 'dataZoom',
					startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
					endValue:	dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
				})
			})
		
		}
		catch (e) {
			console.error("!! Exception occured: "+e);
		}

    }
  }

  customElements.define('com-sap-sample-evonik-bar_chart', EvonikBarChart)
})()