import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    async function fetchStats() {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get('/admin/dashboard');

            // Check if response has the expected structure
            if (response.data && response.data.success) {
                setStats(response.data.data);
            } else {
                setError('Invalid response format');
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
            setError(error.response?.data?.message || 'Failed to fetch dashboard stats');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        let active = true;

        (async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await api.get('/admin/dashboard');

                if (!active) return;

                if (response.data && response.data.success) {
                    setStats(response.data.data);
                } else {
                    setError('Invalid response format');
                }
            } catch (error) {
                if (!active) return;
                console.error('Error fetching stats:', error);
                setError(error.response?.data?.message || 'Failed to fetch dashboard stats');
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        })();

        return () => {
            active = false;
        };
    }, []);

    if (loading) return <LoadingSpinner />;

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                    <p className="text-red-600 text-lg mb-4">❌ {error}</p>
                    <button 
                        onClick={fetchStats}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-fuchsia-400 to-orange-400">
            <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-7xl">
                <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-800">
                    Admin Dashboard
                </h1>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    <div className="bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-lg text-center shadow-md hover:shadow-lg transition">
                        <p className="text-3xl sm:text-2xl font-bold text-blue-600">
                            {stats?.users?.total || 0}
                        </p>
                        <p className="text-gray-600 text-sm sm:text-base mt-2">Total Users</p>
                    </div>
                    <div className="bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-lg text-center shadow-md hover:shadow-lg transition">
                        <p className="text-3xl sm:text-2xl font-bold text-green-600">
                            {stats?.users?.active || 0}
                        </p>
                        <p className="text-gray-600 text-sm sm:text-base mt-2">Active Users</p>
                    </div>
                    <div className="bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-lg text-center shadow-md hover:shadow-lg transition">
                        <p className="text-3xl sm:text-2xl font-bold text-yellow-600">
                            {stats?.posts?.total || 0}
                        </p>
                        <p className="text-gray-600 text-sm sm:text-base mt-2">Total Listings</p>
                    </div>
                    <div className="bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-lg text-center shadow-md hover:shadow-lg transition">
                        <p className="text-3xl sm:text-2xl font-bold text-purple-600">
                            {stats?.posts?.active || 0}
                        </p>
                        <p className="text-gray-600 text-sm sm:text-base mt-2">Active Listings</p>
                    </div>
                </div>

                {/* Admin Menu */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <Link 
                        to="/admin/users" 
                        className="bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition border-l-4 border-blue-500 hover:scale-105 transform"
                    >
                        <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800">👥 Manage Users</h3>
                        <p className="text-sm sm:text-base text-gray-600">View, edit, delete users. Change user roles.</p>
                    </Link>

                    <Link 
                        to="/admin/listings" 
                        className="bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition border-l-4 border-green-500 hover:scale-105 transform"
                    >
                        <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800">📋 Manage All Listings</h3>
                        <p className="text-sm sm:text-base text-gray-600">View, edit, delete any listing.</p>
                    </Link>

                    <Link 
                        to="/admin/cities" 
                        className="bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition border-l-4 border-yellow-500 hover:scale-105 transform"
                    >
                        <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800">🏙️ Manage Cities</h3>
                        <p className="text-sm sm:text-base text-gray-600">Add, edit, delete cities.</p>
                    </Link>

                    <Link 
                        to="/admin/subcities" 
                        className="bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition border-l-4 border-red-500 hover:scale-105 transform"
                    >
                        <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800">📍 Manage Subcities</h3>
                        <p className="text-sm sm:text-base text-gray-600">Add, edit, delete subcities.</p>
                    </Link>

                    <Link 
                        to="/admin/service-types" 
                        className="bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition border-l-4 border-purple-500 hover:scale-105 transform"
                    >
                        <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800">🔧 Manage Service Types</h3>
                        <p className="text-sm sm:text-base text-gray-600">Add, edit, delete service types.</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
