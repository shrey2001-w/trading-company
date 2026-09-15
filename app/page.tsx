import React from 'react'
import Header from './Components/header'
import HeroSection from './Components/hero'
import ProductsCatalog from './Components/Products/ProductsCatalog'
import { SAMPLE_PRODUCTS } from './Components/Products/data'
import AboutUs from './Components/Aboutus'
import ContactForm from './Components/Contact'
import Footer from './Components/Footer'

const page = () => {
  return (
    <div>
      <Header />
      <HeroSection />
      <ProductsCatalog products={SAMPLE_PRODUCTS} currencySymbol="₹" />
      <AboutUs />
      <ContactForm />
      <Footer />
    </div>
  )
}

export default page