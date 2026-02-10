import React, { useState, useCallback } from 'react';
import { ThemeProvider } from 'styled-components';
import GlobalStyles from './styles/GlobalStyles';
import { tokens } from './styles/tokens';

import Preloader from './components/Preloader';
import GridBackground from './components/GridBackground';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import ScrollProgress from './components/ScrollProgress';
import TargetAudience from './components/TargetAudience';
import TeamSection from './components/TeamSection';
import KPISection from './components/KPISection';
import VisionSection from './components/VisionSection';
import EventsTimeline from './components/EventsTimeline';
import Testimonials from './components/Testimonials';
import Stories from './components/Stories';
import FAQ from './components/FAQ';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';

export default function App({ onReady }) {
  const [loaded, setLoaded] = useState(false);

  const handlePreloaderDone = useCallback(() => {
    setLoaded(true);
    onReady?.();
    const el = document.getElementById('preloader');
    if (el) el.remove();
  }, [onReady]);

  return (
    <ThemeProvider theme={tokens}>
      <GlobalStyles />
      <Preloader onComplete={handlePreloaderDone} />
      <GridBackground />
      <ScrollProgress />
      <Navigation />

      <main id="main-content" role="main">
        <Hero />
        <TargetAudience />
        <TeamSection />
        <KPISection />
        <VisionSection />
        <EventsTimeline />
        <Testimonials />
        <Stories />
        <FAQ />
        <Newsletter />
      </main>

      <Footer />
    </ThemeProvider>
  );
}
