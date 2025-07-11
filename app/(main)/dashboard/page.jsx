import { getIndustryInsight } from '@/actions/dashboard';
import { getUserOnboardingStatus } from '@/actions/user';
import { redirect } from 'next/navigation';
import React from 'react'
import DashboardView from './_component/dashboard-view';

const IndustryInsightPage = async () => {
 
    const {isOnboarded} = await getUserOnboardingStatus();
    // const insights = await getIndustryInsight();
    // If not onboarded, redirect to onboarding page
  // Skip this check if already on the onboarding page
    if(!isOnboarded){
      redirect("/onboarding")
    }

  return (
    <div className='container mx-auto'>
      <DashboardView insight = {insights}/>
    </div>
  )
}

export default IndustryInsightPage
 