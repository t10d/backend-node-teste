export interface DeleteBudget {
  deleteById (id: string): Promise<string>
}
