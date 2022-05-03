import { useState } from 'react'
import { useNavigate } from "react-router-dom";


const CreateAccount = ({ getTasks, setLoggedIn }) => {

    // Password validator.
    var passwordValidator = require('password-validator');
    var schema = new passwordValidator;
    schema
    .is().min(5)                                    // Minimum length 5
    .is().max(100)                                  // Maximum length 100
    .has().uppercase()                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().digits(1)                                // Must have at least 1 digits
    .has().not().spaces();                          // Should not have spaces
  
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [statusText, setStatusText] = useState('')

    const isProduction = process.env.NODE_ENV === 'production';
    const endpoints = {
        root: isProduction ? "https://nathan-tasks-backend.herokuapp.com/" : "http://localhost:5000/v2/",
        tasks: "tasks",
        task: "task",
        addTask: "addtask",
        deleteTask: "delete",
        setReminder: "setreminder",
        addUser: "adduser"
    }


    // AJAX Request
    const xhttp = new XMLHttpRequest();
    // Router Navigation
    let navigate = useNavigate(); 
    const routeHome = () =>{ 
        let path = `/`; 
        navigate(path);
    }
    const routeLogin = () =>{ 
        let path = `/login`; 
        navigate(path);
    }

    // Checks whether string contains whitespace.
    const containsWhitespace = (str) => {
        return /\s/.test(str);
    }

    // Validates password based on schema.
    const validatePassword = (password) => {
        return schema.validate(password);
    };

    // Gets failed validation password details
    const getFailedPasswordValidationDetails = (password) => {
        const details = schema.validate(password, { details: true })
        let detailsString = "";
        details.forEach((detail) => {
            detailsString += detail.message + "\n";
        })
        return detailsString;
    }
    
    const onSubmit = (e) => {
        // Doesn't submit to a page.
        e.preventDefault()
        if (!username && !password) {
            alert('Add username and password!')
            return
        }
        if (containsWhitespace(username)) {
            alert('Username cannot have whitespaces')
            return
        }
        if (!validatePassword(password)) {
            alert('Your password need to have the following form:\n\n' + getFailedPasswordValidationDetails(password));
            return
        }

        // Login
        xhttp.open("POST", endpoints.root + endpoints.addUser, true);
        xhttp.setRequestHeader("Content-type", "application/json");
        let obj = {
            username: username,
            password: password
        };
        xhttp.send(JSON.stringify(obj));

        xhttp.onreadystatechange = function () {
            // If request finished and status OK
            if (this.readyState == 4 && this.status == 200 || this.status == 201) {
                console.log("Request was a success!")
                const session = JSON.parse(this.responseText);
                const { username, userid, sessionid } = session;

                sessionStorage.setItem('username', username);
                sessionStorage.setItem('userid', userid);
                sessionStorage.setItem('sessionid', sessionid);
                setLoggedIn(true);
                getTasks();
                routeHome();
            } else if (this.status === 401) {
                setStatusText("Username has been taken. Please try again");
            } else {
                console.log("Request in progress.")
            }
        }
        

        // setUsername('')
        // setPassword('')
    }

  return (
    <div>
    
      <form className="add-form" onSubmit={onSubmit}>
        <div className="form-control">
          <label>Username</label>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-control">
          <label>Password</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        
        <input className="btn btn-block" type="submit" value="Create Account" />
      </form>
      <p className="goto" onClick={routeLogin}>Sign In</p>
      <p className="color-red">{ statusText }</p>
    </div>
  );
}

export default CreateAccount