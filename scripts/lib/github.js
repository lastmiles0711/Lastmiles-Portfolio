// Clean GitHub API helpers — extracted and inspired by
// github.com/yuki6942/yuki6942.de/blob/main/src/lib/github.ts

const GITHUB_API = 'https://api.github.com';

function authHeaders(token) {
    const h = { Accept: 'application/vnd.github+json' };
    if (token) h.Authorization = `Bearer ${token}`;
    return h;
}

export function parseOwnerRepo(url) {
    if (!url) return null;
    try {
        const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
        const parts = parsed.pathname.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
        return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : null;
    } catch {
        return null;
    }
}

export function parseUsername(url) {
    if (!url) return null;
    try {
        const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
        const parts = parsed.pathname.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
        return parts[0] || null;
    } catch {
        return null;
    }
}

export async function fetchRepo(fullName, token) {
    const res = await fetch(`${GITHUB_API}/repos/${fullName}`, {
        headers: authHeaders(token),
    });
    if (!res.ok) throw new Error(`GitHub API ${res.status} for ${fullName}`);
    return res.json();
}

export async function fetchRepoLanguages(fullName, token) {
    const res = await fetch(`${GITHUB_API}/repos/${fullName}/languages`, {
        headers: authHeaders(token),
    });
    if (!res.ok) return {};
    return res.json();
}

export async function fetchUserRepos(username, token) {
    const repos = [];
    let page = 1;
    const perPage = 100;

    while (true) {
        const res = await fetch(
            `${GITHUB_API}/users/${username}/repos?per_page=${perPage}&page=${page}&sort=updated`,
            { headers: authHeaders(token) },
        );

        if (res.status === 404) return [];
        if (!res.ok) throw new Error(`GitHub API ${res.status} listing repos for ${username}`);

        const data = await res.json();
        repos.push(...data);
        if (data.length < perPage) break;
        page += 1;
    }

    return repos;
}

export async function fetchUserProfile(username, token) {
    const res = await fetch(`${GITHUB_API}/users/${username}`, {
        headers: authHeaders(token),
    });
    if (!res.ok) throw new Error(`GitHub API ${res.status} for user ${username}`);
    return res.json();
}

export async function getProjectDetails(project, token) {
    const fullName = parseOwnerRepo(project.github);
    if (!fullName) {
        return {
            id: project.github || 'unknown',
            name: project.github || 'Unknown',
            description: null,
            github: project.github,
            live: project.live || null,
            stars: 0,
            forks: 0,
            languages: {},
            updatedAt: null,
        };
    }

    const [repo, languages] = await Promise.all([
        fetchRepo(fullName, token),
        fetchRepoLanguages(fullName, token),
    ]);

    return {
        id: repo.id?.toString() || repo.name,
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description,
        github: repo.html_url,
        live: project.live || repo.homepage || null,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        languages,
        topics: repo.topics || [],
        updatedAt: repo.updated_at,
        archived: repo.archived || false,
        license: repo.license?.spdx_id || null,
        isFork: repo.fork || false,
    };
}
