import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/user_components/NavBar';
import Home from './components/user_components/home';
import ExcelUpload from './components/user_components/excelUpload';
import PendingDocs from './components/user_components/pendingDocs';
import ApprovedDocs from './components/user_components/approvedDocs';
import DisapprovedDocs from './components/user_components/disapprovedDocs';
import AuthorityView from './components/user_components/authorityView';

function App() {
    const userRole = 'authority'; 

    return (
        <Router>
            <NavBar />
            <Routes>
                <Route path="" element={<Home />} />
                <Route path="/excelUpload" element={<ExcelUpload />} />
                <Route path="/pendingDocs" element={<PendingDocs />} />
                <Route path="/approvedDocs" element={<ApprovedDocs />} />
                <Route path="/disapprovedDocs" element={<DisapprovedDocs />} />
                {userRole === 'authority' && (
                    <Route path="/authorityView" element={<AuthorityView />} />
                )}
            </Routes>
        </Router>
    );
}

export default App;

