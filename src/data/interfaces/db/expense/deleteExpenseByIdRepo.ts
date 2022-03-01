export interface DeleteExpenseByIdRepo {
  deleteById (id: string): Promise<string> 
}