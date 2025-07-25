"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { format, formatDistanceToNow } from "date-fns";
import {
  Brain,
  Briefcase,
  LineChart,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const DashboardView = ({ insights }) => {
  const salaryData = insights.salaryRanges.map((range) => ({
    name: range.role,
    min: range.min / 1000,
    max: range.max / 1000,
    median: range.median / 1000,
  }));

  const getDemandLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case "high":
        return "bg-green-500";

      case "medium":
        return "bg-yellow-500";

      case "low":
        return "bg-red-500";

      default:
        return "bg-gray-500";
    }
  };

  const getMarketOutLookInfo = (outlook) => {
    switch (outlook.toLowerCase()) {
      case "positive":
        return { icon: TrendingUp, color: "text-green-500" };

      case "neutral":
        return { icon: LineChart, color: "text-yellow-500" };

      case "negative":
        return { icon: TrendingDown, color: "text-red-500" };

      default:
        return { icon: LineChart, color: "text-gray-500" };
    }
  };

  const OutlookIcon = getMarketOutLookInfo(insights.marketOutLook).icon;
  const OutlookColor = getMarketOutLookInfo(insights.marketOutLook).color;

  const lastUpdateDate = format(new Date(insights.lastUpdated), "dd/MM/yyyy");
  const nextUpdateDistance = formatDistanceToNow(
    new Date(insights.nextUpdate),
    { addSuffix: true }
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Badge variant="outline">Last Updated : {lastUpdateDate}</Badge>
      </div>

      <div className="grid grid-col-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Market Outlook
            </CardTitle>
            <OutlookIcon className={`h-4 w-4 ${OutlookColor}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.marketOutLook}</div>
            <p className="text-xs texr-muted-foreground">
              Next Update : {nextUpdateDistance}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Industry Growth
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {insights.growthRate.toFixed(1)}%
            </div>
            <Progress value={insights.growthRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Demand Level</CardTitle>
            <Briefcase className={`h-4 w-4 text-muted-foreground `} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.demandLevel}</div>
            <div
              className={`h-2 w-full rounded-full mt-2 ${getDemandLevelColor(
                insights.demandLevel
              )}`}
            ></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Skills</CardTitle>
            <Brain className={`h-4 w-4 text-muted-foreground`} />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {insights.topSkills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Salary Ranges by Roles</CardTitle>
          <CardDescription>
            Displaying minimum, median, and maximum salaries (in thousands)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salaryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />

                <Bar
                  dataKey="min"
                  fill="#94a3b8"
                  name="Min Salary (K)"
                 
                />
                <Bar
                  dataKey="median"
                  fill="#64748b"
                  name="Median Salary (K)"
                 
                />
                <Bar
                  dataKey="max"
                  fill="#475569"
                  name="Max Salary (K)"
                
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
      <Card>
        <CardHeader>
          <CardTitle>Key Industry Trends</CardTitle>
          <CardDescription>
            Current trends shaping the Industry
          </CardDescription>
        </CardHeader>  
        <CardContent>
              <ul className="space-y-4">
                {insights.keyTrends.map((trend,idx)=>(
                  <li key={idx} className="flex items-start space-x-2">
                    <div  className="h-2 w-2 mt-2 rounded-full bg-primary"/>
                      <span>{trend}</span>  
                  </li>
                ))}
              </ul>
          </CardContent>    
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recommended Skills</CardTitle>
          <CardDescription>
           Skills to consider developing
          </CardDescription>
           </CardHeader> 
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {insights.recommendedSkills.map((skill)=>(
                <Badge key={skill} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
            
      </Card>
</div>
    </div>
  );
};

export default DashboardView;
