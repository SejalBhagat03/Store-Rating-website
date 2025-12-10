import React from "react";
import { Star } from "lucide-react";

interface RatingDisplayProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  count?: number;
}

export function RatingDisplay({ rating, size = "md", count }: RatingDisplayProps) {
  const starSize = size === "sm" ? 14 : size === "lg" ? 26 : 20;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={starSize}
          className={i <= Math.round(rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-400"}
        />
      ))}
      {typeof count === "number" && (
        <span className="text-xs text-muted-foreground ml-1">({count})</span>
      )}
    </div>
  );
}

/* ============================================================
   Interactive star rating (click-based)
   ============================================================ */
interface StarRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onRatingChange?: (value: number) => void;
}

export function StarRating({
  rating,
  size = "md",
  interactive = false,
  onRatingChange,
}: StarRatingProps) {
  const starSize = size === "sm" ? 16 : size === "lg" ? 28 : 22;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={starSize}
          className={
            i <= rating
              ? "text-yellow-500 fill-yellow-500 cursor-pointer"
              : "text-gray-400 cursor-pointer"
          }
          onClick={() => interactive && onRatingChange && onRatingChange(i)}
        />
      ))}
    </div>
  );
}

/* ============================================================
   FIXED: Missing StarRatingInput Component
   Used in UserRatings.tsx
   ============================================================ */

interface StarRatingInputProps {
  value: number;
  onChange: (value: number) => void;
}

export function StarRatingInput({ value, onChange }: StarRatingInputProps) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={24}
          className={
            i <= value
              ? "text-yellow-500 fill-yellow-500 cursor-pointer"
              : "text-gray-400 cursor-pointer"
          }
          onClick={() => onChange(i)}
        />
      ))}
    </div>
  );
}
