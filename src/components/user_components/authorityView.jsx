import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';

function AuthorityView() {
    const [docsTable, setDocsTable] = useState([]);
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const [userRole, setUserRole] = useState(''); // State to store user role

    useEffect(() => {
        // Simulate fetching user role (replace with actual logic)
        const fetchUserRole = async () => {
            try {
                
                setUserRole('authority'); 
            } catch (error) {
                console.error('Error fetching user role:', error);
            }
        };

        fetchUserRole();
    }, []);

    const getPdfTable = async (event) => {

        try{
            const response = await fetch('http://localhost:5000/api/selectPendingList', {
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

    const handleClickApprove = async (rowData) => {
      console.log(rowData.refNumber);
      const data = {
        refNumber: rowData.refNumber
      };
    
      try {
        const response = await fetch('http://localhost:5000/api/updatePendingToApproved', {
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
        console.log(result);
        getPdfTable()
    
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const handleClickDisapprove = async (rowData) => {
      console.log(rowData.refNumber);
      const data = {
        refNumber: rowData.refNumber
      };
    
      try {
        const response = await fetch('http://localhost:5000/api/updatePendingToDisapproved', {
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
        console.log(result);
        getPdfTable()
    
      } catch (error) {
        console.error('Error:', error);
      }
    };
    

    useEffect(() => {
        getPdfTable();
      }, []);

  return (
    <div className="flex flex-col justify-center items-center h-screen text-black pt-16">
        <div className="flex flex-col items-center space-y-4 bg-white bg-opacity-85 p-8 rounded-lg w-70%">
        <label className='text-2xl'>Giving Athorization</label>
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
                      <tr key={key}
                          className={` ${key === selectedRowIndex ? '' : ''}hover:bg-blue-100`}>
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
                        </td>
                        <td className='text-center border-t-2'>
                          <button className="p-1 ml-[8px] text-blue-700 rounded w-10" onClick={() => handleClickApprove(refNumber)}>
                            <i className="fa-solid fa-circle-check text-xl hover:text-2xl" aria-hidden="true"></i>
                          </button>
                        </td>
                        <td className='text-center border-t-2'>
                          <button className="p-1 ml-[8px] text-red-700 rounded w-10" onClick={() => handleClickDisapprove(refNumber)}>
                            <i className="fa-solid fa-circle-xmark text-xl hover:text-2xl" aria-hidden="true"></i>
                          </button>
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

export default AuthorityView;
