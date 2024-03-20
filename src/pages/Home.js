//Dependencies
import React from 'react';
import Banner from '../components/Banner';
import Highlights from '../components/Highlights';
import FeaturedProducts from '../components/FeaturedProducts';
import Footer from '../components/Footer';

export default function Home() {
  const data = {
    title: "Welcome to MonLexi Gadgets",
    content: "At MonLexi Gadgets, we believe in the power of technology to transform the way you work, play, and connect. We curate a diverse selection of top-tier laptops from leading brands, providing you with the latest innovations in portable computing.",
    destination: "/products",
    label: "Buy now!"
  };

  return (
    <>
   
      <Banner data={data} />
      <FeaturedProducts />
      <Highlights />
      <Footer />
    </>
  );
}
