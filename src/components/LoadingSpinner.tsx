interface LoadingSpinnerProps {
    message?: string;
    size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
    message = "로딩 중...", 
    size = 'md' 
}) => {
    const sizeClasses = {
        sm: 'h-8 w-8',
        md: 'h-12 w-12',
        lg: 'h-16 w-16'
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="text-center">
                <div className={`animate-spin rounded-full border-b-2 border-blue-600 mx-auto ${sizeClasses[size]}`}></div>
                <p className="mt-4 text-gray-300">{message}</p>
            </div>
        </div>
    );
};

export default LoadingSpinner;
