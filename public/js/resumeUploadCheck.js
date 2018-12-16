$('input[name="resume"]').change(function (e) {
    const fileName = e.target.files[0].name;
    $(this).next('.custom-file-label').html(fileName);
});
$('input[name="coverletter"]').change(function (e) {
    const fileName = e.target.files[0].name;
    $(this).next('.custom-file-label').html(fileName);
});