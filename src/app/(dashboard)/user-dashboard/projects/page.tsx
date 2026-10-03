"use client";

import React, { useState } from "react";
import { CreateProjectForm } from "@/components/form/CreateProjectForm";
import { Modal } from "@/components/ui/modal"; 
import { Button } from "@/components/ui/button";
import { useGetProjects } from "@/hooks"; // 


interface ProjectItem {
  id: string;
  name: string;
  description: string;
  location: string;
  clientInfo?: string;
  budget?: string;
  startDate?: string;
  expectedEndDate?: string;
}

export default function ProjectsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  
  const { data, isLoading, isError, refetch } = useGetProjects();
  console.log(data)
  
const projects: ProjectItem[] = Array.isArray(data?.data?.result) 
  ? data.data.result 
  : data?.result || [];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      
     
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Projects</h1>
          <p className="text-sm text-muted-foreground">Manage corporate projects, tracking timelines and budgets.</p>
        </div>
        
        
        <Button onClick={() => setIsModalOpen(true)}>
          Create Project
        </Button>
      </div>

      
      {isLoading && (
        <div className="rounded-md border p-12 text-center text-sm text-muted-foreground animate-pulse">
          Loading projects data...
        </div>
      )}

      
      {isError && (
        <div className="rounded-md border border-red-200 p-8 text-center text-sm text-red-600 bg-red-50">
          Failed to load projects. Please try refreshing the page.
        </div>
      )}

     
      {!isLoading && !isError && projects.length === 0 && (
        <div className="rounded-md border border-dashed p-16 text-center text-sm text-muted-foreground">
          No projects found. Click "Create Project" to get started.
        </div>
      )}

      
      {!isLoading && !isError && projects.length > 0 && (
        <div className="rounded-lg border bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Project Name</th>
                  <th className="px-6 py-3 font-medium">Location</th>
                  <th className="px-6 py-3 font-medium">Client Info</th>
                  <th className="px-6 py-3 font-medium">Budget</th>
                  <th className="px-6 py-3 font-medium">Timeline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      <div>{project.name}</div>
                      <div className="text-xs text-muted-foreground font-normal max-w-xs truncate">
                        {project.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{project.location}</td>
                    <td className="px-6 py-4 text-slate-600">{project.clientInfo || "—"}</td>
                    <td className="px-6 py-4 font-mono text-slate-700">
                      {project.budget ? `$${Number(project.budget).toLocaleString()}` : "—"}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {project.startDate ? new Date(project.startDate).toLocaleDateString() : "—"} 
                      {" to "}
                      {project.expectedEndDate ? new Date(project.expectedEndDate).toLocaleDateString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Project"
        description="Fill out the project technical details and assign a manager below."
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            
            <Button type="submit" form="create-project-form">
              Create Project
            </Button>
          </>
        }
      >
        
        <CreateProjectForm 
          onSuccess={() => {
            setIsModalOpen(false);
            void refetch();
          }} 
        />
      </Modal>

    </div>
  );
}
