const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const recipes = data.recipes;
const comments = data.comments;

async function main() {
  const db = await dbConnection();
  await db.dropDatabase();

  // await recipes.addRecipe("Fried Eggscscc",
  //   [{ name: "bnnnnnn", amount: "ddddddddddddddd" }, { name: "Oliddddd Oil", amount: "2 tbsdddddp" }],
  //  ["First, heat a non-stick pan on medium-high until hot",
  //    "Add the oil to the pan and allow oil to warm; it is ready the oil immediately sizzles upon contact with a drop of water.",
  //    "Crack the egg and pdddlace the egg and yolk in a small prep bowl; do not crack the yolk!",
  //    "Gently pour the egg from the bowl onto the oil",
  //    "Wait for egg white to turn bubbly and completely opaque (approx 2 min)",
  //    "Using a spatula, flip the egg onto its uncooked side until it is completely cooked (approx 2 min)",
  //    "Remove from oil and plate",
  //    "Repeat for second egg"]);
	  
	  
	  
// 	  await recipes.addRecipe("name":"Nitish", "profile_id":"4fe600d5-21f8-4e33-8536-936aa83dc708", "email":"user@abc.com", "school":"Stevens Institute of Technology", "present_job":"IBM", "skills":[ "Java", "Python", "Node JS" ], "projects":[ "Stock Market Analyser", "Database Performance Tuner" ], "resume":"https://s3-amazon.com/user/user_resume.pdf", "past_experience":[ "IBM 3 Years Java Application Developer", "Oracle 1 Year Web Developer" ], "cover_letter":"https://s3-amazon.com/user/cover_letter.pdf", "social_profiles":[ { "site":"Linkedin", "link":"https://www.linkedin.com/in/user-name81sd407a40/"
// }, { "site":"GitHub", "link":"https://www.github.com/in/user-344/" } ], "job_ids":[ "f79c0103-4c09-46a3-aee9-656ea65e4a3a", "e2c48623-98cb-42ca-b015-9a2eef2ea82d", "89d3e9ae-26a5-49d6-b860-47b98c3769ca" ] });

await recipes.add("job", { "_id":"a5ecf7ab-1021-4d87-85a8-d70148d097e9"}
,{ company_name:"IBM"}, {job_role:"Database engineer"});

  console.log("Done seeding database");
  await db.close();
}

main();

