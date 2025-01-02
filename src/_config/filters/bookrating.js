// generate the displayed book rating with stars and '1/2' characters
export const bookRating = (rating) => {
	const fullStar = "★";
	const halfStar = "½";
	const noStar = "";
	let stars = "";
	if (rating === "") {
		return stars;
	}
	for (let i = 1; i <= 5; i++) {
		if (rating - i >= 0) {
			stars += fullStar;
		} else if (rating - i == -0.5) {
			stars += halfStar;
		} else {
			stars += noStar;
		}
	}
	return stars;
};
