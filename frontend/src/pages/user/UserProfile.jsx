import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/useAuth';
import api from '../../services/api';

const UserProfile = () => {
    const { user, setUser } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        bio: user?.bio || ''
    });
    const [profilePhoto, setProfilePhoto] = useState(user?.profilePhoto || null);
    const [coverPhoto, setCoverPhoto] = useState(user?.coverPhoto || null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const profilePhotoRef = useRef(null);
    const coverPhotoRef = useRef(null);

    const resolveImageUrl = (img) => {
        if (!img) return '/placeholder-image.jpg';
        if (img.startsWith('http')) return img;
        if (img.startsWith('/')) return `http://localhost:3003${img}`;
        return img;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhotoChange = (e, setPhoto, isProfile = true) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhoto({ file, preview: reader.result, isProfile });
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePhotoUpload = async (photoData, imageType) => {
        if (!photoData || !photoData.file) return;

        const formDataUpload = new FormData();
        formDataUpload.append('image', photoData.file);
        formDataUpload.append('imageType', imageType);

        try {
            const response = await api.put(`/users/${user.id}/profile`, formDataUpload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (response.data.success) {
                setUser(response.data.data);
                setMessage(`${imageType === 'profilePhoto' ? 'Profile' : 'Cover'} photo updated successfully!`);
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (error) {
            setMessage(`Error uploading ${imageType === 'profilePhoto' ? 'profile' : 'cover'} photo`);
            console.error('Upload error:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            // Upload profile photo if changed
            if (profilePhoto && profilePhoto.file) {
                await handlePhotoUpload(profilePhoto, 'profilePhoto');
            }

            // Upload cover photo if changed
            if (coverPhoto && coverPhoto.file) {
                await handlePhotoUpload(coverPhoto, 'coverPhoto');
            }

            // Update bio and basic info
            const response = await api.put(`/users/${user.id}/profile`, { bio: formData.bio });
            if (response.data.success) {
                setUser(response.data.data);
                setMessage('Profile updated successfully!');
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (error) {
            setMessage('Error updating profile');
            console.error('Update error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
            <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-4xl">
                <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-neon-cyan">My Profile</h1>
                
                {message && (
                    <div className={`p-4 rounded mb-6 text-sm sm:text-base font-semibold ${message.includes('Error') ? 'bg-red-500/20 text-red-300 border border-red-500' : 'bg-green-500/20 text-green-300 border border-green-500'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Cover Photo Section */}
                    <div className="bg-gray-800 rounded-lg p-6 border border-neon-cyan/30">
                        <label className="block text-neon-cyan mb-3 font-bold text-base sm:text-lg">Cover Photo</label>
                        <div 
                            onClick={() => coverPhotoRef.current?.click()}
                            className="relative w-full h-40 sm:h-48 bg-gradient-to-r from-neon-magenta/20 to-neon-cyan/20 rounded-lg border-2 border-dashed border-neon-cyan/50 cursor-pointer hover:border-neon-magenta transition flex items-center justify-center"
                        >
                            {coverPhoto?.preview || user?.coverPhoto ? (
                                <img 
                                    src={coverPhoto?.preview || resolveImageUrl(user?.coverPhoto)} 
                                    alt="Cover" 
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            ) : (
                                <div className="text-center">
                                    <p className="text-neon-cyan text-lg sm:text-xl font-bold">📷 Click to upload cover</p>
                                </div>
                            )}
                        </div>
                        <input 
                            type="file" 
                            ref={coverPhotoRef}
                            accept="image/*"
                            onChange={(e) => handlePhotoChange(e, setCoverPhoto, false)}
                            className="hidden"
                        />
                    </div>

                    {/* Profile Photo Section */}
                    <div className="bg-gray-800 rounded-lg p-6 border border-neon-cyan/30">
                        <label className="block text-neon-cyan mb-3 font-bold text-base sm:text-lg">Profile Photo</label>
                        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                            <div 
                                onClick={() => profilePhotoRef.current?.click()}
                                className="w-32 h-32 bg-gradient-to-br from-neon-magenta/30 to-neon-cyan/30 rounded-full border-2 border-dashed border-neon-cyan/50 cursor-pointer hover:border-neon-magenta transition flex items-center justify-center flex-shrink-0"
                            >
                                {profilePhoto?.preview || user?.profilePhoto ? (
                                    <img 
                                        src={profilePhoto?.preview || resolveImageUrl(user?.profilePhoto)} 
                                        alt="Profile" 
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="text-center">
                                        <p className="text-neon-cyan text-2xl">👤</p>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <p className="text-gray-300 mb-3">Click the circle to upload your profile picture</p>
                                <input 
                                    type="file" 
                                    ref={profilePhotoRef}
                                    accept="image/*"
                                    onChange={(e) => handlePhotoChange(e, setProfilePhoto, true)}
                                    className="hidden"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Basic Info Section */}
                    <div className="bg-gray-800 rounded-lg p-6 border border-neon-cyan/30 space-y-4">
                        <div>
                            <label className="block text-neon-cyan mb-2 font-semibold text-sm sm:text-base">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                disabled
                                className="w-full p-3 sm:p-2 border border-neon-cyan/30 rounded bg-gray-700 text-gray-300 text-sm sm:text-base opacity-50 cursor-not-allowed"
                            />
                            <p className="text-gray-400 text-xs mt-1">Name cannot be changed</p>
                        </div>
                        
                        <div>
                            <label className="block text-neon-cyan mb-2 font-semibold text-sm sm:text-base">Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                disabled
                                className="w-full p-3 sm:p-2 border border-neon-cyan/30 rounded bg-gray-700 text-gray-300 text-sm sm:text-base opacity-50 cursor-not-allowed"
                            />
                            <p className="text-gray-400 text-xs mt-1">Phone cannot be changed</p>
                        </div>
                        
                        <div>
                            <label className="block text-neon-cyan mb-2 font-semibold text-sm sm:text-base">Bio</label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                placeholder="Tell us about yourself..."
                                className="w-full p-3 sm:p-2 border border-neon-cyan/30 rounded focus:outline-none focus:ring-2 focus:ring-neon-cyan bg-gray-700 text-white text-sm sm:text-base resize-none h-24"
                            />
                            <p className="text-gray-400 text-xs mt-1">{formData.bio.length}/500 characters</p>
                        </div>

                        <div>
                            <label className="block text-neon-cyan mb-2 font-semibold text-sm sm:text-base">Role</label>
                            <input
                                type="text"
                                value={user?.Role || 'User'}
                                className="w-full p-3 sm:p-2 border border-neon-cyan/30 rounded bg-gray-700 text-neon-cyan text-sm sm:text-base opacity-50 cursor-not-allowed"
                                disabled
                            />
                        </div>
                    </div>
                    
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-neon-cyan to-neon-magenta text-gray-900 py-3 sm:py-2 rounded-lg hover:from-neon-magenta hover:to-neon-cyan disabled:opacity-50 transition font-bold text-base sm:text-lg"
                    >
                        {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UserProfile;