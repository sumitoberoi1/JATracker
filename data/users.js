const mongodb = require("mongodb");
const mongoCollections = require("../config/mongoCollections");
const uuid = require('uuid/v4');
const users = mongoCollections.users;
const bcrypt = require('bcrypt');

const saltRounds = 10;

async function getUserByID(_id) 
{
    if (!_id || typeof _id != 'string')
    {
		throw 'id not vaild';
    }
	
	let userCollection = await users();

	let user = await userCollection.findOne({_id: _id});
	return user;
}

async function getUserByUsername(username) 
{
    try 
    {
        if (!username || typeof username != 'string')
        {
            throw "username not vaild";
        }
		
		let userCollection = await users();

		let user = await userCollection.findOne({username: username}, {fields: {hashedpassword: false, sessionIDs: false}});
		return user;
    } 
    catch (e)
    {
		throw e;
	}
}

async function login(username, password) 
{
    if (!username || typeof username != 'string' || !password || typeof password != 'string')
    {
		throw "Username or passward not valid";
    }
    if (username.length === 0)
    {
        throw "Username is empty"
    }
    if (password.length === 0)
    {
        throw "Passward is empty"
    }
	let userCollection = await users();
	let user = undefined;
    try 
    {
		user = await userCollection.findOne({username: username });
    } 
    catch (e) 
    {
		return false;
	}

    if (user && await bcrypt.compare(password, user.hashedpassword))
    {
		return user;
    }
    else
    {
		return false;
    }
}

async function signUp(username, password, Re_enter_password, email, ) 
{
    if (!username || typeof username != 'string' || !password || typeof password != 'string')
    {
		throw "Username or password not valid";
    }
    if (username.length === 0)
    {
        throw "Username is empty"
    }
    if (password.length === 0)
    {
        throw "Passward is empty"
    }
    if ((await getUserByUsername(username)) != undefined)
    {
        throw "Username already exist"

    }
    if (password !== Re_enter_password)
    {
        throw "Passwords must match"
    }

	let hashedpassword = await bcrypt.hash(password, saltRounds);

	let userCollection = await users();

    let newUser = 
    {
		_id: uuid(),
        username: username,
        passward: password,
        hashedpassword: hashedpassword,
        email: email,
		sessionIDs: []
	};

	await userCollection.insert(newUser)
	return newUser;
}

//Gets all of the ratings that have been submitted by the user.
async function getUserRatings(username) 
{
	//MongoDB stuff
}

async function getUserBySessionID(sID) 
{
    try 
    {
        if (!sID)
        {
			return undefined;
        }
		
		let userCollection = await users();
		let user = await userCollection.findOne({sessionIDs: sID});

		return user;
    } 
    catch (e) 
    {
		throw e;
	}
}

async function addUserSessionID(_id, sID) 
{
	let userCollection = await users();

	return await userCollection.update({_id: _id}, {$push: {sessionIDs: sID}});
}

async function cleanSessionID(sID) 
{
    try 
    {
		let userCollection = await users();
		let currentUser = await getUserByUsername(username);

		let indexOfsID = currentUser.sessionIDs.indexOf(sID);
		let currentsIDs = currentUser.sessionIDs;
		currentsIDs.splice(indexOfsID, 1);

		await userCollection.update({username: username}, {$set: {sessionIDs: currentsIDs}});
		return await userCollection.findOne({ username: username });
    } 
    catch (e) 
    {
		throw e;
	}
}

module.exports = {
	getUserByID,
	getUserByUsername,
	login,
	getUserBySessionID,
	addUserSessionID,
	cleanSessionID,
	signUp
};