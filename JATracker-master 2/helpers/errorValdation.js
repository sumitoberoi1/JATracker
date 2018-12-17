const dataNotNULL = (element) => {
    return element
}
const dataTypes = {
    string:'string',
    object:'object'

}
const dataValidString = (element) => {
    return (dataNotNULL(element) && typeof element === dataTypes.string)
}

const dataValidArray = (element) => {
    return (dataNotNULL(element) && typeof element === dataTypes.object && Array.isArray(element) && element.length > 0)
}

const dataValidObject = (element) => {
    return (dataNotNULL(element) && typeof element === dataTypes.object)
}

const arrayContainsObject = (array) => {
    for (const element of array) {
        if (!dataValidObject(element)) {
            return false;
        }
    }
    return true;
}

const isValidFilePath = (path) => {
    return path === 'doc' || path === 'docx' || path === 'pdf'
}
const isValidDate = (dateString) => {
    if (dataNotNULL(dateString) && typeof dateString === dataTypes.string) {
        const date = new Date(dateString)
        if (isNaN(date.getMonth())) {
            return false
         }
         else
         {
            return true
         }
    } else {
        return false
    }
}

const isValidApplicationData = (data) => {
    const {
        companyName,
        role,
        applyDate,
        applicationStatus,
        jobSource,
        notes
    } = data;
    console.log(`Instance of date ${typeof applyDate}`)
    if (dataValidString(companyName) && dataValidString(role) && dataValidString(applicationStatus) && dataValidString(jobSource) && isValidDate(applyDate)) {
        if (notes) {
            if (dataValidString(notes)) {
                return true
            } else {
                return false
            }
        } else {
            return true
        }
    } else {
        return false
    }
}

const objectContainsKeys = (object,params) => {
    for (const key of params) {
        if (!object.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}

const arrayContainsObjectsWithKeys = (array,params) => {
    if (!dataValidArray(array)) {
        return false;
    }
    for (const element of array) {
        if (!dataValidObject(element) || !objectContainsKeys(element,params)) {
            return false;
        }
    }
    return true;
}

const isValidWorkExperienceData = (data) => {
    const {
        _id,
        jobTittle,
        employer,
        startDate,
        endDate,
        location,
        description
    } = data;
    console.log(`Instance of date ${typeof startDate}`)
    if (endDate) {
        console.log(`Instance of date ${typeof endDate}`)
    }
    if (dataValidString(_id) && dataValidString(jobTittle) && dataValidString(employer) && isValidDate(startDate) && dataValidString(location)) {
        if (description) {
            if (dataValidString(description)) {
                return true
            } else {
                return false
            }
        } 
        if (endDate) {
            if (isValidDate(endDate)) {
                return true
            }
            else {
                return false
            }
        }
        return true
    } else {
        return false
    }
}

const isValidProjectData = (data) => {
    const {
        _id,
        name,
        position,
        startDate,
        endDate,
        description,
    } = data;
    console.log(`Instance of date ${typeof startDate}`)
    console.log(`Instance of date ${typeof endDate}`)
    if (dataValidString(_id) && dataValidString(name) && dataValidString(position) && isValidDate(startDate) && isValidDate(endDate)) {
        if (description) {
            if (dataValidString(description)) {
                return true
            } else {
                return false
            }
        } else {
            return true
        }
    } else {
        return false
    }
}


const isValidProfiletData = (data) => {
    const {
        fullName,
        school,
        skills,
        presentJob,
        gitHubLink,
        linkedinLink,
        stackOverflowLink,
        workExperience,
        projects
    } = data;
    if (dataValidString(fullName) && dataValidString(school)) {
        if(skills) {
            if (dataValidString(skills)) {
                return true
            } else {
                return false
            }
        }
        if(presentJob) {
            if (dataValidString(presentJob)) {
                return true
            } else {
                return false
            }
        } 
        if(gitHubLink) {
            if (dataValidString(gitHubLink)) {
                return true
            } else {
                return false
            }
        }
        if(linkedinLink) {
            if (dataValidString(linkedinLink)) {
                return true
            } else {
                return false
            }
        } 
        if(stackOverflowLink) {
            if (dataValidString(stackOverflowLink)) {
                return true
            } else {
                return false
            }
        }
        if(workExperience) {
            if (dataValidArray(workExperience)) {
                return true
            } else {
                return false
            }
        }
        if(projects) {
            if (dataValidArray(projects)) {
                return true
            } else {
                return false
            }
        }
        return true
    } else {
        return false
    }
}

const errorMessage = {
    
}

module.exports = {
    dataValidString,
    dataValidArray,
    dataValidObject,
    arrayContainsObject,
    arrayContainsObjectsWithKeys,
    isValidFilePath,
    isValidApplicationData,
    isValidWorkExperienceData,
    isValidProjectData,
    isValidProfiletData

}