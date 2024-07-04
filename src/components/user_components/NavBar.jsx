import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
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
                    <li>
                        <Link to="/excelUpload" className="text-white hover:text-gray-400 text-lg">Excel Upload</Link>
                    </li>
                    <li>
                        <Link to="/deployedDocs" className="text-white hover:text-gray-400 text-lg">Documents</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default NavBar;
