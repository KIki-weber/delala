import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../Services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { resolveApiUrl } from '../../utils/apiUrl';

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
    const mainImage = images[selectedImage];
    const resolveImageUrl = resolveApiUrl;

    const handleCallNow = () => {
        if (listing.contactPhone) {
            window.location.href = `tel:${listing.contactPhone}`;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4">
            <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto overflow-hidden rounded-2xl sm:rounded-4xl bg-white shadow-2xl ring-1 ring-slate-200 transition-transform duration-500">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute right-2 top-2 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700 shadow transition hover:bg-slate-200 sm:right-4 sm:top-4 sm:h-10 sm:w-10"
                    aria-label="Close"
                >
                    <span className="sr-only">Close</span>
                    <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                <div className="p-3 sm:p-4 md:p-6 lg:p-8">
                    <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
                        <div className="md:col-span-2">
                            {images.length > 0 ? (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-center overflow-hidden rounded-xl bg-slate-100 p-2">
                                        <img
                                            src={resolveImageUrl(mainImage)}
                                            alt="main"
                                            className="max-h-[70vh] w-full object-contain"
                                            onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}
                                        />
                                    </div>
                                    <div className="flex gap-1 overflow-x-auto pb-2 sm:gap-2">
                                        {images.map((img, idx) => (
                                            <img
                                                key={img}
                                                src={resolveImageUrl(img)}
                                                alt={`thumb-${idx}`}
                                                onClick={() => setSelectedImage(idx)}
                                                className={`h-16 w-16 flex-shrink-0 cursor-pointer rounded border-2 object-cover sm:h-20 sm:w-20 ${selectedImage === idx ? 'border-blue-600' : 'border-transparent'}`}
                                                onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex min-h-[18rem] items-center justify-center rounded-xl bg-gray-100 px-4 text-center text-gray-500">
                                    No photos available
                                </div>
                            )}
                        </div>

                        <div>
                            <h1 className="mb-3 pr-8 text-xl font-bold sm:mb-4 sm:text-2xl md:text-3xl">
                                {listing.Title}
                            </h1>

                            <div className="mb-4 sm:mb-6">
                                <p className="text-xs font-semibold text-gray-700 sm:text-sm">Description</p>
                                <p className="mt-2 whitespace-pre-wrap text-xs leading-relaxed text-gray-700 sm:text-sm">
                                    {listing.Description}
                                </p>
                            </div>

                            <div className="mb-4 grid grid-cols-1 gap-3 border-b pb-3 sm:mb-6 sm:gap-4 sm:pb-4 md:grid-cols-2">
                                <div>
                                    <p className="text-xs text-gray-600 sm:text-sm">Price</p>
                                    <p className="text-lg font-bold text-blue-600 sm:text-2xl">ETB {listing.Price}</p>
                                    <p className="text-xs text-gray-500 sm:text-sm">({listing.Pricetype})</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 sm:text-sm">Type</p>
                                    <p className="text-base sm:text-lg">{listing.Posttype === 'rent' ? 'Rent' : 'Sale'}</p>
                                    <p className="text-xs text-gray-500 sm:text-sm">{listing.ServiceType?.Name || listing.ServiceType?.name}</p>
                                </div>
                            </div>

                            <div className="mb-4 sm:mb-6">
                                <p className="text-xs font-semibold text-gray-700 sm:text-sm">Location</p>
                                <p className="mt-1 text-sm sm:text-base">
                                    {listing.city?.Name || listing.city?.name} - {listing.subcity?.Name || listing.subcity?.name}
                                </p>
                                {listing.specificLocation && (
                                    <p className="mt-1 text-xs text-gray-500 sm:text-sm">{listing.specificLocation}</p>
                                )}
                            </div>

                            <div className="mb-4 rounded-lg bg-gray-50 p-2 sm:mb-6 sm:p-4">
                                <p className="mb-2 text-xs font-semibold text-gray-700 sm:text-sm">Contact</p>
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                    <button
                                        onClick={handleCallNow}
                                        className="inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 sm:px-6 sm:text-base"
                                    >
                                        Call Now
                                    </button>
                                    {listing.contactPhone && (
                                        <p className="text-base font-semibold text-blue-700 sm:text-lg">
                                            {listing.contactPhone}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {listing.customAttribute && Object.keys(listing.customAttribute).length > 0 && (
                                <div className="mb-4 sm:mb-6">
                                    <p className="text-xs font-semibold text-gray-700 sm:text-sm">Details</p>
                                    <div className="mt-2 rounded-lg bg-gray-50 p-2 text-xs sm:p-4 sm:text-sm">
                                        {Object.entries(listing.customAttribute).map(([key, value]) => (
                                            <p key={key} className="mb-1">
                                                <strong>{key}:</strong> {value}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mt-4 space-y-1 border-t pt-3 text-xs text-gray-500 sm:mt-6 sm:pt-4 sm:text-sm">
                                <p>Posted: {new Date(listing.createdAt).toLocaleDateString()}</p>
                                <p>Views: {listing.Views}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListingDetail;
