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
    arrayContainsObjectsWithKeys
}