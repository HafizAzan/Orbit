import type { ReactNode } from "react";
import AnimateOnScroll from "../common/animate-on-scroll";
import { Text } from "../ui/typography";

type AuthPageShellProps = {
  children: ReactNode;
};

function AuthPageShell({ children }: AuthPageShellProps) {
  return (
    <div className="relative flex min-h-screen flex-col items-center bg-background px-6 py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 h-80 w-80 rounded-full bg-primary/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 bottom-0 h-80 w-80 rounded-full bg-secondary/15 blur-3xl"
      />

      <div className="relative z-10 flex w-full max-w-xl flex-1 flex-col justify-center sm:max-w-2xl">{children}</div>

      <AnimateOnScroll immediate variant="fade-in" delay={200}>
        <Text as="p" size="sm" color="muted" className="relative z-10 mt-10 text-center">
          © {new Date().getFullYear()} Orbit Technologies Inc. All rights reserved.
        </Text>
      </AnimateOnScroll>
    </div>
  );
}

export default AuthPageShell;
