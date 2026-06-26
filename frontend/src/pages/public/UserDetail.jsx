import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../Services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { resolveApiUrl } from '../../utils/apiUrl';

const UserDetail = () => {
    const { userId } = useParams();
    const [userData, setUserData] = useState(null);
    const [posts, setPosts] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const resolveImageUrl = resolveApiUrl;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const [profileRes, statsRes] = await Promise.all([
                    api.get(`/users/${userId}`),
                    api.get(`/users/${userId}/stats`)
                ]);

                if (profileRes.data?.success) {
                    setUserData(profileRes.data.data.user);
                    setPosts(profileRes.data.data.posts || []);
                }
                
                if (statsRes.data?.success) {
                    setStats(statsRes.data.data);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    if (loading) return <LoadingSpinner />;

    if (!userData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-neon-cyan mb-4">User Not Found</h1>
                    <Link to="/" className="text-neon-magenta hover:text-neon-cyan transition">
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
            {/* Cover Photo Section */}
            <div className="relative h-48 sm:h-64 md:h-80 bg-gradient-to-r from-neon-cyan/20 via-neon-magenta/20 to-neon-cyan/20 overflow-hidden">
                {userData.coverPhoto ? (
                    <img
                        src={resolveImageUrl(userData.coverPhoto)}
                        alt="Cover"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-neon-magenta/30 via-neon-cyan/30 to-neon-magenta/30 flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-neon-cyan text-xl font-bold">Cover Photo</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Profile Info Section */}
                <div className="relative -mt-16 sm:-mt-20 md:-mt-24 mb-8">
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-end">
                        {/* Profile Photo */}
                        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-neon-cyan bg-gray-800 overflow-hidden shadow-2xl">
                            {userData.profilePhoto ? (
                                <img
                                    src={resolveImageUrl(userData.profilePhoto)}
                                    alt={userData.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neon-magenta/40 to-neon-cyan/40 text-4xl">
                                    👤
                                </div>
                            )}
                        </div>

                        {/* User Info */}
                        <div className="flex-1 pb-4">
                            <h1 className="text-3xl sm:text-4xl font-bold text-neon-cyan mb-2">
                                {userData.name}
                            </h1>
                            <p className="text-neon-magenta mb-2 flex items-center gap-1">
                                <span>📍</span> {userData.city?.Name || 'N/A'} 
                                {userData.subcity?.Name && ` - ${userData.subcity.Name}`}
                            </p>
                            {userData.bio && (
                                <p className="text-gray-300 max-w-2xl mb-4">
                                    {userData.bio}
                                </p>
                            )}
                            {userData.phone && (
                                <p className="text-neon-cyan flex items-center gap-1">
                                    <span>📞</span> {userData.phone}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Stats Section */}
                    {stats && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 p-4 bg-gray-800/50 rounded-lg border border-neon-cyan/30">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-neon-cyan">
                                    {stats.totalPosts}
                                </p>
                                <p className="text-gray-400 text-sm">Total Posts</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-neon-magenta">
                                    {stats.activePosts}
                                </p>
                                <p className="text-gray-400 text-sm">Active</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-red-500">
                                    {stats.soldPosts}
                                </p>
                                <p className="text-gray-400 text-sm">Sold</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-blue-500">
                                    {stats.rentedPosts}
                                </p>
                                <p className="text-gray-400 text-sm">Rented</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* User Posts Section */}
                <div className="mt-12">
                    <h2 className="text-3xl font-bold text-neon-cyan mb-6">
                        {userData.name}'s Listings
                    </h2>

                    {posts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
                            {posts.map((post) => (
                                <Link
                                    key={post.id}
                                    to={`/listing/${post.id}`}
                                    className="group block"
                                >
                                    <div className="border-2 border-neon-cyan/50 rounded-lg overflow-hidden hover:border-neon-magenta transition duration-300 bg-gray-800 hover:shadow-lg hover:shadow-neon-magenta/50">
                                        {/* Image Container */}
                                        <div className="relative w-full h-48 bg-gray-700 overflow-hidden">
                                            {post.Image && post.Image.length > 0 ? (
                                                <img
                                                    src={resolveImageUrl(post.Image[0])}
                                                    alt={post.Title}
                                                    className="w-full h-48 object-cover group-hover:scale-110 transition duration-300"
                                                />
                                            ) : (
                                                <div className="w-full h-48 flex items-center justify-center text-gray-500">
                                                    No Image
                                                </div>
                                            )}

                                            {/* Status Badge */}
                                            <div className="absolute top-2 right-2 bg-neon-cyan/90 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
                                                {post.Status?.toUpperCase() || 'ACTIVE'}
                                            </div>
                                        </div>

                                        <div className="p-4">
                                            <h3 className="text-lg font-bold text-neon-cyan line-clamp-2 mb-2">
                                                {post.Title}
                                            </h3>
                                            <p className="text-neon-magenta text-xl font-bold mb-3">
                                                ETB {post.Price?.toLocaleString()}
                                            </p>

                                            <div className="space-y-1 text-sm text-gray-300">
                                                <p className="flex items-center gap-1">
                                                    <span>🏷️</span>
                                                    {post.ServiceType?.Name || 'N/A'}
                                                </p>
                                                <p className="flex items-center gap-1">
                                                    <span>📍</span>
                                                    {post.city?.Name || 'N/A'}
                                                </p>
                                                <p className="flex items-center gap-1">
                                                    <span>👁️</span>
                                                    {post.Views || 0} views
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gray-800/50 rounded-lg border border-neon-cyan/30">
                            <p className="text-gray-400 text-lg">
                                No listings available from this user
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDetail;
