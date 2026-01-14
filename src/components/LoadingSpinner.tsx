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
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
            <div className="relative">
                <div className={`absolute inset-0 ${sizeClasses[size]} rounded-full bg-primary-500/20 blur-xl animate-pulse-slow`}></div>

                <div className={`relative ${sizeClasses[size]}`}>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500 via-indigo-500 to-primary-400 animate-spin"
                        style={{
                            maskImage: 'conic-gradient(transparent 30%, black)',
                            WebkitMaskImage: 'conic-gradient(transparent 30%, black)'
                        }}>
                    </div>
                    <div className="absolute inset-[3px] rounded-full bg-space-800"></div>

                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-primary-400 animate-pulse"></div>
                    </div>
                </div>
            </div>

            <p className="mt-6 text-slate-400 font-medium animate-pulse">{message}</p>
        </div>
    );
};

export default LoadingSpinner;
