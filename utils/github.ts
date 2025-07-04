import axios from 'axios';

export async function fetchGitHubData(githubUrl: string) {
  const username = githubUrl.split('/').pop();
  const baseUrl = 'https://api.github.com';
  
  try {
    // Get user info
    const userResponse = await axios.get(`${baseUrl}/users/${username}`);
    
    // Get repositories
    const reposResponse = await axios.get(`${baseUrl}/users/${username}/repos?sort=updated&per_page=10`);
    
    // Get languages for top repos
    const topRepos = reposResponse.data.slice(0, 5);
    const repoDetails = await Promise.all(
      topRepos.map(async (repo: any) => {
        const langResponse = await axios.get(`${baseUrl}/repos/${username}/${repo.name}/languages`);
        return {
          name: repo.name,
          description: repo.description,
          stars: repo.stargazers_count,
          languages: Object.keys(langResponse.data),
          lastUpdated: repo.updated_at
        };
      })
    );
    
    return {
      profile: userResponse.data,
      repositories: repoDetails,
      totalRepos: userResponse.data.public_repos
    };
  } catch (error) {
    throw new Error(`GitHub API error: ${error}`);
  }
} 