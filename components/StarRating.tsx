"use client";

type StarRatingProps = {
  value: number;
  max?: number;
  onChange?: (value: number) => void;
  label?: string;
};

export function StarRating({value, max = 5, onChange, label}: StarRatingProps) {
  const interactive = !!onChange;

  return (
    <div className="star-rating" role={interactive ? "group" : "img"} aria-label={label}>
      {Array.from({length: max}, (_, i) => {
        const star = i + 1;
        const filled = star <= value;
        if (interactive) {
          return (
            <button
              key={star}
              type="button"
              className={"star-button " + (filled ? "filled" : "")}
              aria-label={`${star}/${max}`}
              aria-pressed={filled}
              onClick={() => onChange?.(star)}
            >
              ★
            </button>
          );
        }
        return (
          <span key={star} className={filled ? "star-filled" : "star-empty"} aria-hidden>
            ★
          </span>
        );
      })}
    </div>
  );
}
