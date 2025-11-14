import { Loader2 } from "lucide-react";

export const LoadingState = () => {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-8">
            <div className="relative">
                {/* Outer ring */}
                <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
                {/* Inner spinning loader */}
                <div className="absolute top-2 left-2">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
                </div>
            </div>
            
            {/* Loading text with animation */}
            <div className="mt-6 text-center">
                <h3 className="text-lg font-medium text-primary mb-2">
                    Loading Content
                </h3>
                <div className="flex items-center justify-center space-x-1">
                    <span className="text-gray-600 dark:text-gray-400">
                        Please wait while we fetch your data
                    </span>
                    <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
                        <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
