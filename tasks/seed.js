const dbConnection = require("../config/mongoConnection");
const data = require("../data/users");
const users = data.users;


async function main() {
  const db = await dbConnection();
  await db.dropDatabase();
    const user = await data.signUp("patrickhill","greatteacher","patrick.hill@stevens.edu");
  await db.serverConfig.close();
}

main();

