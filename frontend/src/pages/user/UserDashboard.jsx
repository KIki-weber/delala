import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

const UserDashboard = () => {
    const { user } = useAuth();

    const resolveImageUrl = (img) => {
        if (!img) return '/placeholder-image.jpg';
        if (img.startsWith('http')) return img;
        if (img.startsWith('/')) return `http://localhost:3003${img}`;
        return img;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
            <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-7xl">
                <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-neon-cyan">User Dashboard</h1>
                
                {/* Profile Info Card with Cover */}
                <div className="bg-gray-800 rounded-lg shadow-lg mb-8 border border-neon-cyan/30 overflow-hidden">
                    {/* Cover Photo */}
                    <div className="relative h-32 sm:h-40 bg-gradient-to-r from-neon-magenta/30 to-neon-cyan/30 overflow-hidden">
                        {user?.coverPhoto ? (
                            <img src={resolveImageUrl(user.coverPhoto)} alt="Cover" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-r from-neon-magenta/20 to-neon-cyan/20"></div>
                        )}
                    </div>

                    {/* User Info Section */}
                    <div className="p-4 sm:p-6 -mt-12 sm:-mt-16 relative">
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
                            {/* Profile Photo */}
                            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-neon-cyan bg-gray-700 overflow-hidden flex-shrink-0">
                                {user?.profilePhoto ? (
                                    <img src={resolveImageUrl(user.profilePhoto)} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-3xl">👤</div>
                                )}
                            </div>

                            {/* User Details */}
                            <div className="flex-1 pt-4">
                                <h2 className="text-2xl sm:text-3xl font-bold text-neon-cyan mb-2">{user?.name}</h2>
                                {user?.bio && (
                                    <p className="text-gray-300 mb-3 max-w-2xl">{user.bio}</p>
                                )}
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    <div className="bg-gray-700/50 p-2 rounded border border-neon-cyan/20">
                                        <p className="text-gray-400 text-xs">📞 Phone</p>
                                        <p className="text-neon-cyan font-semibold text-sm">{user?.phone}</p>
                                    </div>
                                    <div className="bg-gray-700/50 p-2 rounded border border-neon-magenta/20">
                                        <p className="text-gray-400 text-xs">👤 Role</p>
                                        <p className="text-neon-magenta font-semibold text-sm">{user?.Role}</p>
                                    </div>
                                    <div className="bg-gray-700/50 p-2 rounded border border-neon-cyan/20">
                                        <p className="text-gray-400 text-xs">📍 Location</p>
                                        <p className="text-neon-cyan font-semibold text-sm">{user?.city?.Name}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dashboard Links */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <Link 
                        to="/user/my-listings" 
                        className="bg-gradient-to-br from-neon-cyan/10 to-neon-cyan/5 hover:from-neon-cyan/20 hover:to-neon-cyan/10 p-6 rounded-lg shadow-lg hover:shadow-xl transition border border-neon-cyan/30 hover:border-neon-cyan/60"
                    >
                        <h3 className="text-lg sm:text-xl font-bold mb-2 text-neon-cyan">📋 My Listings</h3>
                        <p className="text-sm sm:text-base text-gray-400">View and manage your posts</p>
                    </Link>
                    
                    <Link 
                        to="/user/create-listing" 
                        className="bg-gradient-to-br from-neon-magenta/10 to-neon-magenta/5 hover:from-neon-magenta/20 hover:to-neon-magenta/10 p-6 rounded-lg shadow-lg hover:shadow-xl transition border border-neon-magenta/30 hover:border-neon-magenta/60"
                    >
                        <h3 className="text-lg sm:text-xl font-bold mb-2 text-neon-magenta">➕ Create Listing</h3>
                        <p className="text-sm sm:text-base text-gray-400">Post new rental or property</p>
                    </Link>
                    
                    <Link 
                        to="/user/profile" 
                        className="bg-gradient-to-br from-neon-lime/10 to-neon-lime/5 hover:from-neon-lime/20 hover:to-neon-lime/10 p-6 rounded-lg shadow-lg hover:shadow-xl transition border border-neon-lime/30 hover:border-neon-lime/60"
                    >
                        <h3 className="text-lg sm:text-xl font-bold mb-2 text-neon-lime">👤 My Profile</h3>
                        <p className="text-sm sm:text-base text-gray-400">Update your information</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;