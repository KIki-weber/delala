import { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ManageCities = () => {
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newCity, setNewCity] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editingName, setEditingName] = useState('');

    const fetchCities = async () => {
        try {
            const response = await api.get('/admin/cities');
            setCities(response.data.data);
        } catch (error) {
            console.error('Error fetching cities:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Initial load fetch for the admin list.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchCities();
    }, []);

    const handleAddCity = async (e) => {
        e.preventDefault();
        if (!newCity.trim()) return;
        
        try {
            await api.post('/admin/cities', { Name: newCity });
            setNewCity('');
            fetchCities();
        } catch (error) {
            console.error('Error adding city:', error);
        }
    };

    const handleUpdateCity = async (id) => {
        try {
            await api.put(`/admin/cities/${id}`, { Name: editingName });
            setEditingId(null);
            fetchCities();
        } catch (error) {
            console.error('Error updating city:', error);
        }
    };

    const handleDeleteCity = async (id) => {
        if (window.confirm('Delete this city? Subcities will also be deleted.')) {
            try {
                await api.delete(`/admin/cities/${id}`);
                fetchCities();
            } catch (error) {
                console.error('Error deleting city:', error);
            }
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-fuchsia-400 to-orange-400"> 
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-800">Manage Cities</h1>
            <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-7xl">

            {/* Add City Form - Mobile Responsive */}
            <form onSubmit={handleAddCity} className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <input
                    type="text"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    placeholder="New city name..."
                    className="flex-1 p-3 sm:p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                <button 
                    type="submit" 
                    className="w-full sm:w-auto bg-blue-600 text-white px-4 sm:px-6 py-3 sm:py-2 rounded hover:bg-blue-700 transition font-semibold text-sm sm:text-base"
                >
                    Add City
                </button>
            </form>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="p-3 sm:p-4 text-left text-xs sm:text-sm font-semibold text-gray-700">ID</th>
                            <th className="p-3 sm:p-4 text-left text-xs sm:text-sm font-semibold text-gray-700">City Name</th>
                            <th className="p-3 sm:p-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Subcities</th>
                            <th className="p-3 sm:p-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cities.map(city => (
                            <tr key={city.id} className="border-t hover:bg-gray-50 transition">
                                <td className="p-3 sm:p-4 text-xs sm:text-sm">{city.id}</td>
                                <td className="p-3 sm:p-4 text-xs sm:text-sm font-medium">
                                    {editingId === city.id ? (
                                        <input
                                            type="text"
                                            value={editingName}
                                            onChange={(e) => setEditingName(e.target.value)}
                                            className="p-2 border border-blue-500 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        />
                                    ) : (
                                        city.Name
                                    )}
                                </td>
                                <td className="p-3 sm:p-4 text-xs sm:text-sm text-center bg-blue-50 font-semibold text-blue-600">{city.Subcities?.length || 0}</td>
                                <td className="p-3 sm:p-4 text-xs sm:text-sm">
                                    {editingId === city.id ? (
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleUpdateCity(city.id)} 
                                                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition text-xs"
                                            >
                                                Save
                                            </button>
                                            <button 
                                                onClick={() => setEditingId(null)} 
                                                className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition text-xs"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => {
                                                    setEditingId(city.id);
                                                    setEditingName(city.Name);
                                                }} 
                                                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition text-xs"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteCity(city.id)} 
                                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition text-xs"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {cities.map(city => (
                    <div key={city.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-600">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 mb-1">ID: {city.id}</p>
                                <h3 className="text-lg font-bold text-gray-800">
                                    {editingId === city.id ? (
                                        <input
                                            type="text"
                                            value={editingName}
                                            onChange={(e) => setEditingName(e.target.value)}
                                            className="p-2 border border-blue-500 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        />
                                    ) : (
                                        city.Name
                                    )}
                                </h3>
                            </div>
                        </div>

                        <div className="bg-blue-50 p-3 rounded mb-4">
                            <p className="text-sm text-gray-600">Subcities</p>
                            <p className="text-2xl font-bold text-blue-600">{city.Subcities?.length || 0}</p>
                        </div>

                        <div className="flex flex-col gap-2">
                            {editingId === city.id ? (
                                <>
                                    <button 
                                        onClick={() => handleUpdateCity(city.id)} 
                                        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition font-semibold text-sm"
                                    >
                                        Save Changes
                                    </button>
                                    <button 
                                        onClick={() => setEditingId(null)} 
                                        className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition font-semibold text-sm"
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button 
                                        onClick={() => {
                                            setEditingId(city.id);
                                            setEditingName(city.Name);
                                        }} 
                                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-semibold text-sm"
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteCity(city.id)} 
                                        className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition font-semibold text-sm"
                                    >
                                        Delete
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {cities.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-base sm:text-lg">No cities found. Create one to get started!</p>
                </div>
            )}
        </div>
        </div>
    );
};

export default ManageCities;
