'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import Image from 'next/image';

const featureShowcase = [
    {
        caption: 'Compare real LeetCode profiles',
        image: '/auth-compare-image.png'
    },
    {
        caption: 'See your profile value score',
        image: '/hero-image-dark.png'
    },
    {
        caption: 'Analyze contest performance',
        image: '/hero-image-light.png'
    },
    {
        caption: 'Identify strengths & weaknesses',
        image: '/auth-compare-image.png'
    },
];

export default function SignUpPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isValidatingUsername, setIsValidatingUsername] = useState(false);
    const [usernameValid, setUsernameValid] = useState<boolean | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Auto-change images every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % featureShowcase.length);
        }, 10000); // 10 seconds

        return () => clearInterval(interval);
    }, []);

    // Simulate username validation
    useEffect(() => {
        if (username.length > 0) {
            setIsValidatingUsername(true);
            setUsernameValid(null);

            const timer = setTimeout(() => {
                setIsValidatingUsername(false);
                // Simulate validation logic
                setUsernameValid(username.length >= 3);
            }, 1000);

            return () => clearTimeout(timer);
        } else {
            setUsernameValid(null);
            setIsValidatingUsername(false);
        }
    }, [username]);

    // Password strength calculation
    const getPasswordStrength = (pwd: string) => {
        if (pwd.length === 0) return 0;
        if (pwd.length < 6) return 1;
        if (pwd.length < 10) return 2;
        return 3;
    };

    const passwordStrength = getPasswordStrength(password);
    const strengthLabels = ['', 'Weak', 'Fair', 'Strong'];

    // Form validation
    const isFormValid = usernameValid && email.includes('@') && password.length >= 8;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;

        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            console.log('Form submitted:', { username, email, password });
        }, 2000);
    };

    if (!mounted) {
        return null;
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-[40%_60%] gap-8 lg:gap-12 items-center">

                {/* LEFT SECTION - Sign Up Form */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md mx-auto lg:mx-0"
                >
                    <div className="relative">
                        {/* Glassmorphic card */}
                        <div className="relative backdrop-blur-xl bg-white/60 dark:bg-black/60 border-2 border-gray-200/50 dark:border-gray-800/50 rounded-3xl p-8 shadow-2xl">
                            {/* Logo/Brand */}
                            <div className="mb-8">
                                <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
                                    Create your <span className="underline decoration-2">CodeLibra</span> account
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    Analyze, compare, and understand the real value of your coding profile.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Username Field */}
                                <div>
                                    <label htmlFor="username" className="block text-sm font-medium text-black dark:text-white mb-2">
                                        LeetCode Username
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="username"
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            placeholder="leetcode_username"
                                            className="w-full bg-white/50 dark:bg-black/50 backdrop-blur-sm border-2 border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-black dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-black dark:focus:border-white transition-all"
                                            required
                                        />
                                        {/* Validation icons */}
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            {isValidatingUsername && (
                                                <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
                                            )}
                                            {!isValidatingUsername && usernameValid === true && (
                                                <Check className="w-5 h-5 text-black dark:text-white" />
                                            )}
                                            {!isValidatingUsername && usernameValid === false && (
                                                <X className="w-5 h-5 text-gray-400" />
                                            )}
                                        </div>
                                    </div>
                                    {/* Validation message */}
                                    {username.length > 0 && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`text-xs mt-1.5 ${
                                                isValidatingUsername ? 'text-gray-500' :
                                                usernameValid ? 'text-black dark:text-white' : 'text-gray-400'
                                            }`}
                                        >
                                            {isValidatingUsername ? 'Checking LeetCode username...' :
                                                usernameValid ? '✓ Valid LeetCode username' : '✗ Must match a valid LeetCode username'}
                                        </motion.p>
                                    )}
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-black dark:text-white mb-2">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full bg-white/50 dark:bg-black/50 backdrop-blur-sm border-2 border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-black dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-black dark:focus:border-white transition-all"
                                        required
                                    />
                                </div>

                                {/* Password Field */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-black dark:text-white mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Minimum 8 characters"
                                            className="w-full bg-white/50 dark:bg-black/50 backdrop-blur-sm border-2 border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 pr-12 text-black dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-black dark:focus:border-white transition-all"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black dark:hover:text-white transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>

                                    {/* Password strength indicator */}
                                    {password.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="mt-2"
                                        >
                                            <div className="flex gap-1.5 mb-1">
                                                {[0, 1, 2, 3].map((i) => (
                                                    <div
                                                        key={i}
                                                        className={`h-1 flex-1 rounded-full transition-all ${
                                                            i < passwordStrength 
                                                                ? 'bg-black dark:bg-white' 
                                                                : 'bg-gray-300 dark:bg-gray-700'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                            {passwordStrength > 0 && (
                                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                                    Password strength: <span className="text-black dark:text-white font-medium">
                                                        {strengthLabels[passwordStrength]}
                                                    </span>
                                                </p>
                                            )}
                                        </motion.div>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={!isFormValid || isSubmitting}
                                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                                        isFormValid && !isSubmitting
                                            ? 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 shadow-lg'
                                            : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Creating account...
                                        </>
                                    ) : (
                                        <>
                                            Create Account
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>

                                {/* Sign in link */}
                                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                                    Already have an account?{' '}
                                    <Link href="/signin" className="text-black dark:text-white font-semibold hover:underline transition-all">
                                        Sign in
                                    </Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </motion.div>

                {/* RIGHT SECTION - Feature Showcase - Image Changes Every 10 Seconds */}
                <div className="max-lg:hidden h-screen">
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative h-full w-full overflow-hidden"
                    >
                        {/* Single image display with transitions */}
                        <div className="relative h-full w-full">
                            {featureShowcase.map((feature, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0 }}
                                    animate={{ 
                                        opacity: currentImageIndex === idx ? 1 : 0,
                                        scale: currentImageIndex === idx ? 1 : 1.05
                                    }}
                                    transition={{ duration: 1, ease: "easeInOut" }}
                                    className="absolute inset-0"
                                    style={{ pointerEvents: currentImageIndex === idx ? 'auto' : 'none' }}
                                >
                                    <div className="relative h-full w-full overflow-hidden bg-white dark:bg-black">
                                        <div className="relative w-full h-full grayscale">
                                            <Image
                                                src={feature.image}
                                                alt={feature.caption}
                                                fill
                                                className="object-cover"
                                                priority={idx === 0}
                                            />
                                        </div>
                                        {/* Caption overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end">
                                            <div className="w-full p-6">
                                                <p className="text-white font-semibold text-lg">
                                                    {feature.caption}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Slide indicators */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                            {featureShowcase.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentImageIndex(idx)}
                                    className={`transition-all ${
                                        currentImageIndex === idx 
                                            ? 'w-8 h-2 bg-white' 
                                            : 'w-2 h-2 bg-white/60 hover:bg-white/80'
                                    } rounded-full backdrop-blur-sm`}
                                    aria-label={`Go to slide ${idx + 1}`}
                                />
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}