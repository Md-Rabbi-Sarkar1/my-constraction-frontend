import { createProjectTask, CreateTaskPayload, deleteTaskRecord, getAllTasks, getProjectTasks, getTaskById, GlobalTaskFiltersPayload, updateTaskStatus, UpdateTaskStatusPayload } from "@/api/task.api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";



export function useGetProjectTasks(projectId: string) {
  return useQuery({
    queryKey: ["project-tasks", projectId],
    // ✅ FIXED: Invokes function passing ONLY the projectId context parameter
    queryFn: () => getProjectTasks(projectId),
    select: (response: any) => {
      return response?.data?.result || response?.result || [];
    },
    enabled: !!projectId,
  });
}


export function useCreateProjectTask(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTaskPayload) => createProjectTask(projectId, payload),
    onSuccess: () => {
      // 💡 Auto-syncs both the standalone tasks list view and your master dashboard page cache counters
      queryClient.invalidateQueries({ queryKey: ["project-tasks", projectId] });
      queryClient.invalidateQueries({ queryKey: ["project-dashboard", projectId] });
    },
  });
}


export function useGetTaskById(taskId: string) {
  return useQuery({
    queryKey: ["project-task-detail", taskId],
    queryFn: () => getTaskById(taskId),
    // 💡 Unpacks response.data.result exactly where your single task data layout lives
    select: (response: any) => {
      return response?.data?.result || response?.result || response;
    },
    enabled: !!taskId, // Safety rule: Only fire if taskId route context exists
  });
}




export function useGetGlobalTasks(filters: GlobalTaskFiltersPayload) {
  return useQuery({
    queryKey: ["global-tasks-directory", filters],
    queryFn: () => getAllTasks(filters),
    select: (response: any) => {
      // 💡 Unpack layer looking into your generic container or direct arrays
      const unpacked = response?.data?.result || response?.result || response;

      // 💡 FIXED TUPLE UNWRAPPER: If the response maps to an array where index 0 is your tasks collection list
      if (Array.isArray(unpacked) && Array.isArray(unpacked[0])) {
        return {
          tasks: unpacked[0], // Contains your tasks array: [{...}, {...}, {...}]
          totalCount: typeof unpacked[1] === "number" ? unpacked[1] : unpacked[0].length,
          totalPages: typeof unpacked[1] === "number" ? Math.ceil(unpacked[1] / filters.pageSize) : 1
        };
      }

      // Standard fallback cases if the format is a standard flat array model
      if (Array.isArray(unpacked)) {
        return { tasks: unpacked, totalCount: unpacked.length, totalPages: 1 };
      }

      if (unpacked && Array.isArray(unpacked.tasks)) {
        return {
          tasks: unpacked.tasks,
          totalCount: unpacked.totalCount || unpacked.tasks.length,
          totalPages: unpacked.totalPages || 1
        };
      }

      return { tasks: [], totalCount: 0, totalPages: 1 };
    },
  });
}



export function useUpdateTaskStatus(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateTaskStatusPayload) => updateTaskStatus(taskId, payload),
    onSuccess: (_, payload) => {
      // 1. FIXED: Instantly update the single task detail cache matching the exact response layout
      queryClient.setQueryData(["project-task-detail", taskId], (old: any) => {
        if (!old) return old;

        // Traverse down the exact structure used in your useGetTaskById select wrapper
        if (old.data?.result) {
          return {
            ...old,
            data: {
              ...old.data,
              result: { ...old.data.result, status: payload.status }
            }
          };
        } else if (old.result) {
          return {
            ...old,
            result: { ...old.result, status: payload.status }
          };
        }

        // Fallback fallback if the cache data layer is already flat
        return {
          ...old,
          status: payload.status,
        };
      });

      // 2. FIXED: Invalidate the correct matching key and trigger silent background syncs for lists
      queryClient.invalidateQueries({ queryKey: ["project-task-detail", taskId] });
      queryClient.invalidateQueries({ queryKey: ["project-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["company-tasks-inventory"] });
    },
  });
}


export function useDeleteTaskRecord(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteTaskRecord(taskId),
    onSuccess: () => {
      // Clear data keys from layout memory state securely
      queryClient.invalidateQueries({ queryKey: ["project-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["company-tasks-inventory"] });
    },
  });
}