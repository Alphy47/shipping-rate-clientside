import React, { useState, useRef, useEffect } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import API_BASE_URL from './envirenment';

function ExcelUpload() {
  const [selectedOption, setSelectedOption] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [file, setFile] = useState(null);
  const [jsonData, setJsonData] = useState(null);
  const [message, setMessage] = useState('');
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const fileInputRef = useRef(null);
  const [fuelCost, setFuelCost] = useState('');
  const [currentUPSFuelRate, setcurrentUPSFuelRate] = useState('')
  const [currentFedexFuelRate, setcurrentFedexFuelRate] = useState('')
  const [currentDHLFuelRate, setcurrentDHLFuelRate] = useState('')

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setFile(null);
    setJsonData(null);
    setSelectedOption('')
    setFuelCost('')
    if (selectedOption.current){
      selectedOption.current.value=null
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleConvert = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        alert('Error: No file selected.');
        reject('No file selected');
        const json = 0
        resolve(json);
        return;
      }
  
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        // Get the column headers
        const headers = [];
        const range = XLSX.utils.decode_range(worksheet['!ref']); // Get the range of the worksheet
        const firstRow = range.s.r; // Starting row of the range
        const lastCol = range.e.c; // Last column of the range

        for (let col = range.s.c; col <= lastCol; col++) {
          const cellAddress = { c: col, r: firstRow }; // Create cell address for the header
          const cell = worksheet[XLSX.utils.encode_cell(cellAddress)];
          headers.push(cell ? cell.v : `Column ${col + 1}`); // Push the header value or default name
        }

        // Log the headers to the console
        console.log('Headers:', headers);

          const json = XLSX.utils.sheet_to_json(worksheet);
          resolve( {json, headers} );
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };
  
  const downloadTemplate = (filePath, fileName) => {
    const link = document.createElement('a');
    link.href = process.env.PUBLIC_URL + filePath;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleInputChange = (e) => {
    setFuelCost(e.target.value);
  };



  /////////
  //-UPS-//
  /////////
  
  //for UPS Zones
  const handleSubmitUPSZones = async (event) => {
    event.preventDefault();
    if (file) {
      try {
        const json = await handleConvert(file);
        console.log(json);

        if (json === 0) {
          alert('Error: No valid JSON data found.');
        } else {

        const response = await axios.post(API_BASE_URL+'uploadUPSZones.jsx', json);
        console.log('JSON data sent to API successfully', response.data);
        alert('File uploaded Successfully!');
        }
  
        // Clear the file input and state
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error:', error);
        setMessage('Upload not succeeded!');
        setShowMessageDialog(true);
      }
    }
  };

  //for UPS Exports Upto Five
  const handleSubmitUPSExportsUptoFive = async (event) => {
    event.preventDefault();
    if (file) {
      try {
        const json = await handleConvert(file);
        console.log(json);
        const response = await axios.post(API_BASE_URL+'uploadUPSExportsUptoFive.jsx', json);
        console.log('JSON data sent to API successfully', response.data);
        // setMessage('File uploaded Successfully!');
        // setShowMessageDialog(true);
        alert('File uploaded Successfully!');
  
        // Clear the file input and state
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error:', error);
        setMessage('Upload not succeeded!');
        setShowMessageDialog(true);
      }
    }
  };
  
  //for UPS Exports Over Five
  const handleSubmitUPSExportsOverFive = async (event) => {
    event.preventDefault();
    if (file) {
      try {
        const json = await handleConvert(file);
        console.log(json);
        const response = await axios.post(API_BASE_URL+'uploadUPSExportsOverFive.jsx', json);
        console.log('JSON data sent to API successfully', response.data);
        // setMessage('File uploaded Successfully!');
        // setShowMessageDialog(true);
        alert('File uploaded Successfully!');
  
        // Clear the file input and state
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error:', error);
        setMessage('Upload not succeeded!');
        setShowMessageDialog(true);
      }
    }
  };

  //for UPS Exports Over Seventy
  const handleSubmitUPSExportsOverSeventy = async (event) => {
    event.preventDefault();
    if (file) {
      try {
        const json = await handleConvert(file);
        console.log(json);
        const response = await axios.post(API_BASE_URL+'uploadUPSExportsOverSeventy.jsx', json);
        console.log('JSON data sent to API successfully', response.data);
        // setMessage('File uploaded Successfully!');
        // setShowMessageDialog(true);
        alert('File uploaded Successfully!');
  
        // Clear the file input and state
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error:', error);
        setMessage('Upload not succeeded!');
        setShowMessageDialog(true);
      }
    }
  };

   //for UPS Special Exports Upto Five
   const handleSubmitUPSSpecialExportsUptoFive = async (event) => {
    event.preventDefault();
    if (file) {
      try {
        const {json, headers} = await handleConvert(file);
        console.log(json);

        const dataToSend = {
          jsonData: json,
          headers: headers
        };
        console.log(dataToSend);
        const response = await axios.post(API_BASE_URL+'uploadUPSSpecialExportsUptoFive.jsx', dataToSend);
        console.log('JSON data sent to API successfully', response.data);
        // setMessage('File uploaded Successfully!');
        // setShowMessageDialog(true);
        alert('File uploaded Successfully!');
  
        // Clear the file input and state
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error:', error);
        setMessage('Upload not succeeded!');
        setShowMessageDialog(true);
      }
    }
  };

   //for UPS Special Exports over Five
   const handleSubmitUPSSpecialExportsOverFive = async (event) => {
    event.preventDefault();
    if (file) {
      try {
        const {json, headers} = await handleConvert(file);
        console.log(json);

        const dataToSend = {
          jsonData: json,
          headers: headers
        };

        const response = await axios.post(API_BASE_URL+'uploadUPSSpecialExportsOverFive.jsx', dataToSend);
        console.log('JSON data sent to API successfully', response.data);
        // setMessage('File uploaded Successfully!');
        // setShowMessageDialog(true);
        alert('File uploaded Successfully!');
  
        // Clear the file input and state
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error:', error);
        setMessage('Upload not succeeded!');
        setShowMessageDialog(true);
      }
    }
  };

   //for UPS Special Exports over Five
   const handleSubmitUPSSpecialExportsOverSeventy = async (event) => {
    event.preventDefault();
    if (file) {
      try {
        const {json, headers} = await handleConvert(file);
        console.log(json);

        const dataToSend = {
          jsonData: json,
          headers: headers
        };

        const response = await axios.post(API_BASE_URL+'uploadUPSSpecialExportsOverSeventy.jsx', dataToSend);
        console.log('JSON data sent to API successfully', response.data);
        // setMessage('File uploaded Successfully!');
        // setShowMessageDialog(true);
        alert('File uploaded Successfully!');
  
        // Clear the file input and state
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error:', error);
        setMessage('Upload not succeeded!');
        setShowMessageDialog(true);
      }
    }
  };

   //for UPS Imports Upto Five
   const handleSubmitUPSImportsUptoFive = async (event) => {
    event.preventDefault();
    if (file) {
      try {
        const json = await handleConvert(file);
        console.log(json);
        const response = await axios.post(API_BASE_URL+'uploadUPSImportsUptoFive.jsx', json);
        console.log('JSON data sent to API successfully', response.data);
        // setMessage('File uploaded Successfully!');
        // setShowMessageDialog(true);
        alert('File uploaded Successfully!');
  
        // Clear the file input and state
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error:', error);
        setMessage('Upload not succeeded!');
        setShowMessageDialog(true);
      }
    }
  };

   //for UPS Imports Over Five
   const handleSubmitUPSImportsOverFive = async (event) => {
    event.preventDefault();
    if (file) {
      try {
        const json = await handleConvert(file);
        console.log(json);
        const response = await axios.post(API_BASE_URL+'uploadUPSImportsOverFive.jsx', json);
        console.log('JSON data sent to API successfully', response.data);
        // setMessage('File uploaded Successfully!');
        // setShowMessageDialog(true);
        alert('File uploaded Successfully!');
  
        // Clear the file input and state
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error:', error);
        setMessage('Upload not succeeded!');
        setShowMessageDialog(true);
      }
    }
  };

   //for UPS Imports Over Seventy
   const handleSubmitUPSImportsOverSeventy = async (event) => {
    event.preventDefault();
    if (file) {
      try {
        const json = await handleConvert(file);
        console.log(json);
        const response = await axios.post(API_BASE_URL+'uploadUPSImportsOverSeventy.jsx', json);
        console.log('JSON data sent to API successfully', response.data);
        // setMessage('File uploaded Successfully!');
        // setShowMessageDialog(true);
        alert('File uploaded Successfully!');
  
        // Clear the file input and state
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error:', error);
        setMessage('Upload not succeeded!');
        setShowMessageDialog(true);
      }
    }
  };

  //for UPS fuel cost
  const handleUPSFuelCostChange = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
  
    console.log('Fuel Cost:', fuelCost);
    
    if (fuelCost === '' || (fuelCost >= 0 && fuelCost <= 100)) {
      try {
        // Prepare the JSON payload
        const payload = {
          fuelCost: fuelCost.toString(), // Ensure fuelCost is a string as expected by the API
          service: "UPS" // Service is hardcoded to "UPS"
        };
        
        // Send the data to the API using axios
        const response = await axios.post(API_BASE_URL + 'updateFuelCost', payload);
  
        if (response.status === 200) {
          alert("Fuel Cost Value Updated.");
          getFuelCost(); // Refresh the fuel cost value
          setFuelCost(''); // Clear the input field
        } else {
          throw new Error('Network response was not OK');
        }
  
      } catch (error) {
        console.error('Error updating fuel cost:', error);
      }
    } else {
      alert("Please Enter Valid Range (0 - 100)%");
    }
  };
  

  //for DHL fuel cost
  const handleDHLFuelCostChange = async(event) => {
    event.preventDefault(); // Prevent default form submission behavior
  
    console.log('Fuel Cost:', fuelCost);
    
    if (fuelCost === '' || (fuelCost >= 0 && fuelCost <= 100)) {
      try {
        // Prepare the JSON payload
        const payload = {
          fuelCost: fuelCost.toString(), // Ensure fuelCost is a string as expected by the API
          service: "DHL"
        };
        
        // Send the data to the API using axios
        const response = await axios.post(API_BASE_URL + 'updateFuelCost', payload);
  
        if (response.status === 200) {
          alert("Fuel Cost Value Updated.");
          getFuelCost(); // Refresh the fuel cost value
          setFuelCost(''); // Clear the input field
        } else {
          throw new Error('Network response was not OK');
        }
  
      } catch (error) {
        console.error('Error updating fuel cost:', error);
      }
    } else {
      alert("Please Enter Valid Range (0 - 100)%");
    }
};

  //for Fedex fuel cost
  const handleFedexFuelCostChange = async(event) => {
    event.preventDefault(); // Prevent default form submission behavior
  
    console.log('Fuel Cost:', fuelCost);
    
    if (fuelCost === '' || (fuelCost >= 0 && fuelCost <= 100)) {
      try {
        // Prepare the JSON payload
        const payload = {
          fuelCost: fuelCost.toString(), // Ensure fuelCost is a string as expected by the API
          service: "FeDex" 
        };
        
        // Send the data to the API using axios
        const response = await axios.post(API_BASE_URL + 'updateFuelCost', payload);
  
        if (response.status === 200) {
          alert("Fuel Cost Value Updated.");
          getFuelCost(); // Refresh the fuel cost value
          setFuelCost(''); // Clear the input field
        } else {
          throw new Error('Network response was not OK');
        }
  
      } catch (error) {
        console.error('Error updating fuel cost:', error);
      }
    } else {
      alert("Please Enter Valid Range (0 - 100)%");
    }
};

  //get all Fuel Cost data
  const getFuelCost = async() => {

      try {
        const response = await fetch(API_BASE_URL+'selectFuelCost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not OK');
        } else {
          
          const data = await response.json();
          console.log("methana:",data);
          console.log(currentUPSFuelRate);
          console.log(currentDHLFuelRate);
          console.log(currentFedexFuelRate);

          const upsFuelCost = data.find(item => item.Dservice === 'UPS');
          setcurrentUPSFuelRate(upsFuelCost.fuelCost)
            
          const fedexFuelCost = data.find(item => item.Dservice === 'FeDex');
          setcurrentFedexFuelRate(fedexFuelCost.fuelCost)

          const dhlFuelCost = data.find(item => item.Dservice === 'DHL');
          setcurrentDHLFuelRate(dhlFuelCost.fuelCost)
        }

    } catch (error) {
        console.error('Error updating fuel cost.', error);
    }

};


  /////////
  //-DHL-//
  /////////

   //for DHL Zones
   const handleSubmitDHLZones = async (event) => {
    event.preventDefault();
    if (file) {
      try {
        const json = await handleConvert(file);
        console.log(json);
        const response = await axios.post(API_BASE_URL+'uploadDHLZones.jsx', json);
        console.log('JSON data sent to API successfully', response.data);
        // setMessage('File uploaded Successfully!');
        // setShowMessageDialog(true);
        alert('File uploaded Successfully!');
  
        // Clear the file input and state
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error:', error);
        setMessage('Upload not succeeded!');
        setShowMessageDialog(true);
      }
    }
  };

   //for DHL Exports Upto Two
   const handleSubmitDHLExportsUptoTwo = async (event) => {
    event.preventDefault();
    if (file) {
      try {
        const json = await handleConvert(file);
        console.log(json);
        const response = await axios.post(API_BASE_URL+'uploadDHLExportsUptoTwo.jsx', json);
        console.log('JSON data sent to API successfully', response.data);
        // setMessage('File uploaded Successfully!');
        // setShowMessageDialog(true);
        alert('File uploaded Successfully!');
  
        // Clear the file input and state
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error:', error);
        setMessage('Upload not succeeded!');
        setShowMessageDialog(true);
      }
    }
  };

   //for DHL Exports Over Two
   const handleSubmitDHLExportsOverTwo = async (event) => {
    event.preventDefault();
    if (file) {
      try {
        const json = await handleConvert(file);
        console.log(json);
        const response = await axios.post(API_BASE_URL+'uploadDHLExportsOverTwo.jsx', json);
        console.log('JSON data sent to API successfully', response.data);
        // setMessage('File uploaded Successfully!');
        // setShowMessageDialog(true);
        alert('File uploaded Successfully!');
  
        // Clear the file input and state
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error:', error);
        setMessage('Upload not succeeded!');
        setShowMessageDialog(true);
      }
    }
  };

   //for DHL Exports Over Thirty
   const handleSubmitDHLExportsOverThirty = async (event) => {
    event.preventDefault();
    if (file) {
      try {
        const json = await handleConvert(file);
        console.log(json);
        const response = await axios.post(API_BASE_URL+'uploadDHLExportsOverThirty.jsx', json);
        console.log('JSON data sent to API successfully', response.data);
        // setMessage('File uploaded Successfully!');
        // setShowMessageDialog(true);
        alert('File uploaded Successfully!');
  
        // Clear the file input and state
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error:', error);
        setMessage('Upload not succeeded!');
        setShowMessageDialog(true);
      }
    }
  };

   //for DHL E-Commerce Exports Over Point Five
   const handleSubmitDHLEComExportsOverPointFive = async (event) => {
    event.preventDefault();
    if (file) {
      try {
        const json = await handleConvert(file);
        console.log(json);
        const response = await axios.post(API_BASE_URL+'uploadDHLEComExportsOverPointFive.jsx', json);
        console.log('JSON data sent to API successfully', response.data);
        // setMessage('File uploaded Successfully!');
        // setShowMessageDialog(true);
        alert('File uploaded Successfully!');
  
        // Clear the file input and state
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error:', error);
        setMessage('Upload not succeeded!');
        setShowMessageDialog(true);
      }
    }
  };

   //for DHL E-commerce Exports Over Thirty
   const handleSubmitDHLEComExportsOverThirty = async (event) => {
      event.preventDefault();
      if (file) {
        try {
          const json = await handleConvert(file);
          console.log(json);
          const response = await axios.post(API_BASE_URL+'uploadDHLEComExportsOverThirty.jsx', json);
          console.log('JSON data sent to API successfully', response.data);
          // setMessage('File uploaded Successfully!');
          // setShowMessageDialog(true);
          alert('File uploaded Successfully!');
    
          // Clear the file input and state
          setFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        } catch (error) {
          console.error('Error:', error);
          setMessage('Upload not succeeded!');
          setShowMessageDialog(true);
        }
      }
  };

   //for DHL Imports Upto Two
   const handleSubmitDHLImportsUptoTwo = async (event) => {
    event.preventDefault();
    if (file) {
      try {
        const json = await handleConvert(file);
        console.log(json);
        const response = await axios.post(API_BASE_URL+'uploadDHLImportsUptoTwo.jsx', json);
        console.log('JSON data sent to API successfully', response.data);
        // setMessage('File uploaded Successfully!');
        // setShowMessageDialog(true);
        alert('File uploaded Successfully!');
  
        // Clear the file input and state
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error:', error);
        setMessage('Upload not succeeded!');
        setShowMessageDialog(true);
      }
    }
  };

   //for DHL Imports Over Two
   const handleSubmitDHLImportsOverTwo = async (event) => {
      event.preventDefault();
      if (file) {
        try {
          const json = await handleConvert(file);
          console.log(json);
          const response = await axios.post(API_BASE_URL+'uploadDHLImportsOverTwo.jsx', json);
          console.log('JSON data sent to API successfully', response.data);
          // setMessage('File uploaded Successfully!');
          // setShowMessageDialog(true);
          alert('File uploaded Successfully!');
    
          // Clear the file input and state
          setFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        } catch (error) {
          console.error('Error:', error);
          setMessage('Upload not succeeded!');
          setShowMessageDialog(true);
        }
      }
  };

   //for DHL Exports Over Thirty
   const handleSubmitDHLImportsOverThirty = async (event) => {
      event.preventDefault();
      if (file) {
        try {
          const json = await handleConvert(file);
          console.log(json);
          const response = await axios.post(API_BASE_URL+'uploadDHLImportsOverThirty.jsx', json);
          console.log('JSON data sent to API successfully', response.data);
          // setMessage('File uploaded Successfully!');
          // setShowMessageDialog(true);
          alert('File uploaded Successfully!');
    
          // Clear the file input and state
          setFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        } catch (error) {
          console.error('Error:', error);
          setMessage('Upload not succeeded!');
          setShowMessageDialog(true);
        }
      }
  };


  ///////////
  //-FeDex-//
  ///////////

   //for FeDex Zones
   const handleSubmitFedexZones = async (event) => {
    event.preventDefault();
    if (file) {
      try {
        const json = await handleConvert(file);
        console.log(json);
        const response = await axios.post(API_BASE_URL+'uploadFedexZones.jsx', json);
        console.log('JSON data sent to API successfully', response.data);
        // setMessage('File uploaded Successfully!');
        // setShowMessageDialog(true);
        alert('File uploaded Successfully!');
  
        // Clear the file input and state
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error:', error);
        setMessage('Upload not succeeded!');
        setShowMessageDialog(true);
      }
    }
  };
  
   //for FeDex Exports Document
   const handleSubmitFedexExportsDocument = async (event) => {
    event.preventDefault();
    if (file) {
      try {
        const json = await handleConvert(file);
        console.log(json);
        const response = await axios.post(API_BASE_URL+'uploadFedexExportsDocument.jsx', json);
        console.log('JSON data sent to API successfully', response.data);
        // setMessage('File uploaded Successfully!');
        // setShowMessageDialog(true);
        alert('File uploaded Successfully!');
  
        // Clear the file input and state
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error:', error);
        setMessage('Upload not succeeded!');
        setShowMessageDialog(true);
      }
    }
  };

   //for FeDex Exports Package
   const handleSubmitFedexExportsPackage = async (event) => {
    event.preventDefault();
    if (file) {
      try {
        const json = await handleConvert(file);
        console.log(json);
        const response = await axios.post(API_BASE_URL+'uploadFedexExportsPackage.jsx', json);
        console.log('JSON data sent to API successfully', response.data);
        // setMessage('File uploaded Successfully!');
        // setShowMessageDialog(true);
        alert('File uploaded Successfully!');
  
        // Clear the file input and state
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error:', error);
        setMessage('Upload not succeeded!');
        setShowMessageDialog(true);
      }
    }
  };

   //for FeDex Exports Sample
   const handleSubmitFedexExportsSample = async (event) => {
    event.preventDefault();
    if (file) {
      try {
        const json = await handleConvert(file);
        console.log(json);
        const response = await axios.post(API_BASE_URL+'uploadFedexExportsSample.jsx', json);
        console.log('JSON data sent to API successfully', response.data);
        // setMessage('File uploaded Successfully!');
        // setShowMessageDialog(true);
        alert('File uploaded Successfully!');
  
        // Clear the file input and state
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error:', error);
        setMessage('Upload not succeeded!');
        setShowMessageDialog(true);
      }
    }
  };

   //for FeDex E-commerce Exports Document
   const handleSubmitFedexEComExportsDocument = async (event) => {
    event.preventDefault();
    if (file) {
      try {
        const json = await handleConvert(file);
        console.log(json);
        const response = await axios.post(API_BASE_URL+'uploadFedexEComExportsDocument.jsx', json);
        console.log('JSON data sent to API successfully', response.data);
        // setMessage('File uploaded Successfully!');
        // setShowMessageDialog(true);
        alert('File uploaded Successfully!');
  
        // Clear the file input and state
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error:', error);
        setMessage('Upload not succeeded!');
        setShowMessageDialog(true);
      }
    }
  };

   //for FeDex E-commerce Exports Package
   const handleSubmitFedexEComExportsPackage = async (event) => {
    event.preventDefault();
    if (file) {
      try {
        const json = await handleConvert(file);
        console.log(json);
        const response = await axios.post(API_BASE_URL+'uploadFedexEComExportsPackage.jsx', json);
        console.log('JSON data sent to API successfully', response.data);
        // setMessage('File uploaded Successfully!');
        // setShowMessageDialog(true);
        alert('File uploaded Successfully!');
  
        // Clear the file input and state
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error:', error);
        setMessage('Upload not succeeded!');
        setShowMessageDialog(true);
      }
    }
  };

   //for FeDex E-commerce Exports Sample
   const handleSubmitFedexEComExportsSample = async (event) => {
    event.preventDefault();
    if (file) {
      try {
        const json = await handleConvert(file);
        console.log(json);
        const response = await axios.post(API_BASE_URL+'uploadFedexEComExportsSample.jsx', json);
        console.log('JSON data sent to API successfully', response.data);
        // setMessage('File uploaded Successfully!');
        // setShowMessageDialog(true);
        alert('File uploaded Successfully!');
  
        // Clear the file input and state
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error:', error);
        setMessage('Upload not succeeded!');
        setShowMessageDialog(true);
      }
    }
  };

   //for FeDex Imports Document
   const handleSubmitFedexImportsDocument = async (event) => {
    event.preventDefault();
    if (file) {
      try {
        const json = await handleConvert(file);
        console.log(json);
        const response = await axios.post(API_BASE_URL+'uploadFedexImportsDocument.jsx', json);
        console.log('JSON data sent to API successfully', response.data);
        // setMessage('File uploaded Successfully!');
        // setShowMessageDialog(true);
        alert('File uploaded Successfully!');
  
        // Clear the file input and state
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error:', error);
        setMessage('Upload not succeeded!');
        setShowMessageDialog(true);
      }
    }
  };

   //for FeDex Imports Package
   const handleSubmitFedexImportsPackage = async (event) => {
    event.preventDefault();
    if (file) {
      try {
        const json = await handleConvert(file);
        console.log(json);
        const response = await axios.post(API_BASE_URL+'uploadFedexImportsPackage.jsx', json);
        console.log('JSON data sent to API successfully', response.data);
        // setMessage('File uploaded Successfully!');
        // setShowMessageDialog(true);
        alert('File uploaded Successfully!');
  
        // Clear the file input and state
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error:', error);
        setMessage('Upload not succeeded!');
        setShowMessageDialog(true);
      }
    }
  };

   //for FeDex Imports Sample
   const handleSubmitFedexImportsSample = async (event) => {
    event.preventDefault();
    if (file) {
      try {
        const json = await handleConvert(file);
        console.log(json);
        const response = await axios.post(API_BASE_URL+'uploadFedexImportsSample.jsx', json);
        console.log('JSON data sent to API successfully', response.data);
        // setMessage('File uploaded Successfully!');
        // setShowMessageDialog(true);
        alert('File uploaded Successfully!');
  
        // Clear the file input and state
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error:', error);
        setMessage('Upload not succeeded!');
        setShowMessageDialog(true);
      }
    }
    // window.location.reload();
  };

   //for FeDex Imports Over 30Kg
   const handleSubmitFedexImportsOverThirty = async (event) => {
    event.preventDefault();
    if (file) {
      try {
        const json = await handleConvert(file);
        console.log(json);
        const response = await axios.post(API_BASE_URL+'uploadFedexImportsOverThirty.jsx', json);
        console.log('JSON data sent to API successfully', response.data);
        // setMessage('File uploaded Successfully!');
        // setShowMessageDialog(true);
        alert('File uploaded Successfully!');
  
        // Clear the file input and state
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error:', error);
        setMessage('Upload not succeeded!');
        setShowMessageDialog(true);
      }
    }
    // window.location.reload();
  };

  useEffect(() => {
    getFuelCost();
  }, []);

  const renderDialogContent = () => {
    switch (selectedOption) {
      case 'UPS':
        return (
          //file upload space for UPS rates

          
          <div>
            {/* ups zones */}
            <form onSubmit={handleSubmitUPSZones}>
              <h1 className="font-semibold">UPS Express Saver Tariff Zones</h1>
              <div className='flex items-center space-x-4'>
              <input
                // className="text-black p-1 pt-2 rounded border border-black"
                type="file"
                onChange={handleFileChange}
                accept=".xlsx, .xls"
                ref={fileInputRef}
                class="block w-full text-sm text-slate-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                    file:bg-violet-50 file:text-violet-700
                    hover:file:bg-violet-100"
              />
              <button type="submit" className="mt-1 p-2 bg-violet-50 text-violet-700 hover:bg-violet-100 rounded">
                Upload
              </button>
              <button type="submit" 
                      className="relative mt-1 p-2 bg-violet-50 
                                text-violet-700 hover:bg-violet-100 rounded 
                                  flex items-center focus:ring-4 focus:outline-none 
                                  focus:ring-blue-300 group"
                      onClick={() => downloadTemplate('/templates/UPS/UPS Country_Zones(Template).xlsx','UPS Country_Zones(Template).xlsx')}>
                <i className="fas fa-download m-1" aria-hidden="true"></i>
                
                <span className="absolute left-20 transform -translate-x-8 bottom-0 
                                  mb-1 px-3 py-2 bg-black bg-opacity-80 w-40 
                                  text-white text-sm rounded opacity-0 
                                  transition-opacity duration-300 
                                  group-hover:opacity-100">
                  Download Template
                </span>
                
              </button>

              </div>
            </form>

            {/* ups export rates */}
            <form>
              <h1 className="mt-4 font-semibold">UPS Export Rates</h1>
  
              <select className="
                  text-black 
                    p-2 
                    border-violet-700 
                    bg-violet-50 
                    focus:border-violet-700 
                    focus:bg-violet-60 
                    transition-colors 
                    duration-100 
                    ease-in-out"
                  defaultValue=""
                  onChange={handleSelectChange}
              >
                <option value="" disabled>--select--</option>
                <option value="Documents upto 5Kg other than UPS Express Envelopes">Documents upto 5Kg other than UPS Express Envelopes</option>
                <option value="Documents over 5Kg and Packages">Documents over 5Kg and Packages</option>
                <option value="Over 70Kg Packages">Over 70Kg Packages</option>
              </select>
            </form>


            {/* ups special export rates */}
            <form>
              <h1 className="mt-4 font-semibold">UPS Special Export Rates</h1>
              <select
                className="
                  text-black 
                  p-2 
                  border-violet-700 
                  bg-violet-50 
                  focus:border-violet-700 
                  focus:bg-violet-60 
                  transition-colors 
                  duration-100 
                  ease-in-out"
                defaultValue=""
                onChange={handleSelectChange}>
                  <option value="" disabled>--select--</option>
                  <option value="Special Export Rates Upto Five">Documents upto 5Kg other than UPS Express Envelopes</option>
                  <option value="Special Export Rates Over Five">Documents over 5Kg and Packages</option>
                  <option value="Special Export Rates Over Seventy">Over 70Kg Packages</option>
                </select><br />
                
              {/* <input className="text-black p-1 rounded border border-black" type="file" />
              <button type="submit" className="ml-2 mt-1 p-2 bg-green-500 text-white rounded">Upload</button> */}
            </form>

            {/* ups import rates */}
            <form>
              <h1 className="mt-4 font-semibold">UPS Import Rates</h1>
              <select
                className="
                  text-black 
                  p-2 
                  border-violet-700 
                  bg-violet-50 
                  focus:border-violet-700 
                  focus:bg-violet-60 
                  transition-colors 
                  duration-100 
                  ease-in-out"
                defaultValue=""
                onChange={handleSelectChange}>
            <option value="" disabled>--select--</option>
            <option value="Import Rates Upto Five">Documents upto 5Kg other than UPS Express Envelopes</option>
            <option value="Import Rates Over Five">Documents over 5Kg and Packages</option>
            <option value="Import Rates Over Seventy">Over 70Kg Packages</option>
          </select><br />
              
            </form>

            {/* UPS Fuel Cost */}
              <div>
              <h1 className="mt-4 font-semibold">UPS Fuel cost (%)</h1>
              <input
                  type="number"
                  value={currentUPSFuelRate}
                  disabled="true"
                  className="text-black 
                    w-[175px]
                    mr-2
                    p-2 
                    border-violet-700 
                    bg-violet-50 
                    focus:border-violet-700 
                    focus:bg-violet-60 
                    transition-colors "
                />
                <input
                  type="number"
                  value={fuelCost}
                  onChange={handleInputChange}
                  className="text-black 
                    p-2 
                    w-[175px]
                    border-violet-700 
                    bg-violet-50 
                    focus:border-violet-700 
                    focus:bg-violet-60 
                    transition-colors "
                />
                <button onClick={handleUPSFuelCostChange} className="mt-1 ml-3 p-2 bg-violet-50 text-violet-700 hover:bg-violet-100 rounded">
                  Set Value
                </button>
              </div>
          </div>
        );

        case 'Documents upto 5Kg other than UPS Express Envelopes':
        return (
          <div>
            <form onSubmit={handleSubmitUPSExportsUptoFive}>
              <h1 className="mt-4 font-semibold">Documents upto 5Kg other than UPS Express Envelopes</h1>
              <div className='flex items-center space-x-4'>
              <input
                className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
              file:bg-violet-50 file:text-violet-700
              hover:file:bg-violet-100"
                type="file"
                onChange={handleFileChange}
                accept=".xlsx, .xls"
                ref={fileInputRef}
              />
              <button type="submit" className="mt-1 p-2 bg-violet-50 text-violet-700 hover:bg-violet-100 rounded">
                Upload
              </button>
              <button type="submit" 
                      className="relative mt-1 p-2 bg-violet-50 
                                text-violet-700 hover:bg-violet-100 rounded 
                                  flex items-center focus:ring-4 focus:outline-none 
                                  focus:ring-blue-300 group"
                                  onClick={() => downloadTemplate('/templates/UPS/UPS Export Rates - upto 5Kg (Template).xlsx','UPS Export Rates - upto 5Kg (Template).xlsx')}>
                <i className="fas fa-download m-1" aria-hidden="true"></i>
                
                <span className="absolute left-20 transform -translate-x-8 bottom-0 
                                  mb-1 px-3 py-2 bg-black bg-opacity-80 w-40 
                                  text-white text-sm rounded opacity-0 
                                  transition-opacity duration-300 
                                  group-hover:opacity-100">
                  Download Template
                </span>
                
              </button>
              </div>
            </form>
            
          </div>
        );

        case 'Documents over 5Kg and Packages':
        return (
          <div>
            <form onSubmit={handleSubmitUPSExportsOverFive}>
              <h1 className="mt-4 font-semibold">Documents over 5Kg and Packages</h1>
              <div className='flex items-center space-x-4'>
              <input
                className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
              file:bg-violet-50 file:text-violet-700
              hover:file:bg-violet-100"
                type="file"
                onChange={handleFileChange}
                accept=".xlsx, .xls"
                ref={fileInputRef}
              />
              <button type="submit" className="mt-1 p-2 bg-violet-50 text-violet-700 hover:bg-violet-100 rounded">
                Upload
              </button>
              <button type="submit" 
                      className="relative mt-1 p-2 bg-violet-50 
                                text-violet-700 hover:bg-violet-100 rounded 
                                  flex items-center focus:ring-4 focus:outline-none 
                                  focus:ring-blue-300 group"
                                  onClick={() => downloadTemplate('/templates/UPS/UPS Export Rates - over 5Kg (Template).xlsx','UPS Export Rates - over 5Kg (Template).xlsx')}>
                <i className="fas fa-download m-1" aria-hidden="true"></i>
                
                <span className="absolute left-20 transform -translate-x-8 bottom-0 
                                  mb-1 px-3 py-2 bg-black bg-opacity-80 w-40 
                                  text-white text-sm rounded opacity-0 
                                  transition-opacity duration-300 
                                  group-hover:opacity-100">
                  Download Template
                </span>
                
              </button>
              </div>
            </form>
          </div>
        );

        case 'Over 70Kg Packages':
          return (
            <div>
              <form onSubmit={handleSubmitUPSExportsOverSeventy}>
                <h1 className="mt-4 font-semibold">Over 70Kg Packages</h1>
                <div className='flex items-center space-x-4'>
                <input
                  className="block w-full text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                file:bg-violet-50 file:text-violet-700
                hover:file:bg-violet-100"
                  type="file"
                  onChange={handleFileChange}
                  accept=".xlsx, .xls"
                  ref={fileInputRef}
                />
                <button type="submit" className="mt-1 p-2 bg-violet-50 text-violet-700 hover:bg-violet-100 rounded">
                  Upload
                </button>
                <button type="submit" 
                      className="relative mt-1 p-2 bg-violet-50 
                                text-violet-700 hover:bg-violet-100 rounded 
                                  flex items-center focus:ring-4 focus:outline-none 
                                  focus:ring-blue-300 group"
                                  onClick={() => downloadTemplate('/templates/UPS/UPS Export Rates - over 70Kg (Template).xlsx','UPS Export Rates - over 70Kg (Template).xlsx')}>
                <i className="fas fa-download m-1" aria-hidden="true"></i>
                
                <span className="absolute left-20 transform -translate-x-8 bottom-0 
                                  mb-1 px-3 py-2 bg-black bg-opacity-80 w-40 
                                  text-white text-sm rounded opacity-0 
                                  transition-opacity duration-300 
                                  group-hover:opacity-100">
                  Download Template
                </span>
                
              </button>
                </div>
              </form>
            </div>
          );

        case 'Special Export Rates Upto Five':
        return(
          <div>
            <form onSubmit={handleSubmitUPSSpecialExportsUptoFive}>
              <h1 className="mt-4 font-semibold">Documents Upto 5Kg and Packages</h1>
              <div className='flex items-center space-x-4'>
              <input
                className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
              file:bg-violet-50 file:text-violet-700
              hover:file:bg-violet-100"
                type="file"
                onChange={handleFileChange}
                accept=".xlsx, .xls"
                ref={fileInputRef}
              />
              <button type="submit" className="mt-1 p-2 bg-violet-50 text-violet-700 hover:bg-violet-100 rounded">
                Upload
              </button>
              <button type="submit" 
                      className="relative mt-1 p-2 bg-violet-50 
                                text-violet-700 hover:bg-violet-100 rounded 
                                  flex items-center focus:ring-4 focus:outline-none 
                                  focus:ring-blue-300 group"
                                  onClick={() => downloadTemplate('/templates/UPS/Special UPS Export Rates - upto 5Kg (Template).xlsx','Special UPS Export Rates - upto 5Kg (Template).xlsx')}>
                <i className="fas fa-download m-1" aria-hidden="true"></i>
                
                <span className="absolute left-20 transform -translate-x-8 bottom-0 
                                  mb-1 px-3 py-2 bg-black bg-opacity-80 w-40 
                                  text-white text-sm rounded opacity-0 
                                  transition-opacity duration-300 
                                  group-hover:opacity-100">
                  Download Template
                </span>
                
              </button>
              </div>
            </form>
          </div>
        );

        case 'Special Export Rates Over Five':
        return(
          <div>
            <form onSubmit={handleSubmitUPSSpecialExportsOverFive}>
              <h1 className="mt-4 font-semibold">Documents over 5Kg and Packages</h1>
              <div className='flex items-center space-x-4'>
                <input
                  className="block w-full text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                file:bg-violet-50 file:text-violet-700
                hover:file:bg-violet-100"
                  type="file"
                  onChange={handleFileChange}
                  accept=".xlsx, .xls"
                  ref={fileInputRef}
                />
                <button type="submit" className="mt-1 p-2 bg-violet-50 text-violet-700 hover:bg-violet-100 rounded">
                  Upload
                </button>
                <button type="submit" 
                      className="relative mt-1 p-2 bg-violet-50 
                                text-violet-700 hover:bg-violet-100 rounded 
                                  flex items-center focus:ring-4 focus:outline-none 
                                  focus:ring-blue-300 group"
                                  onClick={() => downloadTemplate('/templates/UPS/Special UPS Export Rates - over 5Kg (Template).xlsx','Special UPS Export Rates - over 5Kg (Template).xlsx')}>
                <i className="fas fa-download m-1" aria-hidden="true"></i>
                
                <span className="absolute left-20 transform -translate-x-8 bottom-0 
                                  mb-1 px-3 py-2 bg-black bg-opacity-80 w-40 
                                  text-white text-sm rounded opacity-0 
                                  transition-opacity duration-300 
                                  group-hover:opacity-100">
                  Download Template
                </span>
                
              </button>
                </div>
            </form>
          </div>
        );
      
        case 'Special Export Rates Over Seventy':
        return(
          <div>
            <form onSubmit={handleSubmitUPSSpecialExportsOverSeventy}>
              <h1 className="mt-4 font-semibold">Over 70Kg Packages</h1>
              <div className='flex items-center space-x-4'>
                <input
                  className="block w-full text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                file:bg-violet-50 file:text-violet-700
                hover:file:bg-violet-100"
                  type="file"
                  onChange={handleFileChange}
                  accept=".xlsx, .xls"
                  ref={fileInputRef}
                />
                <button type="submit" className="mt-1 p-2 bg-violet-50 text-violet-700 hover:bg-violet-100 rounded">
                  Upload
                </button>
                <button type="submit" 
                      className="relative mt-1 p-2 bg-violet-50 
                                text-violet-700 hover:bg-violet-100 rounded 
                                  flex items-center focus:ring-4 focus:outline-none 
                                  focus:ring-blue-300 group"
                                  onClick={() => downloadTemplate('/templates/UPS/Special UPS Export Rates - over 70Kg (Template).xlsx','Special UPS Export Rates - over 70Kg (Template).xlsx')}>
                <i className="fas fa-download m-1" aria-hidden="true"></i>
                
                <span className="absolute left-20 transform -translate-x-8 bottom-0 
                                  mb-1 px-3 py-2 bg-black bg-opacity-80 w-40 
                                  text-white text-sm rounded opacity-0 
                                  transition-opacity duration-300 
                                  group-hover:opacity-100">
                  Download Template
                </span>
                
              </button>
                </div>
            </form>
          </div>
        );

        case 'Import Rates Upto Five':
          return(
            <div>
              <form onSubmit={handleSubmitUPSImportsUptoFive}>
                <h1 className="mt-4 font-semibold">Documents upto 5Kg and Packages</h1>
                <div className='flex items-center space-x-4'>
                  <input
                    className="block w-full text-sm text-slate-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                  file:bg-violet-50 file:text-violet-700
                  hover:file:bg-violet-100"
                    type="file"
                    onChange={handleFileChange}
                    accept=".xlsx, .xls"
                    ref={fileInputRef}
                  />
                  <button type="submit" className="mt-1 p-2 bg-violet-50 text-violet-700 hover:bg-violet-100 rounded">
                    Upload
                  </button>
                  <button type="submit" 
                      className="relative mt-1 p-2 bg-violet-50 
                                text-violet-700 hover:bg-violet-100 rounded 
                                  flex items-center focus:ring-4 focus:outline-none 
                                  focus:ring-blue-300 group"
                                  onClick={() => downloadTemplate('/templates/UPS/UPS Import Rates - upto 5Kg (Template).xlsx','UPS Import Rates - upto 5Kg (Template).xlsx')}>
                <i className="fas fa-download m-1" aria-hidden="true"></i>
                
                <span className="absolute left-20 transform -translate-x-8 bottom-0 
                                  mb-1 px-3 py-2 bg-black bg-opacity-80 w-40 
                                  text-white text-sm rounded opacity-0 
                                  transition-opacity duration-300 
                                  group-hover:opacity-100">
                  Download Template
                </span>
                
              </button>
                </div>
              </form>
            </div>
          );
        
        case 'Import Rates Over Five':
        return(
          <div>
            <form onSubmit={handleSubmitUPSImportsOverFive}>
              <h1 className="mt-4 font-semibold">Documents over 5Kg and Packages</h1>
              <div className='flex items-center space-x-4'>
                <input
                  className="block w-full text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                file:bg-violet-50 file:text-violet-700
                hover:file:bg-violet-100"
                  type="file"
                  onChange={handleFileChange}
                  accept=".xlsx, .xls"
                  ref={fileInputRef}
                />
                <button type="submit" className="mt-1 p-2 bg-violet-50 text-violet-700 hover:bg-violet-100 rounded">
                  Upload
                </button>
                <button type="submit" 
                      className="relative mt-1 p-2 bg-violet-50 
                                text-violet-700 hover:bg-violet-100 rounded 
                                  flex items-center focus:ring-4 focus:outline-none 
                                  focus:ring-blue-300 group"
                                  onClick={() => downloadTemplate('/templates/UPS/UPS Import Rates - over 5Kg (Template).xlsx','UPS Import Rates - over 5Kg (Template).xlsx')}>
                <i className="fas fa-download m-1" aria-hidden="true"></i>
                
                <span className="absolute left-20 transform -translate-x-8 bottom-0 
                                  mb-1 px-3 py-2 bg-black bg-opacity-80 w-40 
                                  text-white text-sm rounded opacity-0 
                                  transition-opacity duration-300 
                                  group-hover:opacity-100">
                  Download Template
                </span>
                
              </button>
              </div>
            </form>
          </div>
        );

        case 'Import Rates Over Seventy':
          return(
            <div>
              <form onSubmit={handleSubmitUPSImportsOverSeventy}>
                <h1 className="mt-4 font-semibold">Over 70Kg Packages</h1>
                <div className='flex items-center space-x-4'>
                  <input
                    className="block w-full text-sm text-slate-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                  file:bg-violet-50 file:text-violet-700
                  hover:file:bg-violet-100"
                    type="file"
                    onChange={handleFileChange}
                    accept=".xlsx, .xls"
                    ref={fileInputRef}
                  />
                  <button type="submit" className="mt-1 p-2 bg-violet-50 text-violet-700 hover:bg-violet-100 rounded">
                    Upload
                  </button>
                  <button type="submit" 
                      className="relative mt-1 p-2 bg-violet-50 
                                text-violet-700 hover:bg-violet-100 rounded 
                                  flex items-center focus:ring-4 focus:outline-none 
                                  focus:ring-blue-300 group"
                                  onClick={() => downloadTemplate('/templates/UPS/UPS Import Rates - over 70Kg (Template).xlsx','UPS Import Rates - over 70Kg (Template).xlsx')}>
                <i className="fas fa-download m-1" aria-hidden="true"></i>
                
                <span className="absolute left-20 transform -translate-x-8 bottom-0 
                                  mb-1 px-3 py-2 bg-black bg-opacity-80 w-40 
                                  text-white text-sm rounded opacity-0 
                                  transition-opacity duration-300 
                                  group-hover:opacity-100">
                  Download Template
                </span>
                
              </button>
                </div>
              </form>
            </div>
          );

      case 'DHL':
        return (
        //file upload space for DHL rates
  
            
        <div>
        {/* DHL zones */}
        <form onSubmit={handleSubmitDHLZones}>
                <h1 className="font-semibold">DHL Zones</h1>
                <div className='flex items-center space-x-4'>
                <input
                  // className="text-black p-1 pt-2 rounded border border-black"
                  type="file"
                  onChange={handleFileChange}
                  accept=".xlsx, .xls"
                  ref={fileInputRef}
                  class="block w-full text-sm text-slate-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                      file:bg-violet-50 file:text-violet-700
                      hover:file:bg-violet-100"
                />
                <button type="submit" className="mt-1 p-2 bg-violet-50 text-violet-700 hover:bg-violet-100 rounded">
                  Upload
                </button>
                <button type="submit" 
                      className="relative mt-1 p-2 bg-violet-50 
                                text-violet-700 hover:bg-violet-100 rounded 
                                  flex items-center focus:ring-4 focus:outline-none 
                                  focus:ring-blue-300 group"
                                  onClick={() => downloadTemplate('/templates/DHL/DHL Country_Zones(Template).xlsx','DHL Country_Zones(Template).xlsx')}>
                <i className="fas fa-download m-1" aria-hidden="true"></i>
                
                <span className="absolute left-20 transform -translate-x-8 bottom-0 
                                  mb-1 px-3 py-2 bg-black bg-opacity-80 w-40 
                                  text-white text-sm rounded opacity-0 
                                  transition-opacity duration-300 
                                  group-hover:opacity-100">
                  Download Template
                </span>
                
              </button>
                </div>
              </form>
  
              {/* dhl export rates */}
              <form>
                <h1 className="mt-4 font-semibold">DHL Export Rates</h1>
    
                <select className="
                    text-black 
                      p-2 
                      border-violet-700 
                      bg-violet-50 
                      focus:border-violet-700 
                      focus:bg-violet-60 
                      transition-colors 
                      duration-100 
                      ease-in-out"
                    defaultValue=""
                    onChange={handleSelectChange}
                >
                  <option value="" disabled>--select--</option>
                  <option value="DHL Exports Documents upto 2Kg">Documents upto 2Kg</option>
                  <option value="DHL Exports Non documents from 0.5Kg & documents from 2.5Kg">Non documents from 0.5Kg & documents from 2.5Kg</option>
                  <option value="DHL Exports Over 30.1Kg">Over 30.1Kg</option>
                </select>
              </form>
  
  
              {/* dhl e-commerce rates */}
              <form>
                <h1 className="mt-4 font-semibold">DHL E-commerce Rates</h1>
                <select
                  className="
                    text-black 
                    p-2 
                    border-violet-700 
                    bg-violet-50 
                    focus:border-violet-700 
                    focus:bg-violet-60 
                    transition-colors 
                    duration-100 
                    ease-in-out"
                  defaultValue=""
                  onChange={handleSelectChange}>
                    <option value="" disabled>--select--</option>
                    <option value="DHL E-Com Exports Over 0.5Kg">Non-documents & Documents from 0.5 Kg</option>
                    <option value="DHL E-Com Exports Over 30Kg">Over 30.1Kg Packages</option>
                  </select><br />
                {/* <input className="text-black p-1 rounded border border-black" type="file" />
                <button type="submit" className="ml-2 mt-1 p-2 bg-green-500 text-white rounded">Upload</button> */}
              </form>
  
              {/* dhl import rates */}
              <form>
                <h1 className="mt-4 font-semibold">DHL Import Rates</h1>
                <select
                  className="
                    text-black 
                    p-2 
                    border-violet-700 
                    bg-violet-50 
                    focus:border-violet-700 
                    focus:bg-violet-60 
                    transition-colors 
                    duration-100 
                    ease-in-out"
                  defaultValue=""
                  onChange={handleSelectChange}>
              <option value="" disabled>--select--</option>
              <option value="DHL Import Rates Upto 2Kg">Documents up to 2.0 Kg</option>
              <option value="DHL Import Rates Over 2Kg">Non-documents from 0.5 Kg & Documents from 2.5 Kg</option>
              <option value="DHL Import Rates over 30Kg">Packages over 30Kg</option>
            </select><br />
              </form>

              {/* dhl Fuel Cost */}
              <div>
              <h1 className="mt-4 font-semibold">DHL Fuel cost (%)</h1>
              <input
                  type="number"
                  value={currentDHLFuelRate}
                  disabled="true"
                  className="text-black 
                    w-[175px]
                    mr-2
                    p-2 
                    border-violet-700 
                    bg-violet-50 
                    focus:border-violet-700 
                    focus:bg-violet-60 
                    transition-colors "
                />
                <input
                  type="number"
                  value={fuelCost}
                  onChange={handleInputChange}
                  className="text-black 
                    p-2 
                    w-[175px]
                    border-violet-700 
                    bg-violet-50 
                    focus:border-violet-700 
                    focus:bg-violet-60 
                    transition-colors "
                />
                <button onClick={handleDHLFuelCostChange} className="mt-1 ml-3 p-2 bg-violet-50 text-violet-700 hover:bg-violet-100 rounded">
                  Set Value
                </button>
              </div>
            </div>
          );

        case 'DHL Exports Documents upto 2Kg':
            return(
              <div>
                <form onSubmit={handleSubmitDHLExportsUptoTwo}>
                  <h1 className="mt-4 font-semibold">Documents up to 2.0 KG</h1>
                  <div className='flex items-center space-x-4'>
                    <input
                      className="block w-full text-sm text-slate-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                    file:bg-violet-50 file:text-violet-700
                    hover:file:bg-violet-100"
                      type="file"
                      onChange={handleFileChange}
                      accept=".xlsx, .xls"
                      ref={fileInputRef}
                    />
                    <button type="submit" className="mt-1 p-2 bg-violet-50 text-violet-700 hover:bg-violet-100 rounded">
                      Upload
                    </button>
                    <button type="submit" 
                      className="relative mt-1 p-2 bg-violet-50 
                                text-violet-700 hover:bg-violet-100 rounded 
                                  flex items-center focus:ring-4 focus:outline-none 
                                  focus:ring-blue-300 group"
                                  onClick={() => downloadTemplate('/templates/DHL/DHL Export Rates - upto 2Kg (Template).xlsx','DHL Export Rates - upto 2Kg (Template).xlsx')}>
                <i className="fas fa-download m-1" aria-hidden="true"></i>
                
                <span className="absolute left-20 transform -translate-x-8 bottom-0 
                                  mb-1 px-3 py-2 bg-black bg-opacity-80 w-40 
                                  text-white text-sm rounded opacity-0 
                                  transition-opacity duration-300 
                                  group-hover:opacity-100">
                  Download Template
                </span>
                
              </button>
                  </div>
                </form>
              </div>
            );

        case 'DHL Exports Non documents from 0.5Kg & documents from 2.5Kg':
              return(
                <div>
                  <form onSubmit={handleSubmitDHLExportsOverTwo}>
                    <h1 className="mt-4 font-semibold">DHL Exports Non documents from 0.5Kg & documents from 2.5Kg</h1>
                    <div className='flex items-center space-x-4'>
                      <input
                        className="block w-full text-sm text-slate-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                      file:bg-violet-50 file:text-violet-700
                      hover:file:bg-violet-100"
                        type="file"
                        onChange={handleFileChange}
                        accept=".xlsx, .xls"
                        ref={fileInputRef}
                      />
                      <button type="submit" className="mt-1 p-2 bg-violet-50 text-violet-700 hover:bg-violet-100 rounded">
                        Upload
                      </button>
                      <button type="submit" 
                        className="relative mt-1 p-2 bg-violet-50 
                                text-violet-700 hover:bg-violet-100 rounded 
                                  flex items-center focus:ring-4 focus:outline-none 
                                  focus:ring-blue-300 group"
                                  onClick={() => downloadTemplate('/templates/DHL/DHL Export Rates - over 2Kg (Template).xlsx','DHL Export Rates - over 2Kg (Template).xlsx')}>
                        <i className="fas fa-download m-1" aria-hidden="true"></i>
                
                        <span className="absolute left-20 transform -translate-x-8 bottom-0 
                                  mb-1 px-3 py-2 bg-black bg-opacity-80 w-40 
                                  text-white text-sm rounded opacity-0 
                                  transition-opacity duration-300 
                                  group-hover:opacity-100">
                          Download Template
                        </span>
                
                      </button>
                    </div>
                  </form>
                </div>
              );
        
        case 'DHL Exports Over 30.1Kg':
                return(
                  <div>
                    <form onSubmit={handleSubmitDHLExportsOverThirty}>
                      <h1 className="mt-4 font-semibold">DHL Exports over 30Kg</h1>
                      <div className='flex items-center space-x-4'>
                        <input
                          className="block w-full text-sm text-slate-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                        file:bg-violet-50 file:text-violet-700
                        hover:file:bg-violet-100"
                          type="file"
                          onChange={handleFileChange}
                          accept=".xlsx, .xls"
                          ref={fileInputRef}
                        />
                        <button type="submit" className="mt-1 p-2 bg-violet-50 text-violet-700 hover:bg-violet-100 rounded">
                          Upload
                        </button>
                        <button type="submit" 
                        className="relative mt-1 p-2 bg-violet-50 
                                text-violet-700 hover:bg-violet-100 rounded 
                                  flex items-center focus:ring-4 focus:outline-none 
                                  focus:ring-blue-300 group"
                                  onClick={() => downloadTemplate('/templates/DHL/DHL Export Rates - over 30Kg (Template).xlsx','DHL Export Rates - over 30Kg (Template).xlsx')}>
                        <i className="fas fa-download m-1" aria-hidden="true"></i>
                
                        <span className="absolute left-20 transform -translate-x-8 bottom-0 
                                  mb-1 px-3 py-2 bg-black bg-opacity-80 w-40 
                                  text-white text-sm rounded opacity-0 
                                  transition-opacity duration-300 
                                  group-hover:opacity-100">
                          Download Template
                        </span>
                
                      </button>
                      </div>
                    </form>
                  </div>
                );

        case 'DHL E-Com Exports Over 0.5Kg':
                  return(
                    <div>
                      <form onSubmit={handleSubmitDHLEComExportsOverPointFive}>
                        <h1 className="mt-4 font-semibold">Non-documents & Documents from 0.5 Kg</h1>
                        <div className='flex items-center space-x-4'>
                          <input
                            className="block w-full text-sm text-slate-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                          file:bg-violet-50 file:text-violet-700
                          hover:file:bg-violet-100"
                            type="file"
                            onChange={handleFileChange}
                            accept=".xlsx, .xls"
                            ref={fileInputRef}
                          />
                          <button type="submit" className="mt-1 p-2 bg-violet-50 text-violet-700 hover:bg-violet-100 rounded">
                            Upload
                          </button>
                          <button type="submit" 
                            className="relative mt-1 p-2 bg-violet-50 
                                text-violet-700 hover:bg-violet-100 rounded 
                                  flex items-center focus:ring-4 focus:outline-none 
                                  focus:ring-blue-300 group"
                                  onClick={() => downloadTemplate('/templates/DHL/DHL E-Com Export Rates - over 0.5Kg (Template).xlsx','DHL E-Com Export Rates - over 0.5Kg (Template).xlsx')}>
                            <i className="fas fa-download m-1" aria-hidden="true"></i>
                
                            <span className="absolute left-20 transform -translate-x-8 bottom-0 
                                  mb-1 px-3 py-2 bg-black bg-opacity-80 w-40 
                                  text-white text-sm rounded opacity-0 
                                  transition-opacity duration-300 
                                  group-hover:opacity-100">
                              Download Template
                            </span>
                
                          </button>
                        </div>
                      </form>
                    </div>
                  );

        case 'DHL E-Com Exports Over 30Kg':
                    return(
                      <div>
                        <form onSubmit={handleSubmitDHLEComExportsOverThirty}>
                          <h1 className="mt-4 font-semibold">DHL E-Commerce Exports over 30Kg</h1>
                          <div className='flex items-center space-x-4'>
                            <input
                              className="block w-full text-sm text-slate-500
                              file:mr-4 file:py-2 file:px-4
                              file:rounded-full file:border-0
                              file:text-sm file:font-semibold
                            file:bg-violet-50 file:text-violet-700
                            hover:file:bg-violet-100"
                              type="file"
                              onChange={handleFileChange}
                              accept=".xlsx, .xls"
                              ref={fileInputRef}
                            />
                            <button type="submit" className="mt-1 p-2 bg-violet-50 text-violet-700 hover:bg-violet-100 rounded">
                              Upload
                            </button>
                            <button type="submit" 
                            className="relative mt-1 p-2 bg-violet-50 
                                text-violet-700 hover:bg-violet-100 rounded 
                                  flex items-center focus:ring-4 focus:outline-none 
                                  focus:ring-blue-300 group"
                                  onClick={() => downloadTemplate('/templates/DHL/DHL E-Com Export Rates - over 30Kg (Template).xlsx','DHL E-Com Export Rates - over 30Kg (Template).xlsx')}>
                            <i className="fas fa-download m-1" aria-hidden="true"></i>
                
                            <span className="absolute left-20 transform -translate-x-8 bottom-0 
                                  mb-1 px-3 py-2 bg-black bg-opacity-80 w-40 
                                  text-white text-sm rounded opacity-0 
                                  transition-opacity duration-300 
                                  group-hover:opacity-100">
                              Download Template
                            </span>
                
                          </button>
                          </div>
                        </form>
                      </div>
                    );

        case 'DHL Import Rates Upto 2Kg':
            return(
              <div>
                <form onSubmit={handleSubmitDHLImportsUptoTwo}>
                  <h1 className="mt-4 font-semibold">Documents up to 2.0 Kg</h1>
                  <div className='flex items-center space-x-4'>
                    <input
                      className="block w-full text-sm text-slate-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                    file:bg-violet-50 file:text-violet-700
                    hover:file:bg-violet-100"
                      type="file"
                      onChange={handleFileChange}
                      accept=".xlsx, .xls"
                      ref={fileInputRef}
                    />
                    <button type="submit" className="mt-1 p-2 bg-violet-50 text-violet-700 hover:bg-violet-100 rounded">
                      Upload
                    </button>
                    <button type="submit" 
                            className="relative mt-1 p-2 bg-violet-50 
                                text-violet-700 hover:bg-violet-100 rounded 
                                  flex items-center focus:ring-4 focus:outline-none 
                                  focus:ring-blue-300 group"
                                  onClick={() => downloadTemplate('/templates/DHL/DHL Import Rates - upto 2Kg (Template).xlsx','DHL Import Rates - upto 2Kg (Template).xlsx')}>
                            <i className="fas fa-download m-1" aria-hidden="true"></i>
                
                            <span className="absolute left-20 transform -translate-x-8 bottom-0 
                                  mb-1 px-3 py-2 bg-black bg-opacity-80 w-40 
                                  text-white text-sm rounded opacity-0 
                                  transition-opacity duration-300 
                                  group-hover:opacity-100">
                              Download Template
                            </span>
                
                    </button>
                  </div>
                </form>
              </div>
            );

        case 'DHL Import Rates Over 2Kg':
              return(
                <div>
                  <form onSubmit={handleSubmitDHLImportsOverTwo}>
                    <h1 className="mt-4 font-semibold">Non-documents from 0.5 Kg & Documents from 2.5 Kg</h1>
                    <div className='flex items-center space-x-4'>
                      <input
                        className="block w-full text-sm text-slate-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                      file:bg-violet-50 file:text-violet-700
                      hover:file:bg-violet-100"
                        type="file"
                        onChange={handleFileChange}
                        accept=".xlsx, .xls"
                        ref={fileInputRef}
                      />
                      <button type="submit" className="mt-1 p-2 bg-violet-50 text-violet-700 hover:bg-violet-100 rounded">
                        Upload
                      </button>
                      <button type="submit" 
                            className="relative mt-1 p-2 bg-violet-50 
                                text-violet-700 hover:bg-violet-100 rounded 
                                  flex items-center focus:ring-4 focus:outline-none 
                                  focus:ring-blue-300 group"
                                  onClick={() => downloadTemplate('/templates/DHL/DHL Import Rates - over 2Kg (Template).xlsx','DHL Import Rates - over 2Kg (Template).xlsx')}>
                            <i className="fas fa-download m-1" aria-hidden="true"></i>
                
                            <span className="absolute left-20 transform -translate-x-8 bottom-0 
                                  mb-1 px-3 py-2 bg-black bg-opacity-80 w-40 
                                  text-white text-sm rounded opacity-0 
                                  transition-opacity duration-300 
                                  group-hover:opacity-100">
                              Download Template
                            </span>
                
                      </button>
                    </div>
                  </form>
                </div>
              );

        case 'DHL Import Rates over 30Kg':
                return(
                  <div>
                    <form onSubmit={handleSubmitDHLImportsOverThirty}>
                      <h1 className="mt-4 font-semibold">DHL Imports over 30Kg</h1>
                      <div className='flex items-center space-x-4'>
                        <input
                          className="block w-full text-sm text-slate-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                        file:bg-violet-50 file:text-violet-700
                        hover:file:bg-violet-100"
                          type="file"
                          onChange={handleFileChange}
                          accept=".xlsx, .xls"
                          ref={fileInputRef}
                        />
                        <button type="submit" className="mt-1 p-2 bg-violet-50 text-violet-700 hover:bg-violet-100 rounded">
                          Upload
                        </button>
                        <button type="submit" 
                            className="relative mt-1 p-2 bg-violet-50 
                                text-violet-700 hover:bg-violet-100 rounded 
                                  flex items-center focus:ring-4 focus:outline-none 
                                  focus:ring-blue-300 group"
                                  onClick={() => downloadTemplate('/templates/DHL/DHL Import Rates - over 30Kg (Template).xlsx','DHL Import Rates - over 30Kg (Template).xlsx')}>
                            <i className="fas fa-download m-1" aria-hidden="true"></i>
                
                            <span className="absolute left-20 transform -translate-x-8 bottom-0 
                                  mb-1 px-3 py-2 bg-black bg-opacity-80 w-40 
                                  text-white text-sm rounded opacity-0 
                                  transition-opacity duration-300 
                                  group-hover:opacity-100">
                              Download Template
                            </span>
                
                      </button>
                      </div>
                    </form>
                  </div>
                );

      case 'FeDex':
                  return (
                  //file upload space for DHL rates
            
                      
                  <div>
                  {/* FeDex zones */}
                  <form onSubmit={handleSubmitFedexZones}>
                          <h1 className="font-semibold">FeDex Zones</h1>
                          <div className='flex items-center space-x-4'>
                          <input
                            // className="text-black p-1 pt-2 rounded border border-black"
                            type="file"
                            onChange={handleFileChange}
                            accept=".xlsx, .xls"
                            ref={fileInputRef}
                            class="block w-full text-sm text-slate-500
                                  file:mr-4 file:py-2 file:px-4
                                  file:rounded-full file:border-0
                                  file:text-sm file:font-semibold
                                file:bg-violet-50 file:text-violet-700
                                hover:file:bg-violet-100"
                          />
                          <button type="submit" className="mt-1 p-2 bg-violet-50 text-violet-700 hover:bg-violet-100 rounded">
                            Upload
                          </button>
                          <button type="submit" 
                            className="relative mt-1 p-2 bg-violet-50 
                                text-violet-700 hover:bg-violet-100 rounded 
                                  flex items-center focus:ring-4 focus:outline-none 
                                  focus:ring-blue-300 group"
                                  onClick={() => downloadTemplate('/templates/Fedex/FeDex Country_Zones(Template).xlsx','FeDex Country_Zones(Template).xlsx')}>
                            <i className="fas fa-download m-1" aria-hidden="true"></i>
                
                            <span className="absolute left-20 transform -translate-x-8 bottom-0 
                                  mb-1 px-3 py-2 bg-black bg-opacity-80 w-40 
                                  text-white text-sm rounded opacity-0 
                                  transition-opacity duration-300 
                                  group-hover:opacity-100">
                              Download Template
                            </span>
                
                      </button>
                          </div>
                        </form>
            
                        {/* fedex export rates */}
                        <form>
                          <h1 className="mt-4 font-semibold">Fedex Export Rates</h1>
              
                          <select className="
                              text-black 
                                p-2 
                                border-violet-700 
                                bg-violet-50 
                                focus:border-violet-700 
                                focus:bg-violet-60 
                                transition-colors 
                                duration-100 
                                ease-in-out"
                              defaultValue=""
                              onChange={handleSelectChange}
                          >
                            <option value="" disabled>--select--</option>
                            <option value="Fedex Exports Document">FeDex Export Document</option>
                            <option value="Fedex Exports Package">FeDex Export Package</option>
                            <option value="Fedex Exports Sample">FeDex Export Sample</option>
                          </select>
                        </form>
            
            
                        {/* fedex e-commerce rates */}
                        <form>
                          <h1 className="mt-4 font-semibold">FeDex E-commerce Rates</h1>
                          <select
                            className="
                              text-black 
                              p-2 
                              border-violet-700 
                              bg-violet-50 
                              focus:border-violet-700 
                              focus:bg-violet-60 
                              transition-colors 
                              duration-100 
                              ease-in-out"
                            defaultValue=""
                            onChange={handleSelectChange}>
                              <option value="" disabled>--select--</option>
                              <option value="Fedex E-Com Document">E-Commerce Document</option>
                              <option value="Fedex E-Com Package">E-Commerce Package</option>
                              <option value="Fedex E-Com Sample">E-Commerce Sample</option>
                            </select><br />
                        </form>
            
                        {/* fedex import rates */}
                        <form>
                          <h1 className="mt-4 font-semibold">FeDex Import Rates</h1>
                          <select
                            className="
                              text-black 
                              p-2 
                              border-violet-700 
                              bg-violet-50 
                              focus:border-violet-700 
                              focus:bg-violet-60 
                              transition-colors 
                              duration-100 
                              ease-in-out"
                            defaultValue=""
                            onChange={handleSelectChange}>
                        <option value="" disabled>--select--</option>
                        <option value="Fedex Imports Document">FeDex Import Document</option>
                        <option value="Fedex Imports Package">FeDex Import Package</option>
                        <option value="Fedex Imports Sample">FeDex Import Sample</option>
                        <option value="Fedex Imports Over 30Kg">FeDex Import Over 30Kg</option>
                      </select><br />
                        </form>

                        {/* fedex Fuel Cost */}
                        <div>
              <h1 className="mt-4 font-semibold">FeDex Fuel cost (%)</h1>
              <input
                  type="number"
                  value={currentFedexFuelRate}
                  disabled="true"
                  className="text-black 
                    w-[175px]
                    mr-2
                    p-2 
                    border-violet-700 
                    bg-violet-50 
                    focus:border-violet-700 
                    focus:bg-violet-60 
                    transition-colors "
                />
                <input
                  type="number"
                  value={fuelCost}
                  onChange={handleInputChange}
                  className="text-black 
                    p-2 
                    w-[175px]
                    border-violet-700 
                    bg-violet-50 
                    focus:border-violet-700 
                    focus:bg-violet-60 
                    transition-colors "
                />
                <button onClick={handleFedexFuelCostChange} className="mt-1 ml-3 p-2 bg-violet-50 text-violet-700 hover:bg-violet-100 rounded">
                  Set Value
                </button>
                        </div>
                      </div>
                    );

        case 'Fedex Exports Document':
                      return(
                        <div>
                          <form onSubmit={handleSubmitFedexExportsDocument}>
                            <h1 className="mt-4 font-semibold">FeDex Export Document</h1>
                            <div className='flex items-center space-x-4'>
                              <input
                                className="block w-full text-sm text-slate-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                              file:bg-violet-50 file:text-violet-700
                              hover:file:bg-violet-100"
                                type="file"
                                onChange={handleFileChange}
                                accept=".xlsx, .xls"
                                ref={fileInputRef}
                              />
                              <button type="submit" className="mt-1 p-2 bg-violet-50 text-violet-700 hover:bg-violet-100 rounded">
                                Upload
                              </button>
                              <button type="submit" 
                                  className="relative mt-1 p-2 bg-violet-50 
                                        text-violet-700 hover:bg-violet-100 rounded 
                                        flex items-center focus:ring-4 focus:outline-none 
                                        focus:ring-blue-300 group"
                                        onClick={() => downloadTemplate('/templates/Fedex/Fedex Export Rates - Document (Template).xlsx','Fedex Export Rates - Document (Template).xlsx')}>
                                  <i className="fas fa-download m-1" aria-hidden="true"></i>
                
                                  <span className="absolute left-20 transform -translate-x-8 bottom-0 
                                        mb-1 px-3 py-2 bg-black bg-opacity-80 w-40 
                                        text-white text-sm rounded opacity-0 
                                        transition-opacity duration-300 
                                        group-hover:opacity-100">
                                    Download Template
                                  </span>
                
                              </button>
                            </div>
                          </form>
                        </div>
                      );

        case 'Fedex Exports Package':
                        return(
                          <div>
                            <form onSubmit={handleSubmitFedexExportsPackage}>
                              <h1 className="mt-4 font-semibold">FeDex Export Package</h1>
                              <div className='flex items-center space-x-4'>
                                <input
                                  className="block w-full text-sm text-slate-500
                                  file:mr-4 file:py-2 file:px-4
                                  file:rounded-full file:border-0
                                  file:text-sm file:font-semibold
                                file:bg-violet-50 file:text-violet-700
                                hover:file:bg-violet-100"
                                  type="file"
                                  onChange={handleFileChange}
                                  accept=".xlsx, .xls"
                                  ref={fileInputRef}
                                />
                                <button type="submit" className="mt-1 p-2 bg-violet-50 text-violet-700 hover:bg-violet-100 rounded">
                                  Upload
                                </button>
                                <button type="submit" 
                                  className="relative mt-1 p-2 bg-violet-50 
                                        text-violet-700 hover:bg-violet-100 rounded 
                                        flex items-center focus:ring-4 focus:outline-none 
                                        focus:ring-blue-300 group"
                                        onClick={() => downloadTemplate('/templates/Fedex/Fedex Export Rates - Package (Template).xlsx','Fedex Export Rates - Package (Template).xlsx')}>
                                  <i className="fas fa-download m-1" aria-hidden="true"></i>
                
                                  <span className="absolute left-20 transform -translate-x-8 bottom-0 
                                        mb-1 px-3 py-2 bg-black bg-opacity-80 w-40 
                                        text-white text-sm rounded opacity-0 
                                        transition-opacity duration-300 
                                        group-hover:opacity-100">
                                    Download Template
                                  </span>
                
                                </button>
                              </div>
                            </form>
                          </div>
                        );

        case 'Fedex Exports Sample':
                          return(
                            <div>
                              <form onSubmit={handleSubmitFedexExportsSample}>
                                <h1 className="mt-4 font-semibold">FeDex Export Sample</h1>
                                <div className='flex items-center space-x-4'>
                                  <input
                                    className="block w-full text-sm text-slate-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                  file:bg-violet-50 file:text-violet-700
                                  hover:file:bg-violet-100"
                                    type="file"
                                    onChange={handleFileChange}
                                    accept=".xlsx, .xls"
                                    ref={fileInputRef}
                                  />
                                  <button type="submit" className="mt-1 p-2 bg-violet-50 text-violet-700 hover:bg-violet-100 rounded">
                                    Upload
                                  </button>
                                  <button type="submit" 
                                  className="relative mt-1 p-2 bg-violet-50 
                                        text-violet-700 hover:bg-violet-100 rounded 
                                        flex items-center focus:ring-4 focus:outline-none 
                                        focus:ring-blue-300 group"
                                        onClick={() => downloadTemplate('/templates/Fedex/Fedex Export Rates - Sample (Template).xlsx','Fedex Export Rates - Sample (Template).xlsx')}>
                                  <i className="fas fa-download m-1" aria-hidden="true"></i>
                
                                  <span className="absolute left-20 transform -translate-x-8 bottom-0 
                                        mb-1 px-3 py-2 bg-black bg-opacity-80 w-40 
                                        text-white text-sm rounded opacity-0 
                                        transition-opacity duration-300 
                                        group-hover:opacity-100">
                                    Download Template
                                  </span>
                
                                </button>
                                </div>
                              </form>
                            </div>
                          );

        case 'Fedex E-Com Document':
                            return(
                              <div>
                                <form onSubmit={handleSubmitFedexEComExportsDocument}>
                                  <h1 className="mt-4 font-semibold">FeDex E-commerce Export Document</h1>
                                  <div className='flex items-center space-x-4'>
                                    <input
                                      className="block w-full text-sm text-slate-500
                                      file:mr-4 file:py-2 file:px-4
                                      file:rounded-full file:border-0
                                      file:text-sm file:font-semibold
                                    file:bg-violet-50 file:text-violet-700
                                    hover:file:bg-violet-100"
                                      type="file"
                                      onChange={handleFileChange}
                                      accept=".xlsx, .xls"
                                      ref={fileInputRef}
                                    />
                                    <button type="submit" className="mt-1 p-2 bg-violet-50 text-violet-700 hover:bg-violet-100 rounded">
                                      Upload
                                    </button>
                                    <button type="submit" 
                                      className="relative mt-1 p-2 bg-violet-50 
                                            text-violet-700 hover:bg-violet-100 rounded 
                                            flex items-center focus:ring-4 focus:outline-none 
                                            focus:ring-blue-300 group"
                                            onClick={() => downloadTemplate('/templates/Fedex/Fedex E-Com Export Rates - Document (Template).xlsx','Fedex E-Com Export Rates - Document (Template).xlsx')}>
                                      <i className="fas fa-download m-1" aria-hidden="true"></i>
                
                                      <span className="absolute left-20 transform -translate-x-8 bottom-0 
                                            mb-1 px-3 py-2 bg-black bg-opacity-80 w-40 
                                            text-white text-sm rounded opacity-0 
                                            transition-opacity duration-300 
                                            group-hover:opacity-100">
                                        Download Template
                                      </span>
                
                                    </button>
                                  </div>
                                </form>
                              </div>
                            );

        case 'Fedex E-Com Package':
                              return(
                                <div>
                                  <form onSubmit={handleSubmitFedexEComExportsPackage}>
                                    <h1 className="mt-4 font-semibold">FeDex E-Commerce Export Package</h1>
                                    <div className='flex items-center space-x-4'>
                                      <input
                                        className="block w-full text-sm text-slate-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-full file:border-0
                                        file:text-sm file:font-semibold
                                      file:bg-violet-50 file:text-violet-700
                                      hover:file:bg-violet-100"
                                        type="file"
                                        onChange={handleFileChange}
                                        accept=".xlsx, .xls"
                                        ref={fileInputRef}
                                      />
                                      <button type="submit" className="mt-1 p-2 bg-violet-50 text-violet-700 hover:bg-violet-100 rounded">
                                        Upload
                                      </button>
                                      <button type="submit" 
                                      className="relative mt-1 p-2 bg-violet-50 
                                            text-violet-700 hover:bg-violet-100 rounded 
                                            flex items-center focus:ring-4 focus:outline-none 
                                            focus:ring-blue-300 group"
                                            onClick={() => downloadTemplate('/templates/Fedex/Fedex E-Com Export Rates - Package (Template).xlsx','Fedex E-Com Export Rates - Package (Template).xlsx')}>
                                      <i className="fas fa-download m-1" aria-hidden="true"></i>
                
                                      <span className="absolute left-20 transform -translate-x-8 bottom-0 
                                            mb-1 px-3 py-2 bg-black bg-opacity-80 w-40 
                                            text-white text-sm rounded opacity-0 
                                            transition-opacity duration-300 
                                            group-hover:opacity-100">
                                        Download Template
                                      </span>
                
                                    </button>
                                    </div>
                                  </form>
                                </div>
                              );

        case 'Fedex E-Com Sample':
                                return(
                                  <div>
                                    <form onSubmit={handleSubmitFedexEComExportsSample}>
                                      <h1 className="mt-4 font-semibold">FeDex E-Commerce Export Sample</h1>
                                      <div className='flex items-center space-x-4'>
                                        <input
                                          className="block w-full text-sm text-slate-500
                                          file:mr-4 file:py-2 file:px-4
                                          file:rounded-full file:border-0
                                          file:text-sm file:font-semibold
                                        file:bg-violet-50 file:text-violet-700
                                        hover:file:bg-violet-100"
                                          type="file"
                                          onChange={handleFileChange}
                                          accept=".xlsx, .xls"
                                          ref={fileInputRef}
                                        />
                                        <button type="submit" className="mt-1 p-2 bg-violet-50 text-violet-700 hover:bg-violet-100 rounded">
                                          Upload
                                        </button>
                                        <button type="submit" 
                                          className="relative mt-1 p-2 bg-violet-50 
                                            text-violet-700 hover:bg-violet-100 rounded 
                                            flex items-center focus:ring-4 focus:outline-none 
                                            focus:ring-blue-300 group"
                                            onClick={() => downloadTemplate('/templates/Fedex/Fedex E-Com Export Rates - Sample (Template).xlsx','Fedex E-Com Export Rates - Sample (Template).xlsx')}>
                                          <i className="fas fa-download m-1" aria-hidden="true"></i>
                
                                          <span className="absolute left-20 transform -translate-x-8 bottom-0 
                                            mb-1 px-3 py-2 bg-black bg-opacity-80 w-40 
                                            text-white text-sm rounded opacity-0 
                                            transition-opacity duration-300 
                                            group-hover:opacity-100">
                                              Download Template
                                          </span>
                
                                        </button>
                                      </div>
                                    </form>
                                  </div>
                                );

        case 'Fedex Imports Document':
                                  return(
                                    <div>
                                      <form onSubmit={handleSubmitFedexImportsDocument}>
                                        <h1 className="mt-4 font-semibold">FeDex Import Document</h1>
                                        <div className='flex items-center space-x-4'>
                                          <input
                                            className="block w-full text-sm text-slate-500
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-full file:border-0
                                            file:text-sm file:font-semibold
                                          file:bg-violet-50 file:text-violet-700
                                          hover:file:bg-violet-100"
                                            type="file"
                                            onChange={handleFileChange}
                                            accept=".xlsx, .xls"
                                            ref={fileInputRef}
                                          />
                                          <button type="submit" className="mt-1 p-2 bg-violet-50 text-violet-700 hover:bg-violet-100 rounded">
                                            Upload
                                          </button>
                                          <button type="submit" 
                                          className="relative mt-1 p-2 bg-violet-50 
                                            text-violet-700 hover:bg-violet-100 rounded 
                                            flex items-center focus:ring-4 focus:outline-none 
                                            focus:ring-blue-300 group"
                                            onClick={() => downloadTemplate('/templates/Fedex/Fedex Import Rates - Document (Template).xlsx','Fedex Import Rates - Document (Template).xlsx')}>
                                          <i className="fas fa-download m-1" aria-hidden="true"></i>
                
                                          <span className="absolute left-20 transform -translate-x-8 bottom-0 
                                            mb-1 px-3 py-2 bg-black bg-opacity-80 w-40 
                                            text-white text-sm rounded opacity-0 
                                            transition-opacity duration-300 
                                            group-hover:opacity-100">
                                              Download Template
                                          </span>
                
                                        </button>
                                        </div>
                                      </form>
                                    </div>
                                  );

        case 'Fedex Imports Package':
            return(
              <div>
                <form onSubmit={handleSubmitFedexImportsPackage}>
                  <h1 className="mt-4 font-semibold">FeDex Import Package</h1>
                  <div className='flex items-center space-x-4'>
                    <input
                      className="block w-full text-sm text-slate-500
                                  file:mr-4 file:py-2 file:px-4
                                  file:rounded-full file:border-0
                                  file:text-sm file:font-semibold
                                  file:bg-violet-50 file:text-violet-700
                                  hover:file:bg-violet-100"
                      type="file"
                      onChange={handleFileChange}
                      accept=".xlsx, .xls"
                      ref={fileInputRef}
                    />
                    <button type="submit" className="mt-1 p-2 bg-violet-50 text-violet-700 hover:bg-violet-100 rounded">
                      Upload
                    </button>
                    <button type="submit" 
                      className="relative mt-1 p-2 bg-violet-50 
                                            text-violet-700 hover:bg-violet-100 rounded 
                                            flex items-center focus:ring-4 focus:outline-none 
                                            focus:ring-blue-300 group"
                        onClick={() => downloadTemplate('/templates/Fedex/Fedex Import Rates - Package (Template).xlsx','Fedex Import Rates - Package (Template).xlsx')}>
                        <i className="fas fa-download m-1" aria-hidden="true"></i>
                
                        <span className="absolute left-20 transform -translate-x-8 bottom-0 
                                            mb-1 px-3 py-2 bg-black bg-opacity-80 w-40 
                                            text-white text-sm rounded opacity-0 
                                            transition-opacity duration-300 
                                            group-hover:opacity-100">
                            Download Template
                        </span>
                
                    </button>
                  </div>
                </form>
              </div>
            );

        case 'Fedex Imports Sample':
              return(
                <div>
                  <form onSubmit={handleSubmitFedexImportsSample}>
                    <h1 className="mt-4 font-semibold">FeDex Import Sample</h1>
                    <div className='flex items-center space-x-4'>
                      <input
                        className="block w-full text-sm text-slate-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-violet-50 file:text-violet-700
                                    hover:file:bg-violet-100"
                        type="file"
                        onChange={handleFileChange}
                        accept=".xlsx, .xls"
                        ref={fileInputRef}
                      />
                      <button type="submit" className="mt-1 p-2 bg-violet-50 text-violet-700 hover:bg-violet-100 rounded">
                        Upload
                      </button>
                      <button type="submit" 
                      className="relative mt-1 p-2 bg-violet-50 
                                            text-violet-700 hover:bg-violet-100 rounded 
                                            flex items-center focus:ring-4 focus:outline-none 
                                            focus:ring-blue-300 group"
                        onClick={() => downloadTemplate('/templates/Fedex/Fedex Import Rates - Sample (Template).xlsx','Fedex Import Rates - Sample (Template).xlsx')}>
                        <i className="fas fa-download m-1" aria-hidden="true"></i>
                
                        <span className="absolute left-20 transform -translate-x-8 bottom-0 
                                            mb-1 px-3 py-2 bg-black bg-opacity-80 w-40 
                                            text-white text-sm rounded opacity-0 
                                            transition-opacity duration-300 
                                            group-hover:opacity-100">
                            Download Template
                        </span>
                
                    </button>
                    </div>
                  </form>
                </div>
              );

        case 'Fedex Imports Over 30Kg':
                return(
                  <div>
                    <form onSubmit={handleSubmitFedexImportsOverThirty}>
                      <h1 className="mt-4 font-semibold">FeDex Import Over 30Kg</h1>
                      <div className='flex items-center space-x-4'>
                        <input
                          className="block w-full text-sm text-slate-500
                                      file:mr-4 file:py-2 file:px-4
                                      file:rounded-full file:border-0
                                      file:text-sm file:font-semibold
                                      file:bg-violet-50 file:text-violet-700
                                      hover:file:bg-violet-100"
                          type="file"
                          onChange={handleFileChange}
                          accept=".xlsx, .xls"
                          ref={fileInputRef}
                        />
                        <button type="submit" className="mt-1 p-2 bg-violet-50 text-violet-700 hover:bg-violet-100 rounded">
                          Upload
                        </button>
                        <button type="submit" 
                          className="relative mt-1 p-2 bg-violet-50 
                                            text-violet-700 hover:bg-violet-100 rounded 
                                            flex items-center focus:ring-4 focus:outline-none 
                                            focus:ring-blue-300 group"
                            onClick={() => downloadTemplate('/templates/Fedex/Fedex Import Rates - Over 30Kg (Template).xlsx','Fedex Import Rates - Over 30Kg (Template).xlsx')}>
                            <i className="fas fa-download m-1" aria-hidden="true"></i>
                
                            <span className="absolute left-20 transform -translate-x-8 bottom-0 
                                            mb-1 px-3 py-2 bg-black bg-opacity-80 w-40 
                                            text-white text-sm rounded opacity-0 
                                            transition-opacity duration-300 
                                            group-hover:opacity-100">
                                Download Template
                            </span>
                
                    </button>
                      </div>
                    </form>
                  </div>
                );

      default:
        return null;
    }
  };

  return (

    <div className="flex flex-col justify-center items-center h-screen text-black pt-16">
      <div className="flex flex-col items-center space-y-4 bg-white bg-opacity-85 p-8 rounded-lg w-1/3">
        <div className=''>
        <h1 className='font-semibold'>Upload Excel Sheets</h1><br />
        <label className='font-semibold'>Service: &nbsp;</label>
          <select
            className="text-black 
            p-2 
            border-violet-700 
            bg-violet-50 
            focus:border-violet-700 
            focus:bg-violet-60 
            transition-colors 
            duration-100 
            ease-in-out"
            value={selectedOption}
            onChange={handleSelectChange}
          >
            <option value="" disabled>--select--</option>
            <option value="UPS">UPS</option>
            <option value="DHL">DHL</option>
            <option value="FeDex">FeDex</option>
          </select><br />
        </div>
  
      </div>

      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded shadow-md">
            {renderDialogContent()}

            <button className="mt-4 p-2 bg-red-50 hover:bg-red-100 text-red-700 rounded" onClick={handleCloseDialog}>
              Close
            </button>
          </div>
        </div>
      )}

      {showMessageDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded shadow-md">
            <h2 className="text-black font-semibold">Message</h2>
            <p className="text-black">{message}</p>
            <button className="mt-4 p-2 bg-blue-500 text-white rounded" onClick={() => setShowMessageDialog(false)}>
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default ExcelUpload;
