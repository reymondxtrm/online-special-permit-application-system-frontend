import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar } from "react-chartjs-2";
// import faker from 'faker';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);
const BarChart = ({ legendTitle, barColor, count, sample }) => {
  const [labels, setLabel] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    if (sample) {
      const newLabels = sample.map((item) => {
        if (item.gender_type === "MALE - Person with Disability") {
          return "MALE-PWD";
        }
        if (item.gender_type === "FEMALE - Person with Disability") {
          return "FEMALE-PWD";
        } else {
          return item.gender_type || "";
        }
      });
      setLabel(newLabels);
      const newData = sample.map((item) => item.count || "");
      setMonthlyData(newData);
    }
  }, [sample]);
  const options = {
    responsive: true,
    plugins: {
      datalabels: {
        display: true,
        color: "black",
        formatter: Math.round,
        anchor: "end",
        offset: -20,
        align: "start",
      },
      legend: {
        position: "bottom",
        align: "center",
      },
      title: {
        display: true,
        text: "",
      },
    },
  };
  // console.log(data.gender);

  // var monthlyData = [12, 12, 12];
  const countPerMonth = labels.map((items, index) => {
    return count?.map((number) => {
      if (number.month === items) {
        monthlyData[index] += number.total;
        // return (number.total)
      } else {
        monthlyData[index] += 0;
        // return (0)
      }
    });
    // console.log( count[0]);
  });

  const data = {
    labels,
    datasets: [
      {
        label: legendTitle,
        data: monthlyData.map((item) => item),
        backgroundColor: barColor,
      },
    ],
  };

  return <Bar width={474} height={300} data={data} options={options} />;
};

export default BarChart;
