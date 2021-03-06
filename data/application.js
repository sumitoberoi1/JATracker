const mongoCollections = require("../config/mongoCollections");
const applications = mongoCollections.applications;
const uuid = require('uuid/v4');
const errorValidator = require('../helpers/errorValdation')
const createApplication = async (applicationData,userID) => {
    const applicationCollection = await applications();
    const {companyName,role,applyDate,applicationStatus,
        jobSource,resume,coverletter,notes} = applicationData
    const jobID = uuid()
    const newApplication = {
        companyName: companyName,
        jobrole: role,
        appliedDate: new Date(applyDate),
        applicationStatus:applicationStatus,
        jobSource:jobSource,
        resume:resume,
        coverletter:coverletter,
        notes:notes,
        _id: jobID,
        userID:userID
    };
    if (errorValidator.isValidApplicationData(applicationData) && errorValidator.dataValidString(jobID) && errorValidator.dataValidString(userID)) {
        await applicationCollection.insertOne(newApplication);
        return await getApplicationByID(jobID,userID);
    } else {
        throw 'Invalid Data'
    }    
}

const getApplicationByID = async (id,userID) => {
    const applicationCollection = await applications();
    const application = await applicationCollection.findOne({
        _id: id,
        userID:userID
    });
    if (!application) { 
        throw "Application not found";
    }
    return application;
}

const editApplication = async (id, updatedApplicationData,userID) => {
    const query = {
        _id: id,
        userID:userID
    };
    const {companyName,role,applyDate,applicationStatus,
        jobSource,resume,coverletter,notes} = updatedApplicationData
    const editApplication = {
        companyName: companyName,
        jobrole: role,
        appliedDate: new Date(applyDate),
        applicationStatus:applicationStatus,
        jobSource:jobSource,
        resume:resume,
        coverletter:coverletter,
        notes:notes,
        userID:userID
    }
    if(errorValidator.isValidApplicationData(updatedApplicationData) && errorValidator.dataValidString(id) && errorValidator.dataValidString(userID)) {
         const applicationCollection = await applications();
        await applicationCollection.updateOne(query, {
            $set: editApplication
        });
        return await getApplicationByID(id,userID);
    } else {
        throw 'Invalid Data'
    }
    
}

const getAllApplications = async(userID) => {
    const applicationCollection = await applications();
    return await applicationCollection.find({userID:userID}).sort({ appliedDate: -1 }).toArray();
}

const getFutureApplications =  async(userID) => {
    const applicationCollection = await applications();
    let query = {userID:userID,appliedDate:{
        $gte: new Date()
    }}

    return await applicationCollection.find(query).sort({ appliedDate: -1 }).toArray();
}
const deleteApplication = async(id,userID) => {
    if (errorValidator.dataValidString(id) && errorValidator.dataValidString(userID)) {
        const applicationCollection = await applications();
        const deletionInfo = await applicationCollection.removeOne({ _id: id,userID:userID });

        if (deletionInfo.deletedCount === 0) {
            throw `Could not delete post with id of ${id}`;
        } 
    } else {
        throw 'Invalid data'
    }
    
}
module.exports = {
    createApplication,
    getApplicationByID,
    getAllApplications,
    editApplication,
    deleteApplication,
    getFutureApplications
}