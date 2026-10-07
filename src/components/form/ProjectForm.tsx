"use client";

import React from "react";
import { useForm } from "@tanstack/react-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useCreateProject, useUpdateProject } from "@/hooks"; // 👈 Added useUpdateProject here
import { useManagers } from "@/hooks/user.hook";
import { toast } from "../ui/toast";

// Define strict prop shapes to allow both create and update states
interface ProjectFormProps {
  projectData?: {
    id: string;
    name: string;
    description: string;
    location: string;
    clientInfo?: string;
    startDate?: string;
    expectedEndDate?: string;
    budget?: string | number;
    managerId?: string;
  } | null;
  onSuccess?: () => void;
}

export function ProjectForm({ projectData, onSuccess }: ProjectFormProps) {
  const isEditMode = !!projectData; // true if we are updating, false if creating
  
  const { mutate: createProject } = useCreateProject();
  const { mutate: updateProject } = useUpdateProject(); // 👈 Mutation handler hook
  const { data: managers, isLoading: isLoadingManagers } = useManagers();

  // Clean date helper to format raw database ISO strings down to HTML date format (YYYY-MM-DD)
  const formatDateForInput = (dateStr?: string) => {
    if (!dateStr) return "";
    return dateStr.split("T")[0];
  };

  const form = useForm({
    // Pre-populate with item properties if in update/edit mode, else fall back to empty fields
    defaultValues: {
      name: projectData?.name || "",
      description: projectData?.description || "",
      location: projectData?.location || "",
      clientInfo: projectData?.clientInfo || "",
      startDate: formatDateForInput(projectData?.startDate),
      expectedEndDate: formatDateForInput(projectData?.expectedEndDate),
      budget: projectData?.budget ? String(projectData.budget) : "",
      managerId: projectData?.managerId || "",
    } as any,
    onSubmit: async ({ value }) => {
      if (isEditMode && projectData) {
        // Trigger update path sequence
        updateProject(
          { id: projectData.id, payload: value },
          {
            onSuccess: () => {
              toast.add({ title: "Project updated successfully!" });
              if (onSuccess) onSuccess();
            },
          }
        );
      } else {
        // Trigger traditional create path sequence
        createProject(value, {
          onSuccess: () => {
            toast.add({ title: "Project created successfully!" });
            form.reset();
            if (onSuccess) onSuccess();
          },
        });
      }
    },
  });

  return (
    <form
      id="project-form" // 👈 Changed target form id to match the shared wrapper button control
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-4 w-full max-h-[65vh] overflow-y-auto px-1 grid grid-cols-1 gap-y-4 gap-x-3 sm:grid-cols-2"
    >
      <form.Field name="name">
        {(field) => (
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-slate-700">Project Name</label>
            <Input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Enter project name"
            />
          </div>
        )}
      </form.Field>

      <form.Field name="description">
        {(field) => (
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-slate-700">Description</label>
            <Input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Short details about the project"
            />
          </div>
        )}
      </form.Field>

      <form.Field name="location">
        {(field) => (
          <div>
            <label className="text-sm font-medium text-slate-700">Location</label>
            <Input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Project site/location"
            />
          </div>
        )}
      </form.Field>

      <form.Field name="clientInfo">
        {(field) => (
          <div>
            <label className="text-sm font-medium text-slate-700">Client Info</label>
            <Input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Client name or company"
            />
          </div>
        )}
      </form.Field>

      <form.Field name="startDate">
        {(field) => (
          <div>
            <label className="text-sm font-medium text-slate-700">Start Date</label>
            <Input
              type="date"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </div>
        )}
      </form.Field>

      <form.Field name="expectedEndDate">
        {(field) => (
          <div>
            <label className="text-sm font-medium text-slate-700">Expected End Date</label>
            <Input
              type="date"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </div>
        )}
      </form.Field>

      <form.Field name="budget">
        {(field) => (
          <div>
            <label className="text-sm font-medium text-slate-700">Budget</label>
            <Input
              type="number"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="e.g. 50000"
            />
          </div>
        )}
      </form.Field>

      <form.Field name="managerId">
        {(field) => {
          const selectedManager = managers?.find((m: any) => m.id === field.state.value);
          return (
            <div>
              <label className="text-sm font-medium text-slate-700">Project Manager</label>
              <Select
                disabled={isLoadingManagers}
                value={field.state.value}
                onValueChange={(value) => field.handleChange(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue>
                    {selectedManager ? selectedManager.name : (isLoadingManagers ? "Loading..." : "Select manager")}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {managers?.map((manager: any) => (
                    <SelectItem key={manager.id} value={manager.id}>
                      {manager.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        }}
      </form.Field>
    </form>
  );
}
