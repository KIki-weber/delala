import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import PrivateRoute from './components/common/PrivateRoute';

// Public Pages
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import ListingDetail from './pages/public/ListingDetail';
import UserDetail from './pages/public/UserDetail';

// User Pages
import UserDashboard from './pages/user/UserDashboard';
import MyListings from './pages/user/MyListings';
import CreateListing from './pages/user/CreateListing';
import EditListing from './pages/user/EditListing';
import UserProfile from './pages/user/UserProfile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageCities from './pages/admin/ManageCities';
import ManageSubcities from './pages/admin/ManageSubcities';
import ManageServiceTypes from './pages/admin/ManageServiceTypes';
import ManageAllListings from './pages/admin/ManageAllListings';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Navbar />
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/listing/:id" element={<ListingDetail />} />
                    <Route path="/user/:userId" element={<UserDetail />} />

                    {/* User Routes */}
                    <Route path="/user/dashboard" element={
                        <PrivateRoute>
                            <UserDashboard />
                        </PrivateRoute>
                    } />
                    <Route path="/user/my-listings" element={
                        <PrivateRoute>
                            <MyListings />
                        </PrivateRoute>
                    } />
                    <Route path="/user/create-listing" element={
                        <PrivateRoute>
                            <CreateListing />
                        </PrivateRoute>
                    } />
                    <Route path="/user/edit-listing/:id" element={
                        <PrivateRoute>
                            <EditListing />
                        </PrivateRoute>
                    } />
                    <Route path="/user/profile" element={
                        <PrivateRoute>
                            <UserProfile />
                        </PrivateRoute>
                    } />

                    {/* Admin Routes */}
                    <Route path="/admin/dashboard" element={
                        <PrivateRoute adminOnly={true}>
                            <AdminDashboard />
                        </PrivateRoute>
                    } />
                    <Route path="/admin/users" element={
                        <PrivateRoute adminOnly={true}>
                            <ManageUsers />
                        </PrivateRoute>
                    } />
                    <Route path="/admin/cities" element={
                        <PrivateRoute adminOnly={true}>
                            <ManageCities />
                        </PrivateRoute>
                    } />
                    <Route path="/admin/subcities" element={
                        <PrivateRoute adminOnly={true}>
                            <ManageSubcities />
                        </PrivateRoute>
                    } />
                    <Route path="/admin/service-types" element={
                        <PrivateRoute adminOnly={true}>
                            <ManageServiceTypes />
                        </PrivateRoute>
                    } />
                    <Route path="/admin/listings" element={
                        <PrivateRoute adminOnly={true}>
                            <ManageAllListings />
                        </PrivateRoute>
                    } />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
