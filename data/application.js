const mongoCollections = require("../config/mongoCollections");
const applications = mongoCollections.applications;
const uuid = require('uuid/v4');
const createApplication = async (applicationData) => {
    const applicationCollection = await applications();
    const {companyName,jobrole,appliedDate,applicationStatus,
        jobSource,resume,coverletter,notes} = applicationData
    const newApplication = {
        companyName: companyName,
        jobrole: jobrole,
        appliedDate: appliedDate,
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
module.exports = {
    createApplication,
    getApplicationByID
}