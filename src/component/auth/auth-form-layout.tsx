import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { UN_AUTH_ROUTES } from "../../router/public-routes";
import AnimateOnScroll from "../common/animate-on-scroll";
import Logo from "../logo";
import { cn } from "../../lib/utils";

type AuthFormLayoutProps = {
  children: ReactNode;
  centeredLogo?: boolean;
  className?: string;
};

function AuthFormLayout({ children, centeredLogo = false, className }: AuthFormLayoutProps) {
  return (
    <div
      className={cn(
        "flex min-h-full w-full flex-col justify-center py-10",
        centeredLogo ? "px-6 sm:px-10" : "px-6 sm:px-10 lg:px-14 xl:px-20",
        className,
      )}
    >
      <div className={cn("mx-auto w-full", centeredLogo ? "max-w-lg" : "max-w-xl sm:max-w-2xl")}>
        <AnimateOnScroll immediate variant="fade-in" className={cn("mb-10 w-full", centeredLogo ? "flex justify-center" : "inline-flex w-fit")}>
          <Link to={UN_AUTH_ROUTES.HOME} className="inline-flex transition-opacity duration-300 hover:opacity-90">
            <Logo animated />
          </Link>
        </AnimateOnScroll>

        <AnimateOnScroll immediate variant="fade-up" delay={100} className="w-full">
          {children}
        </AnimateOnScroll>
      </div>
    </div>
  );
}

export default AuthFormLayout;
