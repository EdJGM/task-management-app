'use client'
import { useState } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth'
import { auth } from '../firebase/config'
import Link from 'next/link';


const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [succesMessage, setSuccesMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);

    const handleSignUp = async () => {
        //Validar email y contraseña
        if (!email.includes('@')) {
            setErrorMessage('Por favor, introduce un email válido.');
            return;
        }
        if (password.length < 6) {
            setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        try {
            const res = await createUserWithEmailAndPassword(email, password)
            console.log({ res })
            sessionStorage.setItem('user', String(true))
            setEmail('');
            setPassword('');
            setSuccesMessage('Registro exitoso. ¡Bienvenido!, por favor inicia sesión.');
            setErrorMessage('');
        } catch (e) {
            console.error(e);
            setErrorMessage('Error al registrar. Por favor, intenta de nuevo.');
        }
    };

    return (
        <div className="bg-cover bg-center bg-no-repeat bg-[url('/sidebar-4.jpg')] min-h-screen flex items-center justify-center">
            <div className="bg-opacity-90 bg-black p-10 rounded-xl shadow-2xl w-96">
                <h1 className="text-white text-3xl font-semibold mb-6 text-center">Registro De Usuarios</h1>
                {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
                {succesMessage && <p className="text-green-500 text-sm mb-4">{succesMessage}</p>}
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
                    onClick={handleSignUp}
                    className="w-full p-4 bg-indigo-600 rounded-lg text-white hover:bg-indigo-500 transition duration-300 font-medium"
                >
                    Registrarse
                </button>
                <p className="text-white mt-6 text-center">
                    ¿Ya tienes una cuenta?{' '}
                    <Link href="/sign-in" className="text-indigo-400 hover:underline hover:text-indigo-300 transition duration-300">
                        Inicia sesión
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignUp;