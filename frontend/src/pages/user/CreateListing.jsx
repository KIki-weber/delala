import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../Services/api';
import ImageUpload from '../../components/ui/ImageUpload';
import { useAuth } from '../../context/useAuth';
import LoadingSpinner from '../../components/common/LoadingSpinner';

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

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            contactPhone: user?.phone || prev.contactPhone
        }));
    }, [user]);

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
        fetchData();
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
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === 'cityId') {
            fetchSubcities(value);
            setFormData((prev) => ({ ...prev, subcityId: '' }));
        }
    };

    const handleFilesSelected = (e) => {
        const files = Array.from(e.target.files || []);
        const total = files.length + selectedFiles.length;
        if (total > 4) {
            alert('You can upload up to 4 images.');
            return;
        }
        setSelectedFiles((prev) => [...prev, ...files]);
        e.target.value = '';
    };

    const removeSelectedFile = (index) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
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

                if (selectedFiles.length > 0) {
                    const formDataFiles = new FormData();
                    selectedFiles.forEach((file) => formDataFiles.append('images', file));

                    try {
                        await api.post(`/posts/${id}/upload-images`, formDataFiles, {
                            headers: { 'Content-Type': 'multipart/form-data' }
                        });
                    } catch (uploadError) {
                        console.error('Error uploading images:', uploadError);
                    }
                }

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
        <div className="min-h-screen overflow-hidden bg-slate-950 text-white">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
            <div className="absolute left-[-8rem] top-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
            <div className="absolute right-[-6rem] top-44 h-80 w-80 rounded-full bg-orange-500/20 blur-3xl" />
            <div className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
                    <p className="text-xs uppercase tracking-[0.45em] text-orange-300">New Listing</p>
                    <h1 className="mt-2 text-3xl font-bold text-neon-lime sm:text-4xl">Create New Listing</h1>
                    <p className="mt-2 max-w-2xl text-sm text-slate-300">
                        Use bright blue controls and keep your listing consistent with the rest of the user dashboard.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 rounded-2xl border border-red-400/40 bg-red-500/15 px-4 py-3 text-sm text-red-200">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl"
                >
                    <div className="space-y-6">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-200">Title</label>
                            <input
                                type="text"
                                name="Title"
                                value={formData.Title}
                                onChange={handleChange}
                                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/30"
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-3 block text-sm font-semibold text-orange-200">
                                Property Photos (optional, up to 4)
                            </label>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="relative cursor-pointer rounded-[1.5rem] border-2 border-dashed border-orange-400/40 bg-gradient-to-br from-orange-500/10 via-slate-950 to-sky-500/10 p-6 transition hover:border-orange-300 hover:bg-orange-500/15"
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFilesSelected}
                                    className="hidden"
                                />

                                <div className="text-center">
                                    <p className="text-base font-semibold text-white">Click to upload or drag and drop</p>
                                    <p className="mt-1 text-xs text-slate-300">PNG, JPG, GIF, or WEBP up to 10MB each</p>
                                    <div className="mt-4 inline-flex rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-200">
                                        {selectedFiles.length}/4 photos
                                    </div>
                                </div>
                            </div>

                            {selectedFiles.length > 0 && (
                                <div className="mt-5">
                                    <div className="mb-3 flex items-center justify-between">
                                        <p className="text-sm font-semibold text-slate-200">Selected Photos</p>
                                        <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-200">
                                            {selectedFiles.length} selected
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                                        {selectedFiles.map((file, idx) => (
                                            <div key={idx} className="group relative">
                                                <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70">
                                                    <img
                                                        src={URL.createObjectURL(file)}
                                                        alt={file.name}
                                                        className="h-24 w-full object-cover transition duration-300 group-hover:scale-105 sm:h-28"
                                                    />
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => removeSelectedFile(idx)}
                                                    className="absolute right-2 top-2 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-red-700"
                                                >
                                                    Remove
                                                </button>

                                                <p className="mt-2 truncate text-xs text-slate-300">{file.name}</p>
                                            </div>
                                        ))}

                                        {selectedFiles.length < 4 && (
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="flex h-28 items-center justify-center rounded-2xl border border-dashed border-blue-400/30 bg-blue-500/10 text-sm font-semibold text-blue-200 transition hover:border-blue-300 hover:bg-blue-500/20"
                                            >
                                                Add more photos
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-200">Description</label>
                            <textarea
                                name="Description"
                                value={formData.Description}
                                onChange={handleChange}
                                rows="5"
                                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/30"
                                required
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-200">Price (ETB)</label>
                                <input
                                    type="number"
                                    name="Price"
                                    value={formData.Price}
                                    onChange={handleChange}
                                    className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/30"
                                    required
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-200">Price Type</label>
                                <select
                                    name="Pricetype"
                                    value={formData.Pricetype}
                                    onChange={handleChange}
                                    className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/30"
                                >
                                    <option value="monthly">Monthly</option>
                                    <option value="yearly">Yearly</option>
                                    <option value="one time">One Time</option>
                                    <option value="negotiable">Negotiable</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-200">Post Type</label>
                                <select
                                    name="Posttype"
                                    value={formData.Posttype}
                                    onChange={handleChange}
                                    className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/30"
                                    required
                                >
                                    <option value="rent">For Rent</option>
                                    <option value="sell">For Sale</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-200">Service Type</label>
                                <select
                                    name="ServiceTypeId"
                                    value={formData.ServiceTypeId}
                                    onChange={handleChange}
                                    className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/30"
                                    required
                                >
                                    <option value="">Select</option>
                                    {serviceTypes.map((type) => (
                                        <option key={type.id} value={type.id}>{type.Name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-200">City</label>
                                <select
                                    name="cityId"
                                    value={formData.cityId}
                                    onChange={handleChange}
                                    className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/30"
                                    required
                                >
                                    <option value="">Select City</option>
                                    {cities.map((city) => (
                                        <option key={city.id} value={city.id}>{city.Name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-200">Subcity</label>
                                <select
                                    name="subcityId"
                                    value={formData.subcityId}
                                    onChange={handleChange}
                                    className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/30 disabled:cursor-not-allowed disabled:opacity-50"
                                    required
                                    disabled={!formData.cityId}
                                >
                                    <option value="">Select Subcity</option>
                                    {subcities.map((sub) => (
                                        <option key={sub.id} value={sub.id}>{sub.Name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-200">Contact Phone</label>
                            <input
                                type="tel"
                                name="contactPhone"
                                value={formData.contactPhone}
                                onChange={handleChange}
                                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/30"
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-200">Specific Location</label>
                            <input
                                type="text"
                                name="specificLocation"
                                value={formData.specificLocation}
                                onChange={handleChange}
                                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/30"
                                placeholder="Near landmark, building name, etc."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-2xl bg-gradient-to-r from-blue-600 via-sky-500 to-blue-500 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:from-blue-500 hover:to-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? 'Creating...' : 'Create Listing'}
                        </button>
                    </div>
                </form>

                {showImageUpload && postId && (
                    <div className="mt-6 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
                        <h3 className="mb-3 text-lg font-semibold text-white">Upload Property Photos</h3>
                        <p className="mb-4 text-sm text-slate-300">You can add or replace photos after creating the listing.</p>
                        <ImageUpload postId={postId} existingImages={[]} onImagesUpdate={() => navigate('/user/my-listings')} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateListing;
