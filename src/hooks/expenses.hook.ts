import { createCompanyExpense, CreateExpensePayload, getAllCompanyExpenses, getExpenseById } from "@/api/expenses.api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";


export function useGetExpenses() {
  return useQuery({
    queryKey: ["company-expenses-inventory"],
    queryFn: getAllCompanyExpenses,
    select: (response: any) => response?.data?.result || response?.result || response || [],
  });
}

export function useGetExpenseDetails(expenseId: string) {
  return useQuery({
    queryKey: ["expense-details", expenseId],
    queryFn: () => getExpenseById(expenseId),
    select: (response: any) => {
      const unpacked = response?.data?.result || response?.result || response;
      if (Array.isArray(unpacked)) {
        return unpacked.find((e: any) => e.id === expenseId);
      }
      return unpacked;
    },
    enabled: !!expenseId,
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateExpensePayload) => createCompanyExpense(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-expenses-inventory"] });
    },
  });
}
