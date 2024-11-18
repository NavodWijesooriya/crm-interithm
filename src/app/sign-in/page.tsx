'use client'
import { useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      const res = await signInWithEmailAndPassword(email, password);
      if (res) {
        console.log({ res });
        sessionStorage.setItem('user', 'true');
        setEmail('');
        setPassword('');
        router.push('/');
      }
    } catch (e: any) {
      if (e.code === 'auth/user-not-found') {
        console.error('User not found. Redirecting to Sign Up.');
        alert('User not found! Redirecting to Sign Up page.');
        router.push('/sign-up');
      } else {
        console.error(e.message);
        alert(e.message);
      }
    }
  };

  return (
    <div className='bg-white'>
      <section className="text-gray-600 body-font h-screen flex justify-center items-center bg-white">
        <div className="container px-5 py-24 mx-auto flex flex-wrap items-center justify-center">
          <div className="lg:w-2/6 md:w-1/2 bg-white rounded-lg p-8 flex flex-col w-full shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl">
            <h2 className="text-gray-900 text-2xl font-bold text-center mb-6">Sign In</h2>

            <div className="relative mb-4">
              <label htmlFor="email" className="leading-7 text-sm text-gray-600">E-mail</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-100 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 text-base outline-none text-gray-700 py-2 px-4 transition-colors duration-200 ease-in-out"
              />
            </div>

            <div className="relative mb-6">
              <label htmlFor="password" className="leading-7 text-sm text-gray-600">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-100 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 text-base outline-none text-gray-700 py-2 px-4 transition-colors duration-200 ease-in-out"
              />
            </div>

            <button
              onClick={handleSignIn}
              className="text-white bg-indigo-600 hover:bg-indigo-700 border-0 py-2 px-6 focus:outline-none rounded-md text-lg w-full mb-4 transform transition duration-300 hover:scale-105"
            >
              Sign In
            </button>

            <p className="text-xs text-center text-gray-500">
              Don't have an account?{' '}
              <a href="/sign-up" className="text-indigo-500 hover:text-indigo-700">Sign Up</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SignIn;