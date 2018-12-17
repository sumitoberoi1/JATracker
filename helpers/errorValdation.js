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

const errorMessage = {
    
}

module.exports = {
    dataValidString,
    dataValidArray,
    dataValidObject,
    arrayContainsObject,
    arrayContainsObjectsWithKeys,
    isValidFilePath,
    isValidApplicationData
}