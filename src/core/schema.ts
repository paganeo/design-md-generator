import { DesignSystemExtraction } from './types';

export const SCHEMA_VERSION = '1.0.0';

/**
 * Validates that an object conforms to the DesignSystemExtraction schema version 1.0.0.
 */
export function validateDesignSystemJson(data: unknown): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: ['Root data must be an object'] };
  }

  const root = data as Record<string, unknown>;

  if (root.schemaVersion !== SCHEMA_VERSION) {
    errors.push(`Invalid schemaVersion: expected "${SCHEMA_VERSION}", received "${root.schemaVersion}"`);
  }

  if (!root.metadata || typeof root.metadata !== 'object') {
    errors.push('Missing or invalid metadata section');
  }

  if (!root.colors || typeof root.colors !== 'object') {
    errors.push('Missing or invalid colors section');
  }

  if (!root.typography || typeof root.typography !== 'object') {
    errors.push('Missing or invalid typography section');
  }

  if (!root.spacing || typeof root.spacing !== 'object') {
    errors.push('Missing or invalid spacing section');
  }

  if (!root.shapes || typeof root.shapes !== 'object') {
    errors.push('Missing or invalid shapes section');
  }

  if (!Array.isArray(root.components)) {
    errors.push('Components must be an array');
  }

  if (!root.motion || typeof root.motion !== 'object') {
    errors.push('Missing or invalid motion section');
  }

  if (!root.responsive || typeof root.responsive !== 'object') {
    errors.push('Missing or invalid responsive section');
  }

  if (!root.accessibility || typeof root.accessibility !== 'object') {
    errors.push('Missing or invalid accessibility section');
  }

  if (!Array.isArray(root.limitations)) {
    errors.push('Limitations must be an array');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Serializes the extraction to clean, deterministic, indentation-2 formatted JSON.
 */
export function serializeDesignSystemJson(data: DesignSystemExtraction): string {
  return JSON.stringify(data, null, 2);
}
