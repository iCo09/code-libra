'use client';

import HeroLeft from './HeroLeft';
import HeroRight from './HeroRight';

export default function Hero() {
    return (
        <section className="relative w-full min-h-screen bg-black overflow-hidden flex flex-col lg:flex-row">
            {/* Grid Background Pattern */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 pointer-events-none" />

            {/* Left Content */}
            <div className="w-full lg:w-[45%] h-full flex flex-col justify-center min-h-[50vh] lg:min-h-screen relative z-10">
                <HeroLeft />
            </div>

            {/* Right Content */}
            <div className="w-full lg:w-[55%] h-full min-h-[50vh] lg:min-h-screen relative z-10 flex items-center justify-center bg-gradient-to-b from-transparent to-zinc-900/20 lg:bg-none">
                <HeroRight />
            </div>
        </section>
    );
}
