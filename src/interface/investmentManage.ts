export interface HomeTop {
  amount: number
  percent: string
  plan: string
  projectName: string
  remain: number
}

export interface HomeCompairPercent {
  amount: number
  plan: number
  projectTypeId: number
  projectTypeName: string
}

interface CompairInvestList {
  amount: number
  budgetDate: string
  month: string
  year: string
}

export interface HomeCompairInvest {
  thisYear: CompairInvestList[]
  lastYear: CompairInvestList[]
}

export interface HomeMothItem {
  amount: number,
  id: number,
  plan: number,
  projectName: string
}

interface IPlanStr {
  [key: string]: number
}
export interface HomeYearItem {
  budget: Array<{amount: number, budgetDate: string, month: string, year: string}>
  plan: IPlanStr
}
