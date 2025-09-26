import { Dialog } from "primereact/dialog";
import { Card } from "primereact/card";

const VitalAlert = ({ showAlert, hideAlert, vitals }) => {
  const alerts = [];
  if (vitals?.heartRate > 120) {
    alerts.push("⚠️ High Heart Rate");
  }
  if (vitals?.spo2 < 95) {
    alerts.push("🟠 Low Oxygen Level");
  }
  if (vitals?.systolic > 140 || vitals?.diastolic > 90) {
    alerts.push("⚠️ High BP");
  }

  const recommendations = {
    "⚠️ High Heart Rate":
      "Take rest, drink water, consult a doctor if persists.",
    "🟠 Low Oxygen Level": "Check with pulse oximeter, seek help if continues.",
    "⚠️ High BP": "Reduce salt intake, stay calm, consult physician.",
  };

  return (
    <Dialog
      visible={showAlert}
      onHide={hideAlert}
      closable
      draggable={false}
      style={{ width: "40rem", maxWidth: "95vw" }}
      header={
        <div className="w-full px-4 py-3 border-round-top">
          <span className="font-semibold text-lg">🚑 Health Alert!</span>
        </div>
      }
      className="shadow-3"
    >
      <div className="flex flex-column gap-3">
        {alerts.map((alert, index) => (
          <Card key={index} title={alert} className="shadow-2 border-round">
            <p className="m-0">{recommendations[alert]}</p>
          </Card>
        ))}
      </div>
    </Dialog>
  );
};

export default VitalAlert;
