import React from 'react'
import Technologies from '../components/Technologies'
import Footer from '../components/Footer'
import HeaderWithNavbar from '../components/HeaderWithNavbar'
import HeroSection from '../components/HeroSection'

const HomePage = () => {
  return (
     <div className="d-flex flex-column min-vh-100">
      <HeaderWithNavbar />
      
      <main className="flex-grow-1">
        {/* Hero Section with full width */}
        <div className="hero-wrapper">
          <HeroSection />
        </div>
        
        {/* Other content sections would go here inside container */}
        <div className="">
          <Technologies/>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export default HomePage