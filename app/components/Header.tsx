import {
  useEffect,
  useState,
} from "react";

import Button from "~/components/Button";
import Container from "~/components/Container";

// https://stackoverflow.com/a/51847335/13901135
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;

  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;

  prompt(): Promise<void>;
}

let deferredPrompt: BeforeInstallPromptEvent;
export default function Header({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  const [installable, setInstallable] = useState(false);

  function handleInstallClick() {
    // Hide the app provided install promotion
    setInstallable(false);
    // Show the install prompt
    deferredPrompt.prompt();
  }

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      deferredPrompt = e as any;
      // Update UI notify the user they can install the PWA
      setInstallable(true);
    });
  }, []);

  return (
    <header className={`${className} pt-8`} {...props}>
      <Container>
        <div className="flex flex-row justify-between">
          <a href="." className="text-heading font-bold">
            STAEM
          </a>
          <div className="flex items-center">
            <Button
              onClick={handleInstallClick}
              className="flex flex-row items-center justify-center px-8 py-2 text-base font-bold"
              disabled={!installable}
            >
              <span role="img" aria-label="install" className="mr-3 inline">
                <EntypoInstall className="inline" />
              </span>{" "}
              Install
            </Button>
          </div>
        </div>
      </Container>
    </header>
  );
}

export function EntypoInstall(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 20 20" {...props}>
      <path
        fill="currentColor"
        d="m19.059 10.898l-3.171-7.927A1.543 1.543 0 0 0 14.454 2H12.02l.38 4.065h2.7L10 10.293L4.9 6.065h2.7L7.98 2H5.546c-.632 0-1.2.384-1.434.971L.941 10.898a4.25 4.25 0 0 0-.246 2.272l.59 3.539A1.544 1.544 0 0 0 2.808 18h14.383c.755 0 1.399-.546 1.523-1.291l.59-3.539a4.22 4.22 0 0 0-.245-2.272zm-2.1 4.347a.902.902 0 0 1-.891.755H3.932a.902.902 0 0 1-.891-.755l-.365-2.193A.902.902 0 0 1 3.567 12h12.867c.558 0 .983.501.891 1.052l-.366 2.193z"
      ></path>
    </svg>
  );
}
