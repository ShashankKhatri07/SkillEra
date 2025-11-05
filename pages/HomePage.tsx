import React from 'react';
import { Brand } from '../components/Brand';
import { FacebookIcon } from '../components/icons/FacebookIcon';
import { YouTubeIcon } from '../components/icons/YouTubeIcon';

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="flex flex-col items-center text-center p-8 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-lg">
        <div className="text-indigo-400 mb-5">{icon}</div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-400 leading-relaxed">{description}</p>
    </div>
);

export const HomePage = ({ onGetStarted }: { onGetStarted: () => void }) => {
    return (
        <div className="bg-[#020617] text-slate-200 font-sans leading-normal tracking-tight">
            <div className="absolute top-0 left-0 w-full h-full bg-cover bg-center opacity-10" style={{backgroundImage: 'radial-gradient(circle at top right, rgb(79, 70, 229) 0%, transparent 40%), radial-gradient(circle at bottom left, rgb(139, 92, 246) 0%, transparent 50%)'}}></div>
            <header className="relative container mx-auto px-6 py-4 flex justify-between items-center">
                <Brand theme="dark" />
                <nav className="space-x-2 sm:space-x-4">
                    <button onClick={onGetStarted} className="font-semibold px-4 py-2 rounded-md hover:bg-white/10 transition-colors">Log In</button>
                    <button onClick={onGetStarted} className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/30">Sign Up</button>
                </nav>
            </header>

            <main className="relative">
                {/* Hero Section */}
                <section className="text-center pt-24 pb-28 px-6">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
                        Unlock Your Potential.
                        <br />
                        <span className="text-indigo-400">Showcase Your Skills.</span>
                    </h1>
                    <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-400">
                        The ultimate platform for students to document achievements, get verified, and climb the ranks. Transform your journey from grades to a portfolio of proven abilities.
                    </p>
                    <button onClick={onGetStarted} className="mt-10 bg-indigo-600 text-white font-bold px-8 py-4 rounded-lg text-lg hover:bg-indigo-700 transition-transform transform hover:scale-105 shadow-2xl shadow-indigo-600/40">
                        Enter SkillEra
                    </button>
                </section>

                {/* Features Section */}
                <section className="py-20 bg-black/20">
                    <div className="container mx-auto px-6">
                        <div className="grid md:grid-cols-3 gap-8">
                            <FeatureCard 
                                icon={<svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                                title="Document Your Skills"
                                description="Easily log your skills and achievements, providing details and evidence for a comprehensive record of your abilities."
                            />
                            <FeatureCard 
                                icon={<svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                                title="Get Staff Verified"
                                description="Submit your skills for review by faculty members, adding a layer of authenticity and credibility to your portfolio."
                            />
                            <FeatureCard 
                                icon={<svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
                                title="Climb the Leaderboard"
                                description="Earn points for verified skills and compete with your peers, fostering a culture of continuous improvement and healthy competition."
                            />
                        </div>
                    </div>
                </section>
                
                {/* About Institute Section */}
                <section className="py-24 px-6">
                    <div className="container mx-auto">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="text-center md:text-left">
                                <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                                    Powered by <span className="text-indigo-400">Excellence</span>
                                </h2>
                                <h3 className="text-2xl font-bold text-slate-300 mb-6">Army Public School, Jodhpur</h3>
                                <p className="text-slate-400 leading-relaxed">
                                    <strong className="block mb-2">About The School</strong>
                                    The Army Public School, Jodhpur was established on 01 July 1992 with strength of 247 students from class I to V. It was recognized by the AWES in Jul 1992. In July 1995, Class IX was added, in 1996 first batch of 16 students made the school proud by passing the CBSE class X Board Exam. Thereafter the school never looked back and took a quantum leap by starting class XI (Science) in 2001. Class XII (Science) was added in July 2002.
                                </p>
                            </div>
                            <div>
                                <img 
                                    src="https://www.apsjodhpur.com/webdata/slider/6bdb8d0d5f3b595d3b341654b2a03f28.png" 
                                    alt="Army Public School, Jodhpur campus" 
                                    className="rounded-xl shadow-2xl shadow-indigo-900/40 w-full h-auto object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonial Section */}
                <section className="py-24 px-6 bg-black/20">
                    <div className="container mx-auto max-w-3xl text-center">
                         <svg className="w-16 h-16 mx-auto mb-4 text-indigo-500 opacity-20" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 32 32"><path d="M9.333 22.667h4L16 17.333V9.333H6.667v8h4L8 22.667h1.333zm13.334 0h4L28 17.333V9.333h-9.333v8h4l-2.667 5.334h1.334z"/></svg>
                        <blockquote className="text-2xl italic text-white/90">
                            "Skillera transformed the way our students think about their accomplishments. It's not just about grades anymore; it's about building a tangible, verified portfolio of their unique talents."
                        </blockquote>
                        <p className="mt-8 font-bold text-lg text-slate-300">Dr. Evelyn Reed</p>
                        <p className="text-sm text-slate-500">Faculty Head</p>
                    </div>
                </section>
            </main>

            <footer className="border-t border-white/10 py-8">
                <div className="container mx-auto px-6 text-center text-slate-500">
                    <div className="flex justify-center items-center space-x-6 mb-6">
                        <a href="https://www.facebook.com/APSJodhpurIndia/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors" aria-label="Facebook">
                            <FacebookIcon className="w-7 h-7" />
                        </a>
                        <a href="https://www.youtube.com/channel/UCW3ebEDxniS3qQ-tnoZrPKQ" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors" aria-label="YouTube">
                            <YouTubeIcon className="w-7 h-7" />
                        </a>
                    </div>
                    &copy; 2025 Skillera. All rights reserved.
                </div>
            </footer>
        </div>
    );
};