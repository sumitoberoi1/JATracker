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