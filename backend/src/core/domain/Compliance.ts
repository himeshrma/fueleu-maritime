export interface ComplianceBalance {
  shipId: string;
  year: number;
  cbGco2eq: number;
  targetIntensity: number;
  actualIntensity: number;
  energyInScope: number;
}

export interface AdjustedComplianceBalance extends ComplianceBalance {
  bankedAmount: number;
  adjustedCb: number;
}
