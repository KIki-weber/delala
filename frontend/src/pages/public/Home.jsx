import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Home = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cities, setCities] = useState([]);
    const [serviceTypes, setServiceTypes] = useState([]);
    const [filters, setFilters] = useState({
        search: '',
        postType: '',
        cityId: '',
        subcityId: '',
        serviceTypeId: '',
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
            if (filterValues.serviceTypeId) params.append('ServicetypeId', filterValues.serviceTypeId);
            if (filterValues.minPrice) params.append('minprice', filterValues.minPrice);
            if (filterValues.maxPrice) params.append('maxprice', filterValues.maxPrice);
            
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
                serviceTypeId: '',
                minPrice: '',
                maxPrice: ''
            });
        };
        initialize();
    }, []);

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
            serviceTypeId: '',
            minPrice: '',
            maxPrice: ''
        };
        setFilters(resetFilterValues);
        fetchListingsWithFilters(resetFilterValues);
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    const resolveImageUrl = (img) => {
        if (!img) return '/placeholder-image.jpg';
        if (img.startsWith('http')) return img;
        if (img.startsWith('/')) return `http://localhost:3003${img}`;
        return img;
    };

    return (
        <div className="bg-slate-50 text-slate-900 transition-all duration-500 ease-out">
            <div className="container mx-auto px-4 py-6 md:py-8 lg:py-10">
                <section className="mb-8 md:mb-10 rounded-2xl md:rounded-3xl lg:rounded-4xl bg-gradient-to-r from-sky-600 to-indigo-600 p-6 md:p-8 lg:p-10 text-white shadow-2xl transition-transform duration-500 hover:-translate-y-1">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">Find your Next Home and Sell Products</h1>
                    <p className="max-w-3xl text-sm sm:text-base md:text-lg text-slate-100/90 mb-6 md:mb-8">Search listings across cities, subcities, and service categories. Smooth filters, beautiful cards, and an easy way to explore rental and sale listings.</p>
                    <div className="flex flex-wrap gap-3 md:gap-4">
                        <Link to="/login" className="inline-flex items-center justify-center rounded-lg md:rounded-full bg-white/90 px-4 md:px-6 py-2 md:py-3 text-slate-900 font-semibold shadow-lg hover:bg-white transition text-sm md:text-base">Login</Link>
                        <Link to="/register" className="inline-flex items-center justify-center rounded-lg md:rounded-full border border-white/30 bg-white/10 px-4 md:px-6 py-2 md:py-3 text-white font-semibold hover:bg-white/20 transition text-sm md:text-base">Register</Link>
                    </div>
                </section>

                <h2 className="text-3xl font-bold mb-6 md:mb-8">Available Rentals & Properties</h2>
                
                {/* Filter Section - RESPONSIVE LAYOUT */}
                <div className="bg-white p-4 md:p-6 lg:p-8 rounded-2xl md:rounded-3xl mb-8 shadow-lg ring-1 ring-slate-200 transition-all duration-500">
                    <form onSubmit={applyFilters} className="flex flex-col gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                            <input
                                type="text"
                                name="search"
                                placeholder="Search title or description..."
                                value={filters.search}
                                onChange={handleFilterChange}
                                className="p-2 md:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm md:text-base"
                            />
                            
                            <select
                                name="postType"
                                value={filters.postType}
                                onChange={handleFilterChange}
                                className="p-2 md:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm md:text-base"
                            >
                                <option value="">All Types</option>
                                <option value="rent">For Rent</option>
                                <option value="sell">For Sale</option>
                            </select>
                            
                            <select
                                name="cityId"
                                value={filters.cityId}
                                onChange={handleFilterChange}
                                className="p-2 md:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm md:text-base"
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
                                className="p-2 md:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition text-sm md:text-base"
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
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                            <select
                                name="serviceTypeId"
                                value={filters.serviceTypeId}
                                onChange={handleFilterChange}
                                className="p-2 md:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm md:text-base"
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
                                className="p-2 md:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm md:text-base"
                            />
                            
                            <input
                                type="number"
                                name="maxPrice"
                                placeholder="Max Price (ETB)"
                                value={filters.maxPrice}
                                onChange={handleFilterChange}
                                className="p-2 md:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm md:text-base"
                            />
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3 justify-end">
                            <button 
                                type="submit" 
                                className="bg-blue-600 text-white px-6 md:px-8 py-2 md:py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold shadow-md text-sm md:text-base order-2 sm:order-1"
                            >
                                Search
                            </button>
                            <button 
                                type="button" 
                                onClick={resetFilters} 
                                className="bg-gray-500 text-white px-6 md:px-8 py-2 md:py-3 rounded-lg hover:bg-gray-600 transition duration-200 font-semibold shadow-md text-sm md:text-base order-1 sm:order-2"
                            >
                                Reset
                            </button>
                        </div>
                    </form>
                </div>
                
                {/* Listings Grid - RESPONSIVE */}
                {Array.isArray(listings) && listings.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
                                const whatsappPhone = listing.contactPhone?.replace(/\D/g, '');
                                const whatsappLink = `https://wa.me/${whatsappPhone}`;
                                const callLink = `tel:${listing.contactPhone}`;
                                
                                return (
                                    <div 
                                        key={listing.id} 
                                        onClick={() => window.location.href = `/listing/${listing.id}`}
                                        className={`border border-gray-200 rounded-xl md:rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 bg-white ${isInactive ? 'opacity-75' : ''} cursor-pointer hover:-translate-y-1`}
                                    >
                                        <div className="relative w-full h-40 md:h-48 bg-gray-100 group">
                                            {(listing.featuredImage || (listing.Image && listing.Image.length > 0)) ? (
                                                <img
                                                    src={resolveImageUrl(listing.featuredImage || (listing.Image && listing.Image[0]))}
                                                    alt={listing.Title}
                                                    className={`block w-full h-40 md:h-48 object-cover ${isInactive ? 'grayscale' : ''}`}
                                                    onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}
                                                />
                                            ) : (
                                                <div className="w-full h-40 md:h-48 flex items-center justify-center text-gray-400 text-sm md:text-base">No Image</div>
                                            )}
                                            
                                            <div className={`absolute top-2 md:top-3 right-2 md:right-3 ${statusBadge.color} ${statusBadge.textColor} px-2 md:px-3 py-1 rounded-lg text-xs md:text-sm font-bold shadow-lg border-2 border-white`}>
                                                {statusBadge.label}
                                            </div>
                                            
                                            {isInactive && (
                                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                                    <div className="bg-gray-800/90 text-white px-3 py-2 rounded-lg text-center">
                                                        <p className="font-bold text-xs md:text-sm">This listing is INACTIVE</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="p-3 md:p-4">
                                            <h2 className="text-lg md:text-xl font-semibold mb-1 md:mb-2 text-gray-800 line-clamp-2">
                                                {listing.Title}
                                            </h2>
                                            <p className="text-gray-600 mb-2 line-clamp-2 text-sm md:text-base">
                                                {listing.Description?.substring(0, 100)}...
                                            </p>
                                            <p className="text-xl md:text-2xl font-bold text-blue-600 mb-3 md:mb-4">
                                                ETB {listing.Price?.toLocaleString()}
                                            </p>
                                            
                                            <div className="space-y-1 mb-3 md:mb-4 text-xs md:text-sm text-gray-600">
                                                <p>{listing.city?.Name || 'N/A'} {listing.subcity?.Name && `- ${listing.subcity.Name}`}</p>
                                                <p>{listing.Servicetype?.Name || 'N/A'} • {listing.Posttype === 'rent' ? 'Rent' : 'Sale'}</p>
                                                <p>{listing.Views || 0} views • Contact: {listing.contactPhone}</p>
                                            </div>

                                            {/* Seller Info */}
                                            <div className="mb-3 md:mb-4 p-2 md:p-3 bg-blue-50 rounded-lg border border-blue-200 cursor-pointer hover:border-blue-400 transition"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    window.location.href = `/user/${listing.userId}`;
                                                }}
                                            >
                                                <p className="text-xs text-gray-600">Seller</p>
                                                <p className="text-sm md:text-base font-semibold text-blue-600 hover:text-blue-800 transition">
                                                    {listing.owner?.name || 'Anonymous'} →
                                                </p>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="grid grid-cols-3 gap-2">
                                                <a 
                                                    href={whatsappLink} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="bg-green-500 text-white px-2 md:px-3 py-1 md:py-2 rounded-lg hover:bg-green-600 transition text-xs md:text-sm font-semibold text-center"
                                                >
                                                    WhatsApp
                                                </a>
                                                <a 
                                                    href={callLink} 
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="bg-blue-500 text-white px-2 md:px-3 py-1 md:py-2 rounded-lg hover:bg-blue-600 transition text-xs md:text-sm font-semibold text-center"
                                                >
                                                    Call
                                                </a>
                                                <button 
                                                    className="bg-gray-600 text-white px-2 md:px-3 py-1 md:py-2 rounded-lg hover:bg-gray-700 transition text-xs md:text-sm font-semibold"
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
                    <div className="text-center py-12 md:py-16 bg-gray-50 rounded-lg">
                        <p className="text-gray-500 text-lg md:text-xl mb-2">No listings found.</p>
                        <p className="text-gray-400 text-sm md:text-base">Try adjusting your filters or check back later.</p>
                    </div>
                )}

                <section id="about" className="mt-12 md:mt-16 rounded-2xl md:rounded-3xl bg-white p-6 md:p-8 shadow-lg ring-1 ring-slate-200 transition-all duration-500">
                    <div className="text-center mb-6">
                        <p className="text-sm uppercase tracking-[0.35em] text-sky-600">About</p>
                        <h2 className="text-2xl md:text-3xl font-semibold mt-4">Built by Kiki Developer</h2>
                    </div>
                    <p className="mx-auto max-w-3xl text-slate-700 leading-8 text-sm md:text-base">This platform was created to make property search and listing management smooth and intuitive. Browse properties, filter by category or location, and manage your listings with a clean, modern home experience.</p>
                </section>

                <footer className="mt-12 md:mt-16 border-t border-slate-200 py-8 text-center text-slate-500">
                    <p className="mb-4">© {new Date().getFullYear()} Kiki Developer</p>
                    <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 text-sm md:text-base">
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