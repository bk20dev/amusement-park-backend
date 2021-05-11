/**
 * Clamps given value
 * @param {Number} value Value to be clamped
 * @param {Number} min Minimal value
 * @param {Number} max Maximal value
 * @returns Clamped value
 */
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

module.exports = clamp;
