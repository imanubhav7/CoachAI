"use client"

import Link from 'next/link'
import React, { useEffect, useRef } from 'react'
import { Button } from './ui/button'
import Image from 'next/image'
import bg from '../public/banner2.jpeg'
const HeroSection = () => {

    const imgRef = useRef(null);
    useEffect(() =>{
        const imgEle = imgRef.current

        const handleScroll = () =>{
            const scrollPosition = window.scrollY;
            const scrollThreshold = 100;
            
            if(scrollPosition > scrollThreshold){
                imgEle.classList.add("scrolled");
            }
            else{
                imgEle.classList.remove("scrolled")
            }
        };
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
        
    },[]);

  return (
    <section className='w-full pt-36 md:pt-48 pb-10'>
        <div className='text-center space-y-6'>
            <div className='space-y-6 mx-auto'>
                <h1 className='text-5xl font-bold md:text-6xl lg:text-7xl xl:text-8xl'>
                    Your AI Career Coach for
                    <br />
                    Professional Success
                </h1>
                <p className='mx-auto max-w-[600] text-muted-foreground md:text-xl' >Advance your career with personalized guidance, interview prep, and AI-powered tools for job success</p>
            </div>
            <div className='flex justify-center space-x-4'>
                <Link href='/dashboard'>
                <Button size='lg' className="px-8">Get Started</Button>
                </Link>
                {/* <Link href=''>
                <Button size='lg' className="px-8" variant="outline">Get Started</Button>
                </Link> */}
            </div>

            <div className='hero-img-wrapper mt-5 md:mt-0'> 
                <div ref={imgRef} className='hero-img'>
                    <Image src={bg}
                    width={1280}
                    height={720}
                    alt='Banner CoachAI'
                    className='rounded-lg shadow-2xl border mx-auto'
                    priority
                    />
                </div>
            </div>
        </div>
    </section>
  )
}

export default HeroSection
