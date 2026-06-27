import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/useAuth';
import api from '../../services/api';
import { resolveApiUrl } from '../../utils/apiUrl';

const emptyPasswordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
};

const UserProfile = () => {
    const { user, setUser } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        bio: ''
    });
    const [passwordData, setPasswordData] = useState(emptyPasswordForm);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [coverPhoto, setCoverPhoto] = useState(null);
    const [profileSaving, setProfileSaving] = useState(false);
    const [passwordSaving, setPasswordSaving] = useState(false);
    const [profileNotice, setProfileNotice] = useState(null);
    const [passwordNotice, setPasswordNotice] = useState(null);
    const profilePhotoRef = useRef(null);
    const coverPhotoRef = useRef(null);

    useEffect(() => {
        if (!user) return;

        setFormData({
            name: user.name || '',
            phone: user.phone || '',
            bio: user.bio || ''
        });
    }, [user]);

    const resolveImageUrl = resolveApiUrl;

    const handleProfileChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handlePasswordChange = (e) => {
        setPasswordData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handlePhotoChange = (e, setPhoto) => {
        const file = e.target.files?.[0];

        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setPhoto({ file, preview: reader.result });
        };
        reader.readAsDataURL(file);
    };

    const updateProfileImage = async (photoData, imageType) => {
        const uploadData = new FormData();
        uploadData.append('image', photoData.file);
        uploadData.append('imageType', imageType);
        uploadData.append('name', formData.name.trim());
        uploadData.append('phone', formData.phone.trim());
        uploadData.append('bio', formData.bio);

        const response = await api.put(`/users/${user.id}/profile`, uploadData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        return response.data.data;
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        setProfileSaving(true);
        setProfileNotice(null);

        try {
            const payload = {
                name: formData.name.trim(),
                phone: formData.phone.trim(),
                bio: formData.bio
            };

            let updatedUser = null;

            if (profilePhoto?.file) {
                updatedUser = await updateProfileImage(profilePhoto, 'profilePhoto');
            }

            if (coverPhoto?.file) {
                updatedUser = await updateProfileImage(coverPhoto, 'coverPhoto');
            }

            if (!profilePhoto?.file && !coverPhoto?.file) {
                const response = await api.put(`/users/${user.id}/profile`, payload);
                updatedUser = response.data.data;
            }

            if (updatedUser) {
                setUser(updatedUser);
            }

            setProfilePhoto(null);
            setCoverPhoto(null);
            setProfileNotice({
                type: 'success',
                text: 'Profile saved successfully.'
            });
        } catch (error) {
            setProfileNotice({
                type: 'error',
                text: error.response?.data?.message || 'Unable to save profile changes.'
            });
        } finally {
            setProfileSaving(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        setPasswordSaving(true);
        setPasswordNotice(null);

        try {
            if (passwordData.newPassword !== passwordData.confirmPassword) {
                setPasswordNotice({
                    type: 'error',
                    text: 'New password and confirmation do not match.'
                });
                return;
            }

            if ((passwordData.newPassword || '').length < 6) {
                setPasswordNotice({
                    type: 'error',
                    text: 'New password must be at least 6 characters.'
                });
                return;
            }

            const response = await api.put(`/users/${user.id}/password`, {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });

            if (response.data?.success) {
                setPasswordData(emptyPasswordForm);
                setPasswordNotice({
                    type: 'success',
                    text: 'Password updated successfully.'
                });
            }
        } catch (error) {
            setPasswordNotice({
                type: 'error',
                text: error.response?.data?.message || 'Unable to update password.'
            });
        } finally {
            setPasswordSaving(false);
        }
    };

    const noticeClass = (type) =>
        type === 'error'
            ? 'border-red-400/40 bg-red-500/15 text-red-200'
            : 'border-emerald-400/40 bg-emerald-500/15 text-emerald-200';

    const initials = (user?.name || 'U')
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    return (
        <div className="min-h-screen overflow-hidden bg-slate-950 text-white">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
            <div className="absolute left-[-8rem] top-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
            <div className="absolute right-[-6rem] top-48 h-80 w-80 rounded-full bg-orange-500/20 blur-3xl" />
            <div className="absolute bottom-8 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-sky-500/15 blur-3xl" />

            <div className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8 overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
                    <div className="h-40 sm:h-56 bg-gradient-to-r from-emerald-400/30 via-orange-400/25 to-sky-500/30">
                        {coverPhoto?.preview || user?.coverPhoto ? (
                            <img
                                src={coverPhoto?.preview || resolveImageUrl(user?.coverPhoto)}
                                alt="Cover preview"
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center text-center">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.5em] text-white/70">Cover Preview</p>
                                    <p className="mt-2 text-lg text-white/90">Add a banner to personalize your profile</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid gap-6 p-6 md:grid-cols-[auto,1fr] md:items-end">
                        <div className="-mt-24 flex justify-center md:-mt-20 md:justify-start">
                            <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-orange-400/50 bg-slate-900 shadow-[0_0_40px_rgba(249,115,22,0.25)] sm:h-36 sm:w-36">
                                {profilePhoto?.preview || user?.profilePhoto ? (
                                    <img
                                        src={profilePhoto?.preview || resolveImageUrl(user?.profilePhoto)}
                                        alt="Profile preview"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-400/30 to-orange-400/30 text-3xl font-bold text-white">
                                        {initials}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="text-center md:text-left">
                            <p className="text-xs uppercase tracking-[0.45em] text-orange-300">Account</p>
                            <h1 className="mt-3 text-3xl font-bold text-neon-lime sm:text-4xl">
                                {formData.name || user?.name || 'Your Profile'}
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm text-slate-300">
                                Update your name, phone number, bio, profile images, and password in one place.
                            </p>
                            <div className="mt-4 flex flex-wrap justify-center gap-3 md:justify-start">
                                <span className="rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-200">
                                    Blue actions
                                </span>
                                <span className="rounded-full border border-orange-400/30 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-200">
                                    Orange accents
                                </span>
                                <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                                    Neon highlight
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
                    <form
                        onSubmit={handleProfileSubmit}
                        className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl"
                    >
                        <div className="mb-6 border-b border-white/10 pb-5">
                            <p className="text-xs uppercase tracking-[0.4em] text-neon-lime">Profile Details</p>
                            <h2 className="mt-2 text-2xl font-bold text-white">Edit your identity</h2>
                            <p className="mt-1 text-sm text-slate-300">Change your name, phone number, bio, and photos.</p>
                        </div>

                        {profileNotice && (
                            <div className={`mb-5 rounded-2xl border px-4 py-3 text-sm ${noticeClass(profileNotice.type)}`}>
                                {profileNotice.text}
                            </div>
                        )}

                        <div className="space-y-5">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                                    <label className="mb-3 block text-sm font-semibold text-orange-200">Cover Photo</label>
                                    <button
                                        type="button"
                                        onClick={() => coverPhotoRef.current?.click()}
                                        className="group relative flex h-40 w-full items-center justify-center overflow-hidden rounded-2xl border border-dashed border-orange-400/40 bg-gradient-to-br from-orange-500/10 via-slate-950 to-sky-500/10 text-center transition hover:border-orange-300 hover:bg-orange-500/15"
                                    >
                                        {coverPhoto?.preview || user?.coverPhoto ? (
                                            <img
                                                src={coverPhoto?.preview || resolveImageUrl(user?.coverPhoto)}
                                                alt="Cover preview"
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div>
                                                <p className="text-sm font-semibold text-white">Choose a cover image</p>
                                                <p className="mt-1 text-xs text-slate-300">Wide banner recommended</p>
                                            </div>
                                        )}
                                    </button>
                                    <input
                                        type="file"
                                        ref={coverPhotoRef}
                                        accept="image/*"
                                        onChange={(e) => handlePhotoChange(e, setCoverPhoto)}
                                        className="hidden"
                                    />
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                                    <label className="mb-3 block text-sm font-semibold text-emerald-200">Profile Photo</label>
                                    <button
                                        type="button"
                                        onClick={() => profilePhotoRef.current?.click()}
                                        className="group relative flex h-40 w-full items-center justify-center overflow-hidden rounded-full border border-dashed border-emerald-400/40 bg-gradient-to-br from-emerald-500/10 via-slate-950 to-sky-500/10 text-center transition hover:border-emerald-300 hover:bg-emerald-500/15"
                                    >
                                        {profilePhoto?.preview || user?.profilePhoto ? (
                                            <img
                                                src={profilePhoto?.preview || resolveImageUrl(user?.profilePhoto)}
                                                alt="Profile preview"
                                                className="h-full w-full rounded-full object-cover"
                                            />
                                        ) : (
                                            <div>
                                                <p className="text-sm font-semibold text-white">Choose a profile image</p>
                                                <p className="mt-1 text-xs text-slate-300">Square crop works best</p>
                                            </div>
                                        )}
                                    </button>
                                    <input
                                        type="file"
                                        ref={profilePhotoRef}
                                        accept="image/*"
                                        onChange={(e) => handlePhotoChange(e, setProfilePhoto)}
                                        className="hidden"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-200">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleProfileChange}
                                        className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/30"
                                        placeholder="Your full name"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-200">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleProfileChange}
                                        className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/30"
                                        placeholder="09..."
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-200">Bio</label>
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleProfileChange}
                                        placeholder="Tell people a little about yourself..."
                                        className="h-28 w-full resize-none rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white placeholder:text-slate-500 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={profileSaving}
                                className="w-full rounded-2xl bg-gradient-to-r from-blue-600 via-sky-500 to-blue-500 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:from-blue-500 hover:to-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {profileSaving ? 'Saving Profile...' : 'Save Profile'}
                            </button>
                        </div>
                    </form>

                    <form
                        onSubmit={handlePasswordSubmit}
                        className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl"
                    >
                        <div className="mb-6 border-b border-white/10 pb-5">
                            <p className="text-xs uppercase tracking-[0.4em] text-orange-300">Security</p>
                            <h2 className="mt-2 text-2xl font-bold text-white">Change password</h2>
                            <p className="mt-1 text-sm text-slate-300">Keep your account protected with a fresh password.</p>
                        </div>

                        {passwordNotice && (
                            <div className={`mb-5 rounded-2xl border px-4 py-3 text-sm ${noticeClass(passwordNotice.type)}`}>
                                {passwordNotice.text}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-200">Current Password</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    autoComplete="current-password"
                                    className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/30"
                                    placeholder="Enter current password"
                                    required
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-200">New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    autoComplete="new-password"
                                    className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white placeholder:text-slate-500 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30"
                                    placeholder="Enter new password"
                                    required
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-200">Confirm New Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    autoComplete="new-password"
                                    className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                                    placeholder="Confirm new password"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={passwordSaving}
                                className="w-full rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:from-orange-400 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {passwordSaving ? 'Updating Password...' : 'Update Password'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
