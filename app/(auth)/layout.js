import React from 'react'

const AuthLayout = ({ children }) => {
    return (
        <div className="flex min-h-[calc(100dvh-72px)] items-center justify-center bg-white px-4 py-12">
            <div className="w-full max-w-[400px]">
                {children}
            </div>
        </div>
    );
}

export default AuthLayout