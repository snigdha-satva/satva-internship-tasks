import React from 'react'

function SkeletonLoader() {
    return (
        <div className="space-y-6 animate-pulse p-4 md:p-6">
            <div>
                <div className="skeleton h-8 w-52 mb-2" />
                <div className="skeleton h-4 w-36" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="card">
                        <div className="skeleton h-10 w-10 rounded-lg mb-3" />
                        <div className="skeleton h-3 w-24 mb-2" />
                        <div className="skeleton h-7 w-20 mb-2" />
                        <div className="skeleton h-3 w-16" />
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="card lg:col-span-2">
                    <div className="skeleton h-4 w-36 mb-4" />
                    <div className="skeleton h-64 w-full" />
                </div>
                <div className="card">
                    <div className="skeleton h-4 w-36 mb-4" />
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i}>
                                <div className="skeleton h-3 w-full mb-1" />
                                <div className="skeleton h-2 w-full rounded-full" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SkeletonLoader;
