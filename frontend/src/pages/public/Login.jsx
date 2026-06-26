import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

const Login = () => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // If user is already logged in, redirect to dashboard
        if (user) {
            navigate(user.Role === 'admin' ? '/admin/dashboard' : '/user/dashboard');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!phone || !password) {
            setError('Please fill in all fields');
            return;
        }
        
        setError('');
        setLoading(true);
        
        const result = await login(phone, password);
        
        if (result.success) {
            // Navigation will happen automatically via useEffect when user state updates
        } else {
            // Display user-friendly error messages
            if (result.message?.toLowerCase().includes('unauthorized')) {
                setError('Invalid phone number or password');
            } else {
                setError(result.message || 'Login failed. Please try again.');
            }
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4 sm:px-6 md:px-8 py-8 sm:py-12">
            <div className="w-full max-w-md rounded-2xl sm:rounded-3xl md:rounded-4xl bg-gray-800 p-6 sm:p-8 shadow-2xl border-2 border-neon-cyan/30 transition-transform duration-500 hover:-translate-y-1">
                <div className="text-center mb-8">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neon-cyan mb-2">Login</h2>
                    <div className="h-1 w-12 bg-gradient-to-r from-neon-cyan to-neon-magenta mx-auto rounded"></div>
                </div>

                {error && (
                    <div className="bg-red-500/20 text-red-300 border border-red-500 p-3 sm:p-4 rounded-lg mb-6 text-xs sm:text-sm font-semibold">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    <div>
                        <label className="block text-neon-cyan mb-2 font-semibold text-xs sm:text-sm md:text-base">Phone Number</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            autoComplete="tel"
                            className="w-full p-2 sm:p-3 border border-neon-cyan/30 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan text-xs sm:text-sm md:text-base placeholder-gray-400"
                            placeholder="0901302252"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-neon-cyan mb-2 font-semibold text-xs sm:text-sm md:text-base">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            className="w-full p-2 sm:p-3 border border-neon-cyan/30 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan text-xs sm:text-sm md:text-base placeholder-gray-400"
                            placeholder="••••••"
                            required
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-neon-cyan to-neon-magenta text-gray-900 p-2 sm:p-3 rounded-lg hover:from-neon-magenta hover:to-neon-cyan disabled:opacity-50 transition font-bold text-xs sm:text-sm md:text-base"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                
                <p className="mt-6 text-center text-gray-400 text-xs sm:text-sm md:text-base">
                    Don't have an account? <Link to="/register" className="text-neon-cyan font-bold hover:text-neon-magenta transition">Register Now</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;