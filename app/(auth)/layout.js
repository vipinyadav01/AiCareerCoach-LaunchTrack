import React from 'react'

const AuthLayout = ({ children }) => {
    return (
        <div className="flex min-h-dvh items-center justify-center px-4 py-16">
            <div className="w-full max-w-sm">
                {children}
            </div>
        </div>
    );
}

export default AuthLayout