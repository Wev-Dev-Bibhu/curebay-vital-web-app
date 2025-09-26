import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Avatar } from "primereact/avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDroplet,
  faHeartPulse,
  faLungs,
  faPersonWalkingArrowRight,
  faShieldHeart,
  faTemperatureHigh,
  faWeightScale,
} from "@fortawesome/free-solid-svg-icons";

const FieldLabel = ({ icon, text, required }) => (
  <div className="flex align-items-center gap-2 mb-2">
    <Avatar
      shape="circle"
      size="large"
      style={{ backgroundColor: "#2196F3", color: "#ffffff", padding: 5 }}
      icon={(options) => <FontAwesomeIcon icon={icon} {...options.iconProps} />}
    />
    <span className="font-medium">
      {text} {required && <span className="text-red-500">*</span>}
    </span>
  </div>
);

const AddVitals = ({ visible, onHide, showAlertFunc }) => {
  const [form, setForm] = useState({});

  const setVal = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSave = () => {
    const updatedForm = { ...form, createDate: new Date().toISOString() };

    const existingData = JSON.parse(localStorage.getItem("latestVitals")) || [];

    const updatedList = [...existingData, updatedForm];

    localStorage.setItem("latestVitals", JSON.stringify(updatedList));

    setForm({});

    if (
      updatedForm.heartRate > 120 ||
      updatedForm.spo2 < 95 ||
      updatedForm.systolic > 140 ||
      updatedForm.diastolic > 90
    ) {
      showAlertFunc(updatedForm);
    }

    if (onHide) onHide("saved");
  };

  const addVitalsFormLabels = [
    {
      key: "height",
      label: "Height",
      icon: faPersonWalkingArrowRight,
      suffix: " cm",
    },
    { key: "weight", label: "Weight", icon: faWeightScale, suffix: " kg" },
    {
      key: "temperature",
      label: "Temperature",
      icon: faTemperatureHigh,
      suffix: " °C",
    },
    {
      key: "respiration",
      label: "Respiration Rate",
      icon: faLungs,
      suffix: " breaths/min",
    },
    {
      key: "systolic",
      label: "Blood Pressure (SYS)",
      icon: faDroplet,
      suffix: " mmHg",
    },
    {
      key: "diastolic",
      label: "Blood Pressure (DIA)",
      icon: faDroplet,
      suffix: " mmHg",
    },
    { key: "spo2", label: "Pulse Ox.", icon: faShieldHeart, suffix: " %" },
    {
      key: "heartRate",
      label: "Heart Rate",
      icon: faHeartPulse,
      suffix: " Beats/min",
    },
    {
      key: "glucose",
      label: "Blood Glucose",
      icon: faDroplet,
      suffix: " mg/dL",
    },
  ];

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      closable
      draggable={false}
      style={{ width: "70rem", maxWidth: "95vw", padding: 1 }}
      header={
        <div className="w-full px-4 py-3 border-round-top">
          <span className="font-semibold">Add New Vitals</span>
        </div>
      }
      className="shadow-3"
    >
      <div className="grid formgrid p-fluid px-2">
        {addVitalsFormLabels.map(({ key, label, icon, suffix }) => (
          <div className="col-12 md:col-6 lg:col-4 mb-4" key={key}>
            <FieldLabel icon={icon} text={label} required={true} />

            <InputNumber
              value={form[key]}
              name={key}
              onValueChange={(e) => setVal(key, e.value)}
              placeholder={`Enter ${label}`}
              suffix={suffix}
              min={0}
              useGrouping={false}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-content-end mt-1">
        <Button
          label="Save"
          iconPos="right"
          icon="pi pi-check"
          severity="info"
          onClick={handleSave}
          className="px-7"
        />
      </div>
    </Dialog>
  );
};

export default AddVitals;
