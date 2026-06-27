import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import api from '../../services/api';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        password: '',
        ServiceTypeId: '',
        cityId: '',
        subcityId: ''
    });
    const [cities, setCities] = useState([]);
    const [subcities, setSubcities] = useState([]);
    const [serviceTypes, setServiceTypes] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register, user } = useAuth();
    const navigate = useNavigate();

    const fetchPublicData = async () => {
        try {
            const [citiesRes, serviceTypesRes] = await Promise.all([
                api.get('/cities'),
                api.get('/service-types')
            ]);
            setCities(citiesRes.data?.data || []);
            setServiceTypes(serviceTypesRes.data?.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
            setCities([]);
            setServiceTypes([]);
        }
    };

    useEffect(() => {
        const initialize = async () => {
            if (user) {
                navigate(user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard');
            } else {
                await fetchPublicData();
            }
        };

        initialize();
    }, [user, navigate]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.phone || !formData.password || !formData.ServiceTypeId || !formData.cityId || !formData.subcityId) {
            setError('Please fill in all fields');
            return;
        }

        setError('');
        setLoading(true);

        const result = await register(formData);

        if (result.success) {
            // Navigation will happen automatically via useEffect when user state updates
        } else {
            setError(result.message || 'Registration failed');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4 sm:px-6 md:px-8 py-8 sm:py-12">
            <div className="w-full max-w-md rounded-2xl sm:rounded-3xl md:rounded-4xl bg-gray-800 p-6 sm:p-8 shadow-2xl border-2 border-neon-magenta/30 transition-transform duration-500 hover:-translate-y-1">
                <div className="text-center mb-8">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neon-magenta mb-2">Register</h2>
                    <div className="h-1 w-12 bg-gradient-to-r from-neon-magenta to-neon-cyan mx-auto rounded"></div>
                </div>

                {error && (
                    <div className="bg-red-500/20 text-red-300 border border-red-500 p-3 sm:p-4 rounded-lg mb-6 text-xs sm:text-sm font-semibold">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    <div>
                        <label className="block text-neon-magenta mb-2 font-semibold text-xs sm:text-sm md:text-base">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            autoComplete="name"
                            className="w-full p-2 sm:p-3 border border-neon-magenta/30 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-neon-magenta text-xs sm:text-sm md:text-base placeholder-gray-400"
                            placeholder="Your Full Name"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-neon-magenta mb-2 font-semibold text-xs sm:text-sm md:text-base">Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            autoComplete="tel"
                            className="w-full p-2 sm:p-3 border border-neon-magenta/30 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-neon-magenta text-xs sm:text-sm md:text-base placeholder-gray-400"
                            placeholder="0911222333"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-neon-magenta mb-2 font-semibold text-xs sm:text-sm md:text-base">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete="new-password"
                            className="w-full p-2 sm:p-3 border border-neon-magenta/30 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-neon-magenta text-xs sm:text-sm md:text-base placeholder-gray-400"
                            placeholder="Create a password"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-neon-magenta mb-2 font-semibold text-xs sm:text-sm md:text-base">Service Type</label>
                        <select
                            name="ServiceTypeId"
                            value={formData.ServiceTypeId}
                            onChange={handleChange}
                            className="w-full p-2 sm:p-3 border border-neon-magenta/30 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-neon-magenta text-xs sm:text-sm md:text-base"
                            required
                        >
                            <option value="">Select Service Type</option>
                            {serviceTypes.map(type => (
                                <option key={type.id} value={type.id}>{type.Name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-neon-magenta mb-2 font-semibold text-xs sm:text-sm md:text-base">City</label>
                        <select
                            name="cityId"
                            value={formData.cityId}
                            onChange={handleChange}
                            className="w-full p-2 sm:p-3 border border-neon-magenta/30 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-neon-magenta text-xs sm:text-sm md:text-base"
                            required
                        >
                            <option value="">Select City</option>
                            {cities.map(city => (
                                <option key={city.id} value={city.id}>{city.Name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-neon-magenta mb-2 font-semibold text-xs sm:text-sm md:text-base">Subcity</label>
                        <select
                            name="subcityId"
                            value={formData.subcityId}
                            onChange={handleChange}
                            className="w-full p-2 sm:p-3 border border-neon-magenta/30 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-neon-magenta text-xs sm:text-sm md:text-base disabled:opacity-50"
                            required
                            disabled={!formData.cityId}
                        >
                            <option value="">Select Subcity</option>
                            {subcities.map(sub => (
                                <option key={sub.id} value={sub.id}>{sub.Name}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-neon-magenta to-neon-cyan text-gray-900 p-2 sm:p-3 rounded-lg hover:from-neon-cyan hover:to-neon-magenta disabled:opacity-50 transition font-bold text-xs sm:text-sm md:text-base"
                    >
                        {loading ? 'Registering...' : 'Create Account'}
                    </button>
                </form>
                <p className="mt-6 text-center text-gray-400 text-xs sm:text-sm md:text-base">
                    Already have an account? <Link to="/login" className="text-neon-cyan font-bold hover:text-neon-magenta transition">Login Here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
