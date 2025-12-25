import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import Routes instead of Switch
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import HomePage from './pages/HomePage';


import Login from './pages/Login';
import Signup from './pages/RegistrationPage';
import AboutUs from './pages/AboutUs';



import UserDashboard from "./pages/UserDashboard/UserDashboard";

import Addprop from './pages/owner/AddPG';
import UploadImages from "./pages/owner/UploadImages";
import PGList from './pages/PGList';
import PGDetails1 from "./pages/PGDetails1";
import OwnerProfile from './pages/owner/OwnerProfile';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Contact from'./pages/ContactPage';

//owner imports
import OwnerLayout from "./pages/owner/OwnerLayout";
import ManageListings from "./pages/owner/ManageListings";
import BookingRequests from "./pages/owner/BookingRequests";
import OwnerDashboard from './pages/owner/OwnerDashboard';
import EditPGMultiStep from "./pages/owner/EditPGMultiStep";
import OwnerProtectedRoute from "./pages/owner/OwnerProtectedRoute";
import Deleteimg from './pages/owner/Deleteimg';

//import OwnerProfilePage from "./pages/owner/OwnerProfilePage";


//admin imports

import AdminLayout from "./pages/admin/components/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Pgs from "./pages/admin/Pgs";
import Bookings from "./pages/admin/Bookings";
import Reviews from "./pages/admin/Reviews";
import Reports from "./pages/admin/Reports";
import Settings from "./pages/admin/Settings";
import Logout from "./pages/admin/Logout";
import Payment  from "./pages/admin/AdminPayments";
import AdminProtectedRoute from "./pages/admin/AdminProtectedRoute";



//student imports
import DashboardHome from './pages/student/DashboardHome';
import BrowsePGs from './pages/student/BrowsePGs';
import PGDetailsStudent from './pages/student/PGDetails';
import MyBookings from './pages/student/MyBookings';
import ReviewsStudent from './pages/student/Reviews';
import ProfileStudent from './pages/student/Profile';
import StudentProtectedRoute from './pages/student/StudentProtectedRoute';
import StudentLayout from './pages/student/StudentLayout';
import StudentPayments from './pages/student/StudentPayments';

// Create the root element
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app inside the root element
root.render(
  <React.StrictMode>
    <Router>
      <Routes>  {/* Switch replaced by Routes in v6 */}
        <Route path="/" element={<HomePage />} />
        <Route path="/pgs" element={<PGList />} />
        
        {/*<Route path="/pg/:id" element={<PGDetails />} />  Example for PG Details with dynamic params */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        <Route path="/pg/:id" element={<PGDetails1 />} />

        {/* <Route path="/add-pg" element={<AddPG />} />
        <Route path="/student-dash" element={<UserDashboard />}/> 
        <Route path="/owner-dashboard" element={<OwnerLayout />} />
        <Route path="/owner/add-pg" element={<Addprop />} />
        <Route path="/owner/profile" element={<OwnerProfile />} />*/}
        <Route path="/upload-images/:pgId" element={<UploadImages />} /> 

        <Route path="/owner" element={<OwnerProtectedRoute />}>
  <Route element={<OwnerLayout />}>
    <Route path="dashboard" element={<OwnerDashboard />} />
    <Route path="add-pg" element={<Addprop />} />
    <Route path="manage-listings" element={<ManageListings />} />
    <Route path="edit-pg/:id" element={<EditPGMultiStep />} />
    <Route path="booking-requests" element={<BookingRequests />} />
    <Route path="profile" element={<OwnerProfile />} />
    <Route path="delete-images/:pgId" element={<Deleteimg />} />
  </Route>
</Route>


        <Route path="/admin" element={<AdminProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="pgs" element={<Pgs />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="logout" element={<Logout />} />
          <Route path="payment" element={<Payment />} />
        </Route>
      </Route>

        <Route path="/student-dashboard" element={
  <StudentProtectedRoute>
    <StudentLayout />
  </StudentProtectedRoute>
}>
  <Route path="home" element={<DashboardHome />} />
  <Route path="browse" element={<BrowsePGs />} />
  <Route path="pg/:id" element={<PGDetailsStudent />} />
  <Route path="bookings" element={<MyBookings />} />
  <Route path="payments" element={<StudentPayments />} /> {/* NEW */}
  <Route path="reviews" element={<ReviewsStudent />} />
  <Route path="profile" element={<ProfileStudent />} />
</Route>

      </Routes>
    </Router>
  </React.StrictMode>
);

// Measure performance
reportWebVitals();

