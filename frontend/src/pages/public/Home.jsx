import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { resolveApiUrl } from '../../utils/apiUrl';

const Home = () => {
    const [listings, setListings] = useState([]);
    const [posterProfiles, setPosterProfiles] = useState({});
    const [loading, setLoading] = useState(true);
    const [cities, setCities] = useState([]);
    const [serviceTypes, setServiceTypes] = useState([]);
    const [filters, setFilters] = useState({
        search: '',
        postType: '',
        cityId: '',
        subcityId: '',
        ServiceTypeId: '',
        minPrice: '',
        maxPrice: ''
    });

    const fetchFilters = async () => {
        try {
            const [citiesRes, serviceTypesRes] = await Promise.all([
                api.get('/cities'),
                api.get('/service-types')
            ]);
            setCities(citiesRes.data?.data || []);
            setServiceTypes(serviceTypesRes.data?.data || []);
        } catch (error) {
            console.error('Error fetching filters:', error);
            setCities([]);
            setServiceTypes([]);
        }
    };

    const fetchListingsWithFilters = async (filterValues) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filterValues.search) params.append('search', filterValues.search);
            if (filterValues.postType) params.append('postType', filterValues.postType);
            if (filterValues.cityId) params.append('cityId', filterValues.cityId);
            if (filterValues.subcityId) params.append('subcityId', filterValues.subcityId);
            if (filterValues.ServiceTypeId) params.append('ServiceTypeId', filterValues.ServiceTypeId);
            if (filterValues.minPrice) params.append('minPrice', filterValues.minPrice);
            if (filterValues.maxPrice) params.append('maxPrice', filterValues.maxPrice);

            const response = await api.get(`/posts/allpost?${params.toString()}`);

            let listingsData = [];
            if (response.data?.data && Array.isArray(response.data.data)) {
                listingsData = response.data.data;
            } else if (response.data && Array.isArray(response.data)) {
                listingsData = response.data;
            } else if (response.data?.listings && Array.isArray(response.data.listings)) {
                listingsData = response.data.listings;
            }

            setListings(listingsData);
        } catch (error) {
            console.error('Error fetching listings:', error);
            setListings([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const initialize = async () => {
            await fetchFilters();
            await fetchListingsWithFilters({
                search: '',
                postType: '',
                cityId: '',
                ServiceTypeId: '',
                minPrice: '',
                maxPrice: ''
            });
        };
        initialize();
    }, []);

    useEffect(() => {
        const fetchPosterProfiles = async () => {
            const userIds = [...new Set(
                (Array.isArray(listings) ? listings : [])
                    .map((listing) => listing.userId)
                    .filter(Boolean)
            )];

            const idsToFetch = userIds.filter((userId) => !posterProfiles[userId]);
            if (idsToFetch.length === 0) return;

            try {
                const results = await Promise.allSettled(
                    idsToFetch.map((userId) => api.get(`/users/${userId}`))
                );

                const nextProfiles = {};
                results.forEach((result, index) => {
                    const userId = idsToFetch[index];
                    if (result.status === 'fulfilled') {
                        const profile = result.value.data?.data?.user || result.value.data?.data || null;
                        if (profile) {
                            nextProfiles[userId] = profile;
                        }
                    }
                });

                if (Object.keys(nextProfiles).length > 0) {
                    setPosterProfiles((prev) => ({
                        ...prev,
                        ...nextProfiles
                    }));
                }
            } catch (error) {
                console.error('Error fetching poster profiles:', error);
            }
        };

        if (listings.length > 0) {
            fetchPosterProfiles();
        }
    }, [listings, posterProfiles]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };

    const applyFilters = (e) => {
        e.preventDefault();
        fetchListingsWithFilters(filters);
    };

    const resetFilters = () => {
        const resetFilterValues = {
            search: '',
            postType: '',
            cityId: '',
            ServiceTypeId: '',
            minPrice: '',
            maxPrice: ''
        };
        setFilters(resetFilterValues);
        fetchListingsWithFilters(resetFilterValues);
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    const resolveImageUrl = resolveApiUrl;
    const getListingImage = (listing) => listing.featuredImage || listing.Image?.[0] || null;
    const getPosterName = (listing) => listing.owner?.name || listing.user?.name || 'Anonymous';
    const getInitials = (name) => {
        const parts = (name || '').trim().split(/\s+/).filter(Boolean);
        if (parts.length === 0) return 'A';
        return parts.slice(0, 2).map(part => part[0].toUpperCase()).join('');
    };

    return (
        <div className="bg-slate-50 text-slate-900 transition-all duration-500 ease-out">
            <div className="container mx-auto px-4 py-6 md:py-8 lg:py-10">
                <section className="mb-8 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 p-6 text-white shadow-2xl transition-transform duration-500 hover:-translate-y-1 md:mb-10 md:rounded-3xl md:p-8 lg:rounded-4xl lg:p-10">
                    <h1 className="mb-3 text-2xl font-bold sm:text-3xl md:mb-4 md:text-4xl lg:text-5xl">
                        Find your Next Home and Sell Products
                    </h1>
                    <p className="mb-6 max-w-3xl text-sm text-slate-100/90 sm:text-base md:mb-8 md:text-lg">
                        Search listings across cities, subcities, and service categories. Use the filters below to explore rental and sale listings.
                    </p>
                    <div className="flex flex-wrap gap-3 md:gap-4">
                        <Link to="/login" className="inline-flex items-center justify-center rounded-lg bg-white/90 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg transition hover:bg-white sm:text-base md:rounded-full md:px-6 md:py-3">
                            Login
                        </Link>
                        <Link to="/register" className="inline-flex items-center justify-center rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20 sm:text-base md:rounded-full md:px-6 md:py-3">
                            Register
                        </Link>
                    </div>
                </section>

                <h2 className="mb-6 text-3xl font-bold md:mb-8">Available Rentals & Properties</h2>

                <div className="mb-8 rounded-2xl bg-white p-4 shadow-lg ring-1 ring-slate-200 transition-all duration-500 md:rounded-3xl md:p-6 lg:p-8">
                    <form onSubmit={applyFilters} className="flex flex-col gap-4">
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-4">
                            <input
                                type="text"
                                name="search"
                                placeholder="Search title or description..."
                                value={filters.search}
                                onChange={handleFilterChange}
                                className="rounded-lg border border-gray-300 p-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500 md:p-3 md:text-base"
                            />
                            <select
                                name="postType"
                                value={filters.postType}
                                onChange={handleFilterChange}
                                className="rounded-lg border border-gray-300 p-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500 md:p-3 md:text-base"
                            >
                                <option value="">All Types</option>
                                <option value="rent">For Rent</option>
                                <option value="sell">For Sale</option>
                            </select>
                            <select
                                name="cityId"
                                value={filters.cityId}
                                onChange={handleFilterChange}
                                className="rounded-lg border border-gray-300 p-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500 md:p-3 md:text-base"
                            >
                                <option value="">All Cities</option>
                                {Array.isArray(cities) && cities.map(city => (
                                    <option key={city.id} value={city.id}>
                                        {city.Name}
                                    </option>
                                ))}
                            </select>
                            <select
                                name="subcityId"
                                value={filters.subcityId}
                                onChange={handleFilterChange}
                                disabled={!filters.cityId}
                                className="rounded-lg border border-gray-300 p-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 md:p-3 md:text-base"
                            >
                                <option value="">All Subcities</option>
                                {Array.isArray(cities) && cities
                                    .find(city => city.id === parseInt(filters.cityId))
                                    ?.Subcities?.map(subcity => (
                                        <option key={subcity.id} value={subcity.id}>
                                            {subcity.Name}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
                            <select
                                name="ServiceTypeId"
                                value={filters.ServiceTypeId}
                                onChange={handleFilterChange}
                                className="rounded-lg border border-gray-300 p-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500 md:p-3 md:text-base"
                            >
                                <option value="">All Categories</option>
                                {Array.isArray(serviceTypes) && serviceTypes.map(type => (
                                    <option key={type.id} value={type.id}>
                                        {type.Name}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="number"
                                name="minPrice"
                                placeholder="Min Price (ETB)"
                                value={filters.minPrice}
                                onChange={handleFilterChange}
                                className="rounded-lg border border-gray-300 p-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500 md:p-3 md:text-base"
                            />
                            <input
                                type="number"
                                name="maxPrice"
                                placeholder="Max Price (ETB)"
                                value={filters.maxPrice}
                                onChange={handleFilterChange}
                                className="rounded-lg border border-gray-300 p-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500 md:p-3 md:text-base"
                            />
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="submit"
                                className="order-2 rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-md transition duration-200 hover:bg-blue-700 sm:order-1 md:px-8 md:py-3 md:text-base"
                            >
                                Search
                            </button>
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="order-1 rounded-lg bg-gray-500 px-6 py-2 text-sm font-semibold text-white shadow-md transition duration-200 hover:bg-gray-600 sm:order-2 md:px-8 md:py-3 md:text-base"
                            >
                                Reset
                            </button>
                        </div>
                    </form>
                </div>

                {Array.isArray(listings) && listings.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
                        {listings
                            .filter(listing => {
                                const status = listing.Status?.toLowerCase() || 'active';
                                return status !== 'inactive';
                            })
                            .map((listing) => {
                                const getStatusBadge = () => {
                                    const status = listing.Status?.toLowerCase() || 'active';
                                    const postType = listing.Posttype?.toLowerCase();

                                    if (status === 'inactive') {
                                        return { label: 'INACTIVE', color: 'bg-gray-600', textColor: 'text-white' };
                                    } else if (status === 'sold' || (postType === 'sell' && status === 'closed')) {
                                        return { label: 'SOLD', color: 'bg-red-600', textColor: 'text-white' };
                                    } else if (status === 'rented' || (postType === 'rent' && status === 'closed')) {
                                        return { label: 'RENTED', color: 'bg-blue-600', textColor: 'text-white' };
                                    } else {
                                        return { label: 'ACTIVE', color: 'bg-green-600', textColor: 'text-white' };
                                    }
                                };

                                const statusBadge = getStatusBadge();
                                const isInactive = (listing.Status?.toLowerCase() || 'active') === 'inactive';
                                const posterProfile = posterProfiles[listing.userId];
                                const posterPhoto =
                                    posterProfile?.profilePhoto ||
                                    posterProfile?.avatar ||
                                    listing.owner?.profilePhoto ||
                                    listing.owner?.avatar ||
                                    listing.user?.profilePhoto ||
                                    listing.user?.avatar ||
                                    null;
                                const posterName = getPosterName(listing);
                                const whatsappPhone = listing.contactPhone?.replace(/\D/g, '');
                                const whatsappLink = `https://wa.me/${whatsappPhone}`;
                                const callLink = `tel:${listing.contactPhone}`;

                                return (
                                    <div
                                        key={listing.id}
                                        onClick={() => window.location.href = `/listing/${listing.id}`}
                                        className={`cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:rounded-2xl ${isInactive ? 'opacity-75' : ''}`}
                                    >
                                        <div
                                            className="flex items-center gap-3 border-b border-gray-100 px-3 py-3 md:px-4"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Link
                                                to={`/user/${listing.userId}`}
                                                className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-blue-200 bg-slate-100 text-sm font-bold text-slate-700"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {posterPhoto ? (
                                                    <img
                                                        src={resolveImageUrl(posterPhoto)}
                                                        alt={posterName}
                                                        className="h-full w-full object-cover"
                                                        onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}
                                                    />
                                                ) : (
                                                    <span>{getInitials(posterName)}</span>
                                                )}
                                            </Link>

                                            <div className="min-w-0 flex-1">
                                                <Link
                                                    to={`/user/${listing.userId}`}
                                                    className="block truncate text-sm font-semibold text-blue-700 transition hover:text-blue-900"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    {posterName}
                                                </Link>
                                                <p className="truncate text-xs text-gray-500">Posted by</p>
                                            </div>
                                        </div>

                                        <div className="relative w-full bg-gray-100 group">
                                            {(listing.featuredImage || (listing.Image && listing.Image.length > 0)) ? (
                                                <div className="flex items-center justify-center overflow-hidden p-2">
                                                    <img
                                                        src={resolveImageUrl(getListingImage(listing))}
                                                        alt={listing.Title}
                                                        className={`block w-full max-h-72 object-contain ${isInactive ? 'grayscale' : ''}`}
                                                        onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex min-h-56 items-center justify-center py-10 text-sm text-gray-400 md:text-base">
                                                    No image available
                                                </div>
                                            )}

                                            <div className={`absolute right-2 top-2 rounded-lg border-2 border-white px-2 py-1 text-xs font-bold shadow-lg md:right-3 md:top-3 md:px-3 md:text-sm ${statusBadge.color} ${statusBadge.textColor}`}>
                                                {statusBadge.label}
                                            </div>

                                            {isInactive && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                    <div className="rounded-lg bg-gray-800/90 px-3 py-2 text-center text-white">
                                                        <p className="text-xs font-bold md:text-sm">This listing is INACTIVE</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-3 md:p-4">
                                            <h2 className="mb-1 line-clamp-2 text-lg font-semibold text-gray-800 md:mb-2 md:text-xl">
                                                {listing.Title}
                                            </h2>
                                            <p className="mb-2 line-clamp-2 text-sm text-gray-600 md:text-base">
                                                {listing.Description?.substring(0, 100)}...
                                            </p>
                                            <p className="mb-3 text-xl font-bold text-blue-600 md:mb-4 md:text-2xl">
                                                ETB {listing.Price?.toLocaleString()}
                                            </p>

                                            <div className="mb-3 space-y-1 text-xs text-gray-600 md:mb-4 md:text-sm">
                                                <p>{listing.city?.Name || 'N/A'} {listing.subcity?.Name && `- ${listing.subcity.Name}`}</p>
                                                <p>{listing.ServiceType?.Name || 'N/A'} - {listing.Posttype === 'rent' ? 'Rent' : 'Sale'}</p>
                                                <p>{listing.Views || 0} views - Contact: {listing.contactPhone}</p>
                                            </div>

                                            <div
                                                className="mb-3 cursor-pointer rounded-lg border border-blue-200 bg-blue-50 p-2 transition hover:border-blue-400 md:mb-4 md:p-3"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    window.location.href = `/user/${listing.userId}`;
                                                }}
                                            >
                                                <p className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition">
                                                    {listing.owner?.name || 'Anonymous'}
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-3 gap-2">
                                                <a
                                                    href={whatsappLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="rounded-lg bg-green-500 px-2 py-1 text-center text-xs font-semibold text-white transition hover:bg-green-600 md:px-3 md:py-2 md:text-sm"
                                                >
                                                    WhatsApp
                                                </a>
                                                <a
                                                    href={callLink}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="rounded-lg bg-blue-500 px-2 py-1 text-center text-xs font-semibold text-white transition hover:bg-blue-600 md:px-3 md:py-2 md:text-sm"
                                                >
                                                    Call
                                                </a>
                                                <button
                                                    className="rounded-lg bg-gray-600 px-2 py-1 text-xs font-semibold text-white transition hover:bg-gray-700 md:px-3 md:py-2 md:text-sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        window.location.href = `/listing/${listing.id}`;
                                                    }}
                                                >
                                                    Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                ) : (
                    <div className="rounded-lg bg-gray-50 py-12 text-center md:py-16">
                        <p className="mb-2 text-lg text-gray-500 md:text-xl">No listings found.</p>
                        <p className="text-sm text-gray-400 md:text-base">Try adjusting your filters or check back later.</p>
                    </div>
                )}

                <section id="about" className="mt-12 rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-200 transition-all duration-500 md:mt-16 md:rounded-3xl md:p-8">
                    <div className="mb-6 text-center">
                        <h2 className="text-2xl font-semibold md:text-3xl">Built by Kiki Developer</h2>
                    </div>
                    <p className="mx-auto max-w-3xl text-sm leading-8 text-slate-700 md:text-base">
                        Browse properties, filter by category or location, and manage listings with a clean, modern home experience.
                    </p>
                </section>

                <footer className="mt-12 border-t border-slate-200 py-8 text-center text-slate-500 md:mt-16">
                    <p className="mb-4">(c) {new Date().getFullYear()} Kiki Developer</p>
                    <div className="flex flex-wrap items-center justify-center gap-3 text-sm md:gap-4 md:text-base">
                        <Link to="/" className="text-slate-600 hover:text-sky-600">Home</Link>
                        <span className="text-slate-300">|</span>
                        <a href="#about" className="text-slate-600 hover:text-sky-600">About</a>
                        <span className="text-slate-300">|</span>
                        <Link to="/login" className="text-slate-600 hover:text-sky-600">Login</Link>
                        <span className="text-slate-300">|</span>
                        <Link to="/register" className="text-slate-600 hover:text-sky-600">Register</Link>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Home;
