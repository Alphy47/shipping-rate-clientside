import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
    const [showLinks, setShowLinks] = useState(false);

    return (
        <nav className="bg-transparent p-4 fixed w-full top-0 z-50">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-white text-3xl font-bold">
                    <Link to="/">Shipping Rates</Link>
                </div>
                <ul className="flex space-x-4">
                    <li>
                        <Link to="/" className="text-white hover:text-gray-400 text-lg">Home</Link>
                    </li>
                    <li onMouseEnter={() => setShowLinks(true)} onMouseLeave={() => setShowLinks(false)}>
                        <Link className="text-white hover:text-gray-400 text-lg ">Documents</Link>
                        {showLinks && (
                            <ul className="absolute p-2 rounded shadow-xl border-t border-l bg-[rgb(32,60,71)]">
                                <li className='mb-3'>
                                    <Link to="/pendingDocs" className="text-gray-200 hover:text-gray-400 text-md ">Pending Documents</Link>
                                </li>
                                <li className='mb-3'>
                                    <Link to="/approvedDocs" className="text-gray-200 hover:text-gray-400 text-md">Approved Documents</Link>
                                </li>
                                <li>
                                    <Link to="/disapprovedDocs" className="text-gray-200 hover:text-gray-400 text-md">Disapproved Documents</Link>
                                </li>
                            </ul>
                        )}
                    </li>
                    <li>
                        <Link to="/excelUpload" className="text-white hover:text-gray-400 text-lg">Excel Upload</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default NavBar;
