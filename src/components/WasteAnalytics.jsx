import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { PieChart, Pie, Cell, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

const WasteAnalytics = () => {
    const [wasteData, setWasteData] = useState([]);
    const [filter, setFilter] = useState("day"); // Default filter: Day

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "waste_detections"), (snapshot) => {
            const newData = snapshot.docs.map(doc => ({
                ...doc.data(),
                timestamp: doc.data().timestamp.toDate()
            }));
            setWasteData(newData);
        });

        return () => unsubscribe();
    }, []);

    // 📌 Filter data based on selected time range
    const filterData = (data) => {
        const now = new Date();
        return data.filter((item) => {
            const itemDate = item.timestamp;
            if (filter === "hour") {
                return itemDate.getHours() === now.getHours() && itemDate.getDate() === now.getDate();
            } else if (filter === "day") {
                return itemDate.getDate() === now.getDate() && itemDate.getMonth() === now.getMonth();
            } else if (filter === "month") {
                return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
            } else if (filter === "year") {
                return itemDate.getFullYear() === now.getFullYear();
            }
            return true;
        });
    };

    const filteredData = filterData(wasteData);

    // 📊 Pie Chart Data
    const categoryCounts = filteredData.reduce((acc, item) => {
        acc[item.type] = (acc[item.type] || 0) + 1;
        return acc;
    }, {});

    const pieChartData = Object.keys(categoryCounts).map(key => ({
        name: key,
        value: categoryCounts[key],
    }));

    const colors = { "Recyclable": "#28a745", "Non-Recyclable": "#dc3545", "Selective": "#ffc107" };

    // 📈 Line Graph Data (Grouped by Time)
    const groupedData = filteredData.reduce((acc, item) => {
        let label;
        if (filter === "hour") {
            label = `${item.timestamp.getMinutes()}m`;
        } else if (filter === "day") {
            label = `${item.timestamp.getHours()}:00`;
        } else if (filter === "month") {
            label = `Day ${item.timestamp.getDate()}`;
        } else {
            label = `Month ${item.timestamp.getMonth() + 1}`;
        }
        acc[label] = (acc[label] || 0) + 1;
        return acc;
    }, {});

    const lineChartData = Object.keys(groupedData).map(key => ({
        time: key,
        detections: groupedData[key]
    }));

    return (
        <div>
            <h2>Waste Analytics Dashboard</h2>
            
            {/* 🔽 Filter Dropdown */}
            <label>Sort by: </label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="hour">Last Hour</option>
                <option value="day">Today</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
            </select>

            <div style={{ display: "flex", justifyContent: "center", gap: "50px", marginTop: "20px" }}>
                {/* Pie Chart */}
                <PieChart width={400} height={400}>
                    <Pie data={pieChartData} cx="50%" cy="50%" outerRadius={120} fill="#8884d8" dataKey="value" label>
                        {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[entry.name] || "#8884d8"} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>

                {/* Line Chart */}
                <LineChart width={500} height={300} data={lineChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="detections" stroke="#8884d8" />
                </LineChart>
            </div>
        </div>
    );
};

export default WasteAnalytics;
