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
import { div } from "framer-motion/client";

export default function Home() {
  
  const [uploadedFile, setFile] = useState<File[]>();
  const [model, setModel] = useState<String>("");
  const [data, setData] = useState<{'High':{
    img: String,
    values: Array<Number>,
    mse: Number
  },'Low':{
    img: String,
    values: Array<Number>,
    mse: Number
  },'Open':{
    img: String,
    values: Array<Number>,
    mse: Number
  },'Close':{
    img: String,
    values: Array<Number>,
    mse: Number
  },'Volume':{
    img: String,
    values: Array<Number>,
    mse: Number
  },'Marketcap':{
    img: String,
    values: Array<Number>,
    mse: Number
  }}>()

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
            setData(response.data)

          } else {
            const response = await getPredictions(formData);
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
      {
        data && 
        <div className="text-white">
          <div className="">
            <div className="flex p-10">
              {
                data &&
                <img src={`data:image/png;base64,${data.High.img}`} height={`600px`} width={`600px`} alt="" />  
              }
              <div>
                {
                  data?.High.values.map((e,i) => {
                    return  <div className="flex" key={i}>
                              <div className="px-3">
                                {i+1}
                              </div>
                              <div className="px-3">
                                {`${e}`}
                              </div>
                            </div>
                  })
                }

              </div>
              <div>
                MSE - {`${data?.High.mse}`}
              </div>
              
            </div>
            <div className="flex p-10">
              {
                data &&
                <img src={`data:image/png;base64,${data.Low.img}`} height={`600px`} width={`600px`} alt="" />  
              }

              <div>
                {
                  data?.Low.values.map((e,i) => {
                    return  <div className="flex" key={i}>
                              <div className="px-3">
                                {i+1}
                              </div>
                              <div className="px-3">
                                {`${e}`}
                              </div>
                            </div>
                  })
                }

              </div>
              <div>
                MSE - {`${data?.Low.mse}`}
              </div>
            </div>
            <div className="flex p-10">
              {
                data &&
                <img src={`data:image/png;base64,${data.Open.img}`} height={`600px`} width={`600px`} alt="" />  
              }

              <div>
                {
                  data?.Open.values.map((e,i) => {
                    return  <div className="flex" key={i}>
                              <div className="px-3">
                                {i+1}
                              </div>
                              <div className="px-3">
                                {`${e}`}
                              </div>
                            </div>
                  })
                }

              </div>
              <div>
              MSE - {`${data?.Open.mse}`}
            </div>
            </div>
            <div className="flex p-10">
              {
                data &&
                <img src={`data:image/png;base64,${data.Close.img}`} height={`600px`} width={`600px`} alt="" />  
              } 

              <div>
                {
                  data?.Close.values.map((e,i) => {
                    return  <div className="flex" key={i}>
                              <div className="px-3">
                                {i+1}
                              </div>
                              <div className="px-3">
                                {`${e}`}
                              </div>
                            </div>
                  })
                }

              </div>
              <div>
            MSE - {`${data?.Close.mse}`}
          </div>
            </div>
            <div className="flex p-10">
              {
                data &&
                <img src={`data:image/png;base64,${data.Volume.img}`} height={`600px`} width={`600px`} alt="" />  
              }

              <div>
                {
                  data?.Volume.values.map((e,i) => {
                    return  <div className="flex" key={i}>
                              <div className="px-3">
                                {i+1}
                              </div>
                              <div className="px-3">
                                {`${e}`}
                              </div>
                            </div>
                  })
                }

              </div>
              <div>
            MSE - {`${data?.Volume.mse}`}
          </div>
            </div>
            <div className="flex p-10">
              {
                data &&
                <img src={`data:image/png;base64,${data.Marketcap.img}`} height={`600px`} width={`600px`} alt="" />  
              }

              <div>
                {
                  data?.Marketcap.values.map((e,i) => {
                    return  <div className="flex" key={i}>
                              <div className="px-3">
                                {i+1}
                              </div>
                              <div className="px-3">
                                {`${e}`}
                              </div>
                            </div>
                  })
                }

              </div>
              <div>
                MSE - {`${data?.Marketcap.mse}`}
              </div>
            </div>
          </div>
          
        </div>      
      }
    </div>
  );
}