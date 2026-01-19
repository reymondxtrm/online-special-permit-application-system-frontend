import React from "react";
import ReactApexChart from "react-apexcharts";

const Spinearea = ({ xAxis, data, date_to, date_from }) => {
  const series = [
    {
      name: "series1",
      data: data,
    },
  ];
  const options = {
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },

    colors: ["#556ee6", "#34c38f"],
    xaxis: {
      type: "datetime",
      categories: [...xAxis],
    },
    grid: {
      borderColor: "#f1f1f1",
    },
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
    },
  };

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="area"
      height="350"
    />
  );
};

export default Spinearea;
