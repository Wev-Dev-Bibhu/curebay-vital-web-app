import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeartPulse, faWeightScale } from "@fortawesome/free-solid-svg-icons";
import { Dropdown } from "primereact/dropdown";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import ChartScreen from "./ChartScreen";

const CAREPLANS = [
  { label: "Heart Health", value: "heart" },
  { label: "Diabetic Care", value: "diab" },
  { label: "Ortho Care", value: "ortho" },
];

const Dashboard = ({ dataChanged }) => {
  const [dashboardData, setDashboardData] = useState({
    bpData: null,
    oxyData: null,
  });

  useEffect(() => {
    const rawData = JSON.parse(localStorage.getItem("latestVitals")) || [];
    const { bpData, oxyData, pulse, weight } = prepareChartData(rawData);
    setDashboardData({ bpData, oxyData, pulse, weight });
  }, [dataChanged]);

  return (
    <main className="col-12 md:col-9 lg:col-10 pb-4">
      <Card className="shadow-2">
        <div className="flex justify-between md:justify-start">
          <div className="md:mr-3 mr-0 w-[49%] md:w-60">
            <span className="text-blue-500 text-sm block mb-2 font-semibold">
              Member profile
            </span>
            <Dropdown
              options={[{ label: "Mrs Ananya Singh", value: 1 }]}
              value={1}
              placeholder="Select"
              className="w-full"
            />
          </div>
          <div className="w-[49%] md:w-60">
            <span className="text-blue-500 text-sm block mb-2 font-semibold">
              Select care plans
            </span>
            <Dropdown
              options={CAREPLANS}
              placeholder="Select"
              className="w-full"
            />
          </div>
        </div>
      </Card>

      <div className="grid mt-3">
        <div className="col-12 lg:col-4">
          <Card
            style={{ backgroundColor: "var(--color-pink-100)" }}
            title="Heart Health package"
          >
            Package expires on <b>20-01-2023</b>
          </Card>
        </div>
        <div className="col-12 lg:col-4">
          <Card
            style={{ backgroundColor: "var(--color-blue-100)" }}
            className="shadow-2"
            title="Diabetic Care package"
          >
            Package expires on <b>20-01-2023</b>
          </Card>
        </div>
        <div className="col-12 lg:col-4">
          <Card
            style={{ backgroundColor: "var(--color-pink-100)" }}
            className="shadow-2"
            title="Ortho Care package"
          >
            Package expires on <b>20-01-2023</b>
          </Card>
        </div>
      </div>

      <Card className="shadow-2 mt-3 py-0" style={{ padding: "0.1rem" }}>
        <div className="flex flex-column md:flex-row md:align-items-center md:justify-content-between">
          <div className="text-700">
            Next Appointment is on{" "}
            <span className="text-primary font-bold">12th Dec at 6 pm</span>{" "}
            with Dr. Nishant Aggarwal.
          </div>
          <Button
            severity="info"
            size="small"
            label="Request for change"
            className="p-button-primary mt-2 md:mt-0"
          />
        </div>
      </Card>

      <h3 className="mt-4 mb-2 font-bold text-2xl text-blue-800">
        Overview of Vitals
      </h3>
      <div className="grid">
        <ChartScreen data={{ ...dashboardData.bpData }} />

        <div className="col-12 md:col-2 flex justify-between md:block">
          <Card className="shadow-2 w-[49%] md:w-full">
            <div className="flex align-items-center justify-content-between">
              <span className="text-600">Pulse</span>
              <FontAwesomeIcon
                icon={faHeartPulse}
                color="#f6339a"
                className="text-3xl"
              />
            </div>
            <div className="mt-2 text-4xl font-bold">
              {dashboardData.pulse}{" "}
              <span className="text-700 text-xl">BPM</span>
            </div>
          </Card>

          <Card className="shadow-2 w-[49%] md:w-full md:mt-3">
            <div className="flex align-items-center justify-content-between">
              <span className="text-600">Weight</span>
              <FontAwesomeIcon
                icon={faWeightScale}
                className="text-3xl"
                color="oklch(62.3% 0.214 259.815)"
              />
            </div>
            <div className="mt-2 text-4xl font-bold">
              {dashboardData.weight}{" "}
              <span className="text-700 text-xl">kgs</span>
            </div>
          </Card>
        </div>

        <ChartScreen data={{ ...dashboardData.oxyData }} />
      </div>
    </main>
  );
};

export default Dashboard;

function prepareChartData(rawData) {
  const sorted = [...rawData].sort(
    (a, b) => new Date(a.createDate) - new Date(b.createDate)
  );

  const labels = sorted.map((d) =>
    new Date(d.createDate).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    })
  );

  const systolicValues = sorted.map((d) => d.systolic);
  const diastolicValues = sorted.map((d) => d.diastolic);

  const minSystolic =
    systolicValues.length > 0 && isFinite(Math.min(...systolicValues))
      ? Math.min(...systolicValues)
      : 0;
  const avgSystolic =
    systolicValues.length > 0 &&
    isFinite(systolicValues.reduce((a, b) => a + b, 0) / systolicValues.length)
      ? Math.round(
          systolicValues.reduce((a, b) => a + b, 0) / systolicValues.length
        )
      : 0;
  const maxSystolic =
    systolicValues.length > 0 && isFinite(Math.max(...systolicValues))
      ? Math.max(...systolicValues)
      : 0;

  const bpData = [
    {
      title: "Blood Pressure",
      calcData: {
        min: minSystolic,
        average: avgSystolic,
        max: maxSystolic,
      },
    },
    {
      labels,
      datasets: [
        {
          label: "Systolic",
          data: systolicValues,
          tension: 0.4,
          borderWidth: 2,
          fill: false,
        },
        {
          label: "Diastolic",
          data: diastolicValues,
          tension: 0.4,
          borderWidth: 2,
          fill: false,
        },
      ],
    },
  ];

  const spo2RateArr = sorted.map((d) => d.spo2);
  const heartRateArr = sorted.map((d) => d.heartRate);
  const weightRateArr = sorted.map((d) => d.weight);

  const oxyData = [
    {
      title: "Oxy Level",
      calcData: {
        spo2:
          spo2RateArr.length > 0 && isFinite(Math.min(...spo2RateArr))
            ? Math.min(...spo2RateArr) + "%"
            : "0%",
        min_pr:
          heartRateArr.length > 0 && isFinite(Math.min(...heartRateArr))
            ? Math.min(...heartRateArr)
            : 0,
      },
    },
    {
      labels,
      datasets: [
        {
          label: "SpO₂ (%)",
          data: spo2RateArr,
          tension: 0.4,
          borderWidth: 2,
          fill: false,
        },
        {
          label: "Pulse Rate (bpm)",
          data: heartRateArr,
          tension: 0.4,
          borderWidth: 2,
          fill: false,
        },
      ],
    },
  ];

  const pulse =
    heartRateArr.length > 0
      ? Math.round(
          heartRateArr.reduce((a, b) => a + b, 0) / heartRateArr.length
        )
      : 0;
  const weight =
    weightRateArr.length > 0
      ? Math.round(
          weightRateArr.reduce((a, b) => a + b, 0) / weightRateArr.length
        )
      : 0;

  return { bpData, oxyData, pulse, weight };
}
