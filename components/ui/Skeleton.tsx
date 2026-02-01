import React from 'react';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular';
}

const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'text' }) => {
    // Base shimmer animation
    const baseStyles = "animate-pulse bg-gray-200/50 rounded-lg";

    // Variant specific styles
    const variantStyles = {
        text: "h-4 w-full",
        circular: "rounded-full",
        rectangular: "h-full w-full",
    };

    return (
        <div
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
            role="status"
            aria-label="Loading..."
        />
    );
};

export default Skeleton;
