export interface Deal {
  id: string;
  dealName: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  currencyType: CurrencyType;
  taxPercentage: number;
  taxAmount: number;
  discountAmount: number;
  status: DealStatus;
  dealDate: string;
  closedDate?: string;
  paymentDueDate?: string;
  closedByUserId?: string;
  teamId?: string;
  referralName?: string;
  referralEmail?: string;
  referralPhone?: string;
  referralCommission?: number;
  isReferralCommissionPaid?: boolean;
  source: string;
  incentiveRuleId?: string;
  incentivePlanId?: string;
  notes?: string;
  recurringFrequencyMonths?: number;
  userId?: string;
  createdAt: string;
  createdBy?: string;
  lastModifiedAt?: string;
  lastModifiedBy?: string;
  payments?: DealPayment[];
  activities?: DealActivity[];
}

export interface DealPayment {
  id: string;
  dealId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  transactionReference?: string;
  notes?: string;
  receivedByUserId?: string;
  isVerified: boolean;
  createdAt: string;
  createdBy?: string;
  lastModifiedAt?: string;
  lastModifiedBy?: string;
}

export interface DealActivity {
  id: string;
  dealId: string;
  type: number;
  description: string;
  notes?: string;
  userId?: string;
  activityDate: string;
  createdAt: string;
  createdBy?: string;
}

export enum DealStatus {
  New = 0,
  OnHold = 1,
  Cancelled = 2,
  Won = 3,
  Lost = 4,
  PartiallyPaid = 5,
  FullyPaid = 6
}

export enum CurrencyType {
  Rupees = 0,
  Dollar = 1
}

export interface DealFilters {
  status?: DealStatus;
  search?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  teamId?: string;
  userId?: string;
}

export interface CreateDealRequest {
  dealName: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
  totalAmount: number;
  currencyType: CurrencyType;
  taxPercentage: number;
  discountAmount: number;
  status: DealStatus;
  dealDate: string;
  paymentDueDate?: string;
  teamId?: string;
  referralName?: string;
  referralEmail?: string;
  referralPhone?: string;
  referralCommission?: number;
  source: string;
  incentiveRuleId?: string;
  incentivePlanId?: string;
  notes?: string;
  recurringFrequencyMonths?: number;
  closedByUserId?: string;
}

export interface UpdateDealRequest {
  id: string;
  dealName: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
  paidAmount?: number;
  remainingAmount?: number;
  totalAmount: number;
  currencyType: CurrencyType;
  taxPercentage: number;
  discountAmount: number;
  status: DealStatus;
  closedDate?: string;
  paymentDueDate?: string;
  teamId?: string;
  referralName?: string;
  referralEmail?: string;
  referralPhone?: string;
  referralCommission?: number;
  isReferralCommissionPaid: boolean;
  source: string;
  incentiveRuleId?: string;
  incentivePlanId?: string;
  notes?: string;
  recurringFrequencyMonths?: number;
  closedByUserId?: string;
}

export interface DealResponse {
  succeeded: boolean;
  message: string;
  errors?: string[];
  data: Deal;
}

export interface DealListResponse {
  succeeded: boolean;
  message: string;
  errors?: string[];
  data: Deal[];
}
