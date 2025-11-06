import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { ContainerScroll } from './ui/container-scroll-animation'
import { TextHoverEffect } from './ui/text-hover-effect'
import { TypewriterEffect } from "./ui/typewriter-effect";

const HeroSection = () => {
   const words = [
  {
    text: "Accelerate",
  },
  {
    text: "Your",
  },
  {
    text: "Career",
  },
  {
    text: "with",
  },
  {
    text: "AI",
  },
  {
    text: "Insights",
    className: "text-foreground",
  },
];

    return (
        <section className='relative w-full min-h-screen pt-20 md:pt-32 pb-16 overflow-hidden bg-transparent'>
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/8 via-primary/3 to-transparent rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-40 -left-40 w-80 h-80 bg-gradient-to-tr from-secondary/12 via-secondary/6 to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute bottom-20 right-20 w-60 h-60 bg-gradient-to-tl from-accent/8 via-accent/3 to-transparent rounded-full blur-2xl animate-pulse delay-2000" />
                
                <div className="absolute top-1/3 right-1/3 w-32 h-32 bg-muted/10 rounded-full blur-xl animate-bounce" style={{ animationDuration: '6s' }} />
                <div className="absolute bottom-1/3 left-1/4 w-24 h-24 bg-muted/8 rounded-full blur-lg animate-bounce delay-3000" style={{ animationDuration: '8s' }} />
                
                <div className="absolute inset-0 bg-grid-small-border/[0.01] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />
            </div>

            <div className='relative z-10'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='text-center space-y-12'>
                        <div className='space-y-10'>
                            <Badge variant="secondary" className="px-6 py-3 text-sm font-medium bg-background/60 backdrop-blur-md border-border/50 hover:bg-background/80 transition-all duration-300 hover:scale-105">
                                <div className="w-2 h-2 bg-primary rounded-full mr-3 animate-pulse" />
                                AI-Powered Career Guidance
                                <div className="ml-3 text-lg">🚀</div>
                            </Badge>

                            <div className="space-y-8">
                                <div className="relative">
                                    <h2 className="text-6xl sm:text-8xl md:text-[8rem] font-black leading-[0.9] text-foreground tracking-tight">
                                        <TextHoverEffect text="ELEVATE" />
                                    </h2>
                                </div>
                                
                                <div className="flex justify-center">
                                    <TypewriterEffect
                                        words={words}
                                        className="text-xl sm:text-3xl md:text-4xl font-semibold text-muted-foreground"
                                    />
                                </div>
                            </div>

                            <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                                Your AI-powered career companion that turns ambitions into achievements with{' '}
                                <span className="font-semibold text-foreground">smart insights</span>,{' '}
                                personalized roadmaps, and opportunities designed for your success.
                            </p>
                        </div>

                        <div className='flex flex-col sm:flex-row items-center justify-center gap-6 pt-8'>
                            <Link href="/dashboard" className="w-full sm:w-auto">
                                <Button
                                    size="lg"
                                    className="w-full sm:w-56 h-14 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                                >
                                    Start Your Journey
                                    <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                                </Button>
                            </Link>
                            <Link href="/sign-in" className="w-full sm:w-auto">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="w-full sm:w-56 h-14 rounded-xl font-semibold text-base transition-all duration-300 hover:scale-105 bg-background/60 backdrop-blur-md border-border/50 hover:bg-background/80"
                                >
                                    Explore Features
                                </Button>
                            </Link>
                        </div>

                        <div className="pt-16">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
                                {[
                                    {
                                        title: "AI-Powered Matching",
                                        description: "Smart algorithms connect you with perfect opportunities",
                                        icon: "🎯"
                                    },
                                    {
                                        title: "Personalized Guidance", 
                                        description: "Tailored advice based on your skills and goals",
                                        icon: "🧭"
                                    },
                                    {
                                        title: "Career Analytics",
                                        description: "Data-driven insights to accelerate your growth",
                                        icon: "📊"
                                    },
                                ].map(({ title, description, icon }, idx) => (
                                    <Card
                                        key={idx}
                                        className="group bg-card/40 backdrop-blur-md border-border/60 hover:border-primary/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:bg-card/50"
                                    >
                                        <CardHeader className="text-center space-y-5 pb-4">
                                            <div className="text-5xl group-hover:scale-125 transition-transform duration-500">
                                                {icon}
                                            </div>
                                            <CardTitle className="text-xl font-bold">
                                                {title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="text-center pt-0">
                                            <CardDescription className="text-base leading-relaxed">
                                                {description}
                                            </CardDescription>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        <div className="pt-12">
                            <div className="flex flex-wrap justify-center items-center gap-6 text-muted-foreground">
                                {[
                                    { stat: "10K+ Success Stories", icon: "⭐" },
                                    { stat: "98% Match Accuracy", icon: "🎯" },
                                    { stat: "24/7 AI Support", icon: "🤖" },
                                ].map(({ stat, icon }, idx) => (
                                    <Badge 
                                        key={idx} 
                                        variant="outline" 
                                        className="px-6 py-3 text-base bg-background/50 backdrop-blur-md border-border/50 hover:bg-primary/10 hover:border-primary/50 hover:text-foreground transition-all duration-300 hover:scale-110 cursor-default"
                                    >
                                        <span className="text-xl mr-3">{icon}</span>
                                        <span className="font-semibold">{stat}</span>
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-24">
                    <div className="flex flex-col overflow-hidden">
                        <ContainerScroll
                            titleComponent={
                                <>
                                    <h2 className="text-5xl md:text-7xl font-extrabold text-center mb-16 text-foreground tracking-tight">
                                        Unleash the power of
                                        <br />
                                        <span className="text-6xl md:text-8xl bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent font-extrabold mt-6 leading-tight inline-block">
                                            AI Career Platform
                                        </span>
                                    </h2>
                                </>
                            }
                        >
                            <Card className="w-full rounded-2xl overflow-hidden aspect-[2/1] border-2 border-border/60 shadow-2xl bg-card/90 backdrop-blur-lg hover:shadow-primary/20 transition-shadow duration-500">
                                <CardContent className="p-0 relative">
                                    <img
                                        src={`/banner.png`}
                                        alt="AI Career Platform Dashboard Preview"
                                        height={720}
                                        width={1400}
                                        className="w-full h-full object-cover object-left-top"
                                        draggable={false}
                                    />
                                    
                                    <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
                                    
                                    <div className="absolute top-6 right-6 flex items-center gap-2 bg-green-500/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-green-500/30">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                        <span className="text-xs font-medium text-green-500">Live</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </ContainerScroll>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroSection