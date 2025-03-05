class ReviewDTO {
  constructor(category, title, rating, comment, createdAt, updatedAt) {
    this.product = {
      category: category,
      title: title,
    };
    this.rating = rating;
    this.comment = comment;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

module.exports = ReviewDTO;
