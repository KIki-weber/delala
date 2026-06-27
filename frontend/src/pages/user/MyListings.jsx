import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
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
        if (!window.confirm('Are you sure you want to delete this listing?')) return;

        try {
            await api.delete(`/posts/${id}`);
            setListings(listings.filter((listing) => listing.id !== id));
        } catch (error) {
            console.error('Error deleting listing:', error);
            alert('Failed to delete listing');
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await api.put(`/posts/${id}/status`, { status: newStatus });
            const response = await api.get('/posts/my/posts');
            setListings(response.data.data);
        } catch (error) {
            console.error('Error changing listing status:', error);
            alert('Failed to change listing status');
        }
    };

    const getStatusBadge = (listing) => {
        const status = listing.Status?.toLowerCase() || 'active';
        const postType = listing.Posttype?.toLowerCase();

        if (status === 'inactive') {
            return { label: 'Inactive', color: 'border-slate-400/30 bg-slate-500/15 text-slate-200' };
        }

        if (status === 'sold' || (postType === 'sell' && status === 'closed')) {
            return { label: 'Sold', color: 'border-red-400/30 bg-red-500/15 text-red-200' };
        }

        if (status === 'rented' || (postType === 'rent' && status === 'closed')) {
            return { label: 'Rented', color: 'border-blue-400/30 bg-blue-500/15 text-blue-200' };
        }

        return { label: 'Active', color: 'border-emerald-400/30 bg-emerald-500/15 text-emerald-200' };
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen overflow-hidden bg-slate-950 text-white">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
            <div className="absolute left-[-7rem] top-20 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
            <div className="absolute right-[-6rem] top-36 h-80 w-80 rounded-full bg-orange-500/20 blur-3xl" />
            <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.45em] text-orange-300">My Posts</p>
                            <h1 className="mt-2 text-3xl font-bold text-neon-lime sm:text-4xl">My Listings</h1>
                            <p className="mt-2 max-w-2xl text-sm text-slate-300">
                                Track your posts, switch their status, and keep them fresh.
                            </p>
                        </div>

                        <Link
                            to="/user/create-listing"
                            className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 via-sky-500 to-blue-500 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:from-blue-500 hover:to-cyan-500"
                        >
                            Create New Listing
                        </Link>
                    </div>
                </div>

                {listings.length === 0 ? (
                    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-10 text-center shadow-2xl backdrop-blur-xl">
                        <p className="text-lg text-slate-200">You haven't created any listings yet.</p>
                        <Link
                            to="/user/create-listing"
                            className="mt-6 inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                        >
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
                                    className={`rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-xl transition hover:-translate-y-1 hover:border-blue-400/30 sm:p-6 ${isInactive ? 'opacity-80' : ''}`}
                                >
                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
                                        <Link to={`/listing/${listing.id}`} className="group block w-full lg:w-72">
                                            <div className="relative h-52 overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/60">
                                                <img
                                                    src={resolveImageUrl(listing.featuredImage || (listing.Image && listing.Image[0]))}
                                                    alt={listing.Title}
                                                    className={`h-full w-full object-cover transition duration-300 group-hover:scale-105 ${isInactive ? 'grayscale' : ''}`}
                                                    onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}
                                                />

                                                <div className={`absolute left-3 top-3 rounded-full border px-3 py-1 text-xs font-semibold ${statusBadge.color}`}>
                                                    {statusBadge.label}
                                                </div>

                                                {isInactive && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                                                        <div className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-2 text-center">
                                                            <p className="text-sm font-semibold text-white">This listing is inactive</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </Link>

                                        <div className="flex flex-1 flex-col justify-between gap-4">
                                            <div>
                                                <h2 className="text-xl font-semibold text-white line-clamp-2">
                                                    {listing.Title}
                                                </h2>
                                                <p className="mt-2 line-clamp-2 text-sm text-slate-300">
                                                    {listing.Description?.substring(0, 150)}...
                                                </p>
                                                <p className="mt-3 text-2xl font-bold text-orange-300">
                                                    ETB {parseFloat(listing.Price).toLocaleString()}
                                                </p>

                                                <div className="mt-4 grid gap-2 text-sm text-slate-300 sm:grid-cols-3">
                                                    <div className="rounded-2xl border border-white/10 bg-slate-950/50 px-3 py-2">
                                                        {listing.city?.Name || 'N/A'}
                                                    </div>
                                                    <div className="rounded-2xl border border-white/10 bg-slate-950/50 px-3 py-2">
                                                        {listing.ServiceType?.Name || 'N/A'}
                                                    </div>
                                                    <div className="rounded-2xl border border-white/10 bg-slate-950/50 px-3 py-2">
                                                        Views {listing.Views || 0}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                                                <Link
                                                    to={`/listing/${listing.id}`}
                                                    className="rounded-2xl bg-slate-800 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-700"
                                                >
                                                    View
                                                </Link>
                                                <Link
                                                    to={`/user/edit-listing/${listing.id}`}
                                                    className="rounded-2xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
                                                >
                                                    Edit
                                                </Link>
                                                <select
                                                    value={listing.Status?.toLowerCase() || 'active'}
                                                    onChange={(e) => handleStatusChange(listing.id, e.target.value)}
                                                    className="rounded-2xl border border-white/10 bg-indigo-600 px-4 py-3 text-sm font-semibold text-white outline-none transition hover:bg-indigo-700"
                                                >
                                                    <option value="active">Active</option>
                                                    <option value="inactive">Inactive</option>
                                                    <option value="sold">Sold</option>
                                                    <option value="rented">Rented</option>
                                                </select>
                                                <button
                                                    onClick={() => handleDelete(listing.id)}
                                                    className="rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyListings;
