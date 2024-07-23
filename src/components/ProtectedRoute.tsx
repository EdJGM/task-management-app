// components/ProtectedRoute.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/config';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const [user, loading] = useAuthState(auth);
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user && !['/sign-in', '/sign-up'].includes(router.pathname)) {
            router.push('/sign-in');
        }
    }, [user, loading, router]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user && !['/sign-in', '/sign-up'].includes(router.pathname)) {
        return null;
    }

    return <>{children}</>;
};

export default ProtectedRoute;