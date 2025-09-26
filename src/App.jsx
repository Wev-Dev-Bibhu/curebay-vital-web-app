import { useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { BreadCrumb } from "primereact/breadcrumb";

import AddVitals from "./components/AddVitals";
import VitalAlert from "./components/VitalAlert";
import Dashboard from "./components/Dashboard";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HealthRecords from "./components/HealthRecords";

export default function App() {
  const [addVitalModal, setAddVitalModal] = useState(false);
  const [dataChanged, setDataChanged] = useState(false);
  const [breadcrumbItems, setBreadcrumbItems] = useState([
    { label: "Dashboard", url: "/dashboard" },
  ]);

  const onHide = (param) => {
    setAddVitalModal(false);
    if (param !== undefined) setDataChanged(!dataChanged);
  };

  const showAlertFunc = (vitals) => {
    return (
      <VitalAlert showAlert={true} hideAlert={() => false} vitals={vitals} />
    );
  };

  const menu = [
    { label: "Dashboard", icon: "pi pi-home", path: "/dashboard" },
    { label: "Health Records", icon: "pi pi-file", path: "/health-records" },
  ];

  const home = { icon: "pi pi-home", url: "/" };

  return (
    <Router>
      <div className="p-3 h-full">
        <BreadCrumb model={breadcrumbItems} home={home} />

        <div className="grid">
          <aside className="col-12 md:col-3 lg:col-2">
            <Card className="shadow-2">
              <div className="flex flex-column gap-2">
                {menu.map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() =>
                      setBreadcrumbItems([
                        { label: item.label, url: item.path },
                      ])
                    }
                    className="p-button p-button-sm p-button-text text-left flex items-center gap-2"
                  >
                    <i className={item.icon}></i>
                    {item.label}
                  </Link>
                ))}
              </div>
            </Card>
          </aside>

          <Routes>
            <Route
              path="/dashboard"
              element={<Dashboard dataChanged={dataChanged} />}
            />
            <Route path="/" element={<Dashboard dataChanged={dataChanged} />} />
            <Route
              path="/health-records"
              element={<HealthRecords dataChanged={dataChanged} />}
            />
          </Routes>
        </div>

        <Button
          className="fixed bottom-2 z-50 right-4"
          label="Add Vitals"
          icon="pi pi-plus"
          iconPos="left"
          size="small"
          severity="info"
          onClick={() => setAddVitalModal(true)}
        />

        <AddVitals
          visible={addVitalModal}
          onHide={onHide}
          showAlertFunc={showAlertFunc}
        />
      </div>
    </Router>
  );
}
