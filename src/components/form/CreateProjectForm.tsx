"use client"
import React from "react";
import { useForm } from "@tanstack/react-form";


import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CreateProjectInput, createProjectSchema } from "@/validation/project.validation";
import { useCreateProject } from "@/hooks";
import { useManagers } from "@/hooks/user.hook";
import { toast } from "../ui/toast";

export function CreateProjectForm({ onSuccess }: { onSuccess?: () => void }) {
  const { mutate: createProject, isPending: isSubmitting } = useCreateProject();
  const { data: managers, isLoading: isLoadingManagers } = useManagers();

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      location: "",
      clientInfo: "",
      startDate: "",
      expectedEndDate: "",
      budget: "",
      managerId: "",
    } as any,
    validators: {
      onSubmit: createProjectSchema,
    },
    onSubmit: async ({ value }) => {
      createProject(value, {
        onSuccess: () => {
          toast.add({title:"Project created successfully!"});
          form.reset();
          if (onSuccess) onSuccess();
        },
      });
    },
  });

  return (
    <form
      id="create-project-form"
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
            {field.state.meta.errors && (
              <p className="text-red-500 text-xs mt-1">{field.state.meta.errors.join(", ")}</p>
            )}
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
            {field.state.meta.errors && (
              <p className="text-red-500 text-xs mt-1">{field.state.meta.errors.join(", ")}</p>
            )}
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
            {field.state.meta.errors && (
              <p className="text-red-500 text-xs mt-1">{field.state.meta.errors.join(", ")}</p>
            )}
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
            {field.state.meta.errors && (
              <p className="text-red-500 text-xs mt-1">{field.state.meta.errors.join(", ")}</p>
            )}
          </div>
        )}
      </form.Field>

      {/* Start Date */}
      <form.Field name="startDate">
        {(field) => (
          <div>
            <label className="text-sm font-medium text-slate-700">Start Date</label>
            <Input
              type="date"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            {field.state.meta.errors && (
              <p className="text-red-500 text-xs mt-1">{field.state.meta.errors.join(", ")}</p>
            )}
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
            {field.state.meta.errors && (
              <p className="text-red-500 text-xs mt-1">{field.state.meta.errors.join(", ")}</p>
            )}
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
            {field.state.meta.errors && (
              <p className="text-red-500 text-xs mt-1">{field.state.meta.errors.join(", ")}</p>
            )}
          </div>
        )}
      </form.Field>

      
      <form.Field name="managerId">
        {(field) => {
          const selectedManager = managers?.find((m) => m.id === field.state.value);
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
                  {managers?.map((manager) => (
                    <SelectItem key={manager.id} value={manager.id}>
                      {manager.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {field.state.meta.errors && (
                <p className="text-red-500 text-xs mt-1">{field.state.meta.errors.join(", ")}</p>
              )}
            </div>
          );
        }}
      </form.Field>
    </form>
  );
}
