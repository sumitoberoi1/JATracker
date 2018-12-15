$(document).ready(()=>{
    var max1 = new Date(new Date().setFullYear(new Date().getFullYear() + 2))
    var max2 = max1.toISOString().split('T')[0]
    var min1 = new Date(new Date().setFullYear(new Date().getFullYear() - 2))
    var min2 = min1.toISOString().split('T')[0]	
    document.getElementsByName("startDate")[0].setAttribute('max', max2);
    document.getElementsByName("startDate")[0].setAttribute('min', min2);
    document.getElementsByName("endDate")[0].setAttribute('max', max2);
    document.getElementsByName("endDate")[0].setAttribute('min', min2);
    document.getElementsById("applyDate")[0].setAttribute('max', max2);
    document.getElementsById("applyDate")[0].setAttribute('min', min2);
})
$('input[name="resume"]').change(function(e){
    const fileName = e.target.files[0].name;
    $(this).next('.custom-file-label').html(fileName);
});
$('input[name="coverletter"]').change(function(e){
    const fileName = e.target.files[0].name;
    $(this).next('.custom-file-label').html(fileName);
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



