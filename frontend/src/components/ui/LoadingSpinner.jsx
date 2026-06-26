const LoadingSpinner = ({ size = 'md' }) => {
    const sizes = {
        sm: 'h-6 w-6',
        md: 'h-12 w-12',
        lg: 'h-16 w-16'
    };

    return (
        <div className="flex justify-center items-center py-10">
            <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizes[size]}`}></div>
        </div>
    );
};

export default LoadingSpinner;
