import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Icon from '../../components/ui/Icon';

const ListingDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        const loadListing = async () => {
            try {
                const response = await api.get(`/posts/${id}`);
                setListing(response.data.data);
            } catch (error) {
                console.error('Error fetching listing:', error);
            } finally {
                setLoading(false);
            }
        };

        loadListing();
    }, [id]);

    if (loading) return <LoadingSpinner />;
    if (!listing) return <div className="text-center py-10">Listing not found</div>;

    const images = listing.Image || [];

    const resolveImageUrl = (img) => {
        if (!img) return '/placeholder-image.jpg';
        if (img.startsWith('http')) return img;
        if (img.startsWith('/')) return `http://localhost:3003${img}`;
        return img;
    };

    const handleCallNow = () => {
        if (listing.contactPhone) {
            window.location.href = `tel:${listing.contactPhone}`;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4">
            <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl sm:rounded-4xl bg-white shadow-2xl ring-1 ring-slate-200 transition-transform duration-500 max-h-[90vh] overflow-y-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute right-2 sm:right-4 top-2 sm:top-4 z-10 inline-flex h-8 sm:h-10 w-8 sm:w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 shadow hover:bg-slate-200 transition"
                    aria-label="Close"
                >
                    <span className="sr-only">Close</span>
                    <svg className="h-4 sm:h-5 w-4 sm:w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <div className="p-3 sm:p-4 md:p-6 lg:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                        <div className="md:col-span-2">
                            {images.length > 0 ? (
                                <div>
                                    <img src={resolveImageUrl(images[selectedImage])} alt="main" className="w-full h-48 sm:h-64 md:h-80 object-cover rounded" onError={(e)=>e.target.src='/placeholder-image.jpg'} />
                                    <div className="mt-2 sm:mt-3 flex gap-1 sm:gap-2 overflow-x-auto pb-2">
                                        {images.map((img, idx) => (
                                            <img key={img} src={resolveImageUrl(img)} alt={`thumb-${idx}`} onClick={() => setSelectedImage(idx)} className={`w-16 sm:w-20 h-16 sm:h-20 object-cover rounded cursor-pointer border-2 flex-shrink-0 ${selectedImage===idx? 'border-blue-600':'border-transparent'}`} onError={(e)=>e.target.src='/placeholder-image.jpg'} />
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full h-48 sm:h-64 md:h-80 bg-gray-100 flex items-center justify-center rounded text-gray-500">No photos</div>
                            )}
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 pr-8">
                                {listing.Title}
                            </h1>

                            {/* Description moved right after title */}
                            <div className="mb-4 sm:mb-6">
                                <p className="text-gray-700 text-xs sm:text-sm font-semibold inline-flex items-center gap-2">
                                    <Icon name="note" className="h-4 sm:h-5 w-4 sm:w-5 text-sky-600" />
                                    Description
                                </p>
                                <p className="text-gray-700 whitespace-pre-wrap mt-2 text-xs sm:text-sm leading-relaxed">{listing.Description}</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b">
                                <div>
                                    <p className="text-gray-600 text-xs sm:text-sm inline-flex items-center gap-2">
                                        <Icon name="price" className="h-4 w-4 text-sky-600" />
                                        Price
                                    </p>
                                    <p className="text-lg sm:text-2xl font-bold text-blue-600">ETB {listing.Price}</p>
                                    <p className="text-xs sm:text-sm text-gray-500">({listing.Pricetype})</p>
                                </div>
                                <div>
                                    <p className="text-gray-600 text-xs sm:text-sm inline-flex items-center gap-2">
                                        <Icon name="tag" className="h-4 w-4 text-sky-600" />
                                        Type
                                    </p>
                                    <p className="text-base sm:text-lg">{listing.Posttype === 'rent' ? '🏠 Rent' : '💰 Sale'}</p>
                                    <p className="text-xs sm:text-sm text-gray-500">{listing.Servicetype?.Name || listing.Servicetype?.name}</p>
                                </div>
                            </div>

                            <div className="mb-4 sm:mb-6">
                                <p className="text-gray-700 text-xs sm:text-sm font-semibold inline-flex items-center gap-2">
                                    <Icon name="location" className="h-4 sm:h-5 w-4 sm:w-5 text-sky-600" />
                                    Location
                                </p>
                                <p className="text-sm sm:text-base mt-1">{listing.city?.Name || listing.city?.name} - {listing.subcity?.Name || listing.subcity?.name}</p>
                                {listing.specificLocation && (
                                    <p className="text-gray-500 mt-1 text-xs sm:text-sm">📍 {listing.specificLocation}</p>
                                )}
                            </div>

                            {/* Call Now Button with Phone Number next to it */}
                            <div className="mb-4 sm:mb-6 p-2 sm:p-4 bg-gray-50 rounded-lg">
                                <p className="text-gray-700 mb-2 text-xs sm:text-sm font-semibold inline-flex items-center gap-2">
                                    <Icon name="phone" className="h-4 sm:h-5 w-4 sm:w-5 text-emerald-600" />
                                    Contact
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                                    <button
                                        onClick={handleCallNow}
                                        className="bg-green-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-green-700 text-sm sm:text-base font-semibold transition flex items-center justify-center gap-2"
                                    >
                                        📞 Call Now
                                    </button>
                                    {listing.contactPhone && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-500 text-xs sm:text-sm">or call</span>
                                            <span className="inline-flex items-center gap-2 text-base sm:text-lg font-semibold text-blue-700">
                                                <Icon name="phone" className="h-4 sm:h-5 w-4 sm:w-5 text-blue-600" />
                                                {listing.contactPhone}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {listing.customAttribute && Object.keys(listing.customAttribute).length > 0 && (
                                <div className="mb-4 sm:mb-6">
                                        <p className="text-gray-700 text-xs sm:text-sm font-semibold inline-flex items-center gap-2">
                                            <Icon name="wrench" className="h-4 sm:h-5 w-4 sm:w-5 text-sky-600" />
                                            Details
                                        </p>
                                    <div className="bg-gray-50 p-2 sm:p-4 rounded-lg mt-2 text-xs sm:text-sm">
                                        {Object.entries(listing.customAttribute).map(([key, value]) => (
                                            <p key={key} className="mb-1"><strong>{key}:</strong> {value}</p>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t text-xs sm:text-sm text-gray-500 space-y-1">
                                <p className="inline-flex items-center gap-2">
                                    <Icon name="calendar" className="h-4 w-4 text-sky-600" />
                                    Posted: {new Date(listing.createdAt).toLocaleDateString()}
                                </p>
                                <p className="inline-flex items-center gap-2">
                                    <Icon name="eye" className="h-4 w-4 text-sky-600" />
                                    Views: {listing.Views}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListingDetail;