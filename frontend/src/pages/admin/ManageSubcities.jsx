import { useState, useEffect } from 'react';
import api from '../../Services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ManageSubcities = () => {
    const [cities, setCities] = useState([]);
    const [subcities, setSubcities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCity, setSelectedCity] = useState('');
    const [newSubcity, setNewSubcity] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editingName, setEditingName] = useState('');

    const fetchCities = async () => {
        try {
            const response = await api.get('/cities');
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

    const fetchSubcities = async (cityId) => {
        if (!cityId) return;
        try {
            const response = await api.get(`/subcities/${cityId}`);
            setSubcities(response.data.data);
        } catch (error) {
            console.error('Error fetching subcities:', error);
        }
    };

    const handleCityChange = (e) => {
        const cityId = e.target.value;
        setSelectedCity(cityId);
        if (cityId) {
            fetchSubcities(cityId);
        } else {
            setSubcities([]);
        }
    };

    const handleAddSubcity = async (e) => {
        e.preventDefault();
        if (!newSubcity.trim() || !selectedCity) return;
        
        try {
            await api.post('/admin/subcities', { Name: newSubcity, cityId: selectedCity });
            setNewSubcity('');
            fetchSubcities(selectedCity);
        } catch (error) {
            console.error('Error adding subcity:', error);
        }
    };

    const handleUpdateSubcity = async (id) => {
        try {
            await api.put(`/admin/subcities/${id}`, { Name: editingName });
            setEditingId(null);
            fetchSubcities(selectedCity);
        } catch (error) {
            console.error('Error updating subcity:', error);
        }
    };

    const handleDeleteSubcity = async (id) => {
        if (window.confirm('Delete this subcity?')) {
            try {
                await api.delete(`/admin/subcities/${id}`);
                fetchSubcities(selectedCity);
            } catch (error) {
                console.error('Error deleting subcity:', error);
            }
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-fuchsia-400 to-orange-400"> 
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-800">Manage Subcities</h1>
            <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-7xl">

            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6">
                <label className="block text-gray-700 mb-3 font-semibold text-sm sm:text-base">Select City</label>
                <select
                    value={selectedCity}
                    onChange={handleCityChange}
                    className="w-full p-3 sm:p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                >
                    <option value="">Select a city</option>
                    {cities.map(city => (
                        <option key={city.id} value={city.id}>{city.Name}</option>
                    ))}
                </select>

                {selectedCity && (
                    <form onSubmit={handleAddSubcity} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <input
                            type="text"
                            value={newSubcity}
                            onChange={(e) => setNewSubcity(e.target.value)}
                            placeholder="New subcity name..."
                            className="flex-1 p-3 sm:p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                            required
                        />
                        <button type="submit" className="w-full sm:w-auto bg-blue-600 text-white px-4 sm:px-6 py-3 sm:py-2 rounded hover:bg-blue-700 transition font-semibold text-sm sm:text-base">
                            Add Subcity
                        </button>
                    </form>
                )}
            </div>

            {selectedCity && subcities.length > 0 && (
                <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="p-2 sm:p-3 text-left font-semibold text-xs sm:text-sm">ID</th>
                                <th className="p-2 sm:p-3 text-left font-semibold text-xs sm:text-sm">Subcity Name</th>
                                <th className="p-2 sm:p-3 text-left font-semibold text-xs sm:text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subcities.map(sub => (
                                <tr key={sub.id} className="border-t hover:bg-gray-50">
                                    <td className="p-2 sm:p-3 text-xs sm:text-sm">{sub.id}</td>
                                    <td className="p-2 sm:p-3 text-xs sm:text-sm">
                                        {editingId === sub.id ? (
                                            <input
                                                type="text"
                                                value={editingName}
                                                onChange={(e) => setEditingName(e.target.value)}
                                                className="p-2 border border-blue-500 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs sm:text-sm"
                                            />
                                        ) : (
                                            sub.Name
                                        )}
                                    </td>
                                    <td className="p-2 sm:p-3 text-xs sm:text-sm">
                                        <div className="flex gap-1 flex-wrap">
                                            {editingId === sub.id ? (
                                                <>
                                                    <button onClick={() => handleUpdateSubcity(sub.id)} className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 text-xs">Save</button>
                                                    <button onClick={() => setEditingId(null)} className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600 text-xs">Cancel</button>
                                                </>
                                            ) : (
                                                <>
                                                    <button onClick={() => {
                                                        setEditingId(sub.id);
                                                        setEditingName(sub.Name);
                                                    }} className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 text-xs">Edit</button>
                                                    <button onClick={() => handleDeleteSubcity(sub.id)} className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 text-xs">Delete</button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
        </div>
    );
};

export default ManageSubcities;
