import { cn } from "@/lib/utils";

interface NexusLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  animate?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-12 w-12",
  xl: "h-16 w-16",
};

const textSizeClasses = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
  xl: "text-4xl",
};

export function NexusLogo({
  size = "md",
  showText = true,
  animate = false,
  className,
}: NexusLogoProps) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div
        className={cn(
          "relative rounded-xl flex items-center justify-center overflow-hidden",
          "bg-gradient-to-br from-nexus-500 via-nexus-600 to-nexus-700",
          "shadow-lg shadow-nexus-500/25",
          sizeClasses[size],
          animate &&
            "animate-pulse hover:animate-none transition-all duration-500",
        )}
      >
        {/* Animated background particles */}
        {animate && (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2s_infinite]" />
            <div className="absolute top-1 left-1 w-1 h-1 bg-white/40 rounded-full animate-ping" />
            <div className="absolute bottom-1 right-1 w-0.5 h-0.5 bg-white/30 rounded-full animate-pulse" />
          </>
        )}

        {/* Main logo content */}
        <div className="relative z-10 flex items-center justify-center group">
          {/* Stylish N+X fusion logo */}
          <svg
            viewBox="0 0 28 28"
            className={cn(
              "text-white drop-shadow-sm transition-all duration-500",
              size === "sm" && "w-4 h-4",
              size === "md" && "w-6 h-6",
              size === "lg" && "w-8 h-8",
              size === "xl" && "w-12 h-12",
              animate &&
                "animate-logo-morph group-hover:animate-none group-hover:scale-110 group-hover:rotate-12",
            )}
            fill="currentColor"
          >
            {/* N letter - left vertical line */}
            <rect
              x="3"
              y="3"
              width="3.5"
              height="22"
              fill="currentColor"
              className={cn(
                "transition-all duration-300",
                animate && "animate-slide-up group-hover:animate-none",
              )}
              style={{ animationDelay: "0.1s" }}
            />

            {/* N letter - right vertical line */}
            <rect
              x="21.5"
              y="3"
              width="3.5"
              height="22"
              fill="currentColor"
              className={cn(
                "transition-all duration-300",
                animate && "animate-slide-up group-hover:animate-none",
              )}
              style={{ animationDelay: "0.2s" }}
            />

            {/* N diagonal + X fusion - this is where the magic happens */}
            <g
              className={
                animate
                  ? "animate-diagonal-slide group-hover:animate-nexus-connection"
                  : ""
              }
            >
              {/* Main diagonal (N's diagonal + X's first line) */}
              <path
                d="M6.5 3 L25 21.5 L21.5 25 L6.5 9.5 L6.5 3 Z"
                fill="currentColor"
                className="transition-opacity duration-300 group-hover:opacity-90"
              />

              {/* X's second diagonal */}
              <path
                d="M21.5 3 L25 6.5 L6.5 25 L3 21.5 L21.5 3 Z"
                fill="currentColor"
                opacity="0.8"
                className="transition-opacity duration-300 group-hover:opacity-100"
              />
            </g>

            {/* Central nexus point - the connection hub */}
            <circle
              cx="14"
              cy="14"
              r="2"
              fill="currentColor"
              className={cn(
                "transition-all duration-300",
                animate && "animate-nexus-connection group-hover:animate-glow",
              )}
            />

            {/* Connection network dots */}
            {animate && (
              <g className="opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                <circle
                  cx="7"
                  cy="7"
                  r="1"
                  className="animate-ping"
                  style={{ animationDelay: "0.8s" }}
                />
                <circle
                  cx="21"
                  cy="7"
                  r="1"
                  className="animate-ping"
                  style={{ animationDelay: "1s" }}
                />
                <circle
                  cx="7"
                  cy="21"
                  r="1"
                  className="animate-ping"
                  style={{ animationDelay: "1.2s" }}
                />
                <circle
                  cx="21"
                  cy="21"
                  r="1"
                  className="animate-ping"
                  style={{ animationDelay: "1.4s" }}
                />

                {/* Connection lines that appear on hover */}
                <g className="opacity-0 group-hover:opacity-40 transition-opacity duration-500">
                  <line
                    x1="7"
                    y1="7"
                    x2="14"
                    y2="14"
                    stroke="currentColor"
                    strokeWidth="0.5"
                  />
                  <line
                    x1="21"
                    y1="7"
                    x2="14"
                    y2="14"
                    stroke="currentColor"
                    strokeWidth="0.5"
                  />
                  <line
                    x1="7"
                    y1="21"
                    x2="14"
                    y2="14"
                    stroke="currentColor"
                    strokeWidth="0.5"
                  />
                  <line
                    x1="21"
                    y1="21"
                    x2="14"
                    y2="14"
                    stroke="currentColor"
                    strokeWidth="0.5"
                  />
                </g>
              </g>
            )}
          </svg>
        </div>
      </div>

      {showText && (
        <span
          className={cn(
            "font-bold bg-gradient-to-r from-nexus-600 to-nexus-700 bg-clip-text text-transparent",
            "tracking-tight",
            textSizeClasses[size],
            animate &&
              "hover:from-nexus-500 hover:to-nexus-600 transition-all duration-300",
          )}
        >
          Nexus
        </span>
      )}
    </div>
  );
}

// Add shimmer animation to global CSS
const shimmerKeyframes = `
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
`;

// This will be added to global.css if needed
export { shimmerKeyframes };
