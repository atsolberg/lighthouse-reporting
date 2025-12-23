import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';
import './app.css';
import logo from '~/assets/logo-180x180.png';
import { cn } from '~/lib/utils';
import PageLinks from '~/components/PageLinks';

export const loader = async () => {
  return { isProd: process.env.NODE_ENV === 'production' };
};

export default function App() {
  return (
    <html lang="en" className="dark h-full text-slate-200 bg-gray-950">
      <head>
        <title>Lighthouse Reporting for acmecorp.com</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>

      <body className="h-full">
        <header
          className={cn(
            'container mx-auto',
            'flex flex-col p-4 gap-2',
            'md:items-center md:flex-row md:justify-between'
          )}
        >
          <div className="flex items-center gap-4">
            <img src={logo} alt="logo" className="h-8" />
            <h1 className="font-medium text-2xl">Lighthouse Monitoring</h1>
          </div>

          <PageLinks />
        </header>

        <Outlet />

        <footer
          className={cn(
            'container mx-auto',
            'flex items-center gap-4 p-4 mt-4'
          )}
        >
          © 2000 - 2025 Acme Corporation
        </footer>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
