#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const METRICS = [
  ['aiPracticeScore', 'AI Practice Score', 'score'],
  ['antiPatternRate', 'Anti-pattern Rate', 'rate'],
  ['antiPatternResolutionRate', 'Resolution Rate', 'percent'],
  ['contextHealthScore', 'Context Health', 'score'],
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
  return {
    workspaceName: String(value.workspaceName ?? ''),
    lookupWorkspaceId: String(value.lookupWorkspaceId ?? value.workspaceName ?? ''),
    contextHealthScore: clamp(value.contextHealthScore),
    verdict: CONTEXT_VERDICTS.has(verdict) ? verdict : 'no data',
    avgUtilization: clampPercent(value.avgUtilization),
    peakUtilization: clampPercent(value.peakUtilization),
    compactions: Math.max(0, Math.round(Number(value.compactions ?? 0))),
    requestsWithTokens: Math.max(0, Math.round(Number(value.requestsWithTokens ?? 0))),
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
  const col = index % 4;
  const row = Math.floor(index / 4);
  const x = 28 + col * 176;
  const y = 104 + row * 102;
  const width = 158;
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

function formatUtilization(value, requestsWithTokens) {
  if (requestsWithTokens <= 0) return '-';
  return clampPercent(value).toFixed(1).replace(/\.0$/, '') + '%';
}

function contextHealthRow(workspace, index) {
  const y = 386 + index * 34;
  const fill = index % 2 === 0 ? '#0d1117' : '#161b22';
  return [
    '    <g>',
    '      <rect x="28" y="' + (y - 21) + '" width="704" height="34" fill="' + fill + '"/>',
    '      <text x="42" y="' + y + '" fill="#f0f6fc" font-size="12" font-weight="600">' + escapeXml(workspace.workspaceName) + '</text>',
    '      <text x="298" y="' + y + '" fill="#f0f6fc" font-size="12">' + escapeXml(workspace.contextHealthScore + '/100') + '</text>',
    '      <text x="384" y="' + y + '" fill="#f0f6fc" font-size="12">' + escapeXml(workspace.verdict) + '</text>',
    '      <text x="490" y="' + y + '" fill="#f0f6fc" font-size="12">' + escapeXml(formatUtilization(workspace.avgUtilization, workspace.requestsWithTokens)) + '</text>',
    '      <text x="570" y="' + y + '" fill="#f0f6fc" font-size="12">' + escapeXml(formatUtilization(workspace.peakUtilization, workspace.requestsWithTokens)) + '</text>',
    '      <text x="650" y="' + y + '" fill="#f0f6fc" font-size="12">' + escapeXml(workspace.compactions) + '</text>',
    '      <text x="704" y="' + y + '" fill="#f0f6fc" font-size="12" text-anchor="end">' + escapeXml(workspace.requestsWithTokens) + '</text>',
    '    </g>',
  ].join('\n');
}

function contextHealthTable(payload) {
  if (payload.contextHealthWorkspaces.length === 0) return '';
  return [
    '  <g font-family="Inter,Segoe UI,Arial,sans-serif">',
    '    <text x="28" y="318" fill="#f0f6fc" font-size="16" font-weight="800">Workspace Context Health</text>',
    '    <rect x="28" y="332" width="704" height="' + (44 + payload.contextHealthWorkspaces.length * 34) + '" rx="8" fill="#0d1117" stroke="#30363d"/>',
    '    <text x="42" y="352" fill="#8b949e" font-size="11">Workspace</text>',
    '    <text x="298" y="352" fill="#8b949e" font-size="11">Score</text>',
    '    <text x="384" y="352" fill="#8b949e" font-size="11">Verdict</text>',
    '    <text x="490" y="352" fill="#8b949e" font-size="11">Avg</text>',
    '    <text x="570" y="352" fill="#8b949e" font-size="11">Peak</text>',
    '    <text x="650" y="352" fill="#8b949e" font-size="11">Comp</text>',
    '    <text x="704" y="352" fill="#8b949e" font-size="11" text-anchor="end">Tokens</text>',
    payload.contextHealthWorkspaces.map(contextHealthRow).join('\n'),
    '  </g>',
  ].join('\n');
}

export function renderMetricsSvg(rawPayload) {
  const payload = sanitizePayload(rawPayload);
  const generatedDate = payload.generatedAt.slice(0, 10);
  const range = payload.current.fromDate + ' to ' + payload.current.toDate;
  const height = payload.contextHealthWorkspaces.length > 0
    ? 420 + payload.contextHealthWorkspaces.length * 34
    : 330;
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
    contextHealthTable(payload),
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
