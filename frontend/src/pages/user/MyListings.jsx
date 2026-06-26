import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../Services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { resolveApiUrl } from '../../utils/apiUrl';

const MyListings = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    const resolveImageUrl = resolveApiUrl;

    useEffect(() => {
        const loadMyListings = async () => {
            try {
                const response = await api.get('/posts/my/posts');
                setListings(response.data.data);
            } catch (error) {
                console.error('Error fetching listings:', error);
            } finally {
                setLoading(false);
            }
        };

        loadMyListings();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this listing?')) {
            try {
                await api.delete(`/posts/${id}`);
                setListings(listings.filter(listing => listing.id !== id));
            } catch (error) {
                console.error('Error deleting listing:', error);
                alert('Failed to delete listing');
            }
        }
    };

    // Handle status change from dropdown
    const handleStatusChange = async (id, newStatus) => {
        try {
            // Use the flexible /status endpoint for all status updates
            await api.put(`/posts/${id}/status`, { status: newStatus });
            
            // Refetch listings to ensure data persists
            const response = await api.get('/posts/my/posts');
            setListings(response.data.data);
        } catch (error) {
            console.error('Error changing listing status:', error);
            alert('Failed to change listing status');
        }
    };

    // Helper function to get status badge color and label
    const getStatusBadge = (listing) => {
        const status = listing.Status?.toLowerCase() || 'active';
        const postType = listing.Posttype?.toLowerCase();
        
        if (status === 'inactive') {
            return { label: '⚠️ INACTIVE', color: 'bg-gray-600', textColor: 'text-white', icon: '○' };
        } else if (status === 'sold' || (postType === 'sell' && status === 'closed')) {
            return { label: '✓ SOLD', color: 'bg-red-600', textColor: 'text-white', icon: '✓' };
        } else if (status === 'rented' || (postType === 'rent' && status === 'closed')) {
            return { label: '✓ RENTED', color: 'bg-blue-600', textColor: 'text-white', icon: '✓' };
        } else {
            return { label: '● ACTIVE', color: 'bg-green-600', textColor: 'text-white', icon: '●' };
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-7xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">My Listings</h1>
                <Link to="/user/create-listing" className="w-full sm:w-auto bg-green-600 text-white px-4 sm:px-6 py-3 sm:py-2 rounded hover:bg-green-700 transition text-center font-semibold text-sm sm:text-base">
                    + Create New Listing
                </Link>
            </div>
            
            {listings.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 mb-4 text-base sm:text-lg">You haven't created any listings yet.</p>
                    <Link to="/user/create-listing" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition font-semibold">
                        Create Your First Listing
                    </Link>
                </div>
            ) : (
                <div className="space-y-4 sm:space-y-6">
                    {listings.map((listing) => {
                        const statusBadge = getStatusBadge(listing);
                        const isInactive = (listing.Status?.toLowerCase() || 'active') === 'inactive';
                        
                        return (
                            <div 
                                key={listing.id} 
                                className={`border border-gray-200 rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition flex flex-col sm:flex-row gap-4 sm:gap-6 bg-white ${isInactive ? 'opacity-80' : ''}`}
                            >
                                {/* Image Section with Status Stamp */}
                                <div className="relative w-full sm:w-40 sm:shrink-0 h-48 sm:h-28 overflow-hidden rounded hover:opacity-80 transition group">
                                    <Link 
                                        to={`/listing/${listing.id}`}
                                    >
                                        <img
                                            src={resolveImageUrl(listing.featuredImage || (listing.Image && listing.Image[0]))}
                                            alt={listing.Title}
                                            className={`w-full h-full object-cover ${isInactive ? 'grayscale' : ''}`}
                                            onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}
                                        />
                                    </Link>
                                    
                                    {/* Status Badge - Stamp Style */}
                                    <div className={`absolute top-2 right-2 sm:top-1 sm:right-1 ${statusBadge.color} ${statusBadge.textColor} px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-full text-xs font-bold shadow-lg transform rotate-12 origin-top-right border border-white`}>
                                        {statusBadge.label}
                                    </div>
                                    
                                    {/* Overlay for inactive listings */}
                                    {isInactive && (
                                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                            <div className="bg-gray-800/90 text-white px-2 py-1 rounded text-center text-xs font-bold">
                                                INACTIVE
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Content Section */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h2 className="text-lg sm:text-xl font-semibold mb-2 line-clamp-2">{listing.Title}</h2>
                                        <p className="text-gray-600 text-sm sm:text-base mb-2 line-clamp-2">{listing.Description?.substring(0, 150)}...</p>
                                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                                            <p className="text-lg sm:text-xl font-bold text-blue-600">ETB {parseFloat(listing.Price).toLocaleString()}</p>
                                            <p className="text-sm sm:text-base text-gray-500">👁️ Views: {listing.Views || 0}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions Section */}
                                <div className="flex flex-col gap-2 sm:gap-2 sm:flex-col sm:items-end">
                                    <Link 
                                        to={`/listing/${listing.id}`} 
                                        className="w-full sm:w-24 text-center bg-gray-600 text-white px-3 py-2 rounded hover:bg-gray-700 text-xs sm:text-sm font-semibold transition"
                                    >
                                        View
                                    </Link>
                                    <Link 
                                        to={`/user/edit-listing/${listing.id}`} 
                                        className="w-full sm:w-24 text-center bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 text-xs sm:text-sm font-semibold transition"
                                    >
                                        Edit
                                    </Link>
                                    
                                    {/* Status Dropdown */}
                                    <select 
                                        value={listing.Status?.toLowerCase() || 'active'}
                                        onChange={(e) => handleStatusChange(listing.id, e.target.value)}
                                        className="w-full sm:w-28 bg-indigo-600 text-white px-3 py-2 rounded hover:bg-indigo-700 text-xs sm:text-sm font-semibold transition cursor-pointer"
                                    >
                                        <option value="active">● Active</option>
                                        <option value="inactive">⚠️ Inactive</option>
                                        <option value="sold">✓ Sold</option>
                                        <option value="rented">✓ Rented</option>
                                    </select>
                                    
                                    <button 
                                        onClick={() => handleDelete(listing.id)} 
                                        className="w-full sm:w-24 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 text-xs sm:text-sm font-semibold transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyListings;
