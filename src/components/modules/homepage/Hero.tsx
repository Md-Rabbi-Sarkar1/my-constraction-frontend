import React from 'react';
import { HardHat, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
// Import your custom Badge safely
import { Badge as CustomBadge } from "@/components/ui/badge"; 
import Link from 'next/link';

export default function SimpleHeroWithImage() {
  return (
    <section className="relative overflow-hidden border-b bg-[#f7f8fa] py-16 text-foreground md:py-24">
      <div className="pointer-events-none absolute -right-32 -top-40 h-96 w-96 rounded-full bg-amber-200/40 blur-3xl" />
      <div className="container mx-auto px-4 max-w-6xl grid gap-12 md:grid-cols-2 items-center">
        
        {/* Left Column: Simple Clean Text */}
        <div className="space-y-6 text-left">
          <div>
            <CustomBadge tone="gray">
              <HardHat className="h-3.5 w-3.5 mr-1.5 text-amber-500 shrink-0" /> Professional Construction Management
            </CustomBadge>
          </div>
          
          <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-950 sm:text-6xl text-balance">
            Run every job site with confidence.
          </h1>
          
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl font-normal leading-relaxed">
            From pre-construction bidding to final closeout, keep teams, budgets, materials, and field issues aligned in one calm workspace.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link href="/login"><Button  size="lg" className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-semibold px-6 h-12 shadow-sm">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button></Link>
            <Button size="lg" variant="outline" className="h-12 px-6 bg-white">
              View Our Work
            </Button>
          </div>
        </div>

        {/* Right Column: Clean Picture Holder */}
        <div className="relative w-full aspect-[4/3] sm:aspect-video md:aspect-square overflow-hidden rounded-3xl border-8 border-white bg-muted shadow-2xl shadow-slate-900/15">
          <img 
            src="images.jpg" 
            alt="Modern Construction Project Site" 
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>

      </div>
    </section>
  );
}
