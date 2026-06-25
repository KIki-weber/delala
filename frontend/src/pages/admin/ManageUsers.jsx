import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/admin/users');
            setUsers(response.data.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await api.put(`/admin/users/${userId}/role`, { Role: newRole });
            fetchUsers();
        } catch (error) {
            console.error('Error updating role:', error);
        }
    };

    const handleStatusToggle = async (userId, currentStatus) => {
        try {
            if (currentStatus) {
                await api.delete(`/admin/users/${userId}`);
            } else {
                await api.put(`/admin/users/${userId}/activate`);
            }
            fetchUsers();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(search.toLowerCase()) ||
        user.phone?.includes(search) ||
        (user.Servicetype?.Name && user.Servicetype.Name.toLowerCase().includes(search.toLowerCase())) ||
        (user.city?.Name && user.city.Name.toLowerCase().includes(search.toLowerCase())) ||
        (user.subcity?.Name && user.subcity.Name.toLowerCase().includes(search.toLowerCase()))
    );

    if (loading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-fuchsia-400 to-orange-400"> 
            <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-7xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">

                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Manage Users</h1>
                <input
                    type="text"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full sm:w-64 p-3 sm:p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                />
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="p-2 sm:p-3 text-left font-semibold text-xs sm:text-sm">Name</th>
                            <th className="p-2 sm:p-3 text-left font-semibold text-xs sm:text-sm hidden sm:table-cell">Phone</th>
                            <th className="p-2 sm:p-3 text-left font-semibold text-xs sm:text-sm hidden md:table-cell">Service</th>
                            <th className="p-2 sm:p-3 text-left font-semibold text-xs sm:text-sm hidden lg:table-cell">Location</th>
                            <th className="p-2 sm:p-3 text-left font-semibold text-xs sm:text-sm">Role</th>
                            <th className="p-2 sm:p-3 text-left font-semibold text-xs sm:text-sm">Status</th>
                            <th className="p-2 sm:p-3 text-left font-semibold text-xs sm:text-sm">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id} className="border-t hover:bg-gray-50">
                                <td className="p-2 sm:p-3 text-xs sm:text-sm"><strong>{user.name}</strong></td>
                                <td className="p-2 sm:p-3 text-xs sm:text-sm hidden sm:table-cell">{user.phone}</td>
                                <td className="p-2 sm:p-3 text-xs sm:text-sm hidden md:table-cell">{user.Servicetype?.Name || 'N/A'}</td>
                                <td className="p-2 sm:p-3 text-xs sm:text-sm hidden lg:table-cell">{user.city?.Name}</td>
                                <td className="p-2 sm:p-3 text-xs sm:text-sm">
                                    <select
                                        value={user.role || user.Role}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                        className="p-1 border border-gray-300 rounded text-xs"
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td className="p-2 sm:p-3 text-xs sm:text-sm">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {user.isActive ? '✓ Active' : '✗ Off'}
                                    </span>
                                </td>
                                <td className="p-2 sm:p-3">
                                    <button
                                        onClick={() => handleStatusToggle(user.id, user.isActive)}
                                        className={`px-2 sm:px-3 py-1 rounded text-white text-xs sm:text-sm font-semibold transition ${user.isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                                    >
                                        {user.isActive ? 'Deactivate' : 'Activate'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsers;