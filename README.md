

1. To start the application you first need to install the dependencies using command :"npm install" and to start it the command "npm start" needs to be executed

2. Below mentioned are the mandatory fields for the input forms

Name of the Form: Create New Application
Required fields:
 Company Name
 Job Role
 Enter Applied Date or Date you will apply On
 Job Source
 
Name of the Form: Edit Application:
Required fields:

Company Name
Job Role
Enter Applied Date or Date you will apply On
Job Source

Name of the Form: Edit Profile 

Required fields:
a.)Personal details
fullName
b.)Add Work Experience
jobTitle
Employer
Start Date
c.) Add Project
Name

3. The project consists of valid html documents and is totally compatible. 
4. Using helmet library for preventing XSS attack (https://www.npmjs.com/package/helmet)

1. HTML Validator gives error for date type not supported in all browser. Hence polyfill is added for that
2. PUT requested is not supported in chrome. Hence using POST for it. 
3. Session is not preserved on server start