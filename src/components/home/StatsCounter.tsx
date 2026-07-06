"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useIntersection } from "@/hooks/use-intersection";
import { GraduationCap, Users, Calendar, Newspaper, Award, School, Trophy, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

// ==========================================
// Types
// ==========================================
interface StatItem {
  label: string;
  value: number;
  suffix?: string;
  icon?: string;
  prefix?: string;
}

interface StatsCounterProps {
  stats: StatItem[];
  className?: string;
  variant?: "default" | "card" | "minimal";
}

// ==========================================
// Icon Mapping
// ==========================================
const iconMap: Record<string, React.ReactNode> = {
  GraduationCap: <GraduationCap className="h-5 w-5" />,
  Users: <Users className="h-5 w-5" />,
  Calendar: <Calendar className="h-5 w-5" />,
  Newspaper: <Newspaper className="h-5 w-5" />,
  Award: <Award className="h-5 w-5" />,
  School: <School className="h-5 w-5" />,
  Trophy: <Trophy className="h-5 w-5" />,
  BookOpen: <BookOpen className="h-5 w-5" />,
};

// ==========================================
// Animated Number Component
// ==========================================
function AnimatedNumber({
  value,
  suffix = "+",
  prefix = "",
  duration = 2000,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const { ref, isIntersecting } = useIntersection({ threshold: 0.3 });
  const animationRef = useRef<number | null>(null);

  const animate = useCallback(() => {
    if (hasAnimated) return;
    
    const startTime = performance.now();
    
    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (easeOutExpo)
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setCount(Math.floor(eased * value));
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(step);
      } else {
        setCount(value);
        setHasAnimated(true);
      }
    };
    
    animationRef.current = requestAnimationFrame(step);
  }, [value, duration, hasAnimated]);

  useEffect(() => {
    if (isIntersecting && !hasAnimated) {
      animate();
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isIntersecting, animate, hasAnimated]);

  // Reset animation when value changes
  useEffect(() => {
    setHasAnimated(false);
    setCount(0);
  }, [value]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

// ==========================================
// Stats Counter Component
// ==========================================
export function StatsCounter({ stats, className, variant = "default" }: StatsCounterProps) {
  if (!stats || stats.length === 0) return null;

  const variantClasses = {
    default: {
      container: "py-16 bg-muted/30 border-y border-border",
      item: "text-center p-6",
      value: "text-3xl md:text-4xl font-bold text-primary",
      label: "text-sm text-muted-foreground mt-2 font-medium",
    },
    card: {
      container: "py-16",
      item: "text-center p-6 rounded-2xl bg-card border border-border hover:border-primary/20 hover:shadow-lg transition-all duration-300 group",
      value: "text-3xl md:text-4xl font-bold text-foreground group-hover:text-primary transition-colors",
      label: "text-sm text-muted-foreground mt-2 font-medium",
    },
    minimal: {
      container: "py-12",
      item: "text-center p-4",
      value: "text-2xl md:text-3xl font-bold text-foreground",
      label: "text-xs text-muted-foreground mt-1 font-medium uppercase tracking-wider",
    },
  };

  const styles = variantClasses[variant];

  return (
    <section className={cn(styles.container, className)}>
      <div className="container-custom">
        <div
          className={cn(
            "grid gap-6 sm:gap-8",
            stats.length <= 2
              ? "grid-cols-2 max-w-lg mx-auto"
              : stats.length === 3
                ? "grid-cols-3 max-w-2xl mx-auto"
                : "grid-cols-2 md:grid-cols-4"
          )}
        >
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={cn(
                styles.item,
                "animate-fade-in"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon (if provided) */}
              {stat.icon && iconMap[stat.icon] && (
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-xl bg-primary/10 text-primary">
                  {iconMap[stat.icon]}
                </div>
              )}

              {/* Animated Value */}
              <div className={styles.value}>
                <AnimatedNumber
                  value={stat.value}
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                />
              </div>

              {/* Label */}
              <div className={styles.label}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}