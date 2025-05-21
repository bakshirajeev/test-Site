import {IInputs, IOutputs} from "./generated/ManifestTypes";

export class VisualComponent implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private container: HTMLDivElement;
    private chart: any;
    private visualType: string = "donut";

    constructor() {}

    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement) {
        this.container = document.createElement("div");
        container.appendChild(this.container);
        this.visualType = context.parameters.visualType.raw || "donut";
        this.renderChart(context);
    }

    private renderChart(context: ComponentFramework.Context<IInputs>) {
        if (this.chart && typeof this.chart.destroy === "function") {
            this.chart.destroy();
        }
        const canvas = document.createElement("canvas");
        this.container.innerHTML = "";
        this.container.appendChild(canvas);

        const labels: string[] = [];
        const data: number[] = [];
        const dataset = context.parameters.dataSet;
        dataset.sortedRecordIds.forEach(id => {
            const record = dataset.records[id];
            labels.push(record.getFormattedValue("label"));
            data.push(parseFloat(record.getFormattedValue("value")) || 0);
        });

        const config = this.getChartConfig(this.visualType, labels, data);
        // Chart is expected to be available globally via script tag
        this.chart = new (window as any).Chart(canvas.getContext("2d"), config);
    }

    private getChartConfig(type: string, labels: string[], data: number[]): any {
        switch (type) {
            case "donut":
                return {
                    type: "doughnut",
                    data: { labels, datasets: [{ data }] },
                    options: { responsive: true }
                };
            case "stackedBar":
                return {
                    type: "bar",
                    data: { labels, datasets: [{ data, backgroundColor: "#5b9bd5" }] },
                    options: { scales: { x: { stacked: true }, y: { stacked: true } } }
                };
            case "heatmap":
                return {
                    type: "matrix",
                    data: { datasets: [{ data: [] }] },
                    options: {}
                };
            default:
                return {
                    type: "line",
                    data: { labels, datasets: [{ data }] },
                    options: {}
                };
        }
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        const selectedType = context.parameters.visualType.raw || "donut";
        if (selectedType !== this.visualType) {
            this.visualType = selectedType;
        }
        this.renderChart(context);
    }

    public getOutputs(): IOutputs { return {}; }
    public destroy(): void {
        if (this.chart && typeof this.chart.destroy === "function") {
            this.chart.destroy();
        }
    }
}
