import { createReport, deleteReport } from '~/models/report.server';
import { createLastReportStats } from '~/models/latest-report-stats.server';

export const action = async ({ request }) => {
  const method = request.method;
  const body = await request.json();

  if (method === 'POST') {
    if (!body.score || !body.target) {
      throw new Response('Missing "score" and "target" in request body', {
        status: 400,
      });
    }

    const ttfb = body.stats?.ttfb?.value;
    const lcp = body.stats?.lcp?.value;
    const fcp = body.stats?.fcp?.value;
    const createdAt = body.createdAt;

    const spec = {
      target: body.target,
      score: body.score,
      ...(ttfb && typeof ttfb === 'number' ? { ttfb } : {}),
      ...(lcp && typeof lcp === 'number' ? { lcp } : {}),
      ...(fcp && typeof fcp === 'number' ? { fcp } : {}),
      ...(createdAt && Number.isInteger(createdAt) ? { createdAt } : {}),
    };

    const report = await createReport(spec);
    try {
      const stats = await createLastReportStats({
        target: body.target,
        rawStats: JSON.stringify(body.stats),
      });
      console.log(`stats created:`, stats);
    } catch (err) {
      console.log(`stats creation failed:`, err);
    }

    return report;
  }

  if (method === 'DELETE') {
    if (!body.id) {
      throw new Response('Missing "id" in request body', { status: 400 });
    }
    const result = await deleteReport(body);
    return { deleted: result.count };
  }
};
