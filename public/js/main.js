
let applications;
$( document ).ready(function() {
    applications = "{{applications}}"
    console.log(`Applications ${applications}`)
})
$('input[name="resume"]').change(function(e){
    const fileName = e.target.files[0].name;
    $(this).next('.custom-file-label').html(fileName);
});
$('input[name="coverletter"]').change(function(e){
    const fileName = e.target.files[0].name;
    $(this).next('.custom-file-label').html(fileName);
});

$('#SearchApplicationButton').click((e) => {
    console.log(`Clicked this`)
    const pageHTTML =  $('html')[0].outerHTML
    const template = Handlebars.compile(pageHTTML)
    const context = {title:'new title'}
    const compileData = template(context)
    pageHTTML.innerHTML = compileData
})
$('#deleteApplicationButton').click((e)=> {
    const delID = $('#applicationID').val();
    $.ajax({
        type: "DELETE",
        url: `/application/${delID}`,
        success: function(result) {
            alert('Application Deleted')
            if (typeof result.redirect == 'string') {
                window.location = result.redirect
            }
        },
        error: function(result) {
            alert('Errror in deleting application')
        }
    })
    e.preventDefault();
})

function show_new_work_form() {
    document.getElementById('hiddenNewWorkForm').style.display = "block";
    document.getElementById('coverLetter').style.display = "none";
    document.getElementById('resume').style.display = "none";
    $('label[for="coverLetter"]').css('display', 'none');
    $('label[for="resume"]').css('display', 'none');   
}

function hide_new_work_form() {
    document.getElementById('hiddenNewWorkForm').style.display = "none";
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



