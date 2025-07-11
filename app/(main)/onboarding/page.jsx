import { getUserOnboardingStatus } from '@/actions/user'
import { industries } from '@/data/industries'
import { redirect } from 'next/navigation';
import React from 'react'
import OnboardingForm from './_component/onboarding-form';

const OnboardingPage = async () => {

  // Checking is user is onboarded or not 

  const {isOnboarded} = await getUserOnboardingStatus();
  if(isOnboarded){
    redirect("/dashboard")
  }

  return (
   <main>
    <OnboardingForm industries={industries}/>
   </main>
  )
}

export default OnboardingPage
