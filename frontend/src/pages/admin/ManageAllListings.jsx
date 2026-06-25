import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../service/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ManageAllListings = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchListings();
    }, []);

    const fetchListings = async () => {
        try {
            const response = await api.get('/posts/allpost');
            setListings(response.data.data);
        } catch (error) {
            console.error('Error fetching listings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this listing?')) {
            try {
                await api.delete(`/admin/posts/${id}`);
                setListings(listings.filter(listing => listing.id !== id));
            } catch (error) {
                console.error('Error deleting listing:', error);
                alert('Failed to delete listing');
            }
        }
    };

    const handleActivate = async (id) => {
        try {
            await api.put(`/admin/posts/${id}/activate`);
            setListings(listings.map(listing => 
                listing.id === id ? { ...listing, Status: 'active' } : listing
            ));
        } catch (error) {
            console.error('Error activating listing:', error);
            alert('Failed to activate listing');
        }
    };

    const handleDeactivate = async (id) => {
        try {
            await api.put(`/admin/posts/${id}/deactivate`);
            setListings(listings.map(listing => 
                listing.id === id ? { ...listing, Status: 'inactive' } : listing
            ));
        } catch (error) {
            console.error('Error deactivating listing:', error);
            alert('Failed to deactivate listing');
        }
    };

    const filteredListings = listings.filter(listing =>
        listing.Title?.toLowerCase().includes(search.toLowerCase()) ||
        listing.owner?.name?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <LoadingSpinner />;

    return (
        <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-7xl">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Manage All Listings</h1>
                <div className="w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="Search listings..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full sm:w-64 p-3 sm:p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    />
                </div>
            </div>

            {/* Listings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredListings.map((listing) => (
                    <div 
                        key={listing.id} 
                        className="border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition overflow-hidden flex flex-col h-full bg-white"
                    >
                        {/* Card Header */}
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
                            <h2 className="text-lg sm:text-xl font-semibold truncate">{listing.Title}</h2>
                            <p className="text-xs sm:text-sm opacity-90 mt-1">
                                By: {listing.owner?.name || 'Unknown'}
                            </p>
                        </div>

                        {/* Card Content */}
                        <div className="p-4 flex-1 flex flex-col gap-3">
                            {/* Contact Info */}
                            <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                <p className="font-semibold">Contact: {listing.owner?.phone || 'N/A'}</p>
                            </div>

                            {/* Description */}
                            <p className="text-sm text-gray-700 line-clamp-3">
                                {listing.Description?.substring(0, 150) || 'No description'}...
                            </p>

                            {/* Price */}
                            <div className="bg-blue-50 p-3 rounded">
                                <p className="text-xs text-gray-600">Price</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    ETB {parseFloat(listing.Price).toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">{listing.Pricetype}</p>
                            </div>

                            {/* Status Badge */}
                            <div className="flex items-center gap-2">
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                    listing.Status === 'active' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {listing.Status?.toUpperCase()}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {listing.Posttype}
                                </span>
                            </div>
                        </div>

                        {/* Card Footer - Actions */}
                        <div className="border-t border-gray-200 p-4 bg-gray-50 flex flex-col gap-2">
                            <div className="flex gap-2">
                                <Link 
                                    to={`/listing/${listing.id}`}
                                    className="flex-1 text-center bg-gray-600 text-white px-3 py-2 rounded hover:bg-gray-700 text-xs sm:text-sm font-semibold transition"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    View
                                </Link>
                                {listing.Status === 'active' ? (
                                    <button
                                        onClick={() => handleDeactivate(listing.id)}
                                        className="flex-1 bg-orange-600 text-white px-3 py-2 rounded hover:bg-orange-700 text-xs sm:text-sm font-semibold transition"
                                    >
                                        Deactivate
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleActivate(listing.id)}
                                        className="flex-1 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 text-xs sm:text-sm font-semibold transition"
                                    >
                                        Activate
                                    </button>
                                )}
                            </div>
                            <button
                                onClick={() => handleDelete(listing.id)}
                                className="w-full bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 text-xs sm:text-sm font-semibold transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredListings.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-base sm:text-lg">
                        {search ? 'No listings match your search.' : 'No listings found.'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default ManageAllListings;