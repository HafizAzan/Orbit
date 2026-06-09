import { useEffect, useRef, useState, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "../../lib/utils";

type AnimationVariant = "fade-up" | "fade-in" | "fade-left" | "fade-right" | "scale-in";

const variantClasses: Record<AnimationVariant, string> = {
  "fade-up": "animate-fade-in-up",
  "fade-in": "animate-fade-in",
  "fade-left": "animate-fade-in-left",
  "fade-right": "animate-fade-in-right",
  "scale-in": "animate-scale-in",
};

type AnimateOnScrollProps = ComponentPropsWithoutRef<"div"> & {
  variant?: AnimationVariant;
  delay?: number;
  immediate?: boolean;
  children: ReactNode;
};

function AnimateOnScroll({
  variant = "fade-up",
  delay = 0,
  immediate = false,
  className,
  children,
  ...props
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(immediate);

  useEffect(() => {
    if (immediate) {
      setVisible(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      { threshold: 0.12, rootMargin: "0px 0px -48px 0px" },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [immediate]);

  return (
    <div
      ref={ref}
      className={cn(!visible && "opacity-0", visible && variantClasses[variant], className)}
      style={visible && delay > 0 ? { animationDelay: `${delay}ms` } : undefined}
      {...props}
    >
      {children}
    </div>
  );
}

export default AnimateOnScroll;
export type { AnimationVariant, AnimateOnScrollProps };
