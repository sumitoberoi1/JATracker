$(() => {
    $( "#applyDate" ).datepicker();
});
$('input[type="file"]').change(function(e){
    console.log('here');
    let fileName = e.target.files[0].name;
    $('.custom-file-label').html(fileName);
});