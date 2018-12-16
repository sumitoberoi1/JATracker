const applicationForm = $('#application-submission');
$('#application-submission').submit((e) => {
    const formData = applicationForm.serializeArray()
    formData.forEach(data => {
        const fieldName = formData['name'];
        console.log(`Company Name ${companyName}`);
    })
    //e.preventDefault()
})

const createErrorHTML = (errors) => {
    errors.forEach(element => {
        
    });
} 

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