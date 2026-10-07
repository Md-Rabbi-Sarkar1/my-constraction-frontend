import React from 'react';
import { HardHat, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
// Import your custom Badge safely
import { Badge as CustomBadge } from "@/components/ui/badge"; 
import Link from 'next/link';

export default function SimpleHeroWithImage() {
  return (
    <section className="bg-background text-foreground py-16 md:py-24 border-b">
      <div className="container mx-auto px-4 max-w-6xl grid gap-12 md:grid-cols-2 items-center">
        
        {/* Left Column: Simple Clean Text */}
        <div className="space-y-6 text-left">
          <div>
            <CustomBadge tone="gray">
              <HardHat className="h-3.5 w-3.5 mr-1.5 text-amber-500 shrink-0" /> Professional Construction Management
            </CustomBadge>
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-50 text-balance leading-tight">
            Deliver Capital Projects On Time and On Budget
          </h1>
          
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl font-normal leading-relaxed">
            From pre-construction bidding to final closeout. We help field crews, managers, and project executives communicate on a simple platform built for scale.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link href="http://localhost:3000/login"><Button  size="lg" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-medium px-6 h-12 shadow-sm">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button></Link>
            <Button size="lg" variant="outline" className="h-12 px-6">
              View Our Work
            </Button>
          </div>
        </div>

        {/* Right Column: Clean Picture Holder */}
        <div className="relative w-full aspect-[4/3] sm:aspect-video md:aspect-square overflow-hidden rounded-xl border bg-muted shadow-sm">
          <img 
            src="images.jpg" 
            alt="Modern Construction Project Site" 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>

      </div>
    </section>
  );
}
