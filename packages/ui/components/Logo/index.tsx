import { cn } from "@heroui/react";

export interface CasaBoardLogoProps {
  className?: string;
  size?: "small" | "medium" | "large";
  variant?: "light" | "dark";
  stacked?: boolean;
  showText?: boolean;
  iconOnly?: boolean;
}

/**
 * CasaBoard Logo Component
 * 
 * Usage examples:
 * - Header: <CasaBoardLogo variant="dark" size="small" />
 * - Login page: <CasaBoardLogo size="large" variant="light" stacked={true} />
 * - Icon only: <CasaBoardLogo iconOnly={true} size="small" />
 * - Dark theme: <CasaBoardLogo variant="dark" size="medium" />
 */

export const CasaBoardLogo = ({ 
  className, 
  size = "medium", 
  variant = "light", 
  stacked = false,
  showText = true,
  iconOnly = false
}: CasaBoardLogoProps) => {
  // Size configurations
  const sizeConfig = {
    small: {
      iconSize: "w-6 h-6 sm:w-8 sm:h-8",
      svgSize: 16,
      textSize: "text-xs sm:text-sm",
      subtitleSize: "text-xs",
      gap: "gap-1 sm:gap-2"
    },
    medium: {
      iconSize: "w-10 h-10",
      svgSize: 24,
      textSize: "text-lg",
      subtitleSize: "text-xs",
      gap: "gap-3"
    },
    large: {
      iconSize: "w-20 h-20",
      svgSize: 48,
      textSize: "text-3xl",
      subtitleSize: "text-sm",
      gap: "gap-4"
    }
  };

  const config = sizeConfig[size];

  // Variant configurations
  const variantConfig = {
    light: {
      iconBg: "bg-gray-800",
      iconText: "text-gray-300",
      textColor: "text-gray-800",
      subtitleColor: "text-gray-500"
    },
    dark: {
      iconBg: "bg-white",
      iconText: "text-gray-800",
      textColor: "text-white",
      subtitleColor: "text-gray-300"
    }
  };

  const variantStyles = variantConfig[variant];

  return (
    <div className={cn("flex items-center", {
      "flex-col": stacked,
      "flex-row": !stacked,
      [config.gap]: !iconOnly,
      "text-center": stacked,
      "text-left": !stacked,
    }, className)}>
      {/* Logo Icon */}
      <div className="relative">
        <div className={cn(
          config.iconSize,
          variantStyles.iconBg,
          "rounded-xl flex items-center justify-center shadow-sm"
        )}>
          <svg
            width={size === "small" ? "16" : config.svgSize}
            height={size === "small" ? "16" : config.svgSize}
            viewBox="0 0 48 48"
            fill="none"
            className={cn(variantStyles.iconText, {
              "w-4 h-4 sm:w-5 sm:h-5": size === "small"
            })}
          >
            {/* House structure */}
            <path
              d="M8 20L24 8L40 20V38C40 39.1046 39.1046 40 38 40H10C8.89543 40 8 39.1046 8 38V20Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Window */}
            <rect x="32" y="26" width="6" height="6" rx="1" fill="#00C8F5" />
          </svg>
        </div>
        {/* Subtle glow effect */}
        <div className={cn(
          "absolute inset-0",
          config.iconSize,
          "bg-cyan-400 rounded-xl opacity-10 blur-sm"
        )}></div>
      </div>
      
      {/* Brand name - only show if not iconOnly and showText is true */}
      {!iconOnly && showText && (
        <div className="flex flex-col">
          <h1 className={cn(
            config.textSize,
            "font-bold tracking-tight leading-none",
            variantStyles.textColor
          )}>
            CasaBoard
          </h1>
          <p className={cn(
            config.subtitleSize,
            "leading-none font-medium",
            variantStyles.subtitleColor,
            {
              "hidden xs:block": size === "small"
            }
          )}>
            Cloud-Hosted HA Dashboard
          </p>
        </div>
      )}
    </div>
  );
}