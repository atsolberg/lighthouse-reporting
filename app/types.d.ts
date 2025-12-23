/** Node namespace */
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      FLY_REGION?: string;
      FLY_MACHINE_ID?: string;
      INTERNAL_PORT?: string;
      PROXY_TARGET?: string;
      CI: boolean;
      PORT?: string;
      LITEFS_DIR?: string;
      SESSION_SECRET?: string;
    }
  }
}

declare global {
  /* Utility Types --------------------------------------------------------- */

  // A type that takes a Record and produces a new type that requires at least
  // one property of that type.
  type AtLeastOne<T, K extends keyof T = keyof T> = Partial<T> &
    { [P in K]: Required<Pick<T, P>> }[K];

  // Use to type a React useState call.
  type useState<T> = [T, React.Dispatch<T>];

  /* END Utility Types ----------------------------------------------------- */

  /* Application Types ----------------------------------------------------- */

  type Target =
    | 'https://www.acmecorp.com'
    | 'https://www.acmecorp.com?skip3p'
    | 'https://www.acmecorp.com/categories/beds-on-sale'
    | 'https://www.acmecorp.com/categories/beds-on-sale?skip3p'
    | 'https://www.acmecorp.com/categories/bedding'
    | 'https://www.acmecorp.com/categories/bedding?skip3p'
    | 'https://www.acmecorp.com/categories/mattresses'
    | 'https://www.acmecorp.com/categories/mattresses?skip3p'
    | 'https://www.acmecorp.com/categories/mattresses-performance-series?tab=config'
    | 'https://www.acmecorp.com/categories/mattresses-performance-series?tab=config&skip3p'
    | 'https://www.acmecorp.com/products/c2'
    | 'https://www.acmecorp.com/products/c2?skip3p'
    | 'https://www.acmecorp.com/products/lyocell-ultra-sheets-set'
    | 'https://www.acmecorp.com/products/lyocell-ultra-sheets-set?skip3p';

  /** Lighthouse score report */
  type Report = {
    id: string;
    target: Target;
    score: number;
    ttfb?: number | null;
    lcp?: number | null;
    createdAt: Date;
  };
}
