import { getReleases } from '~/vendor/github';

export const loader = async () => {
  const commits = await getReleases();
  return commits || [];
};
