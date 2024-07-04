import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/user_components/NavBar';
import Home from './components/user_components/home';
import ExcelUpload from './components/user_components/excelUpload';
import DeployedDocs from './components/user_components/deployedDocs';

function App() {
    return (
        <Router>
            <NavBar />
            <Routes>
                <Route path="" element={<Home />} />
                <Route path="/excelUpload" element={<ExcelUpload />} />
                <Route path="/deployedDocs" element={<DeployedDocs />} />
            </Routes>
        </Router>
    );
}

export default App;
