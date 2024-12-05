import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import PdfComponentTemp from './pdfComponent';
import { PDFViewer,pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import emailjs from 'emailjs-com';
import API_BASE_URL from './envirenment';

function Home() {
    const [selectedService, setSelectedService] = useState('');
    const [selectedRateType, setSelectedRateType] = useState('');
    const [countries, setCountries] = useState([]);
    const [specialCountries, setSpecialCountries] = useState([]);
    const [selectedZone, setSelectedZone] = useState('');
    const [selectedPType, setSelectedPType] = useState('');
    const [refNumber, setRefNumber] = useState('');
    const [weight, setWeight] = useState('');
    const [country, setCountry] = useState('');
    const [rate, setRate] = useState(null);
    const [ServiceProvider, setServiceProvider] = useState(null);
    const [SortedRateList, setSortedRateList] = useState([]);
    const [firstRow, setfirstRow] = useState(null);
    const [selectedRow, setSelectedRow] = useState('');
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showTable, setShowTable] = useState(false);
    const [totalActualWeight, setActualWeight] = useState(0);
    const [totalVolumetricWeight, setVolumetricWeight] = useState(0);
    const [showDialog, setShowDialog] = useState(false);
    const [allRows, setAllRows] = useState('');
    const currentDateTime = new Date();
    const date = currentDateTime.toISOString().split('T')[0];
    const time = currentDateTime.toTimeString().split(' ')[0].substring(0, 5); // HH:MM format
    const currentDate = `${date} ${time}`;
    const [showDialogForCheapest, setShowDialogForCheapest] = useState(false);
    const [showDialogForNonCheapest, setShowDialogForNonCheapest] = useState(false);
    const [heading, setHeading] = useState('')
    const [reason, setReason] = useState('');
    const emailRef = useRef(null);
    const [currentUPSFuelRate, setcurrentUPSFuelRate] = useState('')
    const [currentFedexFuelRate, setcurrentFedexFuelRate] = useState('')
    const [currentDHLFuelRate, setcurrentDHLFuelRate] = useState('')
    const [selectedServiceProvider, setSelectedServiceProvider] = useState(null);


    const handleServiceChange = async (event) => {
        const value = event.target.value;
        setSelectedService(value);
        setSelectedRateType(''); 
        setSelectedZone('');
        setSelectedPType('');
        setSpecialCountries('');
        setServiceProvider(null)
        setRate(null)
        setLoading(false);
        setSortedRateList([]);

        if (value === 'UPS') {
            await fetchUPSZones();
        }


    };

    const handleRateTypeChange = async (event) => {
        const value = event.target.value;
        setSelectedRateType(event.target.value);
        setSpecialCountries('');
        setServiceProvider(null)
        setRate(null)
        setCountry('')
        setWeight('')
        setLoading(false);
        setSortedRateList([]);
        resetTable('length','width','height','actualGrossWeight', 'volumetricWeight')
        setAllRows('')
        setRefNumber('')


        if (value === 'special-exports') {
            await fetchUPSSpecialCountries();
        }
    };

    const fetchUPSZones = async () => {
        try {
            const response = await axios.get(API_BASE_URL+'selectAllUPSZones');
            setCountries(response.data.data);
            // console.log(response.data.data.map((item) => item.Country))
        } catch (error) {
            console.error('Error fetching countries:', error);
        }
    };

    const fetchUPSSpecialCountries = async () => {
        try {
            const response = await axios.get(API_BASE_URL+'selectAllUPSSpecialCountries');
            setSpecialCountries(response.data.data);
            console.log('Special Countries: ',response.data.data)
        } catch (error) {
            console.error('Error fetching special countries:', error);
        }
    };

    const handleRefNumber = (event) => {
        setRefNumber(event.target.value)
    };

    const handleCountryChange = (event) => {
        const zone = event.target.value;
        setSelectedZone(zone);
        setCountry(event.target.value)
    };

    const handleWeightChange = (event) => {     
        setWeight(roundToNearestHalf(event.target.value));
    };

    const roundToNearestHalf = (value) => {
        if ((Math.ceil(value * 2) / 2) === 0){
            return null;
        } else {
            return (Math.ceil(value * 2) / 2).toString();
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
            console.log(data);
  
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

    //set weight when click
    const handleSetWeight = () => {

        let weightToSet;
        if (totalActualWeight > 0 && totalVolumetricWeight > 0){
            if(totalActualWeight > totalVolumetricWeight){
                weightToSet = totalActualWeight;
            } else if (totalActualWeight < totalVolumetricWeight) {
                weightToSet = totalVolumetricWeight;
            } else if (totalActualWeight === totalVolumetricWeight) {
                weightToSet = totalVolumetricWeight;
            }
    
            let FinalWeight = roundToNearestHalf(weightToSet)
            
            setWeight(FinalWeight.toString());
            setAllRows([...rows]);
            handleCloseDialog();
        } else {
            alert("Please complete all fields in the table.")
        }
    }

    //reset the table
    const handleResetTable = () => {
        resetTable('length','width','height','actualGrossWeight', 'volumetricWeight')
    }

// Preview PDF
const handleShowPDF = (e) => {
    e.preventDefault();

    if (refNumber === '') {
        alert('Reference number is required.');
        return; // Stop further execution if refNumber is empty
    }

    setShowDialog(true);
};
    
    //assigning data to pdf component
    const pdfData = {
        referenceNumber: refNumber,
        deliveryType: selectedService,
        packageType: selectedRateType,
        country: country,
        weight: weight,
        services: SortedRateList.map((rate) => {
            let fuelCost;
            let tot;
    
            // Determine the fuel cost based on the source
            if (rate.source === 'UPS') {
                fuelCost = currentUPSFuelRate;
                tot = (((rate.rate)*(currentUPSFuelRate/100))+(rate.rate)).toFixed(2);
            } else if (rate.source === 'DHL') {
                fuelCost = currentDHLFuelRate;
                tot = (((rate.rate)*(currentDHLFuelRate/100))+(rate.rate)).toFixed(2);
            } else if (rate.source === 'FedEx') {
                fuelCost = currentFedexFuelRate;
                tot = (((rate.rate)*(currentFedexFuelRate/100))+(rate.rate)).toFixed(2);
            } else {
                fuelCost = 'N/A';
                tot = 'N/A';
            }
    
            return {
                name: rate.source,
                rate: rate.rate.toFixed(2),
                fuelCost,
                tot
            };
        }),
        tableData: allRows,
        totalActualWeight: totalActualWeight, 
        totalVolumetricWeight: totalVolumetricWeight,
        dateTime: currentDate,
        selectedService: selectedRow,
        reason: reason
    };

    //download pdf
    const saveFile = async () => {
        const blob = await pdf(<PdfComponentTemp {...pdfData}/>).toBlob();
        saveAs(blob, refNumber+'-'+selectedService+'-'+selectedRateType+'.pdf');
      };
    
    //add document to approved list
    const handleSavePdfToDb = async () => {
        try {
            const blob = await pdf(<PdfComponentTemp {...pdfData} />).toBlob();
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            
            reader.onloadend = async () => {
                const base64data = reader.result.split(',')[1]; // Get the base64 part of the data URL
                console.log(base64data);
                
                const response = await axios.post(API_BASE_URL+'addToApprovedList.jsx', {
                    pdfData: base64data,
                    refNumber,
                    selectedService,
                    selectedRateType,
                    country,
                    weight,
                    currentDate
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
    
                alert('Document added to approved list.');
                setSelectedService('')
                setShowDialogForCheapest(false);
            };
        } catch (error) {
            console.error('Error saving PDF to DB:', error);
            alert('Failed to upload file!');
        }
    };
    
    //add document to pending list
    const handleSaveToPendingList = async () => {
        try {
            const blob = await pdf(<PdfComponentTemp {...pdfData} />).toBlob();
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            
            reader.onloadend = async () => {
                const base64data = reader.result.split(',')[1]; // Get the base64 part of the data URL
                console.log(base64data);
                
                const response = await axios.post(API_BASE_URL+'addToPendingList.jsx', {
                    pdfData: base64data,
                    refNumber,
                    selectedService,
                    selectedRateType,
                    country,
                    weight,
                    currentDate
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
    
                console.log('JSON data sent to API successfully', response.data);
                alert('Document added to pending list.');
            };
        } catch (error) {
            console.error('Error saving PDF to DB:', error);
            alert('Failed to upload file!');
        }
    };

    //table components for add package details
    const handleOpenTable = (event) => {
        setShowTable(true)
    };

    //dialog box closings
    const handleCloseDialog = () => {
        setShowTable(false);
        setShowDialog(false);
    };

    const handleCloseRateDialog = () => {
        setShowDialogForCheapest(false);
        setShowDialogForNonCheapest(false);
        setReason('')
    }

    const [rows, setRows] = useState([...Array(5)].map((_, index) => ({
        id: index + 1,
        length: '',
        width: '',
        height: '',
        actualGrossWeight: '',
        volumetricWeight: ''
    })));

    const addRow = () => {
        setRows([...rows, {
            id: rows.length + 1,
            lenght: '',
            width: '',
            height: '',
            actualGrossWeight: '',
            volumetricWeight: ''
        }])
    }
    
    const deleteRow = (id) => {
        setRows(rows.filter(row => row.id !== id))
    }

    const calculateVolumetricWeight = (length, width, height) => {

        
        return ((length * width * height) / 5000).toFixed(2);
    };

    const handleInputChange = (index, field, value) => {
        const newRows = [...rows];
        newRows[index][field] = value;

  
        if (field === 'length' || field === 'width' || field === 'height') {
            const { length, width, height } = newRows[index];
            if (length && width && height) {
                newRows[index].volumetricWeight = calculateVolumetricWeight(length, width, height);
            } 

        }

        setRows(newRows);
    };

    useEffect(() => {
        calculateTotals();
    }, [rows]);

    const calculateTotals = () => {
        let totalActualWeight = 0;
        let totalVolumetricWeight = 0;

        rows.forEach(row => {
            totalActualWeight += parseFloat(row.actualGrossWeight) || 0;
            totalVolumetricWeight += parseFloat(row.volumetricWeight) || 0;
            
            setActualWeight(totalActualWeight.toFixed(2))
            setVolumetricWeight(totalVolumetricWeight.toFixed(2))
            
        })
    }

    //clear all user inputs for table
    const resetTable = (columnName1,columnName2,columnName3,columnName4, columnName5) => {
        const newRows = rows.map(row => ({
            ...row,
            [columnName1]: '',
            [columnName2]: '',
            [columnName3]: '',
            [columnName4]: '',
            [columnName5]: ''
        }));
        setRows(newRows);
    };


    //for rate table

    //get 1st row data from the sorted rate list
        useEffect(() => {
            if (SortedRateList.length > 0) {
                const fRow = SortedRateList[0];
                setfirstRow(fRow)
                // Perform any operation with the first row data if needed
                console.log('First row data:', fRow.source);
            }
        }, [SortedRateList]);

    //get selected row data
    const handleRowClick = (service, index) => {
        setSelectedRow(service.name);
        setSelectedServiceProvider(service.name);
        setSelectedRowIndex(index);
        
        if (index === 0) {
            setHeading("*You've selected the cheapest rate provider  "+firstRow.source);
            setShowDialogForCheapest(true);
        } else {
            setHeading("*You've chosen a service other than  "+firstRow.source);
            setShowDialogForNonCheapest(true);
        }
        
        
      };
    
    //set reason
    const handleReasonChange = (event) => {
        setReason(event.target.value)
    };

    //for email
    const [recipient, setRecipient] = useState('');
    const [status, setStatus] = useState('');

    //mail using emailjs and recieve fuel cost data from the begining
    useEffect(() => {
        emailjs.init("GR00gFFer1E53_WwK");
        getFuelCost()
      }, []);

    const handleSendMail = async (e) => {
        e.preventDefault();
        const serviceId = "service_t1r0ydh";
        const templateId = "template_crx3e4p";

        try{
            setLoading(true);
            await emailjs.send(serviceId, templateId, {
                recipient: emailRef.current.value,
                reason: reason,
                selectedService: selectedService,
                firstRow: firstRow.source,
                selectedServiceProvider: selectedServiceProvider
              });
              alert("Email successfully sent!");
              handleSaveToPendingList();
              handleCloseRateDialog();
              setSelectedService('')
            
        } catch (error) {
            alert('Error sending email')
            console.log(error);
        } finally {
            setLoading(false);
        }    
    }
    


    //imports
    const handleSubmitImportDocuments = async (event) => {
        event.preventDefault();
        setLoading(true);

        if (!country || !weight || !refNumber) {
            alert('Please fill the fields.');
            setLoading(false);
            return;
        } else {
            const data = {
                country: country,
                weight: weight
            };
    
            try{
                const response = await fetch(API_BASE_URL+'selectImportDocuments', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
    
                if (!response.ok) {
                    throw new Error('Network response was not OK');
                }
    
                const result = await response.json();
    
                const RateList = result.rateList
    
                RateList.sort((a, b) => a.rate - b.rate);
    
    
                setServiceProvider(result.source);
                setRate(result.rate);
                setSortedRateList(RateList)
                setLoading(false);
    
            } catch (error) {
                console.error('Error:', error);
            }
        }

    };

    const handleSubmitImportPackages = async (event) => {
        event.preventDefault();
        setLoading(true);

        if (!country || !weight || !refNumber) {
            alert('Please fill the fields.');
            setLoading(false)
            return;
        } else {
            const data = {
                country: country,
                weight: weight
            };
            console.log(data);
    
            try{
                const response = await fetch(API_BASE_URL+'selectImportPackages', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
    
                if (!response.ok) {
                    throw new Error('Network response was not OK');
                }
    
                const result = await response.json();

    
                const RateList = result.rateList
    
                RateList.sort((a, b) => a.rate - b.rate);
    
                console.log(RateList);
    
    
                setServiceProvider(result.source);
                setRate(result.rate);
                setSortedRateList(RateList)
                setLoading(false);
    
            } catch (error) {
                console.error('Error:', error);
            }
        }

    };

    const handleSubmitImportSamples = async (event) => {
        event.preventDefault();
        setLoading(true);

        if (!country || !weight || !refNumber) {
            alert('Please fill the fields.');
            setLoading(false)
            return;
        } else {
            const data = {
                country: country,
                weight: weight
            };
            console.log(data);
    
            try{
                const response = await fetch(API_BASE_URL+'selectImportSamples', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
    
                if (!response.ok) {
                    throw new Error('Network response was not OK');
                }
    
                const result = await response.json();
                console.log(result.source);
                console.log(result.rate);
                console.log(result.rateList);
    
                const RateList = result.rateList
    
                RateList.sort((a, b) => a.rate - b.rate);
    
                console.log(RateList);
    
    
                setServiceProvider(result.source);
                setRate(result.rate);
                setSortedRateList(RateList)
                setLoading(false);
    
            } catch (error) {
                console.error('Error:', error);
            }
        }
        
    };

    //exports
    const handleSubmitExportDocuments = async (event) => {
        event.preventDefault();
        setLoading(true);

        if (!country || !weight || !refNumber) {
            alert('Please fill the fields.');
            setLoading(false)
            return;
        }
        const data = {
            country: country,
            weight: weight
        };
        console.log(data);

        try{
            const response = await fetch(API_BASE_URL+'selectExportDocuments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Network response was not OK');
            }

            const result = await response.json();
            console.log(result.source);
            console.log(result.rate);
            console.log(result.rateList);

            const RateList = result.rateList

            RateList.sort((a, b) => a.rate - b.rate);

            console.log(RateList);


            setServiceProvider(result.source);
            setRate(result.rate);
            setSortedRateList(RateList)
            setLoading(false);

        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSubmitExportPackages = async (event) => {
        event.preventDefault();
        setLoading(true);

        if (!country || !weight || !refNumber) {
            alert('Please fill the fields.');
            setLoading(false)
            return;
        }
        const data = {
            country: country,
            weight: weight
        };
        console.log(data);

        try{
            const response = await fetch(API_BASE_URL+'selectExportPackages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Network response was not OK');
            }

            const result = await response.json();
            console.log(result.source);
            console.log(result.rate);
            console.log(result.rateList);

            const RateList = result.rateList

            RateList.sort((a, b) => a.rate - b.rate);

            console.log(RateList);


            setServiceProvider(result.source);
            setRate(result.rate);
            setSortedRateList(RateList)
            setLoading(false);

        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSubmitExportSamples = async (event) => {
        event.preventDefault();
        setLoading(true);

        if (!country || !weight || !refNumber) {
            alert('Please fill the fields.');
            setLoading(false)
            return;
        }
        const data = {
            country: country,
            weight: weight
        };
        console.log(data);

        try{
            const response = await fetch(API_BASE_URL+'selectExportSamples', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Network response was not OK');
            }

            const result = await response.json();
            console.log(result.source);
            console.log(result.rate);
            console.log(result.rateList);

            const RateList = result.rateList

            RateList.sort((a, b) => a.rate - b.rate);

            console.log(RateList);


            setServiceProvider(result.source);
            setRate(result.rate);
            setSortedRateList(RateList)
            setLoading(false);

        } catch (error) {
            console.error('Error:', error);
        }
    };

    //e-commerce
    const handleSubmitEComDocuments = async (event) => {
        event.preventDefault();
        setLoading(true);

        if (!country || !weight || !refNumber) {
            alert('Please fill the fields.');
            setLoading(false)
            return;
        }
        const data = {
            country: country,
            weight: weight
        };
        console.log(data);

        try{
            const response = await fetch(API_BASE_URL+'selectEComDocuments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Network response was not OK');
            }

            const result = await response.json();
            console.log(result.source);
            console.log(result.rate);
            console.log(result.rateList);

            const RateList = result.rateList

            RateList.sort((a, b) => a.rate - b.rate);

            console.log(RateList);


            setServiceProvider(result.source);
            setRate(result.rate);
            setSortedRateList(RateList)
            setLoading(false);

        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSubmitEComPackages = async (event) => {
        event.preventDefault();
        setLoading(true);

        if (!country || !weight || !refNumber) {
            alert('Please fill the fields.');
            setLoading(false)
            return;
        }
        const data = {
            country: country,
            weight: weight
        };
        console.log(data);

        try{
            const response = await fetch(API_BASE_URL+'selectEComPackages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Network response was not OK');
            }

            const result = await response.json();
            console.log(result.source);
            console.log(result.rate);
            console.log(result.rateList);

            const RateList = result.rateList

            RateList.sort((a, b) => a.rate - b.rate);

            console.log(RateList);


            setServiceProvider(result.source);
            setRate(result.rate);
            setSortedRateList(RateList)
            setLoading(false);

        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSubmitEComSamples = async (event) => {
        event.preventDefault();
        setLoading(true);

        if (!country || !weight || !refNumber) {
            alert('Please fill the fields.');
            setLoading(false)
            return;
        }
        const data = {
            country: country,
            weight: weight
        };
        console.log(data);

        try{
            const response = await fetch(API_BASE_URL+'selectEComSamples', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Network response was not OK');
            }

            const result = await response.json();
            console.log(result.source);
            console.log(result.rate);
            console.log(result.rateList);

            const RateList = result.rateList

            RateList.sort((a, b) => a.rate - b.rate);

            console.log(RateList);


            setServiceProvider(result.source);
            setRate(result.rate);
            setSortedRateList(RateList)
            setLoading(false);

        } catch (error) {
            console.error('Error:', error);
        }
    };



    return (
        <div className="flex flex-col justify-center items-center h-screen text-black pt-16">
            
            <div className="flex flex-col items-center space-y-4 bg-white bg-opacity-85 p-8 rounded-lg w-1/3 min-w-96">
                <div>
                    <label className='font-semibold'>Select Delivery Type: &nbsp;</label>
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
                        value={selectedService}
                        onChange={handleServiceChange}
                    >
                        <option value="" disabled>--select--</option>
                        <option value="Imports">Imports</option>
                        <option value="Exports">Exports</option>
                        <option value="E-Commerce">E-Commerce</option>
                    </select><br />
                </div>

                {/* if select Imports */}
                {selectedService === 'Imports' && (
                    <>
                        <div>
                            <label className='font-semibold'>Select Package Type: &nbsp;</label>
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
                                value={selectedRateType}
                                onChange={handleRateTypeChange}
                            >
                                <option value="" disabled>--select--</option>
                                <option value="Document">Document</option>
                                <option value="Package">Package</option>
                                <option value="Sample">Sample</option>
                            </select><br />
                        </div>

                        {/* if select Document */}
                        {selectedRateType === 'Document' && (
                            <>
                                <form onSubmit={handleSubmitImportDocuments}>
                                <div className='grid justify-items-stretch'>
                                    <label className='font-semibold'>Reference Number: &nbsp;</label>
                                    <input type="text" className="text-black p-1 m-1 rounded border border-black bg-violet-50 text-center" 
                                            value={refNumber} onChange={handleRefNumber} />
                                </div>
                                <div className='grid justify-items-stretch'>
                                    <label className='font-semibold'>Country: &nbsp;</label>
                                    <input type="text" className="text-black p-1 m-1 rounded border border-black bg-violet-50 text-center" 
                                            value={country} onChange={handleCountryChange} />
                                </div>
                                <div className='grid'>
                                    <div className='mb-[10px]'>
                                        <label className='font-semibold'>Document Weight: &nbsp;</label>
                                    </div>
                                    <div className='justify-items-end'>
                                        <input type="number" className="text-black p-1 m-1 rounded border border-black bg-violet-50 text-center" 
                                            value={weight} onChange={handleWeightChange} /><br />
                                    </div>


                                </div>
                                <div className='grid justify-items-stretch'>
                                    <button type="submit" className="
                                                mx-10 
                                                m-1 
                                                p-2 
                                                mt-5
                                                bg-green-500 
                                                text-white 
                                                rounded
                                                hover:bg-green-600">
                                        Find Rate
                                    </button>
                                </div>
                                <div>
                                    <label className='font-semibold grid justify-items-center'>
                                        {ServiceProvider !== null ? ServiceProvider + " has the lowest rate (" + rate + ")":""}
                                    </label>
                                </div>
                                
                                </form>

                                {loading ? (
                                    <div className='loading-animation'>
                                        <div class="flex items-center justify-center w-full h-full">
	                                        <div class="flex justify-center items-center space-x-1 text-sm text-gray-700">
		 
				                                <svg fill='none' class="w-6 h-6 animate-spin" viewBox="0 0 32 32" xmlns='http://www.w3.org/2000/svg'>
					                                <path clip-rule='evenodd'
						                                d='M15.165 8.53a.5.5 0 01-.404.58A7 7 0 1023 16a.5.5 0 011 0 8 8 0 11-9.416-7.874.5.5 0 01.58.404z'
						                                fill='currentColor' fill-rule='evenodd' />
				                                </svg>

		 
		                                        <div>Loading ...</div>
	                                        </div>
                                        </div>
                                    </div>
                                ) : (SortedRateList.length > 0 && (
                                    <div className='flex'>
                                        <div>
                                    <table className="table-fixed bg-[#b2aeff] bg-opacity-10">
                                        <thead>
                                            <tr className="border-b border-neutral-200 bg-[#4444ff] font-medium text-white dark:border-white/10">
                                                <th className="px-5">Service</th>
                                                <th className="px-7">Rate</th>
                                                <th className="px-7">Fuel Cost(%)</th>
                                                <th className="px-7">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pdfData.services.map((service, key) => (
                                                <tr
                                                    key={key}
                                                    className={`${key === 0 ? 'bg-yellow-100 hover:bg-yellow-200' : 'hover:bg-blue-100'} ${key === selectedRowIndex ? '' : ''}`}
                                                    onClick={() => handleRowClick(service, key)}
                                                >
                                                    <td className="text-center">{service.name}</td>
                                                    <td className="text-center">{service.rate}</td>
                                                    <td className="text-center">{service.fuelCost}</td>
                                                    <td className="text-center">{service.tot}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    
                                    </div>
                                    
                                </div>
                                    

                                ))}
                            </>
                        )}

                        {/* if select Package */}
                        {selectedRateType === 'Package' && (
                            <>
                                <form onSubmit={handleSubmitImportPackages}>
                                <div className='grid'>
                                    <div>
                                        <div className='grid justify-items-stretch'>
                                            <label className='font-semibold'>Reference Number: &nbsp;</label>
                                            <input type="text" className="text-black p-1 m-1 rounded border border-black bg-violet-50 text-center" 
                                                value={refNumber} onChange={handleRefNumber} />
                                        </div>
                                        <div className= 'justify-items-stretch'>
                                            <label className='font-semibold'>
                                                Country: &nbsp;
                                            </label>
                                        </div>
                                        <div className=''>
                                            <input type="text" className="text-black p-1 m-1 rounded border border-black bg-violet-50 min-w-[292px] text-center" 
                                                value={country} onChange={handleCountryChange} /><br />
                                        </div>
                                    </div>
                                    <div className='grid'>
                                        <div className= 'justify-items-stretch mb-[10px] mt-[15px]'>
                                            <label className='font-semibold'>
                                                Package Weight: &nbsp;
                                            </label>
                                        </div>
                                        <div className="relative flex items-center mb-[10px]">
                                            <div className="relative">
                                                <input 
                                                    type="text" 
                                                    id="disabled_filled" 
                                                    className="p-1 mx-1 w-[230px] text-center text-black bg-violet-50 rounded border border-black appearance-none" 
                                                    placeholder=" " 
                                                    disabled 
                                                />
                                                <label 
                                                    htmlFor="disabled_filled" 
                                                    className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 text-center text-black"
                                                >
                                                    {weight}
                                                </label>
                                            </div>
                                            <div className="ml-2">
                                                <button 
                                                    type="button" 
                                                    className="relative text-blue-700 hover:text-blue-900 hover:bg-violet-100 rounded flex items-center focus:ring-4 focus:outline-none focus:ring-blue-300 group"
                                                    onClick={handleOpenTable}
                                                >
                                                    <i className="fa fa-table-list text-4xl ml-[10px]" aria-hidden="true"></i>
                                                    <span className="absolute left-20 transform -translate-x-8 bottom-0 mb-1 px-3 py-2 bg-black bg-opacity-80 w-[170px] text-white text-sm rounded opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                                        Add data to set weight
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='grid justify-items-stretch'>
                                        <button type="submit" className="
                                                mx-10 
                                                m-1 
                                                mt-2
                                                p-2 
                                                bg-green-500 
                                                text-white 
                                                rounded
                                                hover:bg-green-600">
                                            Find Rate
                                        </button>
                                    </div>
                                    <div>
                                        <label className='font-semibold grid justify-items-center'>
                                            {ServiceProvider !== null ? ServiceProvider + " has the lowest rate (" + rate + ")":""}
                                        </label>
                                    </div>
                                </div>
                                </form>
                                {loading ? (
                                    <div className='loading-animation'>
                                        <div class="flex items-center justify-center w-full h-full">
	                                        <div class="flex justify-center items-center space-x-1 text-sm text-gray-700">
		 
				                                <svg fill='none' class="w-6 h-6 animate-spin" viewBox="0 0 32 32" xmlns='http://www.w3.org/2000/svg'>
					                                <path clip-rule='evenodd'
						                                d='M15.165 8.53a.5.5 0 01-.404.58A7 7 0 1023 16a.5.5 0 011 0 8 8 0 11-9.416-7.874.5.5 0 01.58.404z'
						                                fill='currentColor' fill-rule='evenodd' />
				                                </svg>

		 
		                                        <div>Loading ...</div>
	                                        </div>
                                        </div>
                                    </div>
                                ) : (SortedRateList.length > 0 && (
                                    <div className='flex'>
                                        <div>
                                        <table className="table-fixed bg-[#b2aeff] bg-opacity-10">
                                        <thead>
                                            <tr className="border-b border-neutral-200 bg-[#4444ff] font-medium text-white dark:border-white/10">
                                                <th className="px-5">Service</th>
                                                <th className="px-7">Rate</th>
                                                <th className="px-7">Fuel Cost(%)</th>
                                                <th className="px-7">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pdfData.services.map((service, key) => (
                                                <tr
                                                    key={key}
                                                    className={`${key === 0 ? 'bg-yellow-100 hover:bg-yellow-200' : 'hover:bg-blue-100'} ${key === selectedRowIndex ? '' : ''}`}
                                                    onClick={() => handleRowClick(service, key)}
                                                >
                                                    <td className="text-center">{service.name}</td>
                                                    <td className="text-center">{service.rate}</td>
                                                    <td className="text-center">{service.fuelCost}</td>
                                                    <td className="text-center">{service.tot}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    
                                    </div>
                                    
                                </div>
                                    

                                ))}
                            
                            </>
                        )}

                        {/* if select Sample */}
                        {selectedRateType === 'Sample' && (
                        <>
                            <form onSubmit={handleSubmitImportSamples}>
                                <div className='grid'>
                                    <div>
                                        <div className='grid justify-items-stretch'>
                                            <label className='font-semibold'>Reference Number: &nbsp;</label>
                                            <input type="text" className="text-black p-1 m-1 rounded border border-black bg-violet-50 text-center" 
                                                value={refNumber} onChange={handleRefNumber} />
                                        </div>
                                        <div className= 'justify-items-stretch'>
                                            <label className='font-semibold'>
                                                Country: &nbsp;
                                            </label>
                                        </div>
                                        <div className=''>
                                            <input type="text" className="text-black p-1 m-1 rounded border border-black bg-violet-50 min-w-[292px] text-center" 
                                                value={country} onChange={handleCountryChange} /><br />
                                        </div>
                                    </div>
                                    <div className='grid'>
                                        <div className= 'justify-items-stretch mb-[10px] mt-[15px]'>
                                            <label className='font-semibold'>
                                                Sample Weight: &nbsp;
                                            </label>
                                        </div>
                                        <div className="relative flex items-center mb-[10px]">
                                            <div className="relative">
                                                <input 
                                                    type="text" 
                                                    id="disabled_filled" 
                                                    className="p-1 mx-1 w-[230px] text-center text-black bg-violet-50 rounded border border-black appearance-none" 
                                                    placeholder=" " 
                                                    disabled 
                                                />
                                                <label 
                                                    htmlFor="disabled_filled" 
                                                    className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 text-center text-black"
                                                >
                                                    {weight}
                                                </label>
                                            </div>
                                            <div className="ml-2">
                                                <button 
                                                    type="button" 
                                                    className="relative text-blue-700 hover:text-blue-900 hover:bg-violet-100 rounded flex items-center focus:ring-4 focus:outline-none focus:ring-blue-300 group"
                                                    onClick={handleOpenTable}
                                                >
                                                    <i className="fa fa-table-list text-4xl ml-[10px]" aria-hidden="true"></i>
                                                    <span className="absolute left-20 transform -translate-x-8 bottom-0 mb-1 px-3 py-2 bg-black bg-opacity-80 w-[170px] text-white text-sm rounded opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                                        Add data to set weight
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='grid justify-items-stretch'>
                                        <button type="submit" className="
                                                mx-10 
                                                m-1 
                                                mt-2
                                                p-2 
                                                bg-green-500 
                                                text-white 
                                                rounded
                                                hover:bg-green-600">
                                            Find Rate
                                        </button>
                                    </div>
                                    <div>
                                        <label className='font-semibold grid justify-items-center'>
                                            {ServiceProvider !== null ? ServiceProvider + " has the lowest rate (" + rate + ")":""}
                                        </label>
                                    </div>
                                </div>
                            </form>
                            {loading ? (
                                    <div className='loading-animation'>
                                        <div class="flex items-center justify-center w-full h-full">
	                                        <div class="flex justify-center items-center space-x-1 text-sm text-gray-700">
		 
				                                <svg fill='none' class="w-6 h-6 animate-spin" viewBox="0 0 32 32" xmlns='http://www.w3.org/2000/svg'>
					                                <path clip-rule='evenodd'
						                                d='M15.165 8.53a.5.5 0 01-.404.58A7 7 0 1023 16a.5.5 0 011 0 8 8 0 11-9.416-7.874.5.5 0 01.58.404z'
						                                fill='currentColor' fill-rule='evenodd' />
				                                </svg>

		 
		                                        <div>Loading ...</div>
	                                        </div>
                                        </div>
                                    </div>
                                ) : (SortedRateList.length > 0 && (
                                    <div className='flex'>
                                        <div>
                                            <table className="table-fixed bg-[#b2aeff] bg-opacity-10">
                                        <thead>
                                            <tr className="border-b border-neutral-200 bg-[#4444ff] font-medium text-white dark:border-white/10">
                                                <th className="px-5">Service</th>
                                                <th className="px-7">Rate</th>
                                                <th className="px-7">Fuel Cost(%)</th>
                                                <th className="px-7">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pdfData.services.map((service, key) => (
                                                <tr
                                                    key={key}
                                                    className={`${key === 0 ? 'bg-yellow-100 hover:bg-yellow-200' : 'hover:bg-blue-100'} ${key === selectedRowIndex ? '' : ''}`}
                                                    onClick={() => handleRowClick(service, key)}
                                                >
                                                    <td className="text-center">{service.name}</td>
                                                    <td className="text-center">{service.rate}</td>
                                                    <td className="text-center">{service.fuelCost}</td>
                                                    <td className="text-center">{service.tot}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                            </table>
                                    
                                        </div>
                                    
                                </div>
                                    

                                ))}
                            
                        </>
                        )}
                    </>
                )}

                {/* if select Exports */}
                {selectedService === 'Exports' && (
                    <>
                        <div>
                            <label className='font-semibold'>Select Package Type: &nbsp;</label>
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
                                value={selectedRateType}
                                onChange={handleRateTypeChange}
                            >
                                <option value="" disabled>--select--</option>
                                <option value="Document">Document</option>
                                <option value="Package">Package</option>
                                <option value="Sample">Sample</option>
                            </select><br />
                        </div>

                        {/* if select Document */}
                        {selectedRateType === 'Document' && (
                            <>
                            <form onSubmit={handleSubmitExportDocuments}>
                                <div className='grid justify-items-stretch'>
                                    <label className='font-semibold'>Reference Number: &nbsp;</label>
                                    <input type="text" className="text-black p-1 m-1 rounded border border-black bg-violet-50 text-center" 
                                            value={refNumber} onChange={handleRefNumber} />
                                </div>
                                <div className='grid justify-items-stretch'>
                                    <label className='font-semibold'>Country: &nbsp;</label>
                                    <input type="text" className="text-black p-1 m-1 rounded border border-black bg-violet-50 text-center" 
                                            value={country} onChange={handleCountryChange} />
                                </div>
                                <div className='grid'>
                                    <div className='mb-[10px]'>
                                        <label className='font-semibold'>Document Weight: &nbsp;</label>
                                    </div>
                                    <div className='justify-items-end'>
                                        <input type="number" className="text-black p-1 m-1 rounded border border-black bg-violet-50 text-center" 
                                            value={weight} onChange={handleWeightChange} /><br />
                                    </div>


                                </div>
                                <div className='grid justify-items-stretch'>
                                    <button type="submit" className="
                                                mx-10 
                                                m-1 
                                                p-2 
                                                mt-5
                                                bg-green-500 
                                                text-white 
                                                rounded
                                                hover:bg-green-600">
                                        Find Rate
                                    </button>
                                </div>
                                <div>
                                    <label className='font-semibold grid justify-items-center'>
                                        {ServiceProvider !== null ? ServiceProvider + " has the lowest rate (" + rate + ")":""}
                                    </label>
                                </div>
                                
                                </form>

                                {loading ? (
                                    <div className='loading-animation'>
                                        <div class="flex items-center justify-center w-full h-full">
	                                        <div class="flex justify-center items-center space-x-1 text-sm text-gray-700">
		 
				                                <svg fill='none' class="w-6 h-6 animate-spin" viewBox="0 0 32 32" xmlns='http://www.w3.org/2000/svg'>
					                                <path clip-rule='evenodd'
						                                d='M15.165 8.53a.5.5 0 01-.404.58A7 7 0 1023 16a.5.5 0 011 0 8 8 0 11-9.416-7.874.5.5 0 01.58.404z'
						                                fill='currentColor' fill-rule='evenodd' />
				                                </svg>

		 
		                                        <div>Loading ...</div>
	                                        </div>
                                        </div>
                                    </div>
                                ) : (SortedRateList.length > 0 && (
                                    <div className='flex'>
                                        <div>
                                        <table className="table-fixed bg-[#b2aeff] bg-opacity-10">
                                        <thead>
                                            <tr className="border-b border-neutral-200 bg-[#4444ff] font-medium text-white dark:border-white/10">
                                                <th className="px-5">Service</th>
                                                <th className="px-7">Rate</th>
                                                <th className="px-7">Fuel Cost(%)</th>
                                                <th className="px-7">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pdfData.services.map((service, key) => (
                                                <tr
                                                    key={key}
                                                    className={`${key === 0 ? 'bg-yellow-100 hover:bg-yellow-200' : 'hover:bg-blue-100'} ${key === selectedRowIndex ? '' : ''}`}
                                                    onClick={() => handleRowClick(service, key)}
                                                >
                                                    <td className="text-center">{service.name}</td>
                                                    <td className="text-center">{service.rate}</td>
                                                    <td className="text-center">{service.fuelCost}</td>
                                                    <td className="text-center">{service.tot}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    
                                    </div>
                                    
                                </div>
                                    

                                ))}
                                
                            </>
                        )}

                        {/* if select Package */}
                        {selectedRateType === 'Package' && (
                            <>
                            <form onSubmit={handleSubmitExportPackages}>
                                <div className='grid'>
                                    <div>
                                        <div className='grid justify-items-stretch'>
                                            <label className='font-semibold'>Reference Number: &nbsp;</label>
                                            <input type="text" className="text-black p-1 m-1 rounded border border-black bg-violet-50 text-center" 
                                                value={refNumber} onChange={handleRefNumber} />
                                        </div>
                                        <div className= 'justify-items-stretch'>
                                            <label className='font-semibold'>
                                                Country: &nbsp;
                                            </label>
                                        </div>
                                        <div className=''>
                                            <input type="text" className="text-black p-1 m-1 rounded border border-black bg-violet-50 min-w-[292px] text-center" 
                                                value={country} onChange={handleCountryChange} /><br />
                                        </div>
                                    </div>
                                    <div className='grid'>
                                        <div className= 'justify-items-stretch mb-[10px] mt-[15px]'>
                                            <label className='font-semibold'>
                                                Package Weight: &nbsp;
                                            </label>
                                        </div>
                                        <div className="relative flex items-center mb-[10px]">
                                            <div className="relative">
                                                <input 
                                                    type="text" 
                                                    id="disabled_filled" 
                                                    className="p-1 mx-1 w-[230px] text-center text-black bg-violet-50 rounded border border-black appearance-none" 
                                                    placeholder=" " 
                                                    disabled 
                                                />
                                                <label 
                                                    htmlFor="disabled_filled" 
                                                    className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 text-center text-black"
                                                >
                                                    {weight}
                                                </label>
                                            </div>
                                            <div className="ml-2">
                                                <button 
                                                    type="button" 
                                                    className="relative text-blue-700 hover:text-blue-900 hover:bg-violet-100 rounded flex items-center focus:ring-4 focus:outline-none focus:ring-blue-300 group"
                                                    onClick={handleOpenTable}
                                                >
                                                    <i className="fa fa-table-list text-4xl ml-[10px]" aria-hidden="true"></i>
                                                    <span className="absolute left-20 transform -translate-x-8 bottom-0 mb-1 px-3 py-2 bg-black bg-opacity-80 w-[170px] text-white text-sm rounded opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                                        Add data to set weight
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='grid justify-items-stretch'>
                                        <button type="submit" className="
                                                mx-10 
                                                m-1 
                                                mt-2
                                                p-2 
                                                bg-green-500 
                                                text-white 
                                                rounded
                                                hover:bg-green-600">
                                            Find Rate
                                        </button>
                                    </div>
                                    <div>
                                        <label className='font-semibold grid justify-items-center'>
                                            {ServiceProvider !== null ? ServiceProvider + " has the lowest rate (" + rate + ")":""}
                                        </label>
                                    </div>
                                </div>
                                </form>
                                {loading ? (
                                    <div className='loading-animation'>
                                        <div class="flex items-center justify-center w-full h-full">
	                                        <div class="flex justify-center items-center space-x-1 text-sm text-gray-700">
		 
				                                <svg fill='none' class="w-6 h-6 animate-spin" viewBox="0 0 32 32" xmlns='http://www.w3.org/2000/svg'>
					                                <path clip-rule='evenodd'
						                                d='M15.165 8.53a.5.5 0 01-.404.58A7 7 0 1023 16a.5.5 0 011 0 8 8 0 11-9.416-7.874.5.5 0 01.58.404z'
						                                fill='currentColor' fill-rule='evenodd' />
				                                </svg>

		 
		                                        <div>Loading ...</div>
	                                        </div>
                                        </div>
                                    </div>
                                ) : (SortedRateList.length > 0 && (
                                    <div className='flex'>
                                        <div>
                                        <table className="table-fixed bg-[#b2aeff] bg-opacity-10">
                                        <thead>
                                            <tr className="border-b border-neutral-200 bg-[#4444ff] font-medium text-white dark:border-white/10">
                                                <th className="px-5">Service</th>
                                                <th className="px-7">Rate</th>
                                                <th className="px-7">Fuel Cost(%)</th>
                                                <th className="px-7">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pdfData.services.map((service, key) => (
                                                <tr
                                                    key={key}
                                                    className={`${key === 0 ? 'bg-yellow-100 hover:bg-yellow-200' : 'hover:bg-blue-100'} ${key === selectedRowIndex ? '' : ''}`}
                                                    onClick={() => handleRowClick(service, key)}
                                                >
                                                    <td className="text-center">{service.name}</td>
                                                    <td className="text-center">{service.rate}</td>
                                                    <td className="text-center">{service.fuelCost}</td>
                                                    <td className="text-center">{service.tot}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    
                                    </div>
                                    
                                </div>
                                    

                                ))}
                        </>
                        )}
                        
                        {/* if select Sample */}
                        {selectedRateType === 'Sample' && (
                            <>
                            <form onSubmit={handleSubmitExportSamples}>
                                <div className='grid'>
                                    <div>
                                        <div className='grid justify-items-stretch'>
                                            <label className='font-semibold'>Reference Number: &nbsp;</label>
                                            <input type="text" className="text-black p-1 m-1 rounded border border-black bg-violet-50 text-center" 
                                                value={refNumber} onChange={handleRefNumber} />
                                        </div>
                                        <div className= 'justify-items-stretch'>
                                            <label className='font-semibold'>
                                                Country: &nbsp;
                                            </label>
                                        </div>
                                        <div className=''>
                                            <input type="text" className="text-black p-1 m-1 rounded border border-black bg-violet-50 min-w-[292px] text-center" 
                                                value={country} onChange={handleCountryChange} /><br />
                                        </div>
                                    </div>
                                    <div className='grid'>
                                        <div className= 'justify-items-stretch mb-[10px] mt-[15px]'>
                                            <label className='font-semibold'>
                                                Sample Weight: &nbsp;
                                            </label>
                                        </div>
                                        <div className="relative flex items-center mb-[10px]">
                                            <div className="relative">
                                                <input 
                                                    type="text" 
                                                    id="disabled_filled" 
                                                    className="p-1 mx-1 w-[230px] text-center text-black bg-violet-50 rounded border border-black appearance-none" 
                                                    placeholder=" " 
                                                    disabled 
                                                />
                                                <label 
                                                    htmlFor="disabled_filled" 
                                                    className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 text-center text-black"
                                                >
                                                    {weight}
                                                </label>
                                            </div>
                                            <div className="ml-2">
                                                <button 
                                                    type="button" 
                                                    className="relative text-blue-700 hover:text-blue-900 hover:bg-violet-100 rounded flex items-center focus:ring-4 focus:outline-none focus:ring-blue-300 group"
                                                    onClick={handleOpenTable}
                                                >
                                                    <i className="fa fa-table-list text-4xl ml-[10px]" aria-hidden="true"></i>
                                                    <span className="absolute left-20 transform -translate-x-8 bottom-0 mb-1 px-3 py-2 bg-black bg-opacity-80 w-[170px] text-white text-sm rounded opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                                        Add data to set weight
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='grid justify-items-stretch'>
                                        <button type="submit" className="
                                                mx-10 
                                                m-1 
                                                mt-2
                                                p-2 
                                                bg-green-500 
                                                text-white 
                                                rounded
                                                hover:bg-green-600">
                                            Find Rate
                                        </button>
                                    </div>
                                    <div>
                                        <label className='font-semibold grid justify-items-center'>
                                            {ServiceProvider !== null ? ServiceProvider + " has the lowest rate (" + rate + ")":""}
                                        </label>
                                    </div>
                                </div>
                            </form>
                            {loading ? (
                                    <div className='loading-animation'>
                                        <div class="flex items-center justify-center w-full h-full">
	                                        <div class="flex justify-center items-center space-x-1 text-sm text-gray-700">
		 
				                                <svg fill='none' class="w-6 h-6 animate-spin" viewBox="0 0 32 32" xmlns='http://www.w3.org/2000/svg'>
					                                <path clip-rule='evenodd'
						                                d='M15.165 8.53a.5.5 0 01-.404.58A7 7 0 1023 16a.5.5 0 011 0 8 8 0 11-9.416-7.874.5.5 0 01.58.404z'
						                                fill='currentColor' fill-rule='evenodd' />
				                                </svg>

		 
		                                        <div>Loading ...</div>
	                                        </div>
                                        </div>
                                    </div>
                                ) : (SortedRateList.length > 0 && (
                                    <div className='flex'>
                                        <div>
                                        <table className="table-fixed bg-[#b2aeff] bg-opacity-10">
                                        <thead>
                                            <tr className="border-b border-neutral-200 bg-[#4444ff] font-medium text-white dark:border-white/10">
                                                <th className="px-5">Service</th>
                                                <th className="px-7">Rate</th>
                                                <th className="px-7">Fuel Cost(%)</th>
                                                <th className="px-7">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pdfData.services.map((service, key) => (
                                                <tr
                                                    key={key}
                                                    className={`${key === 0 ? 'bg-yellow-100 hover:bg-yellow-200' : 'hover:bg-blue-100'} ${key === selectedRowIndex ? '' : ''}`}
                                                    onClick={() => handleRowClick(service, key)}
                                                >
                                                    <td className="text-center">{service.name}</td>
                                                    <td className="text-center">{service.rate}</td>
                                                    <td className="text-center">{service.fuelCost}</td>
                                                    <td className="text-center">{service.tot}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    
                                    </div>
                                    
                                </div>
                                    

                                ))}
                            
                        </>
                        )}
                    </>
                )}

                {/* if select E-Com */}
                {selectedService === 'E-Commerce' && (
                    <>
                        <div>
                            <label className='font-semibold'>Select Package Type: &nbsp;</label>
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
                                value={selectedRateType}
                                onChange={handleRateTypeChange}
                            >
                                <option value="" disabled>--select--</option>
                                <option value="Document">Document</option>
                                <option value="Package">Package</option>
                                <option value="Sample">Sample</option>
                            </select><br />
                        </div>

                        {/* if select Document */}
                        {selectedRateType === 'Document' && (
                            <>
                            <form onSubmit={handleSubmitEComDocuments}>
                                <div className='grid justify-items-stretch'>
                                    <label className='font-semibold'>Reference Number: &nbsp;</label>
                                    <input type="text" className="text-black p-1 m-1 rounded border border-black bg-violet-50 text-center" 
                                            value={refNumber} onChange={handleRefNumber} />
                                </div>
                                <div className='grid justify-items-stretch'>
                                    <label className='font-semibold'>Country: &nbsp;</label>
                                    <input type="text" className="text-black p-1 m-1 rounded border border-black bg-violet-50 text-center" 
                                            value={country} onChange={handleCountryChange} />
                                </div>
                                <div className='grid'>
                                    <div className='mb-[10px]'>
                                        <label className='font-semibold'>Document Weight: &nbsp;</label>
                                    </div>
                                    <div className='justify-items-end'>
                                        <input type="number" className="text-black p-1 m-1 rounded border border-black bg-violet-50 text-center" 
                                            value={weight} onChange={handleWeightChange} /><br />
                                    </div>


                                </div>
                                <div className='grid justify-items-stretch'>
                                    <button type="submit" className="
                                                mx-10 
                                                m-1 
                                                p-2 
                                                mt-5
                                                bg-green-500 
                                                text-white 
                                                rounded
                                                hover:bg-green-600">
                                        Find Rate
                                    </button>
                                </div>
                                <div>
                                    <label className='font-semibold grid justify-items-center'>
                                        {ServiceProvider !== null ? ServiceProvider + " has the lowest rate (" + rate + ")":""}
                                    </label>
                                </div>
                                
                                </form>

                                {loading ? (
                                    <div className='loading-animation'>
                                        <div class="flex items-center justify-center w-full h-full">
	                                        <div class="flex justify-center items-center space-x-1 text-sm text-gray-700">
		 
				                                <svg fill='none' class="w-6 h-6 animate-spin" viewBox="0 0 32 32" xmlns='http://www.w3.org/2000/svg'>
					                                <path clip-rule='evenodd'
						                                d='M15.165 8.53a.5.5 0 01-.404.58A7 7 0 1023 16a.5.5 0 011 0 8 8 0 11-9.416-7.874.5.5 0 01.58.404z'
						                                fill='currentColor' fill-rule='evenodd' />
				                                </svg>

		 
		                                        <div>Loading ...</div>
	                                        </div>
                                        </div>
                                    </div>
                                ) : (SortedRateList.length > 0 && (
                                    <div className='flex'>
                                        <div>
                                        <table className="table-fixed bg-[#b2aeff] bg-opacity-10">
                                        <thead>
                                            <tr className="border-b border-neutral-200 bg-[#4444ff] font-medium text-white dark:border-white/10">
                                                <th className="px-5">Service</th>
                                                <th className="px-7">Rate</th>
                                                <th className="px-7">Fuel Cost(%)</th>
                                                <th className="px-7">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pdfData.services.map((service, key) => (
                                                <tr
                                                    key={key}
                                                    className={`${key === 0 ? 'bg-yellow-100 hover:bg-yellow-200' : 'hover:bg-blue-100'} ${key === selectedRowIndex ? '' : ''}`}
                                                    onClick={() => handleRowClick(service, key)}
                                                >
                                                    <td className="text-center">{service.name}</td>
                                                    <td className="text-center">{service.rate}</td>
                                                    <td className="text-center">{service.fuelCost}</td>
                                                    <td className="text-center">{service.tot}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    
                                    </div>
                                    
                                </div>
                                    

                                ))}
                                
                            </>
                        )}

                        {/* if select Package */}
                        {selectedRateType === 'Package' && (
                            <>
                            <form onSubmit={handleSubmitEComPackages}>
                                <div className='grid'>
                                    <div>
                                        <div className='grid justify-items-stretch'>
                                            <label className='font-semibold'>Reference Number: &nbsp;</label>
                                            <input type="text" className="text-black p-1 m-1 rounded border border-black bg-violet-50 text-center" 
                                                value={refNumber} onChange={handleRefNumber} />
                                        </div>
                                        <div className= 'justify-items-stretch'>
                                            <label className='font-semibold'>
                                                Country: &nbsp;
                                            </label>
                                        </div>
                                        <div className=''>
                                            <input type="text" className="text-black p-1 m-1 rounded border border-black bg-violet-50 min-w-[292px] text-center" 
                                                value={country} onChange={handleCountryChange} /><br />
                                        </div>
                                    </div>
                                    <div className='grid'>
                                        <div className= 'justify-items-stretch mb-[10px] mt-[15px]'>
                                            <label className='font-semibold'>
                                                Package Weight: &nbsp;
                                            </label>
                                        </div>
                                        <div className="relative flex items-center mb-[10px]">
                                            <div className="relative">
                                                <input 
                                                    type="text" 
                                                    id="disabled_filled" 
                                                    className="p-1 mx-1 w-[230px] text-center text-black bg-violet-50 rounded border border-black appearance-none" 
                                                    placeholder=" " 
                                                    disabled 
                                                />
                                                <label 
                                                    htmlFor="disabled_filled" 
                                                    className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 text-center text-black"
                                                >
                                                    {weight}
                                                </label>
                                            </div>
                                            <div className="ml-2">
                                                <button 
                                                    type="button" 
                                                    className="relative text-blue-700 hover:text-blue-900 hover:bg-violet-100 rounded flex items-center focus:ring-4 focus:outline-none focus:ring-blue-300 group"
                                                    onClick={handleOpenTable}
                                                >
                                                    <i className="fa fa-table-list text-4xl ml-[10px]" aria-hidden="true"></i>
                                                    <span className="absolute left-20 transform -translate-x-8 bottom-0 mb-1 px-3 py-2 bg-black bg-opacity-80 w-[170px] text-white text-sm rounded opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                                        Add data to set weight
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='grid justify-items-stretch'>
                                        <button type="submit" className="
                                                mx-10 
                                                m-1 
                                                mt-2
                                                p-2 
                                                bg-green-500 
                                                text-white 
                                                rounded
                                                hover:bg-green-600">
                                            Find Rate
                                        </button>
                                    </div>
                                    <div>
                                        <label className='font-semibold grid justify-items-center'>
                                            {ServiceProvider !== null ? ServiceProvider + " has the lowest rate (" + rate + ")":""}
                                        </label>
                                    </div>
                                </div>
                                </form>
                                {loading ? (
                                    <div className='loading-animation'>
                                        <div class="flex items-center justify-center w-full h-full">
	                                        <div class="flex justify-center items-center space-x-1 text-sm text-gray-700">
		 
				                                <svg fill='none' class="w-6 h-6 animate-spin" viewBox="0 0 32 32" xmlns='http://www.w3.org/2000/svg'>
					                                <path clip-rule='evenodd'
						                                d='M15.165 8.53a.5.5 0 01-.404.58A7 7 0 1023 16a.5.5 0 011 0 8 8 0 11-9.416-7.874.5.5 0 01.58.404z'
						                                fill='currentColor' fill-rule='evenodd' />
				                                </svg>

		 
		                                        <div>Loading ...</div>
	                                        </div>
                                        </div>
                                    </div>
                                ) : (SortedRateList.length > 0 && (
                                    <div className='flex'>
                                        <div>
                                        <table className="table-fixed bg-[#b2aeff] bg-opacity-10">
                                        <thead>
                                            <tr className="border-b border-neutral-200 bg-[#4444ff] font-medium text-white dark:border-white/10">
                                                <th className="px-5">Service</th>
                                                <th className="px-7">Rate</th>
                                                <th className="px-7">Fuel Cost(%)</th>
                                                <th className="px-7">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pdfData.services.map((service, key) => (
                                                <tr
                                                    key={key}
                                                    className={`${key === 0 ? 'bg-yellow-100 hover:bg-yellow-200' : 'hover:bg-blue-100'} ${key === selectedRowIndex ? '' : ''}`}
                                                    onClick={() => handleRowClick(service, key)}
                                                >
                                                    <td className="text-center">{service.name}</td>
                                                    <td className="text-center">{service.rate}</td>
                                                    <td className="text-center">{service.fuelCost}</td>
                                                    <td className="text-center">{service.tot}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    
                                    </div>
                                    
                                </div>
                                    

                                ))}
                            
                        </>
                        )}

                        {/* if select Sample */}
                        {selectedRateType === 'Sample' && (
                            <>
                            <form onSubmit={handleSubmitEComSamples}>
                                <div className='grid'>
                                    <div>
                                        <div className='grid justify-items-stretch'>
                                            <label className='font-semibold'>Reference Number: &nbsp;</label>
                                            <input type="text" className="text-black p-1 m-1 rounded border border-black bg-violet-50 text-center" 
                                                value={refNumber} onChange={handleRefNumber} />
                                        </div>
                                        <div className= 'justify-items-stretch'>
                                            <label className='font-semibold'>
                                                Country: &nbsp;
                                            </label>
                                        </div>
                                        <div className=''>
                                            <input type="text" className="text-black p-1 m-1 rounded border border-black bg-violet-50 min-w-[292px] text-center" 
                                                value={country} onChange={handleCountryChange} /><br />
                                        </div>
                                    </div>
                                    <div className='grid'>
                                        <div className= 'justify-items-stretch mb-[10px] mt-[15px]'>
                                            <label className='font-semibold'>
                                                Sample Weight: &nbsp;
                                            </label>
                                        </div>
                                        <div className="relative flex items-center mb-[10px]">
                                            <div className="relative">
                                                <input 
                                                    type="text" 
                                                    id="disabled_filled" 
                                                    className="p-1 mx-1 w-[230px] text-center text-black bg-violet-50 rounded border border-black appearance-none" 
                                                    placeholder=" " 
                                                    disabled 
                                                />
                                                <label 
                                                    htmlFor="disabled_filled" 
                                                    className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 text-center text-black"
                                                >
                                                    {weight}
                                                </label>
                                            </div>
                                            <div className="ml-2">
                                                <button 
                                                    type="button" 
                                                    className="relative text-blue-700 hover:text-blue-900 hover:bg-violet-100 rounded flex items-center focus:ring-4 focus:outline-none focus:ring-blue-300 group"
                                                    onClick={handleOpenTable}
                                                >
                                                    <i className="fa fa-table-list text-4xl ml-[10px]" aria-hidden="true"></i>
                                                    <span className="absolute left-20 transform -translate-x-8 bottom-0 mb-1 px-3 py-2 bg-black bg-opacity-80 w-[170px] text-white text-sm rounded opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                                        Add data to set weight
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='grid justify-items-stretch'>
                                        <button type="submit" className="
                                                mx-10 
                                                m-1 
                                                mt-2
                                                p-2 
                                                bg-green-500 
                                                text-white 
                                                rounded
                                                hover:bg-green-600">
                                            Find Rate
                                        </button>
                                    </div>
                                    <div>
                                        <label className='font-semibold grid justify-items-center'>
                                            {ServiceProvider !== null ? ServiceProvider + " has the lowest rate (" + rate + ")":""}
                                        </label>
                                    </div>
                                </div>
                            </form>
                            {loading ? (
                                    <div className='loading-animation'>
                                        <div class="flex items-center justify-center w-full h-full">
	                                        <div class="flex justify-center items-center space-x-1 text-sm text-gray-700">
		 
				                                <svg fill='none' class="w-6 h-6 animate-spin" viewBox="0 0 32 32" xmlns='http://www.w3.org/2000/svg'>
					                                <path clip-rule='evenodd'
						                                d='M15.165 8.53a.5.5 0 01-.404.58A7 7 0 1023 16a.5.5 0 011 0 8 8 0 11-9.416-7.874.5.5 0 01.58.404z'
						                                fill='currentColor' fill-rule='evenodd' />
				                                </svg>

		 
		                                        <div>Loading ...</div>
	                                        </div>
                                        </div>
                                    </div>
                                ) : (SortedRateList.length > 0 && (
                                    <div className='flex'>
                                        <div>
                                        <table className="table-fixed bg-[#b2aeff] bg-opacity-10">
                                        <thead>
                                            <tr className="border-b border-neutral-200 bg-[#4444ff] font-medium text-white dark:border-white/10">
                                                <th className="px-5">Service</th>
                                                <th className="px-7">Rate</th>
                                                <th className="px-7">Fuel Cost(%)</th>
                                                <th className="px-7">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pdfData.services.map((service, key) => (
                                                <tr
                                                    key={key}
                                                    className={`${key === 0 ? 'bg-yellow-100 hover:bg-yellow-200' : 'hover:bg-blue-100'} ${key === selectedRowIndex ? '' : ''}`}
                                                    onClick={() => handleRowClick(service, key)}
                                                >
                                                    <td className="text-center">{service.name}</td>
                                                    <td className="text-center">{service.rate}</td>
                                                    <td className="text-center">{service.fuelCost}</td>
                                                    <td className="text-center">{service.tot}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    
                                    </div>
                                    
                                </div>
                                    

                                ))}
                            
                        </>
                        )}
                    </>
                )}
            </div>

            {showTable && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-8 rounded shadow-md">
                <div className='relative flex justify-end  items-center'>
                    <button className="fixed transform translate-x-15 -translate-y-1/2 pb-[2px] pr-[5px] text-sky-500 rounded" onClick={handleResetTable}>
                            <i class="fa-solid fa-arrows-rotate text-md"></i>
                    </button>
                    <button className="fixed transform translate-x-5 -translate-y-1/2 text-red-700 rounded" onClick={handleCloseDialog}>
                        <i className="fa fa-close text-xl" aria-hidden="true"></i>
                    </button>
                </div>
                    <div className="overflow-y-auto max-h-[400px]">

                        <table className="min-w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="border p-2">No.</th>
                                    <th className="border p-2">Length (cm)</th>
                                    <th className="border p-2">Width (cm)</th>
                                    <th className="border p-2">Height (cm)</th>
                                    <th className="border p-2">Actual Gross Weight (Kg)</th>
                                    <th className="border p-2">Volumetric Weight (Kg)</th>
                                    <th className=" p-2"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, index) => (
                                    <tr key={index}>
                                        <td className="border p-1 text-center">{row.id}</td>
                                        <td className="border p-1">
                                            <input type="number" 
                                                    className="w-full h-[35px] text-center" 
                                                    value={row.length} 
                                                    onChange={(e) => {
                                                        const newRows = [...rows];
                                                        newRows[index].length = e.target.value;
                                                        setRows(newRows);
                                                        handleInputChange(index, 'length', e.target.value)
                                            }} />
                                        </td>
                                        <td className="border p-1 ">
                                            <input type="number" className="w-full h-[35px] text-center" value={row.width} onChange={(e) => {
                                                const newRows = [...rows];
                                                newRows[index].width = e.target.value;
                                                setRows(newRows);
                                                handleInputChange(index, 'width', e.target.value)
                                            }} />
                                        </td>
                                        <td className="border p-1">
                                            <input type="number" className="w-full h-[35px] text-center" value={row.height} onChange={(e) => {
                                                const newRows = [...rows];
                                                newRows[index].height = e.target.value;
                                                setRows(newRows);
                                                handleInputChange(index, 'height', e.target.value)
                                            }} />
                                        </td>
                                        <td className="border p-1">
                                            <input type="number" className="w-full h-[35px] text-center" value={row.actualGrossWeight} onChange={(e) => {
                                                const newRows = [...rows];
                                                newRows[index].actualGrossWeight = e.target.value;
                                                setRows(newRows);
                                                handleInputChange(index, 'actualGrossWeight', e.target.value)
                                            }} />
                                        </td>
                                        <td className="border p-1">
                                            <input readOnly type="number" className="w-full h-[35px] text-center" value={row.volumetricWeight} onChange={(e) => {
                                                const newRows = [...rows];
                                                newRows[index].volumetricWeight = e.target.value;
                                                setRows(newRows)
                                                handleInputChange(index, 'volumetricWeight', e.target.value)
                                            }} />
                                        </td>
                                        <td className="p">
                                            <button className="p-1 ml-[8px] text-red-700 rounded w-10" onClick={() => deleteRow(row.id)}>
                                                <i className="fa-solid fa-circle-minus text-xl" aria-hidden="true"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                <tr>
                                    <td className=" p-2" colSpan="4" align="right"><strong>Total:</strong></td>
                                    <td className="border p-2 text-right"><strong>{totalActualWeight}</strong></td>
                                    <td className="border p-2 text-right"><strong>{totalVolumetricWeight}</strong></td>

                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className='relative flex justify-end items-center h-12'>

                        <button className="absolute left-1/2 transform -translate-x-1/2 mt-4 p-2 bg-green-50 hover:bg-green-100 text-green-700 rounded" onClick={handleSetWeight}>
                            Set Total Weight
                        </button>

                        <button className="p-2 ml-[8px] text-blue-700 rounded" onClick={addRow}>
                                            <i class="fa-solid fa-down-long text-xl"></i>
                                            <i className="fa-solid fa-circle-plus" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
            </div>
            )}

            {showDialogForCheapest && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center h-screen pt-11" >
                <div className="relative w-[500px] max-w-4xl h-auto bg-gray-100 rounded-lg shadow-lg pt-8">
                    <div className='absolute top-[5px]'>
                        <lable className="text-md ml-2">{heading}</lable>
                    </div>
                    <div className="absolute -top-[14px] right-0 flex space-x-1 p-2">
                    
                        <button className="text-red-700 rounded p-2" onClick={handleCloseRateDialog}>
                            <i className="fa fa-close text-2xl" aria-hidden="true"></i>
                        </button>
                    </div>
                <div className="w-auto h-auto flex flex-col items-center justify-center">
                    <div className="bg-white p-1 shadow-lg rounded-lg w-full h-auto flex justify-center">
                        <div className='flex-row'>
                            
                            <div className='flex pt-5 space-x-1'>
                                <div className='flex-1'>
                                    <button onClick={handleShowPDF} className='transition ease-in-out delay-150 duration-300 bg-green-50 hover:bg-green-100 rounded p-0 mb-3 text-md w-[190px] h-[60px]'>
                                        <i className="fa-solid fa-file-pdf text-red-600 text-2xl pr-2 rounded" aria-hidden="true"></i>
                                        Preview Document
                                    </button>
                                </div>
                                <div className='flex-1'>
                                    <button onClick={handleSavePdfToDb} className='transition ease-in-out delay-150 duration-300 bg-green-50 hover:bg-green-100 rounded p-0 mb-3 w-[190px] h-[60px]'>
                                        <i className="fa-solid fa-download text-red-600 text-2xl pr-2 rounded" aria-hidden="true"></i>
                                        Save
                                    </button>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
            )}

            {showDialogForNonCheapest && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center h-screen pt-11">
                <div className="relative w-[500px] max-w-4xl h-auto bg-gray-100 rounded-lg shadow-lg pt-8">
                    <div className='absolute top-[5px]'>
                        <lable className="text-md ml-2">{heading}</lable>
                    </div>
                    <div className="absolute -top-[14px] right-0 flex space-x-1 p-2">
                    
                        <button className="text-red-700 rounded p-2" onClick={handleCloseRateDialog}>
                            <i className="fa fa-close text-2xl" aria-hidden="true"></i>
                        </button>
                    </div>
                    <div className="w-auto h-auto flex flex-col items-center justify-center">
                        <div className="bg-white p-1 shadow-lg rounded-lg w-full h-auto flex justify-center">
                            <div className='flex-row'>
                                <div class="w-[390px] pt-4">
                                    <div class="relative w-full min-w-[200px] h-12">
                                        <input
                                            class="peer w-full h-full bg-transparent text-blue-gray-700 font-sans 
                                                font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 
                                                disabled:border-0 transition-all placeholder-shown:border 
                                                placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 
                                                border focus:border-2 border-t-transparent focus:border-t-transparent text-sm 
                                                px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900 bg-red-50"
                                            placeholder=" "
                                            value={reason} 
                                            onChange={handleReasonChange} />
                                            <label
                                                class="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal 
                                                    !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight 
                                                    peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 
                                                    transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[12px] 
                                                    before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] 
                                                    before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t 
                                                    peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none 
                                                    before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow 
                                                    after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent 
                                                    after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none 
                                                    after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-gray-500 peer-focus:text-gray-900 
                                                    before:border-blue-gray-200 peer-focus:before:!border-gray-900 after:border-blue-gray-200 peer-focus:after:!border-gray-900">
                                                        Tell us why?
                                            </label>
                                    </div>
                                <div className=''>
                                    <form>
                                        <div flex-row>
                                            <div>
                                                <div class="relative w-full min-w-[200px] h-12 mt-3">
                                                    <input
                                                        class="peer w-full h-full bg-transparent text-blue-gray-700 font-sans 
                                                                font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 
                                                                disabled:border-0 transition-all placeholder-shown:border 
                                                                placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 
                                                                border focus:border-2 border-t-transparent focus:border-t-transparent text-sm 
                                                                px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900 bg-red-50"
                                                            placeholder=" "
                                                            type="email"
                                                            ref={emailRef}
                                                            onChange={(e) => setRecipient(e.target.value)} />
                                                        <label
                                                            class="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal 
                                                                !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight 
                                                                peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 
                                                                transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[12px] 
                                                                before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] 
                                                                before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t 
                                                                peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none 
                                                                before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow 
                                                                after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent 
                                                                after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none 
                                                                after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-gray-500 peer-focus:text-gray-900 
                                                                before:border-blue-gray-200 peer-focus:before:!border-gray-900 after:border-blue-gray-200 peer-focus:after:!border-gray-900">
                                                                    Email of the Authority
                                                        </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='flex pt-5 space-x-1'>
                                            <div className='flex-1'>
                                                <button 
                                                    className='transition ease-in-out delay-150 bg-blue-50 hover:bg-blue-100 duration-300 rounded p-0 mb-3 w-[190px] h-[55px]'
                                                    
                                                    onClick={handleShowPDF}>
                                                    <i className="fa-solid fa-file-pdf text-red-600 text-2xl pr-2 rounded" aria-hidden="true"></i>
                                                        Preview Document
                                                </button>
                                            </div>
                                            <div className='flex-1'>
                                                <button 
                                                    className='transition ease-in-out delay-150 bg-blue-50 hover:bg-blue-100 duration-300 rounded p-0 mb-3 w-[190px] h-[55px]'
                                                    type='submit'
                                                    onClick={handleSendMail}>
                                        
                                                    <i className="fa-solid fa-file-signature text-red-600 text-2xl pr-2 rounded" aria-hidden="true"></i>
                                                        Ask for Approval
                                                </button>
                                            </div>
                                        </div>

                                    </form>
                                    {status && <p>{status}</p>}
                                </div>
                            </div> 
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
            )}

            {/* viewing generated pdf */}
            {showDialog && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center h-screen pt-11">
                <div className="relative w-full max-w-4xl h-auto bg-gray-100 rounded-lg shadow-lg pt-8">
                    <div className="absolute top-[45px] right-[63px] flex space-x-0 p-0">
                        <label className="bg-[#323639] p-6">
                        </label>
                        <label className="bg-[#323639] p-6">
                        </label>
                    </div>
                    <div className="absolute -top-[14px] right-0 flex space-x-1 p-2">
                    
                        <button className="text-red-700 rounded p-2" onClick={handleCloseDialog}>
                            <i className="fa fa-close text-2xl" aria-hidden="true"></i>
                        </button>
                    </div>
                    <div className="w-full h-auto flex flex-col items-center justify-center">
                        <div className="bg-white p-1 shadow-lg rounded-lg w-full h-auto flex justify-center">
                            <PDFViewer width="100%" height="100%" className="w-full h-[80vh] max-h-[600px]">
                                <PdfComponentTemp {...pdfData} />
                            </PDFViewer>
                        </div>
                    </div>
                </div>
            </div>
            )}
        </div>
    );
}

export default Home;
