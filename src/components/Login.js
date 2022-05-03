import { useState } from 'react'
import { useNavigate } from "react-router-dom";

const Login = ( { getTasks, setLoggedIn }) => {
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
        setReminder: "setreminder"
    }

    // AJAX Request
    const xhttp = new XMLHttpRequest();

    // Router Navigation
    let navigate = useNavigate(); 
    const routeHome = () =>{ 
        let path = `/`; 
        navigate(path);
    }
    const routeCreateAccount = () =>{ 
        let path = `/create`; 
        navigate(path);
    }
    
    const onSubmit = (e) => {
        // Doesn't submit to a page.
        e.preventDefault()
        if(!username && !password) {
            alert('Add username and password!')
            return
        }

        // Login
        xhttp.open("POST", endpoints.root + "auth", true);
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
            }
            else if (this.status == 401) {
                console.log("Auth unsuccessful")
                setStatusText("Username or Password Invalid. Please try again");
            }
            else if (this.status != 200 || this.status != 201) {
              console.log("Request was a failure!")
              setStatusText("Something went wrong. Please try again another time.");
            }
            else {
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

        
        <input className="btn btn-block" type="submit" value="Login" />
      </form>
      <p className="goto" onClick={routeCreateAccount}>Create an Account</p>
      <p className="color-red">{ statusText }</p>
    </div>
  );
};

export default Login;
