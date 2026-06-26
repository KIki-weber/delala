import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setMobileMenuOpen(false);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <nav className="bg-blue-600 text-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-3 sm:px-4 py-3 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-lg sm:text-xl font-bold whitespace-nowrap hover:text-blue-200 transition" onClick={closeMobileMenu}>
                    🏠 Zemenawi Delala
                </Link>
                
                {/* Hamburger Menu Button - Mobile Only */}
                <button
                    onClick={toggleMobileMenu}
                    className="md:hidden inline-flex items-center justify-center p-2 rounded-md hover:bg-blue-700 transition"
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>

                {/* Desktop Navigation */}
                <div className="hidden md:flex space-x-4 lg:space-x-6">
                    <Link to="/" className="hover:text-blue-200 transition text-sm lg:text-base">Home</Link>
                    
                    {!user ? (
                        <>
                            <Link to="/login" className="hover:text-blue-200 transition text-sm lg:text-base">Login</Link>
                            <Link to="/register" className="hover:text-blue-200 transition text-sm lg:text-base">Register</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/user/dashboard" className="hover:text-blue-200 transition text-sm lg:text-base">Dashboard</Link>
                            <Link to="/user/my-listings" className="hover:text-blue-200 transition text-sm lg:text-base">My Listings</Link>
                            
                            {(user.role || user.Role)?.toString().toLowerCase() === 'admin' && (
                                <Link to="/admin/dashboard" className="hover:text-blue-200 transition text-sm lg:text-base">Admin</Link>
                            )}
                            
                            <button 
                                onClick={handleLogout} 
                                className="hover:text-blue-200 transition text-sm lg:text-base bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-blue-700 border-t border-blue-500">
                    <div className="px-3 py-3 space-y-2">
                        <Link 
                            to="/" 
                            className="block px-3 py-2 rounded hover:bg-blue-800 transition text-sm"
                            onClick={closeMobileMenu}
                        >
                            Home
                        </Link>
                        
                        {!user ? (
                            <>
                                <Link 
                                    to="/login" 
                                    className="block px-3 py-2 rounded hover:bg-blue-800 transition text-sm"
                                    onClick={closeMobileMenu}
                                >
                                    Login
                                </Link>
                                <Link 
                                    to="/register" 
                                    className="block px-3 py-2 rounded hover:bg-blue-800 transition text-sm"
                                    onClick={closeMobileMenu}
                                >
                                    Register
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link 
                                    to="/user/dashboard" 
                                    className="block px-3 py-2 rounded hover:bg-blue-800 transition text-sm"
                                    onClick={closeMobileMenu}
                                >
                                    Dashboard
                                </Link>
                                <Link 
                                    to="/user/my-listings" 
                                    className="block px-3 py-2 rounded hover:bg-blue-800 transition text-sm"
                                    onClick={closeMobileMenu}
                                >
                                    My Listings
                                </Link>
                                
                                {(user.role || user.Role)?.toString().toLowerCase() === 'admin' && (
                                    <Link 
                                        to="/admin/dashboard" 
                                        className="block px-3 py-2 rounded hover:bg-blue-800 transition text-sm"
                                        onClick={closeMobileMenu}
                                    >
                                        Admin Panel
                                    </Link>
                                )}
                                
                                <button 
                                    onClick={handleLogout}
                                    className="w-full text-left block px-3 py-2 rounded hover:bg-blue-800 transition text-sm"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
