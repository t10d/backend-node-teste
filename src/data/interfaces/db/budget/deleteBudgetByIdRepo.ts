export interface DeleteBudgetByIdRepo {
  deleteById (id: string): Promise<string> 
}