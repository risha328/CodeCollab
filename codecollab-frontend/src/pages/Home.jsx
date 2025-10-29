import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import CodeEditorPreview from '../components/CodeEditorPreview';
import Workflow from '../components/Workflow';
import FAQNewsletter from '../components/FAQNewsletter';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero />
      <Features />

      <CodeEditorPreview />
      <Workflow />
      <FAQNewsletter />

      <Footer/>
    </div>
  );
};

export default Home;
