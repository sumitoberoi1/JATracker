/* Reference: Lecture Code */
const dbConnection = require("./mongoConnection");

/* This will allow you to have one reference to each collection per app */
/* Feel free to copy and paste this this */
const getCollectionFn = collection => {
  let _col = undefined;

  return async () => {
    try {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
      }
      return _col;
    } catch (e) {
      throw e
    }
  };
};

/* Now, you can list your collections here: */
module.exports = {
  applications: getCollectionFn("applications"),
  users: getCollectionFn("users")
};