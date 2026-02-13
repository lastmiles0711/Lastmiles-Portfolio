#!/usr/bin/env node

// Fetches GitHub repo metadata and friend profiles, writes JSON for the frontend.
// Discovers new repos and writes them back into projects.js (hidden by default).

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import {
  parseOwnerRepo,
  parseUsername,
  fetchUserRepos,
  fetchUserProfile,
  getProjectDetails,
} from './lib/github.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const TOKEN = process.env.GITHUB_TOKEN || '';
const DATA_DIR = process.env.DATA_DIR || resolve(__dirname, '../public/data');
const PROJECTS_PATH = resolve(__dirname, '../src/config/projects.js');
const FRIENDS_PATH = resolve(__dirname, '../src/config/personal.js');

const REPO_OUTPUT = resolve(DATA_DIR, 'repoData.json');
const FRIENDS_OUTPUT = resolve(DATA_DIR, 'friendsData.json');

const AUTOGEN_START = '// --- AUTOGEN:START (do not remove this marker) ---';
const AUTOGEN_END = '// --- AUTOGEN:END ---';

function discoverAndMerge(config, knownSlugs, discoveredRepos) {
  // Find brand-new repos not yet in projects.js at all
  const newEntries = [];
  for (const repo of discoveredRepos) {
    const slug = repo.full_name?.toLowerCase();
    if (!slug || knownSlugs.has(slug)) continue;

    newEntries.push({ github: repo.html_url, visible: false });
    console.log(`  + New repo discovered: ${repo.full_name} (visible: false)`);
  }

  const source = readFileSync(PROJECTS_PATH, 'utf8');
  const startIdx = source.indexOf(AUTOGEN_START);
  const endIdx = source.indexOf(AUTOGEN_END);

  const existingAutogen = [];
  if (startIdx !== -1 && endIdx !== -1) {
    const block = source.slice(startIdx + AUTOGEN_START.length, endIdx);
    const githubMatches = [...block.matchAll(/github:\s*'([^']+)'/g)];
    const visibleMatches = [...block.matchAll(/visible:\s*(true|false)/g)];
    for (let i = 0; i < githubMatches.length; i++) {
      existingAutogen.push({
        github: githubMatches[i][1],
        visible: visibleMatches[i] ? visibleMatches[i][1] === 'true' : false,
      });
    }
  }

  // Merge: existing autogen + new entries (dedup by slug)
  const seen = new Set();
  const merged = [];

  for (const entry of [...existingAutogen, ...newEntries]) {
    const slug = parseOwnerRepo(entry.github)?.toLowerCase();
    if (slug && !seen.has(slug)) {
      seen.add(slug);
      merged.push(entry);
    }
  }

  if (startIdx === -1 || endIdx === -1) {
    console.warn('[fetch-repos] AUTOGEN markers not found — skipping write-back');
    return;
  }

  const indent = '  ';
  const lines = [`${AUTOGEN_START}\n`];
  for (const entry of merged) {
    lines.push(`${indent}{\n`);
    lines.push(`${indent}${indent}github: '${entry.github}',\n`);
    lines.push(`${indent}${indent}visible: ${entry.visible},\n`);
    lines.push(`${indent}},\n`);
  }
  lines.push(`${indent}${AUTOGEN_END}`);

  const before = source.slice(0, startIdx);
  const after = source.slice(endIdx + AUTOGEN_END.length);
  writeFileSync(PROJECTS_PATH, before + lines.join('') + after, 'utf8');
  console.log(`[fetch-repos] Updated projects.js with ${merged.length} auto-discovered entry/entries`);
}

async function main() {
  mkdirSync(DATA_DIR, { recursive: true });

  const mod = await import(PROJECTS_PATH);
  const projects = Array.isArray(mod.PROJECTS) ? mod.PROJECTS : [];
  const config = mod.DISCOVERY_CONFIG || {};
  const username = config.username;

  const knownSlugs = new Map();
  for (const p of projects) {
    const slug = parseOwnerRepo(p.github)?.toLowerCase();
    if (slug) knownSlugs.set(slug, p);
  }

  // ---- Step 1: Auto-discover new repos ------------------------------------

  if (username) {
    console.log(`[fetch-repos] Scanning repos for ${username}…`);
    const allRepos = await fetchUserRepos(username, TOKEN);
    const eligible = allRepos.filter((repo) => {
      if (!config.includeForks && repo.fork) return false;
      if (!config.includeArchived && repo.archived) return false;
      if (config.topics?.length > 0) {
        const rt = (repo.topics || []).map((t) => t.toLowerCase());
        if (!config.topics.some((t) => rt.includes(t.toLowerCase()))) return false;
      }
      if (config.exclude?.length > 0) {
        const slug = repo.full_name?.toLowerCase();
        const name = repo.name?.toLowerCase();
        if (config.exclude.some((e) => e.toLowerCase() === slug || e.toLowerCase() === name)) return false;
      }
      return true;
    });
    console.log(`[fetch-repos] Found ${eligible.length} eligible repo(s)`);
    discoverAndMerge(config, knownSlugs, eligible);
  }

  // ---- Step 2: Fetch metadata for visible projects ------------------------

  const updatedMod = await import(PROJECTS_PATH + `?t=${Date.now()}`);
  const allProjects = Array.isArray(updatedMod.PROJECTS) ? updatedMod.PROJECTS : [];
  const visible = allProjects.filter((p) => p.visible !== false);

  console.log(`[fetch-repos] Fetching metadata for ${visible.length} visible project(s)…`);

  const results = await Promise.allSettled(
    visible.map((p) => getProjectDetails(p, TOKEN)),
  );

  const repoData = results.flatMap((r, i) => {
    if (r.status === 'fulfilled') {
      console.log(`  ✓ ${r.value.name}`);
      return [r.value];
    }
    console.error(`  ✗ Failed: ${visible[i].github} — ${r.reason?.message}`);
    return [];
  });

  writeFileSync(REPO_OUTPUT, JSON.stringify(repoData, null, 2) + '\n');
  console.log(`[fetch-repos] Wrote ${repoData.length} repo(s) to ${REPO_OUTPUT}`);

  // ---- Step 3: Friends ----------------------------------------------------

  const friendsMod = await import(FRIENDS_PATH);
  const friendUrls = friendsMod.FRIENDS || [];
  console.log(`[fetch-repos] Fetching profiles for ${friendUrls.length} friend(s)…`);

  const friendResults = await Promise.allSettled(
    friendUrls.map(async (url) => {
      const user = parseUsername(url);
      if (!user) throw new Error(`Bad URL: ${url}`);
      const data = await fetchUserProfile(user, TOKEN);
      return {
        id: data.login,
        username: data.login,
        name: data.name || data.login,
        bio: data.bio || null,
        url: data.html_url || `https://github.com/${data.login}`,
        avatar: data.avatar_url,
      };
    }),
  );

  const friendsData = friendResults.flatMap((r, i) => {
    if (r.status === 'fulfilled') {
      console.log(`  ✓ ${r.value.name}`);
      return [r.value];
    }
    const user = parseUsername(friendUrls[i]) || friendUrls[i];
    console.error(`  ✗ Failed: ${user} — ${r.reason?.message}`);
    return [{
      id: user,
      username: user,
      name: user,
      bio: null,
      url: `https://github.com/${user}`,
      avatar: `https://github.com/${user}.png`,
      error: true,
    }];
  });

  writeFileSync(FRIENDS_OUTPUT, JSON.stringify(friendsData, null, 2) + '\n');
  console.log(`[fetch-repos] Wrote ${friendsData.length} friend(s) to ${FRIENDS_OUTPUT}`);
}

main().catch((err) => {
  if (err.message?.includes('403')) {
    console.warn('[fetch-repos] GitHub API rate limit hit — skipping (stale data will be used)');
    console.warn('[fetch-repos] Set GITHUB_TOKEN in .env to avoid this.');
    process.exit(0);
  }
  console.error('[fetch-repos] Fatal error:', err);
  process.exit(1);
});
