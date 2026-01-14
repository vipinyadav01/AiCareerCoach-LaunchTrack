"use client";

import React, { useState, useEffect } from "react";
import { useNeonUser } from "@/hooks/use-neon-auth";
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
  ArrowRight,
  CheckCircle2,
  Clock,
  TrendingUp as TrendingUpIcon,
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
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Validate insights data
  if (!insights) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>No Data Available</CardTitle>
            <CardDescription>Unable to load dashboard insights. Please try refreshing.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.reload()} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Page
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Ensure required fields exist with defaults
  const safeInsights = {
    industry: insights.industry || "Unknown",
    salaryRanges: Array.isArray(insights.salaryRanges) ? insights.salaryRanges : [],
    growthRate: typeof insights.growthRate === 'number' ? insights.growthRate : 0,
    demandLevel: insights.demandLevel || "Medium",
    topSkills: Array.isArray(insights.topSkills) ? insights.topSkills : [],
    marketOutlook: insights.marketOutlook || "Neutral",
    keyTrends: Array.isArray(insights.keyTrends) ? insights.keyTrends : [],
    recommendedSkills: Array.isArray(insights.recommendedSkills) ? insights.recommendedSkills : [],
    lastUpdated: insights.lastUpdated || new Date(),
    nextUpdate: insights.nextUpdate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  };

  const salaryData = safeInsights.salaryRanges.map((range) => ({
    name: range.role || "Unknown Role",
    min: (range.min || 0) / 1000,
    max: (range.max || 0) / 1000,
    median: (range.median || 0) / 1000,
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
        return { icon: TrendingUp, color: "text-emerald-500", bgColor: "bg-emerald-500/10", progress: 75, borderColor: "border-emerald-500/20" };
      case "neutral":
        return { icon: LineChart, color: "text-amber-500", bgColor: "bg-amber-500/10", progress: 50, borderColor: "border-amber-500/20" };
      case "negative":
        return { icon: TrendingDown, color: "text-rose-500", bgColor: "bg-rose-500/10", progress: 30, borderColor: "border-rose-500/20" };
      default:
        return { icon: LineChart, color: "text-gray-500", bgColor: "bg-gray-500/10", progress: 50, borderColor: "border-gray-500/20" };
    }
  };

  const OutlookIcon = getMarketOutlookInfo(safeInsights.marketOutlook).icon;
  const outlookColor = getMarketOutlookInfo(safeInsights.marketOutlook).color;
  const outlookBgColor = getMarketOutlookInfo(safeInsights.marketOutlook).bgColor;
  const outlookProgress = getMarketOutlookInfo(safeInsights.marketOutlook).progress;
  const outlookBorderColor = getMarketOutlookInfo(safeInsights.marketOutlook).borderColor;

  // Use useState to prevent hydration mismatch with date formatting
  const [lastUpdatedDate, setLastUpdatedDate] = useState("");
  const [nextUpdateDistance, setNextUpdateDistance] = useState("");

  useEffect(() => {
    setLastUpdatedDate(format(new Date(safeInsights.lastUpdated), "dd/MM/yyyy"));
    setNextUpdateDistance(
      formatDistanceToNow(new Date(safeInsights.nextUpdate), { addSuffix: true })
    );
  }, [safeInsights.lastUpdated, safeInsights.nextUpdate]);

  const { user } = useNeonUser();
  const router = useRouter();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await router.refresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="min-h-screen space-y-6 pb-12">
      {/* Hero Header Section - Enhanced */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/95 to-primary/85 p-8 md:p-12 shadow-2xl border border-primary/30 backdrop-blur-sm">
        {/* Animated background pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMy4zMTQgMi42ODYtNiA2LTZzNi0yLjY4NiA2LTZjMC0zLjMxNC0yLjY4Ni02LTYtNnMtNi0yLjY4Ni02LTZjMC0zLjMxNC0yLjY4Ni02LTYtNnMtNiAyLjY4Ni02IDZjMCAzLjMxNC0yLjY4NiA2LTYgNnMtNiAyLjY4Ni02IDZjMCAzLjMxNCAyLjY4NiA2IDYgNnM2IDIuNjg2IDYgNmMwIDMuMzE0IDIuNjg2IDYgNiA2czYtMi42ODYgNi02eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20 animate-pulse"></div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-transparent to-transparent"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30">
                <Sparkles className="h-6 w-6 md:h-8 md:w-8 text-yellow-300 animate-pulse" />
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground tracking-tight">
                {user?.name || user?.email?.split('@')[0] ? `Welcome back, ${user?.name || user?.email?.split('@')[0]}!` : "Welcome back!"}
              </h1>
            </div>
            <p className="text-primary-foreground/90 text-lg md:text-xl font-medium max-w-2xl">
              Your personalized {safeInsights.industry} career insights dashboard
            </p>
            <div className="flex items-center gap-3 pt-2 flex-wrap">
              <Badge className="bg-white/20 text-primary-foreground backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all duration-200 px-3 py-1.5 text-sm font-medium">
                <Activity className="h-3.5 w-3.5 mr-1.5" />
                Last updated: {lastUpdatedDate || format(new Date(safeInsights.lastUpdated), "dd/MM/yyyy")}
              </Badge>
              <Badge className="bg-white/20 text-primary-foreground backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all duration-200 px-3 py-1.5 text-sm font-medium">
                <BriefcaseIcon className="h-3.5 w-3.5 mr-1.5" />
                {safeInsights.industry}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Link href="/onboarding">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/95 shadow-xl font-semibold transition-all duration-200 hover:scale-105 active:scale-95 h-12 px-6"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </Link>
            <Button
              size="lg"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-white/20 hover:bg-white/30 text-primary-foreground border border-white/30 shadow-xl font-semibold backdrop-blur-md transition-all duration-200 hover:scale-105 active:scale-95 h-12 px-6 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards - Modern Enhanced Design */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Market Outlook Card */}
        <Card className={`group relative overflow-hidden border ${outlookBorderColor} shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-card to-card/95 backdrop-blur-sm`}>
          <div className={`absolute top-0 right-0 w-40 h-40 ${outlookBgColor} rounded-full blur-3xl -mr-20 -mt-20 opacity-30 group-hover:opacity-40 transition-opacity`}></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Market Outlook
            </CardTitle>
            <div className={`p-3 rounded-xl ${outlookBgColor} border ${outlookBorderColor} group-hover:scale-110 transition-transform duration-300`}>
              <OutlookIcon className={`h-5 w-5 ${outlookColor}`} />
            </div>
          </CardHeader>
          <CardContent className="relative z-10 space-y-3">
            <div className="space-y-1">
              <div className="text-3xl font-bold capitalize">{safeInsights.marketOutlook}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Clock className="h-3 w-3" />
                Next update {nextUpdateDistance}
              </p>
            </div>
            <div className="space-y-1.5">
              <Progress value={outlookProgress} className="h-2.5 bg-muted/50" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Market Health</span>
                <span className="font-medium">{outlookProgress}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Industry Growth Card */}
        <Card className="group relative overflow-hidden border border-emerald-500/20 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-card to-card/95 backdrop-blur-sm">
          <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 opacity-30 group-hover:opacity-40 transition-opacity"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Industry Growth
            </CardTitle>
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
              <TrendingUpIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10 space-y-3">
            <div className="space-y-1">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <TrendingUpIcon className="h-6 w-6" />
                +{safeInsights.growthRate.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">Year over year growth</p>
            </div>
            <div className="space-y-1.5">
              <Progress value={Math.min(safeInsights.growthRate, 100)} className="h-2.5 bg-muted/50" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Growth Rate</span>
                <span className="font-medium">{safeInsights.growthRate.toFixed(1)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demand Level Card */}
        <Card className="group relative overflow-hidden border border-primary/20 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-card to-card/95 backdrop-blur-sm">
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20 opacity-30 group-hover:opacity-40 transition-opacity"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Demand Level
            </CardTitle>
            <div className="p-3 rounded-xl bg-primary/15 border border-primary/20 group-hover:scale-110 transition-transform duration-300">
              <BriefcaseIcon className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10 space-y-3">
            <div className="space-y-1">
              <div className="text-3xl font-bold capitalize">{safeInsights.demandLevel}</div>
              <p className="text-xs text-muted-foreground">Current market demand</p>
            </div>
            <div className="space-y-1.5">
              <div className="relative h-2.5 rounded-full bg-muted/50 overflow-hidden">
                <div
                  className={`absolute left-0 top-0 h-full rounded-full bg-gradient-to-r ${getDemandLevelColor(safeInsights.demandLevel)} transition-all duration-700 shadow-sm`}
                  style={{ width: `${getDemandProgress(safeInsights.demandLevel)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Demand Index</span>
                <span className="font-medium">{getDemandProgress(safeInsights.demandLevel)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Skills Card */}
        <Card className="group relative overflow-hidden border border-primary/20 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-card to-card/95 backdrop-blur-sm">
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20 opacity-30 group-hover:opacity-40 transition-opacity"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Top Skills
            </CardTitle>
            <div className="p-3 rounded-xl bg-primary/15 border border-primary/20 group-hover:scale-110 transition-transform duration-300">
              <Brain className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10 space-y-3">
            <div className="space-y-1">
              <div className="text-3xl font-bold">{safeInsights.topSkills.length}</div>
              <p className="text-xs text-muted-foreground">In-demand skills</p>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {safeInsights.topSkills.length > 0 ? (
                <>
                  {safeInsights.topSkills.slice(0, 3).map((skill, index) => (
                    <Badge
                      key={skill || index}
                      variant="secondary"
                      className="text-xs px-2.5 py-1 font-medium hover:bg-primary hover:text-primary-foreground transition-colors cursor-default"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {skill}
                    </Badge>
                  ))}
                  {safeInsights.topSkills.length > 3 && (
                    <Badge variant="outline" className="text-xs px-2.5 py-1">
                      +{safeInsights.topSkills.length - 3} more
                    </Badge>
                  )}
                </>
              ) : (
                <p className="text-xs text-muted-foreground">No skills data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Salary Chart - Modern Enhanced Design */}
      <Card className="shadow-lg border border-border/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5 bg-gradient-to-br from-card to-card/95 backdrop-blur-sm">
        <CardHeader className="pb-5 border-b border-border/50 bg-gradient-to-r from-primary/5 via-primary/3 to-transparent">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <CardTitle className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                Salary Ranges by Role
              </CardTitle>
              <CardDescription className="text-sm md:text-base text-muted-foreground">
                Compensation insights across different positions (in thousands)
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-sm px-4 py-2.5 border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors w-fit">
              <Award className="h-4 w-4 mr-2 text-primary" />
              Market Data
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-8 pb-6">
          {salaryData.length > 0 ? (
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
                className="h-[400px] md:h-[450px] w-full min-w-0"
              >
                <BarChart data={salaryData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-20 stroke-muted" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12, fill: 'currentColor', fontWeight: 500 }}
                    tickLine={false}
                    axisLine={{ stroke: 'currentColor', strokeWidth: 1, opacity: 0.3 }}
                    className="text-muted-foreground"
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: 'currentColor', fontWeight: 500 }}
                    tickLine={false}
                    axisLine={{ stroke: 'currentColor', strokeWidth: 1, opacity: 0.3 }}
                    label={{ value: 'Salary (K)', angle: -90, position: 'insideLeft', fill: 'currentColor', fontSize: 12, fontWeight: 600 }}
                    className="text-muted-foreground"
                  />
                  <ChartTooltip
                    cursor={{ fill: 'rgba(139, 92, 246, 0.08)' }}
                    content={<ChartTooltipContent className="rounded-lg border shadow-lg" />}
                  />
                  <ChartLegend content={<ChartLegendContent className="mt-4" />} />
                  <Bar
                    dataKey="min"
                    fill="var(--color-min)"
                    name="Minimum Salary"
                    radius={[10, 10, 0, 0]}
                    maxBarSize={70}
                    className="hover:opacity-80 transition-opacity"
                  />
                  <Bar
                    dataKey="median"
                    fill="var(--color-median)"
                    name="Median Salary"
                    radius={[10, 10, 0, 0]}
                    maxBarSize={70}
                    className="hover:opacity-80 transition-opacity"
                  />
                  <Bar
                    dataKey="max"
                    fill="var(--color-max)"
                    name="Maximum Salary"
                    radius={[10, 10, 0, 0]}
                    maxBarSize={70}
                    className="hover:opacity-80 transition-opacity"
                  />
                </BarChart>
              </ChartContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[400px] text-muted-foreground">
              <p>No salary data available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bottom Section - Trends, Skills, and Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Key Trends */}
        <Card className="group border border-border/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 shadow-md bg-gradient-to-br from-card to-card/95 backdrop-blur-sm">
          <CardHeader className="border-b border-border/50 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg md:text-xl font-bold">Key Industry Trends</CardTitle>
                <CardDescription className="text-sm mt-1">
                  What's shaping the market
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {safeInsights.keyTrends.length > 0 ? (
              <ul className="space-y-4">
                {safeInsights.keyTrends.map((trend, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 group/item hover:bg-muted/50 rounded-lg p-2 -m-2 transition-colors duration-200"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="mt-1.5 shrink-0">
                      <div className="h-2 w-2 rounded-full bg-primary group-hover/item:scale-150 group-hover/item:bg-primary/80 transition-all duration-200" />
                    </div>
                    <span className="text-sm text-muted-foreground group-hover/item:text-foreground transition-colors leading-relaxed">
                      {trend}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No trends data available</p>
            )}
          </CardContent>
        </Card>

        {/* Recommended Skills */}
        <Card className="group border border-border/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 shadow-md bg-gradient-to-br from-card to-card/95 backdrop-blur-sm">
          <CardHeader className="border-b border-border/50 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 group-hover:scale-110 transition-transform duration-300">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg md:text-xl font-bold">Recommended Skills</CardTitle>
                <CardDescription className="text-sm mt-1">
                  Boost your expertise
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-2.5">
              {insights.recommendedSkills.map((skill, index) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="px-3 py-1.5 text-sm font-medium hover:bg-primary hover:text-primary-foreground hover:scale-105 transition-all duration-200 cursor-pointer border border-transparent hover:border-primary/20"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {skill}
                </Badge>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                Focus on these skills to stay competitive
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="group border border-border/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 shadow-md bg-gradient-to-br from-card to-card/95 backdrop-blur-sm">
          <CardHeader className="border-b border-border/50 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg md:text-xl font-bold">Quick Actions</CardTitle>
                <CardDescription className="text-sm mt-1">
                  Take your next step
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <Link href="/resume" className="block group/link">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 h-14 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 group-hover/link:shadow-md"
                >
                  <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 group-hover/link:bg-white/20 group-hover/link:border-white/30 transition-all">
                    <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400 group-hover/link:text-current transition-colors" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold">Improve Resume</div>
                    <div className="text-xs opacity-70 group-hover/link:opacity-100">ATS-optimized builder</div>
                  </div>
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                </Button>
              </Link>
              <Link href="/ai-cover-letter" className="block group/link">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 h-14 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 group-hover/link:shadow-md"
                >
                  <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 group-hover/link:bg-white/20 group-hover/link:border-white/30 transition-all">
                    <FileSignature className="h-4 w-4 text-purple-600 dark:text-purple-400 group-hover/link:text-current transition-colors" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold">Write Cover Letter</div>
                    <div className="text-xs opacity-70 group-hover/link:opacity-100">AI-powered generator</div>
                  </div>
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                </Button>
              </Link>
              <Link href="/interview" className="block group/link">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 h-14 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 group-hover/link:shadow-md"
                >
                  <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20 group-hover/link:bg-white/20 group-hover/link:border-white/30 transition-all">
                    <MessagesSquare className="h-4 w-4 text-green-600 dark:text-green-400 group-hover/link:text-current transition-colors" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold">Practice Interview</div>
                    <div className="text-xs opacity-70 group-hover/link:opacity-100">Mock interviews & feedback</div>
                  </div>
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>z
    </div>
  );
};

export default DashboardView;