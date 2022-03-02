export interface DeleteExpenseByIdRepo {
  deleteById (id: string, budgetId: string): Promise<string> 
}