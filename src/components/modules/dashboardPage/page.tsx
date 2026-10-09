"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, BarChart3, AlertTriangle, Layers, CheckSquare, RefreshCw } from 'lucide-react';

// Import your custom Badge component correctly from your file path
import { Badge as CustomBadge } from "@/components/ui/badge"; 

// Import your exact production React Query hooks
import { useGetProjects } from '@/hooks';
import { useGetGlobalTasks } from '@/hooks/task.hook';
import { useGetGlobalCompanyIssues } from '@/hooks/issues.hook';
import { useGetExpenses } from '@/hooks/expenses.hook';
import { useGetMaterials } from '@/hooks/material.hook'; // <-- Adjust this path to match your folder structure
import Link from 'next/link';

// Strict TypeScript interfaces matching your exact payload structures
interface ProjectItem {
  id: string;
  name: string;
  budget?: string | number;
  description?: string;
}

interface TaskItem {
  id: string;
  title: string;
  status?: string;
  isCompleted?: boolean;
}

interface ExpenseItem {
  id: string;
  category: string;
  amount: string | number;
}

interface MaterialItem {
  id: string;
  name: string;
  currentStock: string | number;
  reorderLevel?: string | number;
}

interface ChartCategoryItem {
  name: string;
  value: number;
}

interface MaterialChartItem {
  name: string;
  Stock: number;
}

export default function AnalyticsDashboard() {
  const [filters] = useState({ page: 1, pageSize: 100 });


  //2



    // 1. Fetch from all 5 endpoints simultaneously
  const projectsQuery = useGetProjects();
  const tasksQuery = useGetGlobalTasks(filters);
  const issuesQuery = useGetGlobalCompanyIssues();
  const expensesQuery = useGetExpenses();
  const materialsQuery = useGetMaterials();

  // 2. Centralized Loading State check
  const isLoading = 
    projectsQuery.isLoading || 
    tasksQuery.isLoading || 
    issuesQuery.isLoading || 
    expensesQuery.isLoading || 
    materialsQuery.isLoading;

  if (isLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-3 bg-background text-sm text-muted-foreground">
        <RefreshCw className="h-6 w-6 animate-spin text-amber-500" />
        <span className="font-medium tracking-wide">Syncing local system payloads...</span>
      </div>
    );
  }

  // 3. Extracting directly matching your console signatures
  const projects: ProjectItem[] = projectsQuery.data?.data?.result || projectsQuery.data?.result || [];
  const tasks: TaskItem[] = tasksQuery.data?.tasks || [];
  const issues: any[] = Array.isArray(issuesQuery.data) ? issuesQuery.data : [];
  const expenses: ExpenseItem[] = Array.isArray(expensesQuery.data) ? expensesQuery.data : [];
  const materials: MaterialItem[] = Array.isArray(materialsQuery.data) ? materialsQuery.data : [];



  ///3//




    // Accumulate total project budgets (using fallback values if budget key is unassigned)
  const totalProjectBudget = projects.reduce((acc: number, p: ProjectItem) => acc + (p.budget ? Number(p.budget) : 50000), 0);

  // Accumulate financial cost totals across your explicit array items string records
  const totalExpenseSpend = expenses.reduce((acc: number, e: ExpenseItem) => acc + (e.amount ? Number(e.amount) : 0), 0);

  // Calculate task tracking percentages
  const totalTasksCount = tasks.length;
  const completedTasksCount = tasks.filter((t: TaskItem) => t.status?.toLowerCase() === 'completed' || t.isCompleted === true).length;
  const taskCompletionRate = totalTasksCount > 0 ? (completedTasksCount / totalTasksCount) * 100 : 0;

  // Process categorizations into groups (e.g., 'LABOR', 'OTHER') matching your console logs
  const uniqueExpenseCategories = Array.from(new Set(expenses.map((e: ExpenseItem) => e.category || 'OTHER')));
  const expenseChartData: ChartCategoryItem[] = uniqueExpenseCategories.map((category: string) => {
    const total = expenses
      .filter((e: ExpenseItem) => (e.category || 'OTHER') === category)
      .reduce((acc: number, e: ExpenseItem) => acc + (e.amount ? Number(e.amount) : 0), 0);
    return { name: String(category), value: total };
  }).filter(item => item.value > 0);

  // Parse stock reserves mapping 'currentStock' directly into the visual array
  const materialChartData: MaterialChartItem[] = materials.slice(0, 8).map((m: MaterialItem) => ({
    name: String(m.name || 'Raw Material'),
    Stock: m.currentStock ? Number(m.currentStock) : 0
  }));

  const COLORS = ['#f59e0b', '#ea580c', '#3b82f6', '#10b981', '#6366f1'];




  //4



  return (
    <>
    <div className="p-6 space-y-6 max-w-7xl mx-auto bg-background text-foreground min-h-screen">
      
      {/* Title Header Section Layout */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Enterprise Infrastructure Analytics</h1>
          <p className="text-muted-foreground text-sm">Real-time data metrics generated directly from active repository queries.</p>
        </div>
        <div>
          <CustomBadge tone="gray">
            Live Synchronized
          </CustomBadge>
        </div>
      </div>

      {/* Numerical Data Aggregates Cards Display Row - Updated to grid-cols-5 */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        
        {/* CARD 1: Projects */}
        <Link href="/user-dashboard/projects" passHref className="block no-underline group">
          <Card className="shadow-sm h-full transition-all duration-200 hover:border-amber-500 hover:shadow-md cursor-pointer bg-card active:scale-[0.99]">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-hover:text-amber-600 transition-colors">Portfolio Scope</CardTitle>
              <Layers className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-black">{projects.length} Active</div>
              <p className="text-xs text-muted-foreground truncate font-medium mt-1 group-hover:underline">View all sheets →</p>
            </CardContent>
          </Card>
        </Link>

        {/* CARD 2: Expenses */}
        <Link href="/user-dashboard/expenses" passHref className="block no-underline group">
          <Card className="shadow-sm h-full transition-all duration-200 hover:border-orange-500 hover:shadow-md cursor-pointer bg-card active:scale-[0.99]">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-hover:text-orange-600 transition-colors">Expenditures</CardTitle>
              <BarChart3 className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-black">${totalExpenseSpend.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground truncate font-medium mt-1 group-hover:underline">Manage ledger →</p>
            </CardContent>
          </Card>
        </Link>

        {/* CARD 3: Tasks */}
        <Link href="/user-dashboard/tasks" passHref className="block no-underline group">
          <Card className="shadow-sm h-full transition-all duration-200 hover:border-emerald-500 hover:shadow-md cursor-pointer bg-card active:scale-[0.99]">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-hover:text-emerald-600 transition-colors">Task Resolution</CardTitle>
              <CheckSquare className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-black">{taskCompletionRate.toFixed(1)}%</div>
              <p className="text-xs text-emerald-600 truncate font-medium mt-1 group-hover:underline">{completedTasksCount} / {totalTasksCount} closed →</p>
            </CardContent>
          </Card>
        </Link>

        {/* CARD 4: Materials Inventory */}
        <Link href="/user-dashboard/materials" passHref className="block no-underline group">
          <Card className="shadow-sm h-full transition-all duration-200 hover:border-blue-500 hover:shadow-md cursor-pointer bg-card active:scale-[0.99]">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-hover:text-blue-600 transition-colors">Materials</CardTitle>
              <Layers className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-black">{materials.length} Items</div>
              <p className="text-xs text-muted-foreground truncate font-medium mt-1 group-hover:underline">Check inventory →</p>
            </CardContent>
          </Card>
        </Link>

        {/* CARD 5: System Issues */}
        <Link href="/user-dashboard/issues" passHref className="block no-underline group">
          <Card className="shadow-sm h-full border-destructive/10 bg-destructive/5 transition-all duration-200 hover:border-destructive hover:shadow-md cursor-pointer active:scale-[0.99]">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-destructive">Active Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-black text-destructive">{issues.length} Logged</div>
              <p className="text-xs text-destructive/80 truncate font-medium mt-1 group-hover:underline">Resolve alerts →</p>
            </CardContent>
          </Card>
        </Link>

      </div>    
    </div>
    </>
  );
}
