import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import API_BASE_URL from './envirenment';

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
            const response = await fetch(API_BASE_URL+'selectPendingList', {
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
        const response = await fetch(API_BASE_URL+'updatePendingToApproved', {
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
        const response = await fetch(API_BASE_URL+'updatePendingToDisapproved', {
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
  <div className="flex flex-col items-center space-y-4 bg-white bg-opacity-85 p-8 rounded-lg w-11/12 sm:w-10/12 lg:w-3/4">
    <label className="text-2xl mb-4">Giving Authorization</label>
    <div className="w-full max-h-[400px] overflow-y-auto">
      <div className="overflow-x-auto">
        <table className="table-fixed bg-[#b2aeff] bg-opacity-10 w-full border-collapse border border-gray-300">
          <thead className="sticky top-0 bg-[#cccccc] text-black">
            <tr>
              <th className="px-4 py-2 text-center w-40">Reference Number</th>
              <th className="px-4 py-2 text-center w-32">Issued Date</th>
              <th className="px-4 py-2 text-center w-32">Delivery Type</th>
              <th className="px-4 py-2 text-center w-32">Package Type</th>
              <th className="px-4 py-2 text-center w-32">Country</th>
              <th className="px-4 py-2 text-center w-24">Net Weight</th>
              <th className="px-4 py-2 text-center w-32">Document</th>
              <th className="px-4 py-2 text-center w-20">Approve</th>
              <th className="px-4 py-2 text-center w-20">Disapprove</th>
            </tr>
          </thead>
          <tbody>
            {docsTable.map((refNumber, key) => (
              <tr key={key} className="hover:bg-blue-100">
                <td className="text-center border-t border-gray-300 px-4 py-2">{refNumber.refNumber}</td>
                <td className="text-center border-t border-gray-300 px-4 py-2">{refNumber.currentDate}</td>
                <td className="text-center border-t border-gray-300 px-4 py-2">{refNumber.selectedService}</td>
                <td className="text-center border-t border-gray-300 px-4 py-2">{refNumber.selectedrateType}</td>
                <td className="text-center border-t border-gray-300 px-4 py-2">{refNumber.country}</td>
                <td className="text-center border-t border-gray-300 px-4 py-2">{refNumber.Nweight}</td>
                <td className="text-center border-t border-gray-300 px-4 py-2">
                  <button onClick={() => previewPdf(refNumber.pdf_data)}>
                    <i className="fa-solid fa-file-pdf text-xl text-red-500" aria-hidden="true"></i>
                  </button>
                </td>
                <td className="text-center border-t border-gray-300 px-4 py-2">
                  <button
                    className="p-1 text-blue-700 rounded"
                    onClick={() => handleClickApprove(refNumber)}
                  >
                    <i className="fa-solid fa-circle-check text-xl hover:text-2xl" aria-hidden="true"></i>
                  </button>
                </td>
                <td className="text-center border-t border-gray-300 px-4 py-2">
                  <button
                    className="p-1 text-red-700 rounded"
                    onClick={() => handleClickDisapprove(refNumber)}
                  >
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
</div>
  );
}

export default AuthorityView;
