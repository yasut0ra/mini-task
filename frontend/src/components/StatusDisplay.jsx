import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function StatusDisplay({ status }) {
  const data = {
    labels: ['知性', '感情', '健康', '社会性', '資産'],
    datasets: [
      {
        label: 'レベル',
        data: [
          status.intelligence.level,
          status.emotional.level,
          status.health.level,
          status.social.level,
          status.wealth.level
        ],
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(99, 102, 241, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(99, 102, 241, 1)'
      }
    ]
  };

  const options = {
    scales: {
      r: {
        angleLines: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        pointLabels: {
          color: 'rgba(0, 0, 0, 0.7)',
          font: {
            size: 12,
            family: 'sans-serif'
          }
        },
        ticks: {
          stepSize: 1,
          backdropColor: 'transparent'
        },
        suggestedMin: 0,
        suggestedMax: Math.max(
          status.intelligence.level,
          status.emotional.level,
          status.health.level,
          status.social.level,
          status.wealth.level
        ) + 1
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Radar data={data} options={options} />
    </div>
  );
} 