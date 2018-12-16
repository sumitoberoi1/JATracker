let check = function(e) {
    if (document.getElementById('password').value ==
      document.getElementById('repeatedPassword').value) {
      document.getElementById('message').style.color = 'green';
      document.getElementById('message').innerHTML = 'Passwords matched';
      document.getElementById("signupbtn").disabled = false;
   
    } else {
     
      document.getElementById('message').style.color = '#ee0000';
      document.getElementById('message').innerHTML = 'Passwords not matching';
       document.getElementById("signupbtn").disabled = true;

    }
}