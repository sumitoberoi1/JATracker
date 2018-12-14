
$('input[name="resume"]').change(function(e){
    const fileName = e.target.files[0].name;
    $(this).next('.custom-file-label').html(fileName);
});
$('input[name="coverletter"]').change(function(e){
    const fileName = e.target.files[0].name;
    $(this).next('.custom-file-label').html(fileName);
});


$( "#SearchApplicationButton" ).click(function() {
    alert( "Handler for .click() called." );
});

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



