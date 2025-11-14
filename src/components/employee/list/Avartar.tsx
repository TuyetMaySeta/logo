import React from "react";

interface UserAvatarProps {
  name: string;
  size?: number;
  fontSize?: number;
  avatarUrl?: string | null;
  backgroundColor?: string;
  textColor?: string;
  className?: string;
  shape?: "circle" | "square" | "rounded";
  maxInitials?: number;
  fallbackSrc?: string;
  onClick?: () => void;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  avatarUrl,
  size = 40,
  fontSize,
  backgroundColor,
  textColor = "#ffffff",
  className = "",
  shape = "circle",
  maxInitials = 2,
  fallbackSrc,
  onClick,
}) => {
  const [imageError, setImageError] = React.useState(false);
  React.useEffect(() => {
    setImageError(false);
  }, [avatarUrl]);
  // Generate initials from name
  const getInitials = (fullName: string): string => {
    if (!fullName) return "?";

    const words = fullName.trim().split(/\s+/);
    let initials = "";

    if (words.length === 1) {
      // Single word: take first character or first two characters
      initials = words[0].substring(0, Math.min(maxInitials, words[0].length));
    } else {
      // Multiple words: take first character of each word up to maxInitials
      for (let i = 0; i < Math.min(words.length, maxInitials); i++) {
        if (words[i] && words[i][0]) {
          initials += words[i][0];
        }
      }
    }

    return initials.toUpperCase();
  };

  // Generate background color from name
  const generateBackgroundColor = (name: string): string => {
    if (backgroundColor) return backgroundColor;

    const colors = [
      "#1f2937", // gray-800
      "#991b1b", // red-800
      "#92400e", // amber-800
      "#166534", // green-800
      "#1e40af", // blue-700
      "#6b21a8", // purple-800
      "#be185d", // pink-700
      "#0f766e", // teal-700
      "#b45309", // orange-700
      "#374151", // gray-700
    ];

    // Simple hash function to consistently map names to colors
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    const colorIndex = Math.abs(hash) % colors.length;
    return colors[colorIndex];
  };

  // Generate shape styles
  const getShapeStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      width: size,
      height: size,
    };

    switch (shape) {
      case "circle":
        return { ...baseStyles, borderRadius: "50%" };
      case "square":
        return { ...baseStyles, borderRadius: "0" };
      case "rounded":
        return { ...baseStyles, borderRadius: "8px" };
      default:
        return { ...baseStyles, borderRadius: "50%" };
    }
  };

  const initials = getInitials(name);
  const bgColor = generateBackgroundColor(name);
  const calculatedFontSize = fontSize || Math.max(12, size * 0.35);

  const avatarStyles: React.CSSProperties = {
    ...getShapeStyles(),
    backgroundColor: bgColor,
    color: textColor,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: `${calculatedFontSize}px`,
    fontWeight: "600",
    fontFamily: "system-ui, -apple-system, sans-serif",
    cursor: onClick ? "pointer" : "default",
    userSelect: "none",
    transition: "all 0.2s ease-in-out",
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const imageSource = avatarUrl || fallbackSrc;
  const shouldShowImage = imageSource && !imageError;

  // If fallback image is provided, try to use it first
  //if (fallbackSrc) {
    return (
    <div
      className={`avatar-container ${className}`}
      style={{ ...getShapeStyles(), position: "relative" }}
      onClick={handleClick}
      title={name}
    >
      {shouldShowImage ? (
        <img
          src={imageSource!}
          alt={name}
          style={{
            ...getShapeStyles(),
            objectFit: "cover",
          }}
          onError={() => {
            console.warn(`Failed to load avatar for: ${name}`);
            setImageError(true);
          }}
        />
      ) : (
        <div style={avatarStyles}>{initials}</div>
      )}
    </div>
  );
};

export default UserAvatar;
