import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../Services/api';
import ImageUpload from '../../components/ui/ImageUpload';
import { useAuth } from '../../context/useAuth';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useRef } from 'react';

const CreateListing = () => {
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        Title: '',
        Description: '',
        Price: '',
        Pricetype: 'monthly',
        Posttype: 'rent',
        ServiceTypeId: '',
        cityId: '',
        subcityId: '',
        contactPhone: user?.phone || '',
        specificLocation: ''
    });
    const [cities, setCities] = useState([]);
    const [subcities, setSubcities] = useState([]);
    const [serviceTypes, setServiceTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState('');
    const [postId, setPostId] = useState(null);
    const [showImageUpload, setShowImageUpload] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const [citiesRes, serviceTypesRes] = await Promise.all([
                api.get('/cities'),
                api.get('/service-types')
            ]);
            setCities(citiesRes.data?.data || []);
            setServiceTypes(serviceTypesRes.data?.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        const initialize = async () => {
            await fetchData();
        };
        initialize();
    }, []);

    

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (name === 'cityId') {
            fetchSubcities(value);
            setFormData(prev => ({ ...prev, subcityId: '' }));
        }
    };

    const handleFilesSelected = (e) => {
        const files = Array.from(e.target.files || []);
        const total = files.length + selectedFiles.length;
        if (total > 4) {
            alert('You can upload up to 4 images.');
            return;
        }
        setSelectedFiles(prev => [...prev, ...files]);
        e.target.value = '';
    };

    const removeSelectedFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/posts', formData);
            if (response.data.success) {
                const id = response.data.data.id;
                setPostId(id);

                // If user selected files before creating, upload them now
                if (selectedFiles.length > 0) {
                    const formDataFiles = new FormData();
                    selectedFiles.forEach(f => formDataFiles.append('images', f));
                    try {
                        await api.post(`/posts/${id}/upload-images`, formDataFiles, { headers: { 'Content-Type': 'multipart/form-data' } });
                    } catch (err) {
                        console.error('Error uploading images:', err);
                    }
                }

                // show image manager as fallback and then navigate
                setShowImageUpload(true);
                navigate('/user/my-listings');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to create listing');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <LoadingSpinner />;

    return (
        <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-2xl">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Create New Listing</h1>
            
            {error && <div className="bg-red-100 text-red-700 p-3 sm:p-4 rounded mb-4 text-sm sm:text-base">{error}</div>}
            
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4 sm:p-6">
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
                    <label className="block text-gray-700 mb-3 font-semibold text-sm sm:text-base">📸 Property Photos (Optional, up to 4)</label>
                    
                    {/* Upload Area */}
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="relative border-2 border-dashed border-blue-400 rounded-xl p-6 sm:p-8 bg-gradient-to-br from-blue-50 to-indigo-50 cursor-pointer hover:border-blue-600 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 group"
                    >
                        <input 
                            ref={fileInputRef} 
                            type="file" 
                            accept="image/*" 
                            multiple 
                            onChange={handleFilesSelected} 
                            className="hidden"
                        />
                        
                        <div className="flex flex-col items-center justify-center gap-3">
                            {/* Icon */}
                            <div className="text-4xl sm:text-5xl group-hover:scale-110 transition-transform duration-300">
                                📷
                            </div>
                            
                            {/* Text */}
                            <div className="text-center">
                                <p className="text-gray-700 font-semibold text-sm sm:text-base">
                                    Click to upload or drag and drop
                                </p>
                                <p className="text-gray-500 text-xs sm:text-sm mt-1">
                                    PNG, JPG, GIF up to 10MB each
                                </p>
                            </div>
                            
                            {/* Counter */}
                            <div className="mt-2 inline-block bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                {selectedFiles.length}/4 photos
                            </div>
                        </div>
                    </div>

                    {/* Preview Grid */}
                    {selectedFiles.length > 0 && (
                        <div className="mt-4 sm:mt-6">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-gray-700 font-semibold text-sm">Selected Photos</p>
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                                    {selectedFiles.length} selected
                                </span>
                            </div>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                {selectedFiles.map((f, idx) => (
                                    <div key={idx} className="relative group">
                                        <div className="overflow-hidden rounded-lg border-2 border-gray-200">
                                            <img 
                                                src={URL.createObjectURL(f)} 
                                                alt={f.name} 
                                                className="w-full h-24 sm:h-28 object-cover group-hover:scale-105 transition-transform duration-300" 
                                            />
                                        </div>
                                        
                                        {/* Delete Button */}
                                        <button 
                                            type="button" 
                                            onClick={() => removeSelectedFile(idx)} 
                                            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                                            title="Remove photo"
                                        >
                                            ✕
                                        </button>
                                        
                                        {/* File name tooltip */}
                                        <p className="mt-1 text-xs text-gray-600 truncate group-hover:text-gray-900">
                                            {f.name}
                                        </p>
                                    </div>
                                ))}
                                
                                {/* Add More Button - shown if less than 4 */}
                                {selectedFiles.length < 4 && (
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed border-blue-300 rounded-lg h-24 sm:h-28 flex items-center justify-center bg-blue-50 hover:bg-blue-100 hover:border-blue-400 transition-all duration-300 cursor-pointer group/add"
                                    >
                                        <div className="text-center">
                                            <div className="text-2xl group-hover/add:scale-125 transition-transform duration-300">+</div>
                                            <p className="text-xs text-gray-600 mt-1">Add more</p>
                                        </div>
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
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
                            name="ServiceTypeId"
                            value={formData.ServiceTypeId}
                            onChange={handleChange}
                            className="w-full p-3 sm:p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                            required
                        >
                            <option value="">Select</option>
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

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 sm:py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 font-semibold text-sm sm:text-base transition"
                >
                    {loading ? 'Creating...' : 'Create Listing'}
                </button>
            </form>

            {showImageUpload && postId && (
                <div className="mt-6 sm:mt-8 bg-white p-4 sm:p-6 rounded-lg shadow-md">
                    <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Upload Property Photos (optional)</h3>
                    <ImageUpload postId={postId} existingImages={[]} onImagesUpdate={() => navigate('/user/my-listings')} />
                </div>
            )}
        </div>
    );
};

export default CreateListing;
