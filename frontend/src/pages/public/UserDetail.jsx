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
    const [serviceTypes, setServiceTypes] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
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

                try {
                    const serviceTypesRes = await api.get('/service-types');
                    setServiceTypes(serviceTypesRes.data?.data || []);
                } catch (serviceError) {
                    console.error('Error fetching service types:', serviceError);
                    setServiceTypes([]);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    const filteredPosts = posts.filter((post) => {
        if (selectedCategory === 'all') return true;
        const postCategory = post.ServiceType?.Name || post.ServiceType?.name || '';
        return postCategory.toLowerCase() === selectedCategory.toLowerCase();
    });

    if (loading) return <LoadingSpinner />;

    if (!userData) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
                <div className="text-center">
                    <h1 className="mb-4 text-3xl font-bold text-neon-cyan">User Not Found</h1>
                    <Link to="/" className="text-neon-magenta transition hover:text-neon-cyan">
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
            <div className="relative h-48 overflow-hidden bg-gradient-to-r from-neon-cyan/20 via-neon-magenta/20 to-neon-cyan/20 sm:h-64 md:h-80">
                {userData.coverPhoto ? (
                    <img
                        src={resolveImageUrl(userData.coverPhoto)}
                        alt="Cover"
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-neon-magenta/30 via-neon-cyan/30 to-neon-magenta/30">
                        <p className="text-xl font-bold text-neon-cyan">Cover Photo</p>
                    </div>
                )}
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative -mt-16 mb-8 sm:-mt-20 md:-mt-24">
                    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:gap-6">
                        <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-neon-cyan bg-gray-800 shadow-2xl sm:h-40 sm:w-40">
                            {userData.profilePhoto ? (
                                <img
                                    src={resolveImageUrl(userData.profilePhoto)}
                                    alt={userData.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neon-magenta/40 to-neon-cyan/40 text-sm font-semibold">
                                    No Photo
                                </div>
                            )}
                        </div>

                        <div className="flex-1 pb-4">
                            <h1 className="mb-2 text-3xl font-bold text-neon-cyan sm:text-4xl">
                                {userData.name}
                            </h1>
                            <p className="mb-2 text-neon-magenta">
                                {userData.city?.Name || 'N/A'}
                                {userData.subcity?.Name && ` - ${userData.subcity.Name}`}
                            </p>
                            {userData.bio && (
                                <p className="mb-4 max-w-2xl text-gray-300">
                                    {userData.bio}
                                </p>
                            )}
                            {userData.phone && (
                                <p className="text-neon-cyan">
                                    {userData.phone}
                                </p>
                            )}
                        </div>
                    </div>

                    {stats && (
                        <div className="mt-8 grid grid-cols-2 gap-4 rounded-lg border border-neon-cyan/30 bg-gray-800/50 p-4 sm:grid-cols-4">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-neon-cyan">{stats.totalPosts}</p>
                                <p className="text-sm text-gray-400">Total Posts</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-neon-magenta">{stats.activePosts}</p>
                                <p className="text-sm text-gray-400">Active</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-red-500">{stats.soldPosts}</p>
                                <p className="text-sm text-gray-400">Sold</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-blue-500">{stats.rentedPosts}</p>
                                <p className="text-sm text-gray-400">Rented</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-12">
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <h2 className="text-3xl font-bold text-neon-cyan">
                            {userData.name}'s Listings
                        </h2>

                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full rounded-lg border border-neon-cyan/30 bg-gray-800 px-4 py-2 text-sm text-white outline-none transition focus:ring-2 focus:ring-neon-cyan sm:w-72"
                        >
                            <option value="all">All Categories</option>
                            {serviceTypes.map((type) => (
                                <option key={type.id} value={type.Name}>
                                    {type.Name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {filteredPosts.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3 pb-12 lg:grid-cols-3 lg:gap-6">
                            {filteredPosts.map((post) => (
                                <Link
                                    key={post.id}
                                    to={`/listing/${post.id}`}
                                    className="group block"
                                >
                                    <div className="overflow-hidden rounded-lg border-2 border-neon-cyan/50 bg-gray-800 transition duration-300 hover:border-neon-magenta hover:shadow-lg hover:shadow-neon-magenta/50">
                                        <div className="relative w-full bg-gray-700 overflow-hidden">
                                            {post.Image && post.Image.length > 0 ? (
                                                <div className="flex items-center justify-center p-2">
                                                    <img
                                                        src={resolveImageUrl(post.Image[0])}
                                                        alt={post.Title}
                                                        className="h-48 w-full object-contain transition duration-300 group-hover:scale-105"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex h-48 w-full items-center justify-center text-gray-500">
                                                    No Image
                                                </div>
                                            )}

                                            <div className="absolute right-2 top-2 rounded-full bg-neon-cyan/90 px-3 py-1 text-xs font-bold text-gray-900">
                                                {post.Status?.toUpperCase() || 'ACTIVE'}
                                            </div>
                                        </div>

                                        <div className="p-4">
                                            <h3 className="mb-2 line-clamp-2 text-lg font-bold text-neon-cyan">
                                                {post.Title}
                                            </h3>
                                            <p className="mb-3 text-xl font-bold text-neon-magenta">
                                                ETB {post.Price?.toLocaleString()}
                                            </p>

                                            <div className="space-y-1 text-sm text-gray-300">
                                                <p>{post.ServiceType?.Name || 'N/A'}</p>
                                                <p>{post.city?.Name || 'N/A'}</p>
                                                <p>{post.Views || 0} views</p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-lg border border-neon-cyan/30 bg-gray-800/50 py-12 text-center">
                            <p className="text-lg text-gray-400">
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
