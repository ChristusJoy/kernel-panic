import { useState } from "react";
import HistoryTable from "./components/HistoryTable";
import "./App.css";
import TeachableMachine from "./components/TeachableMachine";
import WasteAnalytics from "./components/WasteAnalytics";
import ThemeToggleButton from "./components/ThemeToggleButton";
import ToastNotification from "./components/ToastNotification";

function App() {
  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <h1>Waste Segregation Dashboard</h1>
        <ThemeToggleButton />
      </header>

      {/* Main Content - Two Columns */}
      <div className="main-content">
        <div className="tile">
          <TeachableMachine />
        </div>
        <div className="tile">
          <WasteAnalytics />
        </div>
      </div>

      {/* History Table */}
      <div className="history-container">
        <HistoryTable />
      </div>

      <ToastNotification />
    </div>
  );
}

export default App;
