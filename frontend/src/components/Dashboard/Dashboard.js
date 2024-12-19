import React, { useEffect, useState } from 'react';
import Nav from '../Nav2/Nav2';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  AreaChart, Area
} from 'recharts';
import axios from 'axios';

const URL = "http://localhost:8070/ads";

function Dashboard() {
  const [adsCatData, setAdsCatData] = useState([]);
  const [animationKey, setAnimationKey] = useState(0); // State for re-rendering

  useEffect(() => {
    const fetchAdsData = async () => {
      try {
        const response = await axios.get(URL);
        const advertisements = response.data.ads;
        const titleCounts = {};

        // Count advertisements by title
        advertisements.forEach(ad => {
          titleCounts[ad.title] = (titleCounts[ad.title] || 0) + 1;
        });

        // Convert to format required for PieChart
        const formattedData = Object.entries(titleCounts).map(([name, value]) => ({ name, value }));

        setAdsCatData(formattedData);
        setAnimationKey(prevKey => prevKey + 1); // Change key to trigger re-render
      } catch (error) {
        console.error("Error fetching advertisement data:", error);
      }
    };

    fetchAdsData();
  }, []);

  const noOfAdsData = [
    { name: 'Active', value: 5 },
    { name: 'Paused', value: 3 },
    { name: 'Completed', value: 2 },
  ];

  const adProgressData = [
    { name: 'Ongoing', value: 3 },
    { name: 'Upcoming', value: 2 },
    { name: 'Successful', value: 4 },
  ];

  const dayByDayData = [
    { day: 'Day 1', impressions: 1000 },
    { day: 'Day 2', impressions: 1500 },
    { day: 'Day 3', impressions: 2000 },
    { day: 'Day 4', impressions: 1800 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Nav />
      <div style={{ flex: 1, padding: '20px', marginLeft: '250px', backgroundColor: '#f9f9f9' }}>
        <section style={{ marginBottom: '100px' }}> {/* Increased space here */}
          <h2>Your Advertisement Progress</h2>
          <div style={{ marginBottom: '20px' }} />
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            justifyContent: 'center',
            alignItems: 'center'
          }}>

            {/* Advertisement Categories - Pie Chart */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              border: '1px solid #ddd',
              borderRadius: '5px',
              padding: '10px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            }}>
              <h3>Advertisement Categories</h3>
              <PieChart width={200} height={200} key={animationKey}>
                <Pie
                  data={adsCatData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  animationDuration={800}
                  animationEasing="ease-out"
                >
                  {adsCatData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>

            {/* No of Advertisements - Doughnut Chart */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              border: '1px solid #ddd',
              borderRadius: '5px',
              padding: '10px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            }}>
              <h3>No of Advertisements</h3>
              <PieChart width={200} height={200} key={animationKey}>
                <Pie
                  data={noOfAdsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  fill="#82ca9d"
                  paddingAngle={5}
                  dataKey="value"
                  animationDuration={800}
                  animationEasing="ease-out"
                >
                  {noOfAdsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>

            {/* Advertisement Progress - Horizontal Bar Chart */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              border: '1px solid #ddd',
              borderRadius: '5px',
              padding: '10px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            }}>
              <h3>Advertisement Progress</h3>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <BarChart
                  width={300}
                  height={200}
                  data={adProgressData}
                  layout="vertical"
                  margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                  key={animationKey}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" />
                  <Tooltip />
                  <Bar 
                    dataKey="value" 
                    fill="#8884d8" 
                    animationDuration={1000} 
                    animationEasing="ease-in-out" 
                  />
                </BarChart>
              </div>
            </div>

          </div>

          {/* Advertisement Day By Day Progress - Area Chart */}
          <div style={{
            textAlign: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            border: '1px solid #ddd',
            borderRadius: '5px',
            padding: '10px',
            marginTop: '20px',
            width: '100%',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          }}>
            <h3>Advertisement Day By Day Progress</h3>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <AreaChart
                width={600}
                height={200}
                data={dayByDayData}
                margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                key={animationKey}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="impressions" 
                  stroke="#82ca9d" 
                  fill="#82ca9d" 
                  animationDuration={1000} 
                  animationEasing="ease-in-out"
                />
              </AreaChart>
            </div>
          </div>

        </section>
      </div>
    </div>
  );
}

export default Dashboard;
