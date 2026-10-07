import React from 'react'
import ServicesPage from './services/page'
import PricingPage from './pricing/page'
import AboutPage from './about-us/page'
import ContactPage from './contact/page'
import ProjectAnnouncementBanner from '@/components/modules/homepage/Hero'
import HeroSection from '@/components/modules/homepage/Hero'
import SimpleHero from '@/components/modules/homepage/Hero'
import SimpleHeroWithImage from '@/components/modules/homepage/Hero'

export default function page() {
  return (
    <>
  <SimpleHeroWithImage></SimpleHeroWithImage>
    <ServicesPage></ServicesPage>
    <AboutPage></AboutPage>
    <PricingPage></PricingPage>
    <ContactPage></ContactPage>
    </>
  )
}
