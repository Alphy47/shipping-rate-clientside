import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ApprovedDocs() {
    const [docsTable, setDocsTable] = useState([]);

    const getPdfTable = async () => {
        try {
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
            const tbl = result.DataSet.recordset;
            setDocsTable(tbl);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const previewPdf = (pdfData) => {
        const blob = new Blob([Uint8Array.from(atob(pdfData), c => c.charCodeAt(0))], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    };

    const handleTrackingNumberChange = async (event, refNumber) => {
        const newTrackingNumber = event.target.value;

        try {
            const response = await fetch('http://localhost:5000/api/updateTrackingNumber', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    refNumber: refNumber,
                    trackingNumber: newTrackingNumber
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not OK');
            }

            // Optionally, update the local state if necessary
            setDocsTable(prevDocsTable =>
                prevDocsTable.map(doc =>
                    doc.refNumber === refNumber ? { ...doc, trackingNumber: newTrackingNumber } : doc
                )
            );
        } catch (error) {
            console.error('Error updating tracking number:', error);
        }
    };

    useEffect(() => {
        getPdfTable();
    }, []);

    return (
        <div className="flex flex-col justify-center items-center h-screen text-black pt-16">
            <div className="flex flex-col items-center space-y-4 bg-white bg-opacity-85 p-8 rounded-lg w-70%">
                <label className='text-2xl'>Approved Documents</label>
                <div className="w-full max-h-[400px] overflow-y-auto">
                    <table className="table-fixed bg-[#b2aeff] bg-opacity-10 w-70%">
                        <thead className='sticky top-0'>
                            <tr className="border-b border-neutral-200 bg-[#cccccc] font-medium text-black dark:border-white/10">
                                <th className="px-1 text-center">Reference Number</th>
                                <th className="px-1">Issued Date</th>
                                <th className="px-1">Delivery Type</th>
                                <th className="px-1">Package Type</th>
                                <th className="px-1">Country</th>
                                <th className="px-1">Net Weight</th>
                                <th className="px-1">Document</th>
                                <th className="px-1">Waybill No.</th>
                            </tr>
                        </thead>
                        <tbody>
                            {docsTable.map((doc, key) => (
                                <tr key={key}>
                                    <td className='text-center border-t-[1px]'>{doc.refNumber}</td>
                                    <td className='text-center border-t-2'>{doc.currentDate}</td>
                                    <td className='text-center border-t-2'>{doc.selectedService}</td>
                                    <td className='text-center border-t-2'>{doc.selectedrateType}</td>
                                    <td className='text-center border-t-2'>{doc.country}</td>
                                    <td className='text-center border-t-2'>{doc.Nweight}</td>
                                    <td className='text-center border-t-2'>
                                        <button onClick={() => previewPdf(doc.pdf_data)}>
                                            <i className="fa-solid fa-file-pdf text-xl text-red-500" aria-hidden="true"></i>
                                        </button>
                                        <a href={`data:application/pdf;base64,${doc.pdf_data}`} download={`${doc.selectedrateType+'_'+doc.selectedService+'_'+doc.refNumber}.pdf`}>
                                            <i className="fa fa-download text-xl ml-6 text-green-700" aria-hidden="true"></i>
                                        </a>
                                    </td>
                                    <td className='text-center border-t-2'>
                                        <input
                                            type="text"
                                            value={doc.trackingNumber || ''}
                                            onChange={(e) => handleTrackingNumberChange(e, doc.refNumber)}
                                            className="border rounded p-1 text-center w-[160px]"
                                        />
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

export default ApprovedDocs;
