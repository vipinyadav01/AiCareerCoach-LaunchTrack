"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  BriefcaseIcon,
  LineChart,
  TrendingUp,
  TrendingDown,
  Brain,
  FileText,
  FileSignature,
  MessagesSquare,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
        return "bg-emerald-500";
      case "medium":
        return "bg-amber-500";
      case "low":
        return "bg-rose-500";
      default:
        return "bg-gray-500";
    }
  };

  const getMarketOutlookInfo = (outlook) => {
    switch (outlook.toLowerCase()) {
      case "positive":
        return { icon: TrendingUp, color: "text-emerald-500" };
      case "neutral":
        return { icon: LineChart, color: "text-amber-500" };
      case "negative": 
        return { icon: TrendingDown, color: "text-rose-500" };
      default:
        return { icon: LineChart, color: "text-gray-500" };
    }
  };

  const OutlookIcon = getMarketOutlookInfo(insights.marketOutlook).icon;
  const outlookColor = getMarketOutlookInfo(insights.marketOutlook).color;

  const lastUpdatedDate = format(new Date(insights.lastUpdated), "dd/MM/yyyy");
  const nextUpdateDistance = formatDistanceToNow(
    new Date(insights.nextUpdate),
    { addSuffix: true }
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-card/70 border-border/40">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <CardTitle className="text-2xl md:text-3xl">
              Your {insights.industry} Dashboard
            </CardTitle>
            <CardDescription className="mt-1">
              Personalized insights to help you plan your next career move.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="px-3 py-1 text-sm">
              Last updated: {lastUpdatedDate}
            </Badge>
            <Badge className="px-3 py-1 text-sm">{insights.industry}</Badge>
          </div>
        </CardHeader>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Market Outlook
            </CardTitle>{" "}
            <OutlookIcon className={`h-6 w-6 ${outlookColor}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.marketOutlook}</div>
            <p className="text-xs text-muted-foreground">
              Next update {nextUpdateDistance}
            </p>
            <Progress value={75} className="mt-2 h-2" />{" "}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Industry Growth
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <TrendingUp className="h-6 w-6 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {insights.growthRate.toFixed(1)}%
            </div>
            <Progress value={insights.growthRate} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Demand Level</CardTitle>
            <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex flex-col items-start">
            <div className="text-2xl font-bold">{insights.demandLevel}</div>
            <div
              className={`h-2 w-full rounded-full mt-2 transition-all duration-300 ${getDemandLevelColor(
                insights.demandLevel
              )}`}
            />
            <p className="text-xs text-muted-foreground mt-1">Current demand</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Skills</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {insights.topSkills.slice(0, 3).map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Salary Chart */}
      <Card className="col-span-4 shadow-lg bg-card/80 border border-border/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold text-primary">Salary Ranges by Role</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Displaying minimum, median, and maximum salaries (in thousands)
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <div className="min-w-[340px] md:min-w-0 px-2 md:px-6 py-4">
              <ChartContainer
                config={{
                  min: {
                    label: "Minimum Salary",
                    color: "#10b981", // Green
                  },
                  median: {
                    label: "Median Salary", 
                    color: "#3b82f6", // Blue
                  },
                  max: {
                    label: "Maximum Salary",
                    color: "#8b5cf6", // Purple
                  },
                }}
                className="h-[340px] md:h-[400px]"
              >
                <BarChart data={salaryData} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <ChartTooltip cursor={{ fill: 'rgba(0, 0, 0, 0.07)' }}>
                    <ChartTooltipContent />
                  </ChartTooltip>
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar 
                    dataKey="min" 
                    fill="var(--color-min)" 
                    name="Minimum Salary"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="median" 
                    fill="var(--color-median)" 
                    name="Median Salary"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="max" 
                    fill="var(--color-max)" 
                    name="Maximum Salary"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trends, Skills, and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Key Industry Trends</CardTitle>
            <CardDescription>
              Current trends shaping the industry
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {insights.keyTrends.map((trend, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    {trend}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommended Skills</CardTitle>
            <CardDescription>Skills to consider developing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {insights.recommendedSkills.map((skill) => (
                <Badge key={skill} variant="secondary" className="px-3 py-1">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Boost your profile in minutes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Link href="/resume">
                <Button variant="secondary" className="w-full justify-start gap-2">
                  <FileText className="h-4 w-4" /> Improve Resume
                </Button>
              </Link>
              <Link href="/ai-cover-letter">
                <Button variant="secondary" className="w-full justify-start gap-2">
                  <FileSignature className="h-4 w-4" /> Write Cover Letter
                </Button>
              </Link>
              <Link href="/interview">
                <Button variant="secondary" className="w-full justify-start gap-2">
                  <MessagesSquare className="h-4 w-4" /> Practice Interview
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardView;