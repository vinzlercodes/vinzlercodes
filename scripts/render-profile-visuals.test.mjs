#!/usr/bin/env node
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { renderFile, renderHeroSvg, renderSystemMapSvg } from './render-profile-visuals.mjs';

const profile = JSON.parse(readFileSync('data/profile-visuals.json', 'utf8'));
const hero = renderHeroSvg(profile);
const map = renderSystemMapSvg(profile);

for (const value of [
  'Governed Agentic Workflow Platforms',
  'Healthcare',
  'Finance',
  'Risk',
  'Agent Tooling',
  'Evals',
]) {
  assert.match(hero, new RegExp(value));
}

for (const value of [
  'Portfolio System Map',
  'Governed Agent Runtime',
  'Open Prior Auth',
  'DecisionRisk',
  'CanopyLedger',
  'Artifact \\+ Codex tooling',
]) {
  assert.match(map, new RegExp(value));
}

assert.doesNotMatch(hero + map, /🎉|💪|🚀|✨/u);

const dir = mkdtempSync(join(tmpdir(), 'profile-visuals-'));
renderFile('data/profile-visuals.json', dir);
assert.match(readFileSync(join(dir, 'profile-hero.svg'), 'utf8'), /Vinayak Sengupta profile hero/);
assert.match(readFileSync(join(dir, 'profile-system-map.svg'), 'utf8'), /Agentic portfolio system map/);
