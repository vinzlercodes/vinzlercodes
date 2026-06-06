#!/usr/bin/env node
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { renderFile, renderMetricsSvg, sanitizePayload } from './render-ai-coach-metrics.mjs';

const payload = {
  schemaVersion: 1,
  generatedAt: '2026-01-01T00:00:00.000Z',
  current: { fromDate: '2025-12-03', toDate: '2026-01-01', requests: 1234, antiPatternOccurrences: 12 },
  previous: { fromDate: '2025-11-03', toDate: '2025-12-02', requests: 1000, antiPatternOccurrences: 20 },
  workspaceName: 'secret-project',
  promptPreview: 'private prompt text',
  metrics: {
    aiPracticeScore: 86,
    antiPatternRate: 1.2,
    antiPatternResolutionRate: 40,
    contextHealthScore: 91,
    promptQualityScore: 88,
    codeReviewVerificationScore: 72,
    toolMasteryScore: 77,
    agenticSdlcCoverage: 83,
  },
  contextHealthWorkspaces: [
    {
      workspaceName: 'ai-coach-profile-publisher',
      lookupWorkspaceId: 'ai-coach-profile-publisher',
      contextHealthScore: 96,
      verdict: 'limited',
      avgUtilization: 27.1,
      peakUtilization: 99.2,
      compactions: 0,
      requestsWithTokens: 14,
      promptPreview: 'private prompt text',
    },
    {
      workspaceName: 'Open_Prior_Auth_Workbench',
      lookupWorkspaceId: 'Doctor',
      contextHealthScore: 96,
      verdict: 'limited',
      avgUtilization: 37,
      peakUtilization: 100,
      compactions: 0,
      requestsWithTokens: 448,
    },
  ],
};

const sanitized = sanitizePayload(payload);
assert.equal(sanitized.workspaceName, undefined);
assert.equal(sanitized.promptPreview, undefined);
assert.equal(sanitized.contextHealthWorkspaces[0].promptPreview, undefined);

const svg = renderMetricsSvg(payload);
for (const label of [
  'AI Practice Score',
  'Anti-pattern Rate',
  'Resolution Rate',
  'Context Health',
  'Prompt Quality',
  'Review / Verification',
  'Tool Mastery',
  'Agentic SDLC Coverage',
]) {
  assert.match(svg, new RegExp(label.replaceAll('/', '\\/')));
}
for (const value of [
  'Workspace Context Health',
  'ai-coach-profile-publisher',
  'Open_Prior_Auth_Workbench',
  'limited',
  '27.1%',
  '448',
]) {
  assert.match(svg, new RegExp(value.replaceAll('/', '\\/')));
}
assert.doesNotMatch(svg, /secret-project|private prompt text/);

const dir = mkdtempSync(join(tmpdir(), 'ai-coach-metrics-'));
const input = join(dir, 'metrics.json');
const output = join(dir, 'metrics.svg');
writeFileSync(input, JSON.stringify(payload), 'utf8');
renderFile(input, output);
assert.match(readFileSync(output, 'utf8'), /AI Engineering Coach metrics/);
