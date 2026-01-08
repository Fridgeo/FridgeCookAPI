/**
 * TranslatableString Interface
 * Handles multilanguage content with support for French (fr) and English (en)
 */
export interface TranslatableString {
    fr: string;
    en: string;
}

/**
 * Step Interface
 * Represents a single step in a recipe instruction
 */
export interface Step {
    stepNumber: number;
    instruction: TranslatableString;
    imageUrl?: string;
}
