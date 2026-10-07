"use client";

import React, { useState } from "react";
import Link from "next/link"; 
import { ProjectForm } from "@/components/form/ProjectForm"; // 👈 Points to the shared form
import { Modal } from "@/components/ui/modal"; 
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, RefreshCw } from "lucide-react"; 
import { useGetProjects, useDeleteProject } from "@/hooks"; 

interface ProjectItem {
  id: string;
  name: string;
  description: string;
  location: string;
  clientInfo?: string;
  budget?: string;
  startDate?: string;
  expectedEndDate?: string;
  managerId?: string;
}

export default function ProjectsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Track selected project: If null -> we are creating. If populated -> we are updating!
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);
  
  const { data, isLoading, isError, refetch } = useGetProjects();
  const deleteProjectMutation = useDeleteProject();

  const projects: ProjectItem[] = Array.isArray(data?.data?.result) 
    ? data.data.result 
    : data?.result || [];

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you absolutely sure you want to delete this project?")) {
      try {
        await deleteProjectMutation.mutateAsync(id);
        void refetch();
      } catch (err) {
        console.error("Deletion failure capture:", err);
      }
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Projects</h1>
          <p className="text-sm text-muted-foreground">Manage corporate projects, tracking timelines and budgets.</p>
        </div>
        
        {/* Trigger creation by passing null to the active state */}
        <Button onClick={() => { setActiveProject(null); setIsModalOpen(true); }}>
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
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      <div className="font-semibold text-slate-950">{project.name}</div>
                      <div className="text-xs text-muted-foreground font-normal max-w-xs truncate mt-0.5">
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
                    
                    {/* Render functional Update and Delete controls */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link href={`/user-dashboard/projects/${project.id}`} passHref>
                          <Button variant="outline" size="sm" className="h-8 text-xs">
                            Details
                          </Button>
                        </Link>
                        
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                          onClick={() => {
                            setActiveProject(project); // 👈 Loads project data into local state
                            setIsModalOpen(true);      // 👈 Opens the unified modal
                          }}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>

                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:bg-destructive/5"
                          disabled={deleteProjectMutation.isPending}
                          onClick={() => handleDelete(project.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    
      {/* SHARED MODAL CONTAINER */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={activeProject ? "Update Project Parameters" : "Create New Project"}
        description={activeProject ? "Alter real-time target details below." : "Fill out details to initialize new project."}
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            {/* Direct forms action button reference configuration */}
            <Button type="submit" form="project-form">
              {activeProject ? "Save Changes" : "Create Project"}
            </Button>
          </>
        }
      >
        <ProjectForm 
          projectData={activeProject} // 👈 Passes down the item value mapping array properties
          onSuccess={() => {
            setIsModalOpen(false);
            void refetch();
          }} 
        />
      </Modal>

    </div>
  );
}
