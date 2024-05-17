import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Registering the components necessary for the bar chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const GraphComparison = () => {
  const [chartData, setChartData] = useState({
    labels: ['Jaro-Winkler', 'Levenshtein'],
    datasets: [
      {
        label: 'Processing Time (ms)',
        data: [], // This will be filled with data from localStorage
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)'
        ],
        borderWidth: 1
      }
    ]
  });

  const [wordScoresData, setWordScoresData] = useState({
    labels: [], // This will be filled with words from localStorage
    datasets: [
      {
        label: 'Jaro-Winkler Scores',
        data: [], // This will be filled with Jaro-Winkler scores from localStorage
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      },
      {
        label: 'Levenshtein Scores',
        data: [], // This will be filled with Levenshtein scores from localStorage
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  });

  useEffect(() => {
    const jaroWinklerData = JSON.parse(localStorage.getItem('jaroWinklerData'));
    const levenshteinData = JSON.parse(localStorage.getItem('levenshteinData'));
    if (jaroWinklerData && levenshteinData) {
      setChartData(prevData => ({
        ...prevData,
        datasets: [{
          ...prevData.datasets[0],
          data: [jaroWinklerData.processingTime, levenshteinData.processingTime]
        }]
      }));

      setWordScoresData({
        labels: jaroWinklerData.words,
        datasets: [
          {
            ...wordScoresData.datasets[0],
            data: jaroWinklerData.scores,
            suggestions: jaroWinklerData.suggestions
          },
          {
            ...wordScoresData.datasets[1],
            data: levenshteinData.scores,
            suggestions: levenshteinData.suggestions
          }
        ]
      });
    }
  }, []);

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          afterBody: (tooltipItems) => {
            const suggestions = tooltipItems[0].dataset.suggestions;
            const index = tooltipItems[0].dataIndex;
            const score = tooltipItems[0].raw;
            if (score < 1.00) {
              return `Suggestion: ${suggestions[index]}`;
            }
            return '';
          }
        }
      }
    }
  };

  return (
    <div className='container px-12 py-5'>
      <h2 className='text-2xl font-semibold mb-4'>Processing Time Comparison</h2>
      <Bar data={chartData} />
      <h2 className='text-2xl font-semibold mb-4'>Word Scores Comparison</h2>
      <Bar data={wordScoresData} options={options} />
    </div>
  );
}

export default GraphComparison;