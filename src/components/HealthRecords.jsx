import { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Calendar } from "primereact/calendar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faDroplet,
  faHeartPulse,
  faLungs,
  faShieldHeart,
  faTemperatureHigh,
  faWeightScale,
} from "@fortawesome/free-solid-svg-icons";
import { Dialog } from "primereact/dialog";
import ChartScreen from "./ChartScreen";

const HealthRecords = ({ dataChanged }) => {
  const [date, setDate] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [showChart, setShowChart] = useState(false);

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const options = {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };
    return d
      .toLocaleString("en-US", options)
      .replace(",", "")
      .replace(/(\d{1,2}:\d{2}) (AM|PM)/, "$1$2");
  };

  const [vitals, setVitals] = useState([
    {
      key: "heartRate",
      title: "heart rate",
      value: 0,
      color: "text-blue-500",
      icon: faHeartPulse,
    },
    {
      key: "systolic",
      title: "blood pressure",
      value: 0,
      color: "text-green-500",
      icon: faDroplet,
    },
    {
      key: "temperature",
      title: "Temperature",
      value: 0,
      color: "text-indigo-500",
      icon: faTemperatureHigh,
    },
    {
      key: "glucose",
      title: "blood sugar",
      value: 0,
      color: "text-indigo-500",
      icon: faDroplet,
    },
    {
      key: "spo2",
      title: "oxy level",
      value: 0,
      color: "text-indigo-500",
      icon: faShieldHeart,
    },
    {
      key: "respiration",
      title: "respiration rate",
      value: 0,
      color: "text-indigo-500",
      icon: faLungs,
    },
    {
      key: "weight",
      title: "weight",
      value: 0,
      color: "text-indigo-500",
      icon: faWeightScale,
    },
  ]);

  useEffect(() => {
    const rawData = JSON.parse(localStorage.getItem("latestVitals")) || [];
    if (rawData.length === 0) return;

    let filteredData = rawData;
    if (date !== null) {
      const selectedDate = new Date(date);
      filteredData = rawData.filter((item) => {
        const itemDate = new Date(item.createDate);
        return (
          itemDate.getFullYear() === selectedDate.getFullYear() &&
          itemDate.getMonth() === selectedDate.getMonth() &&
          itemDate.getDate() === selectedDate.getDate()
        );
      });
    }

    const avgVitals = calculateAverages(filteredData);
    const updatedVitals = vitals.map((q) => ({
      ...q,
      date: formatDate(date || new Date()),
      value: avgVitals[q.key] || 0,
    }));

    setVitals(updatedVitals);
  }, [date, dataChanged]);

  const prepareChartData = (title, dataKey) => {
    const rawData = JSON.parse(localStorage.getItem("latestVitals")) || [];
    if (rawData.length === 0) return;

    let dataKeyValues = [...rawData].map((d) => d[dataKey]);

    const labels = [...rawData].map((d) => {
      const date = new Date(d.createDate);

      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        timeZone: "UTC",
      });
    });

    const CHART_DATA = [
      {
        title: title,
        calcData: {
          min: Math.min(...dataKeyValues),
          average: Math.round(
            dataKeyValues.reduce((a, b) => a + b, 0) / dataKeyValues.length
          ),
          max: Math.max(...dataKeyValues),
        },
      },
      {
        labels,
        datasets: [
          {
            label: dataKey.toUpperCase(),
            data: dataKeyValues,
            tension: 0.4,
            borderWidth: 2,
            fill: false,
          },
        ],
      },
    ];

    setChartData(CHART_DATA);
    setShowChart((p) => !p);
  };

  return (
    <main className="col-12 md:col-12 lg:col-10 pb-4">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">See your Vitals</h2>
          <Calendar
            value={date}
            onChange={(e) => setDate(e.value)}
            placeholder="Choose Date"
            showIcon
            className="w-60"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-blu">
          {vitals.map((vital) => (
            <div
              className="w-fu ll md:w-[30%] bg-white rounded-lg shadow-lg p-5"
              key={vital.key}
            >
              <div className="flex mb-4">
                <div
                  className="px-2 grid items-center py-2 rounded-full mr-2 text-white"
                  style={{ backgroundColor: "#bedbff" }}
                >
                  {/* <i className={`${vital.icon} ${vital.color} text-xl`}></i> */}
                  <FontAwesomeIcon icon={vital.icon} className="text-xl" />
                </div>
                <h3 className="font-semibold capitalize text-2xl">
                  {vital.title}
                </h3>
              </div>
              <Divider />
              <div className="grid grid-cols-2 gap-4 mt-4 ml-1.5">
                <FontAwesomeIcon icon={vital.icon} className="text-xl" />
                <div className="">
                  <p className="text-2xl font-bold text-gray-800">
                    {vital.value}
                  </p>
                  <p style={{ color: "#99a1af" }} className="text-sm">
                    Avg. daily {vital.title}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4 ml-1.5">
                <FontAwesomeIcon
                  icon={faCalendar}
                  color=" #b9f8cf"
                  className="text-xl"
                />

                <div className="flex flex-col text-left items-start text-green-200">
                  <span className="text-lime-600 text-xl">
                    Uploaded Date and Time
                  </span>
                  <p className="text-gray-700 text-base text-center mt-1 font-semibold">
                    {vital.value === 0 ? "NA" : vital.date}
                  </p>
                </div>
              </div>
              <div className="mt-5">
                <Button
                  disabled={vital.value === 0}
                  onClick={() => prepareChartData(vital.title, vital.key)}
                  label="Show Chart"
                  className="p-button-outlined w-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      {chartData.length !== 0 && (
        <Dialog
          visible={showChart}
          onHide={() => {
            setChartData([]);
            setShowChart(false);
          }}
          closable
          draggable={false}
          style={{ width: "100%", maxWidth: "60vw", padding: 1 }}
          header={
            <div className="w-full px-4 py-3 border-round-top">
              <span className="font-semibold capitalize">Chart Screen</span>
            </div>
          }
          className="shadow-3"
        >
          <ChartScreen data={chartData} width="w-full" />
        </Dialog>
      )}
    </main>
  );
};

export default HealthRecords;

const calculateAverages = (data) => {
  const total = data.length;
  if (total === 0) return {};

  return {
    heartRate: Math.round(data.reduce((a, b) => a + b.heartRate, 0) / total),
    systolic: Math.round(data.reduce((a, b) => a + b.systolic, 0) / total),
    diastolic: Math.round(data.reduce((a, b) => a + b.diastolic, 0) / total),
    temperature: (data.reduce((a, b) => a + b.temperature, 0) / total).toFixed(
      1
    ),
    glucose: Math.round(data.reduce((a, b) => a + b.glucose, 0) / total),
    spo2: Math.round(data.reduce((a, b) => a + b.spo2, 0) / total),
    respiration: Math.round(
      data.reduce((a, b) => a + b.respiration, 0) / total
    ),
    weight: Math.round(data.reduce((a, b) => a + b.weight, 0) / total),
  };
};
