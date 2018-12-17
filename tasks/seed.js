const dbConnection = require("../config/mongoConnection");
const data = require("../data/users");
const applications = require("../data/application");

async function main() {
  const db = await dbConnection();
  await db.dropDatabase();
    const user = await data.signUp("patrickhill","greatteacher","patrick.hill@stevens.edu");
    const getUser = await data.getUserByUsername("patrickhill")
    for (let i=1; i<10; i++) {
      const applicationData = 
      {companyName:`Company ${1}`,
      role:`Role ${i}`,
      applyDate:`2008-07-${i+10}`,
      applicationStatus:`Under Review`,
      jobSource:`Source ${i}`,
      notes:`Notes ${i}`}
      try {
      const application = await applications.createApplication(applicationData,getUser._id)
      } catch(e) {
        console.log(`Erro in seed ${e}`)
      }
    }
    await db.serverConfig.close();
}

main();

