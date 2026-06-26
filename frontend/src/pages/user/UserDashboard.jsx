import { Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { resolveApiUrl } from '../../utils/apiUrl';

const UserDashboard = () => {
    const { user } = useAuth();

    const resolveImageUrl = resolveApiUrl;
    const initials = (user?.name || 'U')
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    return (
        <div className="min-h-screen overflow-hidden bg-slate-950 text-white">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
            <div className="absolute left-[-8rem] top-20 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
            <div className="absolute right-[-6rem] top-48 h-80 w-80 rounded-full bg-orange-500/20 blur-3xl" />
            <div className="absolute bottom-10 left-1/3 h-72 w-72 rounded-full bg-sky-500/15 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
                    <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
                        <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/60">
                            <div className="h-40 bg-gradient-to-r from-emerald-400/30 via-orange-400/25 to-sky-500/30">
                                {user?.coverPhoto ? (
                                    <img
                                        src={resolveImageUrl(user.coverPhoto)}
                                        alt="Cover"
                                        className="h-full w-full object-cover"
                                    />
                                ) : null}
                            </div>

                            <div className="p-6">
                                <div className="-mt-20 flex flex-col items-center gap-4 sm:-mt-24 sm:flex-row sm:items-end">
                                    <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-orange-400/60 bg-slate-900 shadow-[0_0_35px_rgba(249,115,22,0.25)] sm:h-36 sm:w-36">
                                        {user?.profilePhoto ? (
                                            <img
                                                src={resolveImageUrl(user.profilePhoto)}
                                                alt="Profile"
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-400/30 to-orange-400/30 text-3xl font-bold">
                                                {initials}
                                            </div>
                                        )}
                                    </div>

                                    <div className="text-center sm:text-left">
                                        <p className="text-xs uppercase tracking-[0.45em] text-orange-300">Welcome back</p>
                                        <h1 className="mt-2 text-3xl font-bold text-neon-lime sm:text-4xl">
                                            {user?.name || 'User Dashboard'}
                                        </h1>
                                        <p className="mt-2 max-w-2xl text-sm text-slate-300">
                                            Manage your listings, update your profile, and keep your account details current.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                                    <div className="rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4">
                                        <p className="text-xs uppercase tracking-[0.35em] text-blue-200">Phone</p>
                                        <p className="mt-2 text-sm font-semibold text-white">{user?.phone || 'Not set'}</p>
                                    </div>
                                    <div className="rounded-2xl border border-orange-400/20 bg-orange-500/10 p-4">
                                        <p className="text-xs uppercase tracking-[0.35em] text-orange-200">Role</p>
                                        <p className="mt-2 text-sm font-semibold text-white">{user?.Role || 'User'}</p>
                                    </div>
                                    <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
                                        <p className="text-xs uppercase tracking-[0.35em] text-emerald-200">Location</p>
                                        <p className="mt-2 text-sm font-semibold text-white">{user?.city?.Name || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-6">
                            <p className="text-xs uppercase tracking-[0.45em] text-sky-300">Quick Actions</p>
                            <div className="mt-5 grid gap-4">
                                <Link
                                    to="/user/my-listings"
                                    className="rounded-2xl border border-blue-400/20 bg-gradient-to-r from-blue-600/20 to-sky-500/10 p-5 transition hover:border-blue-300/40 hover:bg-blue-500/20"
                                >
                                    <h3 className="text-lg font-bold text-white">My Listings</h3>
                                    <p className="mt-1 text-sm text-slate-300">View, edit, and manage your posts.</p>
                                </Link>

                                <Link
                                    to="/user/create-listing"
                                    className="rounded-2xl border border-orange-400/20 bg-gradient-to-r from-orange-500/20 to-amber-500/10 p-5 transition hover:border-orange-300/40 hover:bg-orange-500/20"
                                >
                                    <h3 className="text-lg font-bold text-white">Create Listing</h3>
                                    <p className="mt-1 text-sm text-slate-300">Publish a new rental or sale post.</p>
                                </Link>

                                <Link
                                    to="/user/profile"
                                    className="rounded-2xl border border-emerald-400/20 bg-gradient-to-r from-emerald-500/20 to-sky-500/10 p-5 transition hover:border-emerald-300/40 hover:bg-emerald-500/20"
                                >
                                    <h3 className="text-lg font-bold text-white">My Profile</h3>
                                    <p className="mt-1 text-sm text-slate-300">Update account details and password.</p>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
