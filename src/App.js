import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'
import About from './components/About'
import Login from './components/Login'
import CreateAccount from './components/CreateAccount'


function App() {
  // AJAX Request
  const xhttp = new XMLHttpRequest();

  const [showAddTask, setShowAddTask] = useState(false)
  const [showLogin] = useState(false)
  const isProduction = process.env.NODE_ENV === 'production';

  // States are immutable. Need to use setTasks to create a new State.
  const [tasks, setTasks] = useState([])
  const [loggedIn, setLoggedIn] = useState(false)



  const endpoints = {
    root: isProduction ? "https://nathan-tasks-backend.herokuapp.com/v2" : "http://localhost:5000/v2",
    tasks: "/tasks",
    task: "/task",
    addTask: "/addtask",
    deleteTask: "/delete",
    setReminder: "/setreminder"
}

  useEffect(() => {
    
    // Check login status. Needed for refreshes.
    if (!loggedIn) {
      let username = sessionStorage.getItem('username');
      let userid = sessionStorage.getItem('userid');
      let sessionid = sessionStorage.getItem('sessionid');
      if (username != null && userid != null && sessionid) {
        setLoggedIn(true);
      }
    }
    getTasks();
  }, [])

  
  // Ajax call to get tasks with userID
  const getTasks = () => {
    let username = sessionStorage.getItem('username');
    let userid = sessionStorage.getItem('userid');
    let sessionid = sessionStorage.getItem('sessionid');


    if (username != null || userid != null || sessionid != null) {

      // Ajax Post request.
      xhttp.open("POST", endpoints.root + endpoints.tasks, true);
      xhttp.setRequestHeader("Content-type", "application/json");
      let obj = {
        username: username,
        userid: userid,
        sessionid: sessionid
      };
      xhttp.send(JSON.stringify(obj));

      xhttp.onreadystatechange = function () {
          // If request finished and status OK
          if (this.readyState === 4 && (this.status === 200 || this.status === 201)) {
            console.log("Request was a success!")
            const tasksFromServer = JSON.parse(this.responseText).tasks;

            // Sets tasks in order by id.
            if (tasksFromServer != undefined) {
                setTasks(tasksFromServer.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0)))
            }
          
          } else if (this.status === 401) {
              console.log("Authentication Error")
          } else {
              console.log("Request in progress.")
          }
      }
    } else {
      console.log("No auth session")
    }
  }

  // Fetch Task
  const fetchTask = async (id) => {
    const res = await fetch(endpoints.root + endpoints.task + `/${id}`)
    const data = await res.json()

    return data[0];
  }
  
  // Add task
  const addTask = async (task) => {
    // Session info
    let username = sessionStorage.getItem('username');
    let userid = sessionStorage.getItem('userid');
    let sessionid = sessionStorage.getItem('sessionid');

    const formattedTask = {
      task: task.text,
      date_time: task.day,
      reminder: task.reminder,
      username: username,
      userid: userid,
      sessionid: sessionid
    };
    const res = await fetch(endpoints.root + endpoints.addTask,
    {
      method: 'POST',
      headers: {
        'Content-type':'application/json'
      },
      body: JSON.stringify(formattedTask)
    })

    const data = await res.json()
    setTasks([...tasks, data])
  }

  // Delete Task
  const deleteTask = async (taskId) => {
    // Session info
    let username = sessionStorage.getItem('username');
    let userid = sessionStorage.getItem('userid');
    let sessionid = sessionStorage.getItem('sessionid');

    // Ajax request
    await fetch(endpoints.root + endpoints.deleteTask, {
      method: 'DELETE',
      headers: {
        'Content-type':'application/json'
      },
      body: JSON.stringify({
        id: taskId,
        username: username,
        userid: userid,
        sessionid: sessionid
      })
    })
    // const data = await res.json()
    setTasks(tasks.filter((task) => task.id !== taskId))
  }

 // Toggle Reminder
 const toggleReminder = async (taskId) => {
  const taskToToggle = await fetchTask(taskId)
  const newReminderState = !taskToToggle.reminder;
  const updTask = { ...taskToToggle, reminder: !taskToToggle.reminder }

  let username = sessionStorage.getItem('username');
  let userid = sessionStorage.getItem('userid');
  let sessionid = sessionStorage.getItem('sessionid');

  await fetch(endpoints.root + endpoints.setReminder, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      id: taskId,
      reminder: newReminderState,
      username: username,
      userid: userid,
      sessionid: sessionid
    }),
  })

  // Sets tasks in order by id.
  setTasks(
    tasks.map((task) =>
      task.id === taskId ? updTask : task
    ).sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0))
  )
}

  return (
    <Router>
    <div className="container">
      <Header onAdd={() => setShowAddTask(!showAddTask)} setShowAddTask={setShowAddTask} showAdd={showAddTask} loggedIn={loggedIn} setTasks={setTasks} setLoggedIn={setLoggedIn}/>
      
      <Routes>
      {/* <Route path='/about' component={About} /> */}
      
      <Route path='/' exact element={
          <>
          {showAddTask && <AddTask onAdd={addTask}/>} 
          {showLogin && <Login/>} 
          {!loggedIn ? <><p>Please Log in!</p><br/></> :
            <>{tasks.length > 0 ? <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder}/> : 'No tasks to show'}</>
            }
          
          </>
        
      } />
      <Route path="/login" exact element={
        <Login getTasks={getTasks} setLoggedIn={setLoggedIn}/>
      } />
      <Route path="/create" exact element={
        <CreateAccount getTasks={getTasks} setLoggedIn={setLoggedIn}/>
      } />
      <Route path='/about'  element={<About />} />
      </Routes>
      <Footer />
    </div>
    </Router>
  );
}

// class App extends React.Component {
//   render() {
//     return <h1>Hello From a class</h1>
//   }
// }

export default App;
