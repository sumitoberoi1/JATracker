const dbConnection = require("./mongoConnection");

function getCollectionFn(collection) {
	let _col = undefined;

	return async function () {
		if (!_col) {
			const db = await dbConnection();
			_col = await db.collection(collection);
		}

		return _col;
	};
};

module.exports = {
	users: getCollectionFn("users")
}