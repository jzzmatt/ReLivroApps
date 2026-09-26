type ProfileStatsProps = {
  books: number;
  reviews: number;
  rating: number;
  labels: {books: string; reviews: string; rating: string};
};

export function ProfileStats({books, reviews, rating, labels}: ProfileStatsProps) {
  return (
    <div className="profile-stats">
      <div>
        <strong>{books}</strong>
        <span>{labels.books}</span>
      </div>
      <div>
        <strong>{reviews}</strong>
        <span>{labels.reviews}</span>
      </div>
      <div>
        <strong>{rating ? rating.toFixed(1) : "—"}</strong>
        <span>{labels.rating}</span>
      </div>
    </div>
  );
}
