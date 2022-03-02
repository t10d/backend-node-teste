export interface InviteModel {
  id: string
  description?: string,
  userId?: string,
  to: string,
  date: Date,
  budgetId: string
}
