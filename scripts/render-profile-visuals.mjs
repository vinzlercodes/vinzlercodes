#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const FONT = 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function tagPills(tags) {
  let x = 58;
  return tags.map(tag => {
    const width = Math.max(82, tag.label.length * 10 + 42);
    const textX = x + width / 2;
    const pill = [
      `    <rect x="${x}" y="191" width="${width}" height="36" rx="18" fill="${tag.fill}" stroke="${tag.stroke}"/>`,
      `    <text x="${textX}" y="214" text-anchor="middle" fill="${tag.text}">${escapeXml(tag.label)}</text>`,
    ].join('\n');
    x += width + 14;
    return pill;
  }).join('\n');
}

export function renderHeroSvg(profile) {
  const hero = profile.hero;
  return `<svg width="960" height="300" viewBox="0 0 960 300" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc">
  <title id="title">Vinayak Sengupta profile hero</title>
  <desc id="desc">Professional banner showing governed agentic workflows across healthcare, finance, risk, and developer automation.</desc>
  <rect width="960" height="300" rx="18" fill="#F8FAFC"/>
  <rect x="1" y="1" width="958" height="298" rx="17" stroke="#D8E3F0" stroke-width="2"/>
  <rect x="24" y="24" width="912" height="252" rx="14" fill="#FFFFFF"/>
  <rect x="24" y="24" width="912" height="252" rx="14" stroke="#E2E8F0"/>
  <g opacity="0.9">
    <circle cx="830" cy="78" r="44" fill="#DBEAFE"/>
    <circle cx="874" cy="134" r="62" fill="#DCFCE7"/>
    <circle cx="773" cy="190" r="52" fill="#E0F2FE"/>
  </g>
  <text x="58" y="76" fill="#1E3A8A" font-family="${FONT}" font-size="18" font-weight="700" letter-spacing="1.6">${escapeXml(hero.eyebrow)}</text>
  <text x="58" y="122" fill="#0F172A" font-family="${FONT}" font-size="35" font-weight="800">${escapeXml(hero.headline)}</text>
  <text x="58" y="157" fill="#334155" font-family="${FONT}" font-size="18" font-weight="500">${escapeXml(hero.subhead)}</text>
  <g font-family="${FONT}" font-size="15" font-weight="700">
${tagPills(hero.tags)}
  </g>
  <g transform="translate(735 68)">
    <rect x="0" y="0" width="152" height="152" rx="18" fill="#FFFFFF" stroke="#CBD5E1"/>
    <circle cx="76" cy="76" r="44" fill="#EFF6FF" stroke="#60A5FA" stroke-width="2"/>
    <circle cx="76" cy="76" r="21" fill="#1E40AF"/>
    <circle cx="76" cy="22" r="10" fill="#22C55E"/>
    <circle cx="124" cy="76" r="10" fill="#22C55E"/>
    <circle cx="76" cy="130" r="10" fill="#22C55E"/>
    <circle cx="28" cy="76" r="10" fill="#22C55E"/>
    <path d="M76 32V54M98 76H114M76 98V120M38 76H54" stroke="#1E40AF" stroke-width="3" stroke-linecap="round"/>
    <text x="76" y="82" text-anchor="middle" fill="#FFFFFF" font-family="${FONT}" font-size="13" font-weight="800">AI</text>
  </g>
  <text x="58" y="255" fill="#64748B" font-family="${FONT}" font-size="13" font-weight="600">${escapeXml(hero.footer)}</text>
</svg>
`;
}

function domainCard(domain) {
  return [
    `    <rect x="${domain.x}" y="${domain.y}" width="178" height="72" rx="12" fill="${domain.fill}" stroke="${domain.stroke}"/>`,
    `    <text x="${domain.x + 24}" y="${domain.y + 32}" fill="${domain.text}" font-size="15" font-weight="800">${escapeXml(domain.label)}</text>`,
    `    <text x="${domain.x + 24}" y="${domain.y + 55}" fill="#334155" font-size="12" font-weight="600">${escapeXml(domain.detail)}</text>`,
  ].join('\n');
}

function projectPills(projects) {
  const widths = [164, 126, 138, 168];
  let x = 85;
  return projects.map((project, index) => {
    const width = widths[index] ?? 148;
    const pill = [
      `    <rect x="${x}" y="314" width="${width}" height="26" rx="13" fill="#F8FAFC" stroke="#CBD5E1"/>`,
      `    <text x="${x + width / 2}" y="332" text-anchor="middle" fill="#334155">${escapeXml(project)}</text>`,
    ].join('\n');
    x += width + 28;
    return pill;
  }).join('\n');
}

export function renderSystemMapSvg(profile) {
  const map = profile.systemMap;
  return `<svg width="960" height="360" viewBox="0 0 960 360" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc">
  <title id="title">Agentic portfolio system map</title>
  <desc id="desc">A system map connecting domains, runtime primitives, and public projects in Vinayak Sengupta's portfolio.</desc>
  <rect width="960" height="360" rx="18" fill="#FFFFFF"/>
  <rect x="1" y="1" width="958" height="358" rx="17" stroke="#D8E3F0" stroke-width="2"/>
  <text x="48" y="52" fill="#0F172A" font-family="${FONT}" font-size="23" font-weight="800">${escapeXml(map.title)}</text>
  <text x="48" y="78" fill="#475569" font-family="${FONT}" font-size="14" font-weight="600">${escapeXml(map.subtitle)}</text>
  <g font-family="${FONT}">
${map.domains.map(domainCard).join('\n')}
  </g>
  <g stroke="#94A3B8" stroke-width="2" stroke-linecap="round">
    <path d="M226 154H335"/>
    <path d="M226 246H335"/>
    <path d="M625 154H734"/>
    <path d="M625 246H734"/>
  </g>
  <g font-family="${FONT}">
    <rect x="335" y="104" width="290" height="192" rx="16" fill="#F8FAFC" stroke="#CBD5E1"/>
    <text x="480" y="136" text-anchor="middle" fill="#0F172A" font-size="17" font-weight="800">${escapeXml(map.runtime.title)}</text>
    <g font-size="12" font-weight="700">
      <rect x="365" y="160" width="82" height="32" rx="16" fill="#FFFFFF" stroke="#93C5FD"/>
      <text x="406" y="181" text-anchor="middle" fill="#1D4ED8">${escapeXml(map.runtime.primitives[0])}</text>
      <rect x="463" y="160" width="82" height="32" rx="16" fill="#FFFFFF" stroke="#86EFAC"/>
      <text x="504" y="181" text-anchor="middle" fill="#15803D">${escapeXml(map.runtime.primitives[1])}</text>
      <rect x="513" y="212" width="82" height="32" rx="16" fill="#FFFFFF" stroke="#FDE68A"/>
      <text x="554" y="233" text-anchor="middle" fill="#A16207">${escapeXml(map.runtime.primitives[2])}</text>
      <rect x="414" y="212" width="82" height="32" rx="16" fill="#FFFFFF" stroke="#67E8F9"/>
      <text x="455" y="233" text-anchor="middle" fill="#0E7490">${escapeXml(map.runtime.primitives[3])}</text>
      <rect x="365" y="258" width="230" height="24" rx="12" fill="#FFFFFF" stroke="#CBD5E1"/>
      <text x="480" y="275" text-anchor="middle" fill="#334155">${escapeXml(map.runtime.base)}</text>
    </g>
    <path d="M448 176H463M504 192V212M513 228H496M455 212V192" stroke="#64748B" stroke-width="2" stroke-linecap="round"/>
  </g>
  <g font-family="${FONT}" font-size="12" font-weight="700">
${projectPills(map.projects)}
  </g>
</svg>
`;
}

export function renderFile(inputPath = 'data/profile-visuals.json', outputDir = 'assets') {
  const profile = JSON.parse(readFileSync(inputPath, 'utf8'));
  mkdirSync(outputDir, { recursive: true });
  writeFileSync(join(outputDir, 'profile-hero.svg'), renderHeroSvg(profile), 'utf8');
  writeFileSync(join(outputDir, 'profile-system-map.svg'), renderSystemMapSvg(profile), 'utf8');
}

if (fileURLToPath(import.meta.url) === process.argv[1]) {
  renderFile(process.argv[2], process.argv[3] ?? dirname('assets/profile-hero.svg'));
}
