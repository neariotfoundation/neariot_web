import { Label } from "@mui/icons-material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { memo, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { setLabels } from "react-chartjs-2/dist/utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


const LineChart = memo(({ title }: any) => {
  const [labels, setLabels] = useState<any[]>();
  const [Data, setData] = useState<any>({labels:[], datasets:[]});

  useEffect(()=>{
    setLabels(["January", "February", "March", "April", "May", "June", "July"])
  },[])
  useEffect(() => {
    setData({
      labels: labels,
      datasets: [
        {
          label: "Dataset 1",
          data: [65, 59, 80, 81, 56, 55, 40],
          borderColor: "rgb(75, 192, 192)",
        },
        {
          label: "Dataset 2",
          data: [28, 48, 40, 19, 86, 27, 90],
          borderColor: "rgb(255, 99, 132)",
        },
      ],
    });
  },[labels]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: title || "Line Chart",
      },
    },
  };

  return <>
    <Line options={options} data={Data} />
  </>;
});

LineChart.displayName = "LineChart";

export default LineChart;
