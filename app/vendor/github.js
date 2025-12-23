// NOTE! This token only lasts for 366 days and will need to be regenerated.
const GITHUB_TOKEN = process.env.GH_GENERAL_API_TOKEN;
const REPO_NAME = 'acmecorp'; // Replace with the repository name
const BRANCH = 'main';
const isDev = process.env.NODE_ENV === 'development';
import test_commit_data from '~/assets/test_commit_data.json';

// Headers for authentication
const headers = {
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  Accept: 'application/vnd.github.v3+json',
};

const ms24h = 24 * 60 * 60 * 1000;

/** Fetch the last 20 commits on the main branch */
export async function getMainCommits({ repo = REPO_NAME, page = '1' }) {
  if (isDev) {
    const now = Date.now();
    const testData = test_commit_data.map((commit, i) => {
      const daysAgo = i + 1;
      const fakeDate = new Date(now - daysAgo * ms24h);
      return {
        ...commit,
        timestamp: fakeDate.toISOString(),
      };
    });
    return testData;
  }

  const baseUrl = `https://api.github.com/repos/atsolberg/${repo}/commits`;
  const commits = [];

  try {
    const url = new URL(baseUrl);
    url.searchParams.set('sha', BRANCH);
    url.searchParams.set('per_page', '100');
    url.searchParams.set('page', page);

    const response = await fetch(url, { headers });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `${response.status} - ${errorData.message || 'Unknown error'}`
      );
    }

    const commitData = await response.json();
    console.log(`commitData:`, commitData);
    for (const commit of commitData) {
      commits.push({
        sha: commit.sha,
        message: commit.commit.message,
        timestamp: commit.commit.committer.date,
        html_url: commit.html_url,
        author: commit.author.login,
      });
    }
  } catch (error) {
    console.error(`Error fetching github commits: ${error.message}`);
  }

  console.log(`commits:`, commits);
  return commits;
}

/** Fetch the last 200 commits on the main branch */
export async function getReleases() {
  const page1 = await getMainCommits({ page: '1' });
  const page2 = await getMainCommits({ page: '2' });
  const page3 = await getMainCommits({ page: '3' });
  const page4 = await getMainCommits({ page: '4' });
  const page5 = await getMainCommits({ page: '5' });
  return [...page1, ...page2, ...page3, ...page4, ...page5].filter(Boolean);
}
