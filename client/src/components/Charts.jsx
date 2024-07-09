import React, { useEffect, useState } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { getAlltask } from '../fetch/fetch';
import { format } from 'date-fns';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend);

function Charts() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAlltask(setTasks, setLoading, setError);
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-6 overflow-hidden box-border flex flex-col items-center justify-center">
      <div className='w-full f md:flex items-end justify-around '>
        <div className="w-[40%]">
          <BarChart data={tasks} />
        </div>
        <div className="w-[20%]">
          <PieChart data={tasks} />
        </div>
      </div>
      <div className='w-[30%]'>
      <LineChart  data={tasks} />
      </div>
    </div>
  );
}

export default Charts;

const BarChart = ({ data }) => {
  const chartData = barChartData(data);

  return (
    <div>
      <h2 className='font-semibold'>Tasks Created by User</h2>
      <Bar data={chartData} />
    </div>
  );
};

const barChartData = (data) => {
  const users = [...new Set(data.map(task => task.name))];
  const taskCount = users.map(user => data.filter(task => task.name === user).length);

  return {
    labels: users,
    datasets: [
      {
        label: 'Tasks Created',
        data: taskCount,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };
};

const PieChart = ({ data }) => {
  const chartData = pieChartData(data);

  return (
    <div>
      <h2 className='font-semibold'>Task Completion Status</h2>
      <Pie data={chartData} />
    </div>
  );
};

const pieChartData = (data) => {
  const completedTasks = data.filter(task => task.completed).length;
  const incompleteTasks = data.length - completedTasks;

  return {
    labels: ['Completed', 'Incomplete'],
    datasets: [
      {
        data: [completedTasks, incompleteTasks],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  };
};

const lineChartData = (data) => {
  const dates = [...new Set(data.map(task => format(new Date(task.createdDate), 'yyyy-MM-dd')))].sort();
  const taskCount = dates.map(date => data.filter(task => format(new Date(task.createdDate), 'yyyy-MM-dd') === date).length);

  return {
    labels: dates,
    datasets: [
      {
        label: 'Tasks Created Over Time',
        data: taskCount,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        fill: false,
        tension: 0.1,
      },
    ],
  };
};

const LineChart = ({ data }) => {
  const chartData = lineChartData(data);

  return (
    <div>
      <h2 className='font-semibold'>Tasks Created Over Time</h2>
      <Line data={chartData} />
    </div>
  );
};
