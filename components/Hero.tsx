'use client';
import HeroHeader from './HeroHeader';
import HeroVisual from './HeroVisual';

export default function Hero() {
    return (
        <section className="relative w-full min-h-screen bg-background overflow-hidden flex flex-col items-center">
            {/* Background Gradients */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-foreground/5 via-background to-background opacity-20 pointer-events-none" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5 pointer-events-none" />

            {/* Content */}
            <div className="w-full h-full flex flex-col relative z-10">
                <HeroHeader />
                <HeroVisual />
            </div>
        </section>
    );
}
