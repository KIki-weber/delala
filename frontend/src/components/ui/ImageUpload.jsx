import { useState } from 'react';
import api from '../../Services/api';

const ImageUpload = ({ postId, existingImages = [], onImagesUpdate }) => {
    const [images, setImages] = useState(existingImages || []);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files || []);
        if (images.length + files.length > 4) {
            setError('Maximum 4 images allowed');
            return;
        }

        setUploading(true);
        setError('');

        const formData = new FormData();
        files.forEach(file => formData.append('images', file));

        try {
            const res = await api.post(`/posts/${postId}/upload-images`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const updated = res.data.data.images || [];
            setImages(updated);
            if (onImagesUpdate) onImagesUpdate(updated);
        } catch (err) {
            setError(err.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    const handleDelete = async (img) => {
        try {
            await api.delete(`/posts/${postId}/delete-image`, { data: { imageUrl: img } });
            const updated = images.filter(i => i !== img);
            setImages(updated);
            if (onImagesUpdate) onImagesUpdate(updated);
        } catch (err) {
            setError(err.response?.data?.message || 'Delete failed');
        }
    };

    const setFeatured = async (img) => {
        try {
            const res = await api.put(`/posts/${postId}`, { featuredImage: img });
            const featured = res.data.data.featuredImage || img;
            if (onImagesUpdate) onImagesUpdate(images, featured);
        } catch (err) {
            setError(err.response?.data?.message || 'Set featured failed');
        }
    };

    return (
        <div className="mt-6">
            <label className="block mb-2 font-medium">Property Photos (max 4)</label>
            {error && <div className="text-red-600 text-sm mb-2">{error}</div>}

            <div className="grid grid-cols-4 gap-3 mb-3">
                {images.map((img, idx) => (
                    <div key={img} className="relative group">
                        <img src={img} alt={`img-${idx}`} className="w-full h-24 object-cover rounded" />
                        <button type="button" onClick={() => handleDelete(img)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full px-2 py-0.5 opacity-90">×</button>
                        <button type="button" onClick={() => setFeatured(img)} className="absolute left-1 bottom-1 bg-white text-sm px-2 py-0.5 rounded opacity-90">Set Featured</button>
                    </div>
                ))}
                {images.length < 4 && (
                    <label className="flex items-center justify-center border-dashed border-2 border-slate-300 rounded p-2 cursor-pointer">
                        <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                        {uploading ? 'Uploading...' : 'Upload'}
                    </label>
                )}
            </div>
            <div className="text-sm text-slate-500">{images.length}/4 photos uploaded</div>
        </div>
    );
};

export default ImageUpload;
