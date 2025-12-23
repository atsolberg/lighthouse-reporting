import { useRouteLoaderData } from 'react-router';

/**
 * Return all data from the root route loader
 */
export default function useRootData() {
  return useRouteLoaderData('root');
}
