const OverlayContainerTemplate = document.createElement('template');
OverlayContainerTemplate.innerHTML = `
    <style>
        .chart-overlay-container {
            position: relative;
            pointer-events: none;
            overflow: hidden;
        }
        .series-bar-column-container {
            background-color: transparent;
        }
        .series-bar-column {
            width: 100%;
            height: 100%;
        }
        .axis-label-container {
            position: absolute;
            display: flex;
            height: 18px;
            flex-flow: row nowrap;
            align-items: center;
            justify-content: flex-end;
            background-color: transparent;
        }
        .axis-label {
            text-overflow: ellipsis;
        }
        .axis-label-icon {
            padding-left: 4px;
        }
        .common-label {
            position: absolute;
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
        }
    </style>
    <div class="chart-overlay-container"/>
`;

const BarColumnTemplate = document.createElement('template');
BarColumnTemplate.innerHTML = `<div class="series-bar-column-container">
</div>`;

const AxisLabelTemplate = document.createElement('template');
AxisLabelTemplate.innerHTML = `
    <span class="axis-label-container">
        <span class="axis-label"></span>
        <img class="axis-label-icon"
            width="22"
            height="22"
        >
    </span>
`;

const iconMap = {
    'California': 'https://fp68static.cfapps.eu10-004.hana.ondemand.com/sap-icons/Location.png',
    'Nevada': 'https://fp68static.cfapps.eu10-004.hana.ondemand.com/sap-icons/Location.png',
    'Oregon': 'https://fp68static.cfapps.eu10-004.hana.ondemand.com/sap-icons/Location.png',
    'Carbonated Drinks': 'https://fp68static.cfapps.eu10-004.hana.ondemand.com/sap-icons/CarbonatedDrinks.png',
    'Juices': 'https://fp68static.cfapps.eu10-004.hana.ondemand.com/sap-icons/Juices.png',
    'Alcohol': 'https://fp68static.cfapps.eu10-004.hana.ondemand.com/sap-icons/Alcohol.png',
    'Others': 'https://fp68static.cfapps.eu10-004.hana.ondemand.com/sap-icons/Others.png',
    'Gross Margin': 'https://fp68static.cfapps.eu10-004.hana.ondemand.com/sap-icons/GrossMargin.png',
    'Discount': 'https://fp68static.cfapps.eu10-004.hana.ondemand.com/sap-icons/Discount.png',
    'Original Sales Price': 'https://fp68static.cfapps.eu10-004.hana.ondemand.com/sap-icons/Price.png',
    'City': 'https://fp68static.cfapps.eu10-004.hana.ondemand.com/sap-icons/City.png',
    'Info': 'https://fp68static.cfapps.eu10-004.hana.ondemand.com/sap-icons/Info.png',
};

// For PoC
class ChartOverlayComponent extends HTMLElement {

    constructor() {
        super();

        this._rounded = true;
        this._sizeIncrement = 0;
        this._axisLabelColor = '#333';

        this._shadowRoot = this.attachShadow({mode: 'open'});
        const container = OverlayContainerTemplate.content.cloneNode(true);
        this._containerElement = container.querySelector('.chart-overlay-container');
        this._shadowRoot.appendChild(container);
    }


    render() {
        this._containerElement.innerHTML = '';

        const supportedChartTypes = [
            'barcolumn',
            'stackedbar',
            'line',
            'area',
        ];

        if (!supportedChartTypes.includes(this._chartType)) {
            return;
        }

        const { width: chartWidth, height: chartHeight } = this._size;
        const { y: clipPathY, height: clipPathHeight } = this._clipPath;
        this._containerElement.setAttribute(
            'style',
            `position: relative; pointer-events: none; overflow: hidden; width: ${chartWidth}px; height: ${chartHeight}px; clip-path: inset(${clipPathY}px 0 ${chartHeight - clipPathY - clipPathHeight}px 0);`
        );

        this._series.forEach((singleSeries, index) => {
            const options = {
                color: singleSeries.color,
                showAsTriangle: singleSeries.showAsTriangle,
                isLast: index === 0,
            };
            this.renderASeries(singleSeries, options);
        });

        this.renderAxisLabels(this._xAxisLabels);
        this.renderAxisLabels(this._yAxisLabels);
        this.renderAxisStackLabels(this._xAxisStackLabels);
        this.renderAxisStackLabels(this._yAxisStackLabels);

    }

    renderASeries(singleSeries, options) {
        singleSeries.dataPoints.forEach((dataPoint) => {
            const { dataInfo, labelInfo } = dataPoint;
            this.renderData(dataInfo, options);
            this.renderLabel(labelInfo, options);
        });
    }

    renderData(dataInfo, options) {
        if (!dataInfo) {
            return;
        }
        let { x, y, width, height } = dataInfo;
        const dataElement = BarColumnTemplate.content.cloneNode(true);
        const barColumnContainer = dataElement.querySelector('.series-bar-column-container');
        const increment = this._sizeIncrement / 100;
        let roundedStyle = '';
        if (options?.showAsTriangle) {
            const originalWidth = width;
            const originalHeight = height;
            width = height = (Math.min(originalWidth, originalHeight) / 2) * (1 + increment);
            x = width === originalWidth ? x : x + (originalWidth - width) / 2;
            y = height === originalHeight ? y : y + (originalHeight - height) / 2;
            roundedStyle = `border-radius: ${height/2 + 3}px;`;
        } else {
            switch(this._chartType) {
            case 'barcolumn':
            case 'stackedbar':
                if (this._isHorizontal) {
                    height = height * (1 + increment);
                    y = y - height * increment / 2;
                    if (this._chartType === 'stackedbar' && !options.isLast) {
                        break;
                    }
                    roundedStyle = `border-radius: 0 ${height / 2}px ${height / 2}px 0;`;
                } else {
                    width = width * (1 + increment);
                    x = x - width * increment / 2;
                    if (this._chartType === 'stackedbar' && !options.isLast) {
                        break;
                    }
                    roundedStyle = `border-radius: ${width / 2}px ${width / 2}px 0 0;`;
                }
                break;
            case 'line':
            case 'area':
                width = width * (1 + increment);
                height = height * (1 + increment);
                x = x - width * increment / 2;
                y = y - height * increment / 2;
                roundedStyle = `border-radius: ${height/2}px;`;
                break;
            }
        }

        const color = dataInfo.color || options.color;
        const backgroundStyle = options?.showAsTriangle ?
            `border: ${color} solid 3px;` :
            `background-color: ${color};`;
        const barStyle = this._rounded ? `${backgroundStyle} ${roundedStyle}` : backgroundStyle;
        barColumnContainer.setAttribute(
            'style',
            `${barStyle} position: absolute; top: ${y}px; left: ${x}px; width: ${width}px; height: ${height}px;${dataInfo.opacity !== undefined ? `opacity: ${dataInfo.opacity};` : ''}`
        );
        this._containerElement.appendChild(dataElement);
    }

    renderLabel(labelInfo, options) {
        if (!labelInfo) {
            return;
        }
        if (Array.isArray(labelInfo)) {
            labelInfo.forEach((label) => {
                this.renderLabel(label, options);
            });
            return;
        }
        const { x, y, width, height, varianceLabelType, color, fontSize } = labelInfo;
        const labelSpan = document.createElement('span');
        const bgColor = 'transparent';
        let labelColor = this._chartType.startsWith('stacked') ? '#666' : options.color;
        if (varianceLabelType !== undefined) {
            labelColor = color;
        }
        labelSpan.classList.add('common-label');
        labelSpan.setAttribute(
            'style',
            `background-color: ${bgColor}; position: absolute; top: ${y}px; left: ${x}px; width: ${width}px; height: ${height}px; color: ${labelColor}; font-size: ${fontSize};`
        );
        labelSpan.innerHTML = labelInfo.formattedValue;

        this._containerElement.appendChild(labelSpan);
    }

    _renderAxisLabel(label) {
        if (!label) {
            return;
        }
        const { x, y, width, height, pointValue, formattedValue, fontSize } = label;
        const labelEl = AxisLabelTemplate.content.cloneNode(true);
        const labelContainer = labelEl.querySelector('.axis-label-container');
        const bgColor = 'transparent';
        labelContainer.setAttribute('style', `background-color: ${bgColor}; width: ${width + 36}px; left: ${x - 30}px; top: ${y - 2}px; font-size: ${fontSize};`);
        this._containerElement.appendChild(labelEl);

        const labelSpan = labelContainer.querySelector('.axis-label');
        const _axisLabelColor = this._axisLabelColor;
        labelSpan.setAttribute('style', `color: ${_axisLabelColor}`);
        labelSpan.innerHTML = formattedValue;

        const iconImg = labelContainer.querySelector('img');
        iconImg.setAttribute('src', iconMap[pointValue] || iconMap.City || iconMap.Info);
    };

    renderAxisLabels(axisLabels) {
        if (axisLabels && !Array.isArray(axisLabels)) {
            this._renderAxisLabel(axisLabels);
        } else {
            axisLabels.forEach((labels) => this.renderAxisLabels(labels));
        }
    }

    renderAxisStackLabel(stackLabelInfo) {
        if (!stackLabelInfo) {
            return;
        }
        const stackLabelSpan = document.createElement('span');
        stackLabelSpan.classList.add('common-label');
        const axisLabelColor = this._axisLabelColor;
        const bgColor = 'transparent';
        const {
            x, y, width, height, formattedValue, fontSize
        } = stackLabelInfo;
        stackLabelSpan.setAttribute(
            'style',
            `background-color: ${bgColor}; color: ${axisLabelColor}; top: ${y}px; left: ${x}px; width: ${width}px; height: ${height}px; font-size: ${fontSize};`
        );
        stackLabelSpan.textContent = formattedValue;
        this._containerElement.appendChild(stackLabelSpan);
    }

    renderAxisStackLabels(axisStackLabels) {
        if (!axisStackLabels) {
            return;
        }
        if (axisStackLabels && !Array.isArray(axisStackLabels)) {
            this.renderAxisStackLabel(axisStackLabels);
        } else {
            axisStackLabels.forEach((stackLabels) => {
                this.renderAxisStackLabels(stackLabels);
            });
        }
    }

    setExtensionData(extensionData) {
        const {
            chartType,
            isHorizontal,
            chartSize,
            clipPath,
            series,
            xAxisLabels,
            xAxisStackLabels,
            yAxisLabels,
            yAxisStackLabels,
        } = extensionData;
        this._size = chartSize;
        this._clipPath = clipPath;
        this._series = series;
        this._xAxisLabels = xAxisLabels;
        this._yAxisLabels = yAxisLabels;
        this._xAxisStackLabels = xAxisStackLabels;
        this._yAxisStackLabels = yAxisStackLabels;
        this._chartType = chartType;
        this._isHorizontal = isHorizontal;
        this.render();
    }

    set rounded(value) {
        this._rounded = value;
        this.render();
    }

    set sizeIncrement(value) {
        this._sizeIncrement = value;
        this.render();
    }

    set axisLabelColor(value) {
        this._axisLabelColor = value;
        this.render();
    }
}

customElements.define('viz-overlay', ChartOverlayComponent);
