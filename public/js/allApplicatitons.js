let allApplications = {}
let oldElement;
const searchBar = $("#SeachApplicationSearchBar")
const allApplicationContainer = $("#allApplicationContainer");
let allDropDownValues = []
let handleBarHTMl;
$(document).ready(()=>{
    //Call get Application
    //Store the application data
    console.log(`Path name ${location.pathname}`)

    if (location.pathname === '/application') {
        getAllApplications('/application/all')
    } else if (location.pathname === '/application/future') {
        getAllApplications('/application/all/future')
    }  
    handleBarHTMl = allApplicationContainer.innerHTML;
    
    allDropDownValues = $('#sort-dropdown').children('a').map(function(i, e){
        return e.value || e.innerText;
    }).get();
})

getAllApplications = (path)  => {
    $.ajax({
        type: "GET",
        url: path,
        success: function(result) {
            allApplications = result.applications
            console.log(`All application ${allApplications}`)
        },
        error: function(result) {
            alert('Errror in fetching application')
        }
    })
}

searchBar.on('input',function(e){
    console.log(`I am changed ${searchBar.val()}`)
    let val = searchBar.val
    if (val.length > 0) {
        const filteredList = getFilteredList()
        allApplicationContainer.html(createHTMLForApplication(filteredList))
    } else {
        allApplicationContainer.html(handleBarHTMl)
    }
});

const getFilteredList = () => {
   return allApplications.filter(application => {
        if (application.companyName.toLowerCase().indexOf(searchBar.val().toLowerCase()) !== -1) {
            return true
        } 
        if (application.jobrole.indexOf(searchBar.val().toLowerCase()) !== -1) {
            return true
        }
    })
}

$('#sort-dropdown a').click((e) => {
    console.log(e.target.innerHTML)
    if (e.target.innerHTML === `Recent Apply Date First`) {
        let filteredList = getFilteredList().sort((first,second) => {
            return first.appliedDate > second.appliedDate
        })
        allApplicationContainer.html(createHTMLForApplication(filteredList))
    } else {
        let filteredList = getFilteredList().filter(application => {
            return application.applicationStatus === e.target.innerHTML 
        })
        allApplicationContainer.html(createHTMLForApplication(filteredList))
    }
})
createHTMLForApplication =  (fileteredApplications) => {
    let createHTML = `<ul class="list-group">`
    fileteredApplications.forEach(application => {
        createHTML += `<li class="list-group-item">\n`
        createHTML += `<div class="card">`
        createHTML += `<div class="card-header">\n`
        createHTML += `<h2 class="card-title">${application.companyName}</h2>\n`
        createHTML += `</div>\n`
        createHTML += `<div class="card-body">\n`
        createHTML += `<h3 class="card-subtitle mb-2 text-mutedcard-subtitle mb-2 text-muted">Role:
        ${application.jobrole}</h3>\n`
        createHTML += `<p class="card-text">Status: ${application.applicationStatus}</p>\n`
        createHTML += `<p class="card-text">Source: ${application.jobSource}</p>\n`
        createHTML += `<p class="card-text">Applied On/To Apply Date: ${application.appliedDate}</p>\n`
        createHTML += `</div>\n`
        createHTML += `<div class="card-footer">\n`
        if (application.resume) {
            createHTML += `<a href="${application.resume.path}" download="${application.resume.originalname}" class="card-link">Resume</a>`
        }
        if (application.coverletter) {
            createHTML += `<a href="${application.coverletter.path}" download="${application.coverletter.originalname}" class="card-link">Cover
            Letter</a>`
        }
        createHTML += `<a href="/application/edit/"${application._id} class="card-link">Edit Application</a> \n`
        createHTML += `</div>`
        createHTML += '</div>'
    });
    createHTML += `</ul>`
    return createHTML
}


