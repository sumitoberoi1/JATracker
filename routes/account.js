const express = require("express");
const router = express.Router();
const userData = require("../data/users");
const fs = require("fs");
const { getUserFromCookie } = require("../public/js/cookieFunctions");


function noUserError(res) 
{
	let errorNum = 403;

	let data = {
		errorNum: errorNum,
		description: "User not logged in yet."
	};

	res.status(errorNum).render("error", data);
}

router.get("/", async (req, res) => {
	let user = await getUserFromCookie(req);
	
	if (user) {
		reviews = await reviewData.getReviewsByUser(user._id);

		favorites = [];
		for (let i = 0; i < reviews.length; i++) {
			if (reviews[i].rating == 4)
				favorites.push(reviews[i].movie);
		}
        // user profile
		data = {
            data
		}

		res.render("account", data);
	} else {
		noUserError(res);
	}
});