import { getReports } from '~/models/report.server';

export const loader = async ({ request }) => {
  const params = new URL(request.url).searchParams;
  const target = params.get('target');
  const reports = await getReports([target], Date.now(), 7);

  return { reports };
};
