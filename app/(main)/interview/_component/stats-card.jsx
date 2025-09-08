import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Trophy } from 'lucide-react';
import React from 'react'

const StatsCards = ({assessment}) => {

    const getAverageScore = () => {
        if(!assessment?.length) return 0;

        const total = assessment.reduce((sum, assessment) => sum + assessment.quizScore,0 )
        return (total / assessment.length).toFixed(1);
    }

    const getLatestAssessment = () => {
        if(!assessment?.length) return null;
        return assessment[0]
    }

    const getTotalQuestion = () => {
        if(!assessment?.length) return 0;
        return assessment.reduce((sum ,assessment) => sum + assessment.questions.length, 0 )
    }

  return (
    <div className='grid gap-4 md:grid-cols-3'>
      <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
             Average Score
            </CardTitle>
              <Trophy className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getAverageScore()}%</div>
            <p className="text-xs texr-muted-foreground">
             Across all assessments
            </p>
          </CardContent>
        </Card>

      <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
            Question Practice
            </CardTitle>
              <Brain className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalQuestion()}</div>
            <p className="text-xs texr-muted-foreground">
            Total Questions
            </p>
          </CardContent>
        </Card>

      <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
             Latest Score
            </CardTitle>
              <Trophy className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getLatestAssessment()?. quizScore.toFixed(1) || 0}%</div>
            <p className="text-xs texr-muted-foreground">
             Most recent quiz
            </p>
          </CardContent>
        </Card>
    </div>
  )
}

export default StatsCards
