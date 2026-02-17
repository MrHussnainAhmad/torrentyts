import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AdminLogin() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/auth/signin');
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-bg text-white">
            <p>Redirecting to login...</p>
        </div>
    );
}
