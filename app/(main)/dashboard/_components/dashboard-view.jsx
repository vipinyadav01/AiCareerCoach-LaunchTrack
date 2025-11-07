"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart,
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
  Sparkles,
  Target,
  Zap,
  Award,
  Activity,
  RefreshCw,
  Edit,
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
        return "from-emerald-500 to-green-600";
      case "medium":
        return "from-amber-500 to-orange-600";
      case "low":
        return "from-rose-500 to-red-600";
      default:
        return "from-gray-500 to-slate-600";
    }
  };

  const getDemandProgress = (level) => {
    switch (level.toLowerCase()) {
      case "high":
        return 85;
      case "medium":
        return 55;
      case "low":
        return 25;
      default:
        return 50;
    }
  };

  const getMarketOutlookInfo = (outlook) => {
    switch (outlook.toLowerCase()) {
      case "positive":
        return { icon: TrendingUp, color: "text-emerald-500", bgColor: "bg-emerald-500/10", progress: 75 };
      case "neutral":
        return { icon: LineChart, color: "text-amber-500", bgColor: "bg-amber-500/10", progress: 50 };
      case "negative": 
        return { icon: TrendingDown, color: "text-rose-500", bgColor: "bg-rose-500/10", progress: 30 };
      default:
        return { icon: LineChart, color: "text-gray-500", bgColor: "bg-gray-500/10", progress: 50 };
    }
  };

  const OutlookIcon = getMarketOutlookInfo(insights.marketOutlook).icon;
  const outlookColor = getMarketOutlookInfo(insights.marketOutlook).color;
  const outlookBgColor = getMarketOutlookInfo(insights.marketOutlook).bgColor;
  const outlookProgress = getMarketOutlookInfo(insights.marketOutlook).progress;

  const lastUpdatedDate = format(new Date(insights.lastUpdated), "dd/MM/yyyy");
  const nextUpdateDistance = formatDistanceToNow(
    new Date(insights.nextUpdate),
    { addSuffix: true }
  );

  const { user } = useUser();
  const router = useRouter();

  return (
    <div className="min-h-screen space-y-8 pb-12">
      {/* Hero Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-violet-600 via-purple-600 to-indigo-700 p-8 md:p-10 shadow-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMy4zMTQgMi42ODYtNiA2LTZzNi0yLjY4NiA2LTZjMC0zLjMxNC0yLjY4Ni02LTYtNnMtNi0yLjY4Ni02LTZjMC0zLjMxNC0yLjY4Ni02LTYtNnMtNiAyLjY4Ni02IDZjMCAzLjMxNC0yLjY4NiA2LTYgNnMtNiAyLjY4Ni02IDZjMCAzLjMxNCAyLjY4NiA2IDYgNnM2IDIuNjg2IDYgNmMwIDMuMzE0IDIuNjg2IDYgNiA2czYtMi42ODYgNi02eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-yellow-300" />
              {user?.firstName ? `Welcome back, ${user.firstName}!` : "Welcome back!"}
            </h1>
            <p className="text-violet-100 text-lg">
              Your personalized {insights.industry} career insights dashboard
            </p>
            <div className="flex items-center gap-2 pt-2">
              <Badge className="bg-white/20 text-white backdrop-blur-sm border-white/30 hover:bg-white/30">
                <Activity className="h-3 w-3 mr-1" />
                Last updated: {lastUpdatedDate}
              </Badge>
              <Badge className="bg-white/20 text-white backdrop-blur-sm border-white/30 hover:bg-white/30">
                {insights.industry}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Link href="/onboarding">
              <Button size="lg" variant="secondary" className="bg-white text-purple-700 hover:bg-white/90 shadow-lg">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </Link>
            <Button 
              size="lg" 
              onClick={() => router.refresh()}
              className="bg-purple-500 hover:bg-purple-400 text-white shadow-lg"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Insights
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards - Enhanced Design */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Market Outlook Card */}
        <Card className="relative overflow-hidden border-2 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className={`absolute top-0 right-0 w-32 h-32 ${outlookBgColor} rounded-full blur-3xl -mr-16 -mt-16`}></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Market Outlook
            </CardTitle>
            <div className={`p-3 rounded-xl ${outlookBgColor}`}>
              <OutlookIcon className={`h-6 w-6 ${outlookColor}`} />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold mb-1">{insights.marketOutlook}</div>
            <p className="text-xs text-muted-foreground mb-3">
              Next update {nextUpdateDistance}
            </p>
            <Progress value={outlookProgress} className="h-2.5 bg-muted" />
          </CardContent>
        </Card>

        {/* Industry Growth Card */}
        <Card className="relative overflow-hidden border-2 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Industry Growth
            </CardTitle>
            <div className="p-3 rounded-xl bg-emerald-500/10">
              <TrendingUp className="h-6 w-6 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold mb-1 text-emerald-600">
              +{insights.growthRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mb-3">Year over year growth</p>
            <Progress value={insights.growthRate} className="h-2.5 bg-muted" />
          </CardContent>
        </Card>

        {/* Demand Level Card */}
        <Card className="relative overflow-hidden border-2 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Demand Level
            </CardTitle>
            <div className="p-3 rounded-xl bg-blue-500/10">
              <BriefcaseIcon className="h-6 w-6 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold mb-1">{insights.demandLevel}</div>
            <p className="text-xs text-muted-foreground mb-3">Current market demand</p>
            <div className="relative h-2.5 rounded-full bg-muted overflow-hidden">
              <div 
                className={`absolute left-0 top-0 h-full rounded-full bg-linear-to-r ${getDemandLevelColor(insights.demandLevel)} transition-all duration-500`}
                style={{ width: `${getDemandProgress(insights.demandLevel)}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Top Skills Card */}
        <Card className="relative overflow-hidden border-2 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Top Skills
            </CardTitle>
            <div className="p-3 rounded-xl bg-purple-500/10">
              <Brain className="h-6 w-6 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold mb-1">{insights.topSkills.length}</div>
            <p className="text-xs text-muted-foreground mb-3">In-demand skills</p>
            <div className="flex flex-wrap gap-1.5">
              {insights.topSkills.slice(0, 3).map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Salary Chart - Enhanced Design */}
      <Card className="shadow-xl border-2 hover:shadow-2xl transition-all duration-300">
        <CardHeader className="pb-4 border-b">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Target className="h-6 w-6 text-primary" />
                Salary Ranges by Role
              </CardTitle>
              <CardDescription className="text-base">
                Compensation insights across different positions (in thousands)
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-sm px-4 py-2">
              <Award className="h-4 w-4 mr-2" />
              Market Data
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="w-full">
            <ChartContainer
              config={{
                min: {
                  label: "Minimum Salary",
                  color: "#10b981",
                },
                median: {
                  label: "Median Salary", 
                  color: "#3b82f6",
                },
                max: {
                  label: "Maximum Salary",
                  color: "#8b5cf6",
                },
              }}
              className="h-[400px] w-full"
            >
              <BarChart data={salaryData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30 stroke-muted" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 13, fill: 'currentColor' }}
                  tickLine={false}
                  axisLine={{ stroke: 'currentColor', strokeWidth: 1 }}
                  className="text-muted-foreground"
                />
                <YAxis 
                  tick={{ fontSize: 13, fill: 'currentColor' }}
                  tickLine={false}
                  axisLine={{ stroke: 'currentColor', strokeWidth: 1 }}
                  label={{ value: 'Salary (K)', angle: -90, position: 'insideLeft', fill: 'currentColor' }}
                  className="text-muted-foreground"
                />
                <ChartTooltip 
                  cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }}
                  content={<ChartTooltipContent />}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar 
                  dataKey="min" 
                  fill="var(--color-min)" 
                  name="Minimum Salary"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={60}
                />
                <Bar 
                  dataKey="median" 
                  fill="var(--color-median)" 
                  name="Median Salary"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={60}
                />
                <Bar 
                  dataKey="max" 
                  fill="var(--color-max)" 
                  name="Maximum Salary"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={60}
                />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Section - Trends, Skills, and Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Key Trends */}
        <Card className="border-2 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="border-b bg-linear-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Zap className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Key Industry Trends</CardTitle>
                <CardDescription className="text-sm">
                  What's shaping the market
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="space-y-4">
              {insights.keyTrends.map((trend, index) => (
                <li key={index} className="flex items-start space-x-3 group">
                  <div className="mt-1 shrink-0">
                    <div className="h-2 w-2 rounded-full bg-blue-500 group-hover:scale-125 transition-transform" />
                  </div>
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    {trend}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Recommended Skills */}
        <Card className="border-2 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="border-b bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Brain className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Recommended Skills</CardTitle>
                <CardDescription className="text-sm">
                  Boost your expertise
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-2">
              {insights.recommendedSkills.map((skill, index) => (
                <Badge 
                  key={skill} 
                  variant="secondary" 
                  className="px-3 py-1.5 text-sm hover:bg-purple-500 hover:text-white transition-all duration-200 cursor-pointer"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-2 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="border-b bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Sparkles className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
                <CardDescription className="text-sm">
                  Take your next step
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <Link href="/resume" className="block">
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-3 h-12 hover:bg-primary hover:text-primary-foreground transition-all group"
                >
                  <div className="p-1.5 rounded-md bg-blue-500/10 group-hover:bg-white/20">
                    <FileText className="h-4 w-4 text-blue-600 group-hover:text-current" />
                  </div>
                  <span className="font-medium">Improve Resume</span>
                </Button>
              </Link>
              <Link href="/ai-cover-letter" className="block">
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-3 h-12 hover:bg-primary hover:text-primary-foreground transition-all group"
                >
                  <div className="p-1.5 rounded-md bg-purple-500/10 group-hover:bg-white/20">
                    <FileSignature className="h-4 w-4 text-purple-600 group-hover:text-current" />
                  </div>
                  <span className="font-medium">Write Cover Letter</span>
                </Button>
              </Link>
              <Link href="/interview" className="block">
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-3 h-12 hover:bg-primary hover:text-primary-foreground transition-all group"
                >
                  <div className="p-1.5 rounded-md bg-green-500/10 group-hover:bg-white/20">
                    <MessagesSquare className="h-4 w-4 text-green-600 group-hover:text-current" />
                  </div>
                  <span className="font-medium">Practice Interview</span>
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