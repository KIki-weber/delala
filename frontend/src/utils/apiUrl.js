const DEFAULT_API_PORT = '3003';

const normalizeUrl = (value) => value.replace(/\/+$/, '');
const stripApiSuffix = (value) => value.replace(/\/api\/?$/i, '');

export const getApiBaseUrl = () => {
    const configuredBaseUrl = import.meta.env.VITE_API_URL?.trim()
        || import.meta.env.VITE_API_BASE_URL?.trim();

    if (configuredBaseUrl) {
        return normalizeUrl(configuredBaseUrl);
    }

    if (typeof window !== 'undefined' && window.location?.hostname) {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return `http://${window.location.hostname}:${DEFAULT_API_PORT}/api`;
        }

        return `${stripApiSuffix(window.location.origin)}/api`;
    }

    return 'https://kiki.com.et/api';
};

export const getApiOrigin = () => {
    const baseUrl = getApiBaseUrl();

    try {
        return new URL(baseUrl).origin;
    } catch {
        return stripApiSuffix(baseUrl);
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
