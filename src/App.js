import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'
import About from './components/About'


function App() {
  const [showAddTask, setShowAddTask] = useState(false)

  // States are immutable. Need to use setTasks to create a new State.
  const [tasks, setTasks] = useState([])
  const endpoints = {
    root: "https://nathan-tasks-backend.herokuapp.com/",
    tasks: "tasks",
    task: "task",
    addTask: "addtask",
    deleteTask: "delete",
    setReminder: "setreminder"
}

  useEffect(() => {
    // Gets tasks from backend.
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()

      // Sets tasks in order by id.
      setTasks(tasksFromServer.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0)))
    }

    getTasks()
  }, [])
  
  // Fetch Tasks
  const fetchTasks = async () => {
    const res = await fetch(endpoints.root + endpoints.tasks);
    const data = await res.json()

    return data
  }

  // Fetch Task
  const fetchTask = async (id) => {
    const res = await fetch(endpoints.root + endpoints.task + `/${id}`)
    const data = await res.json()

    return data[0];
  }
  
  // Add task
  const addTask = async (task) => {
    console.log("task", task);
    const formattedTask = {
      task: task.text,
      date_time: task.day,
      reminder: task.reminder
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
    console.log("res data:", data);

    setTasks([...tasks, data])
  }

  // Delete Task
  const deleteTask = async (taskId) => {
    console.log("Request body:", {"id": taskId})
    const res = await fetch(endpoints.root + endpoints.deleteTask, {
      method: 'DELETE',
      headers: {
        'Content-type':'application/json'
      },
      body: JSON.stringify({id: taskId})
    })
    const data = await res.json()
    console.log("res data:", data);
    setTasks(tasks.filter((task) => task.id !== taskId))
  }

 // Toggle Reminder
 const toggleReminder = async (taskId) => {
  const taskToToggle = await fetchTask(taskId)
  const newReminderState = !taskToToggle.reminder;
  const updTask = { ...taskToToggle, reminder: !taskToToggle.reminder }

  await fetch(endpoints.root + endpoints.setReminder, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      id: taskId,
      reminder: newReminderState
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
      <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask}/>
      
      <Routes>
      {/* <Route path='/about' component={About} /> */}
      
      <Route path='/' exact element={
          <>
          {showAddTask && <AddTask onAdd={addTask}/>} 
          {tasks.length > 0 ? <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder}/> : 'No tasks to show'}
          </>
        
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
