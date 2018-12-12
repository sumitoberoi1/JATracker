
$('input[name="resume"]').change(function(e){
    const fileName = e.target.files[0].name;
    $(this).next('.custom-file-label').html(fileName);
});
$('input[name="cover-letter"]').change(function(e){
    const fileName = e.target.files[0].name;
    $(this).next('.custom-file-label').html(fileName);
});

function show_work_form() {
    document.getElementById('hiddenWorkForm').style.display = "block";
    document.getElementById('coverletter').style.display = "none";
    document.getElementById('resume').style.display = "none";
    $('label[for="coverletter"]').css('display', 'none');
    $('label[for="resume"]').css('display', 'none');
    
}

function hide_work_form() {
    document.getElementById('hiddenWorkForm').style.display = "none";
    $('label[for="coverletter"]').css('display', 'block');
    $('label[for="resume"]').css('display', 'block');
}

function show_project_form() {
    document.getElementById('hiddenProjectForm').style.display = "block";
    document.getElementById('coverletter').style.display = "none";
    document.getElementById('resume').style.display = "none";
    $('label[for="coverletter"]').css('display', 'none');
    $('label[for="resume"]').css('display', 'none');
}

function hide_project_form() {
    document.getElementById('hiddenProjectForm').style.display = "none";
    $('label[for="coverletter"]').css('display', 'block');
    $('label[for="resume"]').css('display', 'block');
}



