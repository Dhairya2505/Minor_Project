"use client"

import { useState } from "react";
import axios from "axios";

import { FileUpload } from "@/components/ui/file-upload";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"

import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface Data {
  'High': Array<BigInt64Array | Float64Array>
}

export default function Home() {
  
  const [uploadedFile, setFile] = useState<File[]>();
  const [model, setModel] = useState<string>("");
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [showGraph, setShowGraph] = useState(false);

  const chartConfig = {
    desktop: {
      label: "value",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig

  const chartData = [
    { month: "January", desktop: 186 },
    { month: "February", desktop: 305 },
    { month: "March", desktop: 237 },
    { month: "April", desktop: 73 },
    { month: "May", desktop: 209 },
    { month: "June", desktop: 214 },
  ]

  const handleFileUpload = (files: File[]) => {
    setFile(files);
  };

  const checkFile = () => {
    if(!uploadedFile){
      alert("Please upload a file.");
      return false;
    } else{
      if(`${uploadedFile[0].name[uploadedFile[0].name.length-4]}${uploadedFile[0].name[uploadedFile[0].name.length-3]}${uploadedFile[0].name[uploadedFile[0].name.length-2]}${uploadedFile[0].name[uploadedFile[0].name.length-1]}` != '.csv'){
        alert("Please upload a valid csv file.");
        return false;
      } else {
        // console.log("Thank you for the file")
        return true;
      }
    }
  }

  const checkModel = () => {
    if(model == ""){
      alert("Please select a model.")
      return false;
    } else {
      return true;
    }
  }

  const getPredictions = async (formData: FormData) => {
    const response = await axios.post("http://127.0.0.1:5000/getPredictions", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  }

  const getForecast = async (formData: FormData) => {
    const response = await axios.post("http://127.0.0.1:5000/getForecast", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  }

  const sendFile = async () => {
    if (checkFile()){
      if (checkModel()){
        if(uploadedFile){
          const formData: FormData = new FormData();
          formData.append('file',uploadedFile[0]) 
          formData.append('model',model) 
          if(model == "arima" || model == "sarima" || model == "es"){
            const response = await getForecast(formData);
            console.log(response.data['High'])
            setData(response.data)
          } else {
            const response = await getPredictions(formData);
            console.log(response.data['High'])
            setData(response.data)
          }
        } else {
          return;
        }
      } else {
        return;
      }
    } else {
      return;
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <div className=" flex flex-col items-center ">

        <div className="mt-10 p-2 w-full max-w-xl mx-auto min-h-28 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
          <FileUpload onChange={handleFileUpload} />
        </div>
        <div className="flex">
          <div className="text-white p-2">
            <Select onValueChange={(value) => setModel(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a Model" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup className="text-white">
                  <SelectItem value="arima">ARIMA</SelectItem>
                  <SelectItem value="cnn">CNN</SelectItem>
                  <SelectItem value="es">Exponential Smoothing</SelectItem>
                  <SelectItem value="lr">Linear Regression</SelectItem>
                  <SelectItem value="sarima">SARIMA</SelectItem>
                  <SelectItem value="svr">SVR</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="p-2">
            <Button className="text-white border border-white" onClick={sendFile}>Predict</Button>
          </div>
        </div>
      </div>

      <div>
        {
          showGraph && !loading &&

          data.map((element,index) => {

          })

          <Card className="h-96 w-96 text-white">
            <CardHeader>
              <CardTitle className="text-white">Line Chart - Linear</CardTitle>
              <CardDescription className="text-white">January - June 2024</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <LineChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Line
                    dataKey="desktop"
                    type="linear"
                    stroke="var(--color-desktop)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="flex gap-2 font-medium leading-none">
              </div>
              <div className="leading-none text-muted-foreground">
                Showing total visitors for the last 6 months
              </div>
            </CardFooter>
          </Card>

        }

      </div>
      
    </div>
  );
}