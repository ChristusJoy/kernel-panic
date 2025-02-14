import { useState } from 'react'
import HistoryTable from "./components/HistoryTable";
import './App.css'
import TeachableMachine from './components/TeachableMachine';
import WasteAnalytics from './components/WasteAnalytics';
import ThemeToggleButton from './components/ThemeToggleButton';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Waste Segregation Dashboard</h1>
      <ThemeToggleButton  />
      <TeachableMachine />
      <WasteAnalytics />
      <HistoryTable />

    </>
  )
}

export default App
