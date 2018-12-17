function show_new_work_form() {
    document.getElementById('hiddenNewWorkForm').style.display = "block";
    document.getElementById('coverLetter').style.display = "none";
    document.getElementById('resume').style.display = "none";
    document.getElementById('projectscard').style.display = "none";
    $('label[for="coverLetter"]').css('display', 'none');
    $('label[for="resume"]').css('display', 'none');   
}

function hide_new_work_form() {
    document.getElementById('hiddenNewWorkForm').style.display = "none";
    document.getElementById('projectscard').style.display = "block";
    $('label[for="coverLetter"]').css('display', 'block');
    $('label[for="resume"]').css('display', 'block');
}

function show_new_project_form() {
    document.getElementById('hiddenNewProjectForm').style.display = "block";
    document.getElementById('coverLetter').style.display = "none";
    document.getElementById('resume').style.display = "none";
    $('label[for="coverLetter"]').css('display', 'none');
    $('label[for="resume"]').css('display', 'none');
}

function hide_new_project_form() {
    document.getElementById('hiddenNewProjectForm').style.display = "none";
    $('label[for="coverLetter"]').css('display', 'block');
    $('label[for="resume"]').css('display', 'block');
}

$(document).on("click", ".deleteProjectButton", function(e){
    const closestInput = $(this).next('input')
    const delID = closestInput.val()
    $.ajax({
        type: "DELETE",
        url: `profile/project/delete/${delID}`,
        success: function(result) {
            alert('Project Deleted')
            if (result.redirect && typeof result.redirect == 'string') {
                window.location = result.redirect
            }
        },
        error: function(result) {
            alert('Errror in deleting application')
        }
    })
    e.preventDefault()
});

$(document).on("click", ".deleteWorkExperienceButton", function(e){
    console.log(`Here I come`)
    const closestInput = $(this).next('input')
    const delID = closestInput.val()
    console.log(`id: ${delID}`)
    $.ajax({
        type: "DELETE",
        url: `profile/work_experience/delete/${delID}`,
        success: function(result) {
            alert('Work Experience Deleted')
            console.log(`Result Redirect ${result}`)
            if (result.redirect && typeof result.redirect == 'string') {
                window.location = result.redirect
            }
        },
        error: function(result) {
            alert('Errror in deleting application')
        }
    })
    e.preventDefault()
});