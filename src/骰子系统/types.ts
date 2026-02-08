/**
 * Standardized dice roll result.
 */
export interface RollResult {
  total: number;
  rawDice: number[];
  keptDice: number[];
  formula: string;
  breakdown: string;
  tags: string[];
}

/**
 * Custom field type.
 */
export type FieldType = 'number' | 'text' | 'select' | 'toggle';

/**
 * Custom UI field configuration.
 */
export interface CustomFieldConfig {
  id: string;
  type: FieldType;
  label?: string;
  placeholder?: string;
  defaultValue: number | string | boolean;
  hidden?: boolean;
  options?: Array<{ label: string; value: number | string }>;
  contestOverride?: Partial<CustomFieldConfig>;
}

/**
 * Derived variable specification.
 */
export interface DerivedVarSpec {
  id: string;
  expr: string;
}

/**
 * Dice expression patch rule.
 */
export interface DiceExprPatch {
  when?: string;
  op: 'append' | 'prepend' | 'replace';
  template: string;
}

/**
 * Outcome adjudication policy: minimum rank.
 */
export interface OutcomePolicyMinRank {
  kind: 'minRank';
  requiredRankVarId: string;
  unmetOutcomeId: string;
  keepActualOutcome?: boolean;
}

/**
 * Outcome adjudication policy: conditional override.
 */
export interface OutcomePolicyConditional {
  kind: 'conditional';
  rules: Array<{
    when: string;
    overrideOutcomeId: string;
  }>;
}

/**
 * Outcome adjudication policy.
 */
export type OutcomePolicy = OutcomePolicyMinRank | OutcomePolicyConditional;
