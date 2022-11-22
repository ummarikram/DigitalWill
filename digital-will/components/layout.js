import Navbar from './navbar'
import Footer from './footer'
import { useEffect, useState } from 'react';

export default function Layout({ children }) {

  return (
    <>
      <Navbar/>
      <main>{children}</main>
      <Footer />
    </>
  )
}