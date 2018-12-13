const mongoCollections = require("../config/mongoCollections");
const applications = mongoCollections.applications;
const uuid = require('uuid/v4');
const createApplication = async (applicationData) => {
    const applicationCollection = await applications();
    const {companyName,role,applyDate,applicationStatus,
        jobSource,resume,coverletter,notes} = applicationData
    const newApplication = {
        companyName: companyName,
        jobrole: role,
        appliedDate: applyDate,
        applicationStatus:applicationStatus,
        jobSource:jobSource,
        resume:resume,
        coverletter:coverletter,
        notes:notes,
        _id: uuid()
    };
    const newApplicationMongo = await applicationCollection.insertOne(newApplication);
    const newId = newApplicationMongo.insertedId;
    return await getApplicationByID(newId);
}
const getApplicationByID = async (id) => {
    const applicationCollection = await applications();
    const application = await applicationCollection.findOne({
        _id: id
    });
    if (!application) throw "Application not found";
    return application;
}

const editApplication = async (id, updatedApplicationData) => {
    const query = {
        _id: id
    };
    const applicationCollection = await applications();
    await applicationCollection.updateOne(query, {
        $set: updatedRecipeData
    });
    return await getRecipeByID(id);
}

const getAllApplications = async() => {
    const applicationCollection = await applications();
    return await applicationCollection.find({}).toArray();
}
const deleteApplication = async(id) => {
    const applicationCollection = await applications();
    const deletionInfo = await applicationCollection.removeOne({ _id: id });
    if (deletionInfo.deletedCount === 0) {
        throw `Could not delete post with id of ${id}`;
    } 
}
module.exports = {
    createApplication,
    getApplicationByID,
    getAllApplications,
    editApplication,
    deleteApplication
}