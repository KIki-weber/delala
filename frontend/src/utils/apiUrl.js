const DEFAULT_API_PORT = '3003';

const normalizeUrl = (value) => value.replace(/\/+$/, '');

export const getApiBaseUrl = () => {
    const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

    if (configuredBaseUrl) {
        return normalizeUrl(configuredBaseUrl);
    }

    if (typeof window !== 'undefined' && window.location?.hostname) {
        return `${window.location.protocol}//${window.location.hostname}:${DEFAULT_API_PORT}/api`;
    }

    return `http://localhost:${DEFAULT_API_PORT}/api`;
};

export const getApiOrigin = () => {
    const baseUrl = getApiBaseUrl();

    try {
        return new URL(baseUrl).origin;
    } catch {
        return baseUrl.replace(/\/api\/?$/, '');
    }
};

export const resolveApiUrl = (value) => {
    if (!value) {
        return '/placeholder-image.jpg';
    }

    if (/^(https?:)?\/\//i.test(value) || value.startsWith('data:') || value.startsWith('blob:')) {
        return value;
    }

    if (value.startsWith('/')) {
        return `${getApiOrigin()}${value}`;
    }

    return value;
};
