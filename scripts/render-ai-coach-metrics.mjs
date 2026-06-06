#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const METRICS = [
  ['aiPracticeScore', 'AI Practice Score', 'score'],
  ['antiPatternRate', 'Anti-pattern Rate', 'rate'],
  ['antiPatternResolutionRate', 'Resolution Rate', 'percent'],
  ['contextHealthScore', 'Context Mgmt', 'score'],
  ['contextQualityScore', 'Context Quality', 'score'],
  ['promptQualityScore', 'Prompt Quality', 'score'],
  ['codeReviewVerificationScore', 'Review / Verification', 'score'],
  ['toolMasteryScore', 'Tool Mastery', 'score'],
  ['agenticSdlcCoverage', 'Agentic SDLC Coverage', 'score'],
];

const CONTEXT_VERDICTS = new Set(['optimal', 'degraded', 'limited', 'no data']);

function clamp(n) {
  const value = Number(n);
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function clampPercent(n) {
  const value = Number(n);
  if (!Number.isFinite(value)) return 0;
  return Math.round(Math.max(0, Math.min(100, value)) * 10) / 10;
}

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function sanitizeContextHealthWorkspace(value = {}) {
  const verdict = String(value.verdict ?? 'no data');
  const contextManagementScore = clamp(value.contextManagementScore ?? value.contextHealthScore);
  return {
    workspaceName: String(value.workspaceName ?? ''),
    lookupWorkspaceId: String(value.lookupWorkspaceId ?? value.workspaceName ?? ''),
    contextHealthScore: contextManagementScore,
    contextManagementScore,
    contextQualityScore: clamp(value.contextQualityScore),
    agenticReadinessScore: clamp(value.agenticReadinessScore),
    instructionQualityScore: clamp(value.instructionQualityScore),
    progressiveDisclosureScore: clamp(value.progressiveDisclosureScore),
    verdict: CONTEXT_VERDICTS.has(verdict) ? verdict : 'no data',
    avgUtilization: clampPercent(value.avgUtilization),
    peakUtilization: clampPercent(value.peakUtilization),
    compactions: Math.max(0, Math.round(Number(value.compactions ?? 0))),
    requestsWithTokens: Math.max(0, Math.round(Number(value.requestsWithTokens ?? 0))),
    configFiles: Math.max(0, Math.round(Number(value.configFiles ?? 0))),
    hasInstructions: Boolean(value.hasInstructions),
    hasPrompts: Boolean(value.hasPrompts),
    hasAgents: Boolean(value.hasAgents),
    hasSkills: Boolean(value.hasSkills),
    hasHooks: Boolean(value.hasHooks),
  };
}

function sanitizeContextHealthWorkspaces(value) {
  if (!Array.isArray(value)) return [];
  return value.map(sanitizeContextHealthWorkspace).filter(workspace => workspace.workspaceName);
}

export function sanitizePayload(raw) {
  const metrics = raw?.metrics ?? {};
  return {
    schemaVersion: 1,
    generatedAt: typeof raw?.generatedAt === 'string' ? raw.generatedAt : new Date().toISOString(),
    current: {
      fromDate: String(raw?.current?.fromDate ?? ''),
      toDate: String(raw?.current?.toDate ?? ''),
      requests: Math.max(0, Math.round(Number(raw?.current?.requests ?? 0))),
      antiPatternOccurrences: Math.max(0, Math.round(Number(raw?.current?.antiPatternOccurrences ?? 0))),
    },
    previous: {
      fromDate: String(raw?.previous?.fromDate ?? ''),
      toDate: String(raw?.previous?.toDate ?? ''),
      requests: Math.max(0, Math.round(Number(raw?.previous?.requests ?? 0))),
      antiPatternOccurrences: Math.max(0, Math.round(Number(raw?.previous?.antiPatternOccurrences ?? 0))),
    },
    metrics: Object.fromEntries(METRICS.map(([key]) => [key, key === 'antiPatternRate' ? Number(metrics[key] ?? 0) : clamp(metrics[key])])),
    contextHealthWorkspaces: sanitizeContextHealthWorkspaces(raw?.contextHealthWorkspaces),
  };
}

function colorFor(value, kind) {
  if (kind === 'rate') {
    if (value <= 5) return '#3fb950';
    if (value <= 15) return '#d29922';
    return '#f85149';
  }
  if (value >= 75) return '#3fb950';
  if (value >= 45) return '#d29922';
  return '#f85149';
}

function formatValue(value, kind) {
  if (kind === 'rate') return Number(value).toFixed(Number(value) >= 100 ? 0 : 1) + '/100 req';
  if (kind === 'percent') return clamp(value) + '%';
  return clamp(value) + '/100';
}

function card([key, label, kind], index, payload) {
  const col = index % 3;
  const row = Math.floor(index / 3);
  const x = 28 + col * 236;
  const y = 104 + row * 102;
  const width = 214;
  const value = payload.metrics[key];
  const color = colorFor(value, kind);
  const bar = kind === 'rate' ? Math.max(0, Math.min(100, 100 - Number(value))) : clamp(value);
  return [
    '    <g>',
    '      <rect x="' + x + '" y="' + y + '" width="' + width + '" height="78" rx="8" fill="#161b22" stroke="#30363d"/>',
    '      <text x="' + (x + 14) + '" y="' + (y + 24) + '" fill="#8b949e" font-size="12">' + escapeXml(label) + '</text>',
    '      <text x="' + (x + 14) + '" y="' + (y + 50) + '" fill="#f0f6fc" font-size="22" font-weight="700">' + escapeXml(formatValue(value, kind)) + '</text>',
    '      <rect x="' + (x + 14) + '" y="' + (y + 61) + '" width="' + (width - 28) + '" height="5" rx="3" fill="#30363d"/>',
    '      <rect x="' + (x + 14) + '" y="' + (y + 61) + '" width="' + Math.round((width - 28) * bar / 100) + '" height="5" rx="3" fill="' + color + '"/>',
    '    </g>',
  ].join('\n');
}

function formatScore(value) {
  return clamp(value) + '';
}

function signalText(workspace) {
  const signals = [];
  if (workspace.hasInstructions) signals.push('Instr');
  if (workspace.hasPrompts) signals.push('Prompts');
  if (workspace.hasAgents) signals.push('Agents');
  if (workspace.hasSkills) signals.push('Skills');
  if (workspace.hasHooks) signals.push('Hooks');
  return signals.length > 0 ? signals.join(' ') : '-';
}

function contextHealthRow(workspace, index, startY) {
  const y = startY + 54 + index * 34;
  const fill = index % 2 === 0 ? '#0d1117' : '#161b22';
  return [
    '    <g>',
    '      <rect x="28" y="' + (y - 21) + '" width="704" height="34" fill="' + fill + '"/>',
    '      <text x="42" y="' + y + '" fill="#f0f6fc" font-size="12" font-weight="600">' + escapeXml(workspace.workspaceName) + '</text>',
    '      <text x="256" y="' + y + '" fill="#f0f6fc" font-size="12">' + escapeXml(formatScore(workspace.contextManagementScore)) + '</text>',
    '      <text x="324" y="' + y + '" fill="#f0f6fc" font-size="12">' + escapeXml(formatScore(workspace.contextQualityScore)) + '</text>',
    '      <text x="400" y="' + y + '" fill="#f0f6fc" font-size="12">' + escapeXml(formatScore(workspace.agenticReadinessScore)) + '</text>',
    '      <text x="474" y="' + y + '" fill="#f0f6fc" font-size="12">' + escapeXml(formatScore(workspace.instructionQualityScore)) + '</text>',
    '      <text x="530" y="' + y + '" fill="#f0f6fc" font-size="12">' + escapeXml(formatScore(workspace.progressiveDisclosureScore)) + '</text>',
    '      <text x="582" y="' + y + '" fill="#f0f6fc" font-size="12">' + escapeXml(workspace.configFiles) + '</text>',
    '      <text x="632" y="' + y + '" fill="#f0f6fc" font-size="11">' + escapeXml(signalText(workspace)) + '</text>',
    '    </g>',
  ].join('\n');
}

function contextHealthTable(payload, startY) {
  if (payload.contextHealthWorkspaces.length === 0) return '';
  return [
    '  <g font-family="Inter,Segoe UI,Arial,sans-serif">',
    '    <text x="28" y="' + startY + '" fill="#f0f6fc" font-size="16" font-weight="800">Workspace Context Health</text>',
    '    <rect x="28" y="' + (startY + 14) + '" width="704" height="' + (44 + payload.contextHealthWorkspaces.length * 34) + '" rx="8" fill="#0d1117" stroke="#30363d"/>',
    '    <text x="42" y="' + (startY + 34) + '" fill="#8b949e" font-size="11">Workspace</text>',
    '    <text x="256" y="' + (startY + 34) + '" fill="#8b949e" font-size="11">Mgmt</text>',
    '    <text x="324" y="' + (startY + 34) + '" fill="#8b949e" font-size="11">Quality</text>',
    '    <text x="400" y="' + (startY + 34) + '" fill="#8b949e" font-size="11">Agentic</text>',
    '    <text x="474" y="' + (startY + 34) + '" fill="#8b949e" font-size="11">Instr</text>',
    '    <text x="530" y="' + (startY + 34) + '" fill="#8b949e" font-size="11">PD</text>',
    '    <text x="582" y="' + (startY + 34) + '" fill="#8b949e" font-size="11">Files</text>',
    '    <text x="632" y="' + (startY + 34) + '" fill="#8b949e" font-size="11">Signals</text>',
    payload.contextHealthWorkspaces.map((workspace, index) => contextHealthRow(workspace, index, startY)).join('\n'),
    '  </g>',
  ].join('\n');
}

export function renderMetricsSvg(rawPayload) {
  const payload = sanitizePayload(rawPayload);
  const generatedDate = payload.generatedAt.slice(0, 10);
  const range = payload.current.fromDate + ' to ' + payload.current.toDate;
  const tableStartY = 420;
  const height = payload.contextHealthWorkspaces.length > 0
    ? tableStartY + 88 + payload.contextHealthWorkspaces.length * 34
    : 430;
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" width="760" height="' + height + '" viewBox="0 0 760 ' + height + '" role="img" aria-labelledby="title desc">',
    '  <title id="title">AI Engineering Coach metrics</title>',
    '  <desc id="desc">Sanitized aggregate AI-assisted engineering practice metrics.</desc>',
    '  <rect width="760" height="' + height + '" rx="12" fill="#0d1117"/>',
    '  <rect x="1" y="1" width="758" height="' + (height - 2) + '" rx="12" fill="none" stroke="#30363d"/>',
    '  <text x="28" y="38" fill="#f0f6fc" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="24" font-weight="800">AI Engineering Coach</text>',
    '  <text x="28" y="62" fill="#8b949e" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="13">Public, sanitized aggregates only | ' + escapeXml(range) + ' | ' + payload.current.requests.toLocaleString('en-US') + ' requests</text>',
    '  <text x="28" y="82" fill="#6e7681" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="12">Updated ' + escapeXml(generatedDate) + '</text>',
    '  <g font-family="Inter,Segoe UI,Arial,sans-serif">',
    METRICS.map((metric, index) => card(metric, index, payload)).join('\n'),
    '  </g>',
    contextHealthTable(payload, tableStartY),
    '</svg>',
    '',
  ].join('\n');
}

export function renderFile(inputPath = 'data/ai-coach-metrics.json', outputPath = 'assets/ai-coach-metrics.svg') {
  const payload = JSON.parse(readFileSync(inputPath, 'utf8'));
  const svg = renderMetricsSvg(payload);
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, svg, 'utf8');
}

if (fileURLToPath(import.meta.url) === process.argv[1]) {
  renderFile(process.argv[2], process.argv[3]);
}
