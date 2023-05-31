export type ExtensionDataType = IVizTooltipExtensionData | IVizGeneralPlotareaExtensionData;

export interface IAddOnComponent {
    /**
    * Called by SAC add-on extension framework to set exposed extension data to custom add-on component.
    * @param {ExtensionDataType} extensionData The extension data that SAC exposed to custom element at this extension point;
    */
    setExtensionData(extensionData: ExtensionDataType);

    /**
    * Called before the custom settings properties changed.
    * @param {Object} changedProps The changed settings properties of this custom element;
    */
    onBeforeUpdate?(changedProps: any): void;

    /**
    * Called after the custom settings properties changed.
    * @param {Object} changedProps The changed settings properties of this custom element;
    */
    onAfterUpdate?(changedProps: any): void;
}

/**
 * Interface to describe a row displayed on chart tooltip
 */
export interface IVizTooltipRow {
    /**
     * The title of the row
     */
    title: string;

    /**
     * The value of the row
     */
    value: string;

    /**
     * The key of the row
     */
    key?: string;
}

export interface IVizTooltipHeaderRow extends IVizTooltipRow {
    /**
     * The warnings displayed on chart tooltip header
     */
    warnings?: string[];
}

/**
 * Interface of chart tooltip extension data
 */
export interface IVizTooltipExtensionData {
    /**
     * The header row data of chart tooltip
     */
    header: IVizTooltipHeaderRow;
    /**
     * The details rows data of chart tooltip
     */
    details: IVizTooltipRow[];
}


interface ISize {
    width: number;
    height: number;
}

interface IPoint {
    x: number;
    y: number;
}

type IRect = IPoint & ISize;

interface IRectWithValue extends IRect {
    /**
     * The value that current rect element is representing
     */
    pointValue: string | number;
    /**
     * The displayed/formatted value of current rect element is representing
     */
    formattedValue: string;
}

interface ISeries {
    /**
     * The layout information of data points in current series
     */
    dataPoints: IDataPoint;
    /**
     * If current series is selected
     */
    selected: boolean;
    /**
     * The name of the series;
     */
    name: string;
    /**
     * The color of the data point marks in current series
     */
    color: string;
    /**
     * If Show-as Triangle is enabled on current series
     */
    showAsTriangle?: boolean;
}

interface IDataPoint {
    /**
     * Provide data mark layout information of current data point;
     */
    dataInfo: IDataInfo;
    /**
     * Provide data label layout information of current data point;
     */
    labelInfo: ILabelInfo;
}

interface IDataInfo extends IRectWithValue {
    pointValue: number;
    /**
     * Color of current data point mark in original chart
     */
    color: string;
    /**
     * The border color of current data point mark in orignal chart
     */
    borderColor: string;
    /**
     * If current data point is selected
     */
    selected?: boolean;
}

interface ILabelRect extends IRect {
    /**
     * The color of this label
     */
    color: string;
    /**
     * A string of number between 0 and 1 indicating the opacity of this label
     */
    opacity: string;
    /**
     * A string of a number ending with 'px' indicating the font size of this label
     */
    fontSize: string;
}


interface ILabelInfo extends ILabelRect {
    pointValue: string;
    /**
     * If this label is a variance label, then it will have this property indicating
     * the type of this variance label
     */
    varianceLabelType?: 'positive' | 'negative' | 'nullzero';
}

interface IAxisLabel extends ILabelRect {
    pointValue: string;
}

export interface IVizGeneralPlotareaExtensionData {
    /**
     * The size of original chart
     */
    chartSize: ISize;
    /**
     * If true, it's a bar chart, otherwise it's a column chart
     */
    isHorizontal: boolean;
    /**
     * The view range of current chart. It should be applied to
     * custom add-on component's clip-path style so that the
     * elements (data points, labels) out of view range are not
     * displayed.
     */
    clipPath: IRect;
    /**
     * The series of the chart
     */
    series: ISeries[];
    /**
     * The layout information of x-aixs labels
     */
    xAxisLabels: IAxisLabel[];
    /**
     * The layout information of y-axis labels
     */
    yAxisLabels: IAxisLabel[];
    /**
     * The layout information of x-aixs stacked labels
     */
    xAxisStackLabels: IAxisLabel[];
    /**
     * The layout information of y-aixs stacked labels
     */
    yAxisStackLabels: IAxisLabel[];
}