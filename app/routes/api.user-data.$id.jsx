import { getUserDataReport } from '~/models/user-data';

export const loader = async ({ params }) => {
  const report = await getUserDataReport(params.id);
  return report;
};
