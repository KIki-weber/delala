import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/useAuth';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ImageUpload from '../../components/ui/ImageUpload';

const EditListing = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        Title: '',
        Description: '',
        Price: '',
        Pricetype: 'monthly',
        Posttype: 'rent',
        ServicetypeId: '',
        cityId: '',
        subcityId: '',
        contactPhone: '',
        specificLocation: ''
    });
    const [cities, setCities] = useState([]);
    const [subcities, setSubcities] = useState([]);
    const [serviceTypes, setServiceTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState('');
    const [postImages, setPostImages] = useState([]);

    const fetchSubcities = async (cityId) => {
        if (!cityId) {
            setSubcities([]);
            return;
        }

        try {
            const response = await api.get(`/subcities/${cityId}`);
            setSubcities(response.data?.data || []);
        } catch (error) {
            console.error('Error fetching subcities:', error);
            setSubcities([]);
        }
    };

    useEffect(() => {
        const initialize = async () => {
            try {
                const [citiesRes, serviceTypesRes] = await Promise.all([
                    api.get('/cities'),
                    api.get('/service-types')
                ]);
                setCities(citiesRes.data?.data || []);
                setServiceTypes(serviceTypesRes.data?.data || []);
            } catch (error) {
                console.error('Error fetching filters:', error);
            }

            try {
                const response = await api.get(`/posts/${id}`);
                const data = response.data?.data;
                if (!data) {
                    setError('Listing not found');
                    return;
                }

                setFormData({
                    Title: data.Title || '',
                    Description: data.Description || '',
                    Price: data.Price || '',
                    Pricetype: data.Pricetype || 'monthly',
                    Posttype: data.Posttype || 'rent',
                    ServicetypeId: data.ServicetypeId || data.Servicetype?.id || '',
                    cityId: data.cityId || '',
                    subcityId: data.subcityId || '',
                    contactPhone: data.contactPhone || user?.phone || '',
                    specificLocation: data.specificLocation || ''
                });

                setPostImages(data.Image || []);

                if (data.cityId) {
                    await fetchSubcities(data.cityId);
                }
            } catch (error) {
                console.error('Error fetching listing:', error);
                setError('Failed to load listing details');
            } finally {
                setFetching(false);
            }
        };

        initialize();
    }, [id, user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === 'cityId') {
            fetchSubcities(value);
            setFormData((prev) => ({ ...prev, subcityId: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.put(`/posts/${id}`, formData);
            if (response.data.success) {
                navigate('/user/my-listings');
            } else {
                setError(response.data.message || 'Failed to update listing');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to update listing');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <LoadingSpinner />;

    return (
        <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-2xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-3 sm:gap-0">
                <h1 className="text-2xl sm:text-3xl font-bold">Edit Listing</h1>
                <button
                    type="button"
                    onClick={() => navigate('/user/my-listings')}
                    className="w-full sm:w-auto bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 text-sm sm:text-base transition"
                >
                    Cancel
                </button>
            </div>

            {error && <div className="bg-red-100 text-red-700 p-3 sm:p-4 rounded mb-4 text-sm sm:text-base">{error}</div>}

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
                <div className="mb-4 sm:mb-6">
                    <label className="block text-gray-700 mb-2 font-semibold text-sm sm:text-base">Title *</label>
                    <input
                        type="text"
                        name="Title"
                        value={formData.Title}
                        onChange={handleChange}
                        className="w-full p-3 sm:p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                        required
                    />
                </div>
                <div className="mb-4 sm:mb-6">
                    <label className="block text-gray-700 mb-2 font-semibold text-sm sm:text-base">Description *</label>
                    <textarea
                        name="Description"
                        value={formData.Description}
                        onChange={handleChange}
                        rows="5"
                        className="w-full p-3 sm:p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                        required
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div>
                        <label className="block text-gray-700 mb-2 font-semibold text-sm sm:text-base">Price (ETB) *</label>
                        <input
                            type="number"
                            name="Price"
                            value={formData.Price}
                            onChange={handleChange}
                            className="w-full p-3 sm:p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2 font-semibold text-sm sm:text-base">Price Type</label>
                        <select
                            name="Pricetype"
                            value={formData.Pricetype}
                            onChange={handleChange}
                            className="w-full p-3 sm:p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                        >
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                            <option value="one time">One Time</option>
                            <option value="negotiable">Negotiable</option>
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div>
                        <label className="block text-gray-700 mb-2 font-semibold text-sm sm:text-base">Post Type *</label>
                        <select
                            name="Posttype"
                            value={formData.Posttype}
                            onChange={handleChange}
                            className="w-full p-3 sm:p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                            required
                        >
                            <option value="rent">For Rent</option>
                            <option value="sell">For Sale</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2 font-semibold text-sm sm:text-base">Service Type *</label>
                        <select
                            name="ServicetypeId"
                            value={formData.ServicetypeId}
                            onChange={handleChange}
                            className="w-full p-3 sm:p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                            required
                        >
                            <option value="">Select Service Type</option>
                            {serviceTypes.map(type => (
                                <option key={type.id} value={type.id}>{type.Name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div>
                        <label className="block text-gray-700 mb-2 font-semibold text-sm sm:text-base">City *</label>
                        <select
                            name="cityId"
                            value={formData.cityId}
                            onChange={handleChange}
                            className="w-full p-3 sm:p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                            required
                        >
                            <option value="">Select City</option>
                            {cities.map(city => (
                                <option key={city.id} value={city.id}>{city.Name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2 font-semibold text-sm sm:text-base">Subcity *</label>
                        <select
                            name="subcityId"
                            value={formData.subcityId}
                            onChange={handleChange}
                            className="w-full p-3 sm:p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                            required
                            disabled={!formData.cityId}
                        >
                            <option value="">Select Subcity</option>
                            {subcities.map(sub => (
                                <option key={sub.id} value={sub.id}>{sub.Name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="mb-4 sm:mb-6">
                    <label className="block text-gray-700 mb-2 font-semibold text-sm sm:text-base">Contact Phone *</label>
                    <input
                        type="tel"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleChange}
                        className="w-full p-3 sm:p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                        required
                    />
                </div>
                <div className="mb-6 sm:mb-8">
                    <label className="block text-gray-700 mb-2 font-semibold text-sm sm:text-base">Specific Location (Optional)</label>
                    <input
                        type="text"
                        name="specificLocation"
                        value={formData.specificLocation}
                        onChange={handleChange}
                        className="w-full p-3 sm:p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                        placeholder="Near landmark, building name, etc."
                    />
                </div>
<div className="mt-6 sm:mt-8 bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base flex items-center gap-2">
                    📸 Manage Property Photos
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm mb-4">Update or add photos to your listing (up to 4 images)</p>
                <ImageUpload postId={id} existingImages={postImages} onImagesUpdate={(imgs) => setPostImages(imgs)} />
            </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 sm:py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 font-semibold text-sm sm:text-base transition"
                >
                    {loading ? 'Updating...' : 'Update Listing'}
                </button>
            </form>

            
        </div>
    );
};

export default EditListing;
