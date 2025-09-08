import { getAssessment } from '../../../actions/interview'
import React from 'react'
import StatsCards from './_component/stats-card';
import QuizList from './_component/quiz-list';
import PerformanceChart from './_component/performancechart';

const InterviewPage = async () => {

  const assessments = await getAssessment();


  return (
    <div>
      <div>
        <h1 className='text-6xl font-bold gradient-title mb-5'>Interview Preparation</h1>

        <div className='space-y-6'>
          <StatsCards assessments={assessments}/>
          <PerformanceChart assessments={assessments}/>
          <QuizList assessments={assessments}/>
        </div>
      </div>
    </div>
  )
}

export default InterviewPage
