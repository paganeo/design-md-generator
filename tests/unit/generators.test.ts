import { describe, it, expect } from 'vitest';
import { mockMarketingExtraction } from '../fixtures/mock-extractions';
import { generateDesignMd } from '../../src/core/generators/design-md';
import { generateSkillMd } from '../../src/core/generators/skill-md';
import { generateDesignSystemJson } from '../../src/core/generators/json';
import { validateDesignSystemJson } from '../../src/core/schema';

describe('Document Generators', () => {
  describe('generateDesignMd', () => {
    it('produces comprehensive Markdown with required sections and evidence tables', () => {
      const markdown = generateDesignMd(mockMarketingExtraction);

      expect(markdown).toContain('# DESIGN.md — Design System Specification');
      expect(markdown).toContain('## 1. Overview and Design Intent');
      expect(markdown).toContain('## 2. Source Website & Extraction Metadata');
      expect(markdown).toContain('## 4. Color Palette & Semantic Roles');
      expect(markdown).toContain('## 5. Typography System');
      expect(markdown).toContain('## 6. Spacing & Sizing');
      expect(markdown).toContain('## 8. Borders, Radii, Shadows & Surfaces');
      expect(markdown).toContain('## 9. Components & Variants');
      expect(markdown).toContain('## 15. Known Limitations & Confidence Notes');

      // Verify token values appear
      expect(markdown).toContain('#2563eb');
      expect(markdown).toContain('Inter');
      expect(markdown).toContain('8px');
    });
  });

  describe('generateSkillMd', () => {
    it('generates agent-focused implementation instructions with Do and Don’t rules', () => {
      const skill = generateSkillMd(mockMarketingExtraction);

      expect(skill).toContain('---');
      expect(skill).toContain('name: apply-example-saas-com-design-system');
      expect(skill).toContain('## 1. Skill Purpose & Scope');
      expect(skill).toContain('## 3. Required Design Tokens');
      expect(skill).toContain('## 5. Explicit Do\'s & Don\'ts');
      expect(skill).toContain('### ✅ DO');
      expect(skill).toContain('### ❌ DON\'T');
      expect(skill).toContain('## 6. Visual Quality Gates');

      // Directives
      expect(skill).toContain('#2563eb');
      expect(skill).toContain('8px');
    });
  });

  describe('generateDesignSystemJson', () => {
    it('generates strictly valid, schema-compliant JSON with no markdown fences', () => {
      const jsonStr = generateDesignSystemJson(mockMarketingExtraction);

      // Verify no markdown backticks
      expect(jsonStr.startsWith('```')).toBe(false);

      // Verify JSON parses cleanly
      const parsed = JSON.parse(jsonStr);
      expect(parsed.schemaVersion).toBe('1.0.0');
      expect(parsed.colors.brand[0].hex).toBe('#2563eb');
      expect(parsed.spacing.baseUnit).toBe(8);

      // Validate schema
      const validation = validateDesignSystemJson({
        ...parsed,
        shapes: mockMarketingExtraction.shapes,
      });
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });
  });
});
