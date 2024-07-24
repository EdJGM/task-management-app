'use client'
import { useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth'
import { auth } from '../firebase/config'
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
    const router = useRouter()

    const handleSignIn = async () => {
        try {
            const res = await signInWithEmailAndPassword(email, password);
            if (res) {
                console.log({ res });
                sessionStorage.setItem('user', String(true));
                setEmail('');
                setPassword('');
                router.push('/taskScheduler');
            } else {
                console.error('Error: Invalid credentials');
                setError('Credenciales inválidas. Por favor, intenta de nuevo.');
            }
        } catch (e) {
            console.error(e)
            setError('Error al iniciar sesión. Por favor, verifica tus credenciales.');
        }
    };

    return (
        <div className="bg-cover bg-center bg-no-repeat bg-[url('/sidebar-4.jpg')] min-h-screen flex items-center justify-center">
            <div className="bg-opacity-90 bg-black p-10 rounded-xl shadow-2xl w-96">
                <h1 className="text-white text-3xl font-semibold mb-6">Ingreso al Gestor de Tareas</h1>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-4 mb-4 bg-gray-800 rounded-lg outline-none text-white placeholder-gray-400 focus:bg-gray-700 focus:shadow-outline transition duration-300"
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-4 mb-4 bg-gray-800 rounded-lg outline-none text-white placeholder-gray-400 focus:bg-gray-700 focus:shadow-outline transition duration-300"
                />
                <button
                    onClick={handleSignIn}
                    className="w-full p-4 bg-indigo-600 rounded-lg text-white hover:bg-indigo-500 transition duration-300 font-medium"
                >
                    Ingresar
                </button>
                <p className="text-white mt-6 text-center">
                    ¿No tienes una cuenta?{' '}
                    <Link href="/sign-up" className="text-indigo-400 hover:underline hover:text-indigo-300 transition duration-300">
                        Regístrate
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignIn;