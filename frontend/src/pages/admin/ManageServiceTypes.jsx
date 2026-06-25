import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ManageServiceTypes = () => {
    const [serviceTypes, setServiceTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newServiceType, setNewServiceType] = useState('');
    const [newCategory, setNewCategory] = useState('both');
    const [editingId, setEditingId] = useState(null);
    const [editingName, setEditingName] = useState('');
    const [editingCategory, setEditingCategory] = useState('');

    useEffect(() => {
        fetchServiceTypes();
    }, []);

    const fetchServiceTypes = async () => {
        try {
            const response = await api.get('/service-types');
            setServiceTypes(response.data.data);
        } catch (error) {
            console.error('Error fetching service types:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddServiceType = async (e) => {
        e.preventDefault();
        if (!newServiceType.trim()) return;
        
        try {
            await api.post('/admin/service-types', { Name: newServiceType, Category: newCategory });
            setNewServiceType('');
            setNewCategory('both');
            fetchServiceTypes();
        } catch (error) {
            console.error('Error adding service type:', error);
        }
    };

    const handleUpdateServiceType = async (id) => {
        try {
            await api.put(`/admin/service-types/${id}`, { Name: editingName, Category: editingCategory });
            setEditingId(null);
            fetchServiceTypes();
        } catch (error) {
            console.error('Error updating service type:', error);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-fuchsia-400 to-orange-400"> 
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-800">Manage Service Types</h1>
            <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-7xl">

            <form onSubmit={handleAddServiceType} className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <input
                    type="text"
                    value={newServiceType}
                    onChange={(e) => setNewServiceType(e.target.value)}
                    placeholder="New service type..."
                    className="flex-1 p-3 sm:p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    required
                />
                <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full sm:w-40 p-3 sm:p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                >
                    <option value="rent">Rent Only</option>
                    <option value="sell">Sell Only</option>
                    <option value="both">Both</option>
                </select>
                <button type="submit" className="w-full sm:w-auto bg-blue-600 text-white px-4 sm:px-6 py-3 sm:py-2 rounded hover:bg-blue-700 transition font-semibold text-sm sm:text-base">
                    Add Service Type
                </button>
            </form>

            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="p-2 sm:p-3 text-left font-semibold text-xs sm:text-sm">ID</th>
                            <th className="p-2 sm:p-3 text-left font-semibold text-xs sm:text-sm">Name</th>
                            <th className="p-2 sm:p-3 text-left font-semibold text-xs sm:text-sm">Category</th>
                            <th className="p-2 sm:p-3 text-left font-semibold text-xs sm:text-sm">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {serviceTypes.map(type => (
                            <tr key={type.id} className="border-t hover:bg-gray-50">
                                <td className="p-2 sm:p-3 text-xs sm:text-sm">{type.id}</td>
                                <td className="p-2 sm:p-3 text-xs sm:text-sm">
                                    {editingId === type.id ? (
                                        <input
                                            type="text"
                                            value={editingName}
                                            onChange={(e) => setEditingName(e.target.value)}
                                            className="p-2 border border-blue-500 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs"
                                        />
                                    ) : (
                                        type.Name
                                    )}
                                </td>
                                <td className="p-2 sm:p-3 text-xs sm:text-sm">
                                    {editingId === type.id ? (
                                        <select
                                            value={editingCategory}
                                            onChange={(e) => setEditingCategory(e.target.value)}
                                            className="p-1 border border-blue-500 rounded text-xs"
                                        >
                                            <option value="rent">Rent Only</option>
                                            <option value="sell">Sell Only</option>
                                            <option value="both">Both</option>
                                        </select>
                                    ) : (
                                        type.Category
                                    )}
                                </td>
                                <td className="p-2 sm:p-3 text-xs sm:text-sm">
                                    <div className="flex gap-1 flex-wrap">
                                        {editingId === type.id ? (
                                            <>
                                                <button onClick={() => handleUpdateServiceType(type.id)} className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 text-xs">Save</button>
                                                <button onClick={() => setEditingId(null)} className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600 text-xs">Cancel</button>
                                            </>
                                        ) : (
                                            <button onClick={() => {
                                                setEditingId(type.id);
                                                setEditingName(type.Name);
                                                setEditingCategory(type.Category);
                                            }} className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 text-xs">Edit</button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        </div>
    );
};

export default ManageServiceTypes;