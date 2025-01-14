import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './dashboard/Dashboard';
import Login from './dashboard/components/admin/Login';
import Usercheck from './dashboard/components/user/Usercheck';
import { AdminProvider } from './dashboard/context/AdminContext';
import MainGrid from './dashboard/components/MainGrid';
import CustomizedDataGrid from './dashboard/components/CustomizedDataGrid';
import Userinfo from './dashboard/components/user/Userinfo';

import Midcategory from './dashboard/components/recycle/Midcategory';
import BigCategory from './dashboard/components/recycle/Bigcategory';
import Calendar from './dashboard/components/calendar/Calendar';
import Signup from './dashboard/components/admin/Signup';
import Company from './dashboard/components/company/Company';
import CompanyProduct from './dashboard/components/company/CompanyProduct';
import Faq from './dashboard/components/faq/Faq';
function App() {
  return (
    <div className="App">
          <AdminProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign_up" element={<Signup/>}/>
          <Route path="/usercheck" element={<Usercheck />} />
          <Route path="/userinfo/:user_no" element={<Userinfo/>}/>
          <Route path="/bigcategory" element={<BigCategory/>}/>
          <Route path="/midcategory" element={<Midcategory/>}/>
          <Route path="/calendar" element={<Calendar/>}/>
          <Route path="/company" element={<Company/>}/>
          <Route path="/company_product" element={<CompanyProduct/>}/>
          <Route path="/faq" element={<Faq/>}/>
          {/* <Route path="/tree" element={<} */}
        </Routes>
      </Router>
      </AdminProvider>
    </div>
  );
}

export default App;
