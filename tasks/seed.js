const dbConnection = require("../config/mongoConnection");
const data = require("../data/users");
const users = data.users;


async function main() {
  const db = await dbConnection();
  await db.dropDatabase();


await data.signUp("patrickhill","greatteacher","patrick.hill@stevens.edu");

  console.log("Done seeding database");
 
  await db.serverConfig.close();
}

main();

