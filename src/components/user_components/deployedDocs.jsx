import React, { useEffect, useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';

function DeployedDocs() {

    const [docsTable, setDocsTable] = useState([])
    

    const getPdfTable = async (event) => {

        try{
            const response = await fetch('http://localhost:5000/api/selectPDFs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                
            });

            if (!response.ok) {
                throw new Error('Network response was not OK');
            }

            const result = await response.json();
            const tbl = result.DataSet.recordset
            setDocsTable(tbl)
            console.log(docsTable);

        } catch (error) {
            console.error('Error:', error);
        }
    };

    const previewPdf = (pdfData) => {
        const blob = new Blob([Uint8Array.from(atob(pdfData), c => c.charCodeAt(0))], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      };

    useEffect(() => {
        getPdfTable();
      }, []);

  return (
    <div className="flex flex-col justify-center items-center h-screen text-black pt-16">
        <div className="flex flex-col items-center space-y-4 bg-white bg-opacity-85 p-8 rounded-lg w-70%">
            <div className="w-full max-h-[500px] overflow-y-auto">
                <table className="table-fixed bg-[#b2aeff] bg-opacity-10 w-70%">
                    <thead className='sticky top-0'>
                        <tr className="border-b border-neutral-200 bg-[#cccccc] font-medium text-black dark:border-white/10">
                            <th className="px-1 text-center">Referense Number</th>
                            <th className="px-1">Issued Date</th>
                            <th className="px-1">Delivery Type</th>
                            <th className="px-1">Package Type</th>
                            <th className="px-1">Country</th>
                            <th className="px-1">Net Weight</th>
                            <th className="px-1 ">Document</th>
                        </tr>
                    </thead>
                    <tbody>
                    {docsTable.map((refNumber, key) => (
              <tr key={key}>
                <td className='text-center border-t-[1px]'>{refNumber.refNumber}</td>
                <td className='text-center border-t-2'>{refNumber.currentDate}</td>
                <td className='text-center border-t-2'>{refNumber.selectedService}</td>
                <td className='text-center border-t-2'>{refNumber.selectedrateType}</td>
                <td className='text-center border-t-2'>{refNumber.country}</td>
                <td className='text-center border-t-2'>{refNumber.Nweight}</td>
                <td className='text-center border-t-2'>
                  <button onClick={() => previewPdf(refNumber.pdf_data)}>
                    <i className="fa-solid fa-file-pdf text-xl text-red-500" aria-hidden="true"></i>
                  </button>
                
                  <a href={`data:application/pdf;base64,${refNumber.pdf_data}`} download={`${refNumber.selectedrateType+'_'+refNumber.selectedService+'_'+refNumber.refNumber}.pdf`}>
                    <i className="fa fa-download text-xl ml-6 text-green-700" aria-hidden="true"></i>
                  </a>
                </td>
              </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
}

export default DeployedDocs;