import { BudgetModel } from "../../../../domain/models";

export interface GetBudgetByIdRepo {
  getById (id: string): Promise<BudgetModel> 
}