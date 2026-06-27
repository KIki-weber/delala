import { useEffect, useState } from 'react';
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
        ServiceTypeId: '',
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

    useEffect(() => {
        const loadData = async () => {
            try {
                const [citiesRes, serviceTypesRes] = await Promise.all([
                    api.get('/cities'),
                    api.get('/service-types')
                ]);
                setCities(citiesRes.data?.data || []);
                setServiceTypes(serviceTypesRes.data?.data || []);
            } catch (loadError) {
                console.error('Error fetching filters:', loadError);
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
                    ServiceTypeId: data.ServiceTypeId || data.ServiceType?.id || '',
                    cityId: data.cityId || '',
                    subcityId: data.subcityId || '',
                    contactPhone: data.contactPhone || user?.phone || '',
                    specificLocation: data.specificLocation || ''
                });

                setPostImages(data.Image || []);

                if (data.cityId) {
                    const responseSubcities = await api.get(`/subcities/${data.cityId}`);
                    setSubcities(responseSubcities.data?.data || []);
                }
            } catch (loadError) {
                console.error('Error fetching listing:', loadError);
                setError('Failed to load listing details');
            } finally {
                setFetching(false);
            }
        };

        loadData();
    }, [id, user]);

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
        <div className="min-h-screen overflow-hidden bg-slate-950 text-white">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
            <div className="absolute left-[-8rem] top-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
            <div className="absolute right-[-6rem] top-44 h-80 w-80 rounded-full bg-orange-500/20 blur-3xl" />
            <div className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
                    <p className="text-xs uppercase tracking-[0.45em] text-orange-300">Edit Listing</p>
                    <h1 className="mt-2 text-3xl font-bold text-neon-lime sm:text-4xl">Edit Listing</h1>
                    <p className="mt-2 max-w-2xl text-sm text-slate-300">
                        Update the listing details, photos, and contact information.
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
                                    <option value="">Select Service Type</option>
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

                        <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-5">
                            <h3 className="mb-2 text-lg font-semibold text-white">Manage Property Photos</h3>
                            <p className="mb-4 text-sm text-slate-300">Update or add photos to your listing, up to 4 images.</p>
                            <ImageUpload postId={id} existingImages={postImages} onImagesUpdate={(imgs) => setPostImages(imgs)} />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-2xl bg-gradient-to-r from-blue-600 via-sky-500 to-blue-500 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:from-blue-500 hover:to-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? 'Updating...' : 'Update Listing'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditListing;
