import { MotionPattern } from '../core/types';
import { SampledNode } from './dom-sampler';

export function analyzeMotion(nodes: SampledNode[]): MotionPattern {
  const transitionsSet = new Set<string>();
  const animationsSet = new Set<string>();
  const durationsSet = new Set<string>();
  const easingsSet = new Set<string>();

  for (const item of nodes) {
    const { computedStyle } = item;

    // Transition
    const trans = computedStyle.transitionProperty;
    if (trans && trans !== 'none' && trans !== 'all 0s ease 0s') {
      transitionsSet.add(trans);
    }

    const duration = computedStyle.transitionDuration;
    if (duration && duration !== '0s') {
      durationsSet.add(duration);
    }

    const timing = computedStyle.transitionTimingFunction;
    if (timing && timing !== 'ease') {
      easingsSet.add(timing);
    }

    // Animation
    const anim = computedStyle.animationName;
    if (anim && anim !== 'none') {
      animationsSet.add(anim);
    }
  }

  // Check prefers-reduced-motion media query support
  let reducedMotionSupported = false;
  try {
    reducedMotionSupported = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    // Non-fatal
  }

  return {
    transitions: Array.from(transitionsSet).slice(0, 5),
    animations: Array.from(animationsSet).slice(0, 5),
    durations: Array.from(durationsSet).slice(0, 5),
    easings: Array.from(easingsSet).slice(0, 5),
    reducedMotionSupported,
    notes: transitionsSet.size > 0 ? 'Smooth micro-interactions observed on interactive states.' : 'Standard instant state updates.',
  };
}
