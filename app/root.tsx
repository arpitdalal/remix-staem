import styles from "./tailwind.css";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLocation,
  useMatches,
} from "@remix-run/react";
import { useEffect } from "react";
import slickThemeStyles from "slick-carousel/slick/slick-theme.css";
import slickStyles from "slick-carousel/slick/slick.css";

import Footer from "~/components/Footer";
import Header from "~/components/Header";

import type { LinksFunction, MetaFunction } from "@remix-run/node";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Noto+Sans:wght@100;200;300;400;500;600;700;800;900&display=swap",
  },
  { rel: "stylesheet", href: styles },
  { rel: "stylesheet", href: slickStyles },
  { rel: "stylesheet", href: slickThemeStyles },
  { rel: "stylesheet", href: "/css/index.css" },
  { rel: "manifest", href: "/resources/manifest.json" },
  {
    rel: "apple-touch-icon",
    sizes: "57x57",
    href: "/icons/apple-icon-57x57.png",
  },
  {
    rel: "apple-touch-icon",
    sizes: "60x60",
    href: "/icons/apple-icon-60x60.png",
  },
  {
    rel: "apple-touch-icon",
    sizes: "72x72",
    href: "/icons/apple-icon-72x72.png",
  },
  {
    rel: "apple-touch-icon",
    sizes: "76x76",
    href: "/icons/apple-icon-76x76.png",
  },
  {
    rel: "apple-touch-icon",
    sizes: "114x114",
    href: "/icons/apple-icon-114x114.png",
  },
  {
    rel: "apple-touch-icon",
    sizes: "120x120",
    href: "/icons/apple-icon-120x120.png",
  },
  {
    rel: "apple-touch-icon",
    sizes: "144x144",
    href: "/icons/apple-icon-144x144.png",
  },
  {
    rel: "apple-touch-icon",
    sizes: "152x152",
    href: "/icons/apple-icon-152x152.png",
  },
  {
    rel: "apple-touch-icon",
    sizes: "180x180",
    href: "/icons/apple-icon-180x180.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "192x192",
    href: "/icons/android-icon-192x192.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "32x32",
    href: "/icons/android-icon-32x32.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "96x96",
    href: "/icons/android-icon-96x96.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "16x16",
    href: "/icons/android-icon-16x16.png",
  },
];

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "STAEM - Remix",
  description:
    "Project made with Remix and Tailwind CSS for the challenge: https://blog.zernonia.com/i-design-you-build-frontend-challenge-4-supabase-version",
  viewport: "width=device-width,initial-scale=1",
  "msapplication-TileColor": "#214B6B",
  "sapplication-TileImage": "/ms-icon-144x144.png",
  "theme-color": "#214B6B",
});

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

let isMount = true;
function Document({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const matches = useMatches();

  useEffect(() => {
    const mounted = isMount;
    isMount = false;
    if ("serviceWorker" in navigator) {
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller?.postMessage({
          type: "REMIX_NAVIGATION",
          isMount: mounted,
          location,
          matches,
          manifest: window.__remixManifest,
        });
      } else {
        let listener = async () => {
          await navigator.serviceWorker.ready;
          navigator.serviceWorker.controller?.postMessage({
            type: "REMIX_NAVIGATION",
            isMount: mounted,
            location,
            matches,
            manifest: window.__remixManifest,
          });
        };
        navigator.serviceWorker.addEventListener("controllerchange", listener);
        return () => {
          navigator.serviceWorker.removeEventListener(
            "controllerchange",
            listener,
          );
        };
      }
    }
  }, [location, matches]);

  return (
    <html lang="en">
      <head>
        <Meta /> <Links />
      </head>
      <body className="bg-background text-text">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <Header /> <main id="main-content">{children}</main> <Footer />
        <ScrollRestoration /> <Scripts /> <LiveReload />
      </body>
    </html>
  );
}

export function CatchBoundary() {
  let { data, status } = useCatch();
  let message = data?.message;
  if (!message) {
    switch (status) {
      case 404:
        message = "Page not found";
        break;
      case 500:
        message = "Internal server error";
        break;
      default:
        message = "Something went wrong";
    }
  }
  return (
    <Document>
      <h1>{message}</h1>
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error("ERROR BOUNDARY", error);
  return (
    <Document>
      <h1>Something went wrong</h1>
    </Document>
  );
}
