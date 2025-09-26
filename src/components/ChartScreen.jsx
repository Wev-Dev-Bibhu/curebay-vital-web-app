import { Chart } from "primereact/chart";
import { Card } from "primereact/card";

const ChartScreen = ({ data, width = "col-5" }) => {
  if (!data || !data[0]) return null;
  const commonOptions = {
    plugins: {
      legend: {
        labels: { boxWidth: 12, boxHeight: 12 },
      },
      tooltip: { mode: "index", intersect: false },
    },
    maintainAspectRatio: false,
    scales: {
      x: { grid: { color: "#eef1f6" }, ticks: { colour: "#6b7280" } },
      y: { grid: { color: "#eef1f6" }, ticks: { colour: "#6b7280" } },
    },
  };
  return (
    <div className={`col-12 md:${width}`}>
      <Card className="shadow-2" title={data[0].title}>
        <div className="text-600 text-sm mb-2 flex justify-between">
          {Object.keys(data[0].calcData).map((key) => (
            <span key={key} className="text-lg flex flex-col items-center">
              <span className="text-lime-600 font-semibold">
                {data[0].calcData[key]}
              </span>
              <strong className="capitalize">{key.split("_").join(" ")}</strong>
            </span>
          ))}
        </div>
        <div style={{ height: 150 }}>
          <Chart type="line" data={data[1]} options={commonOptions} />
        </div>
      </Card>
    </div>
  );
};

export default ChartScreen;
