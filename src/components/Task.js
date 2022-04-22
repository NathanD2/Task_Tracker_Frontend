import { FaTimes } from 'react-icons/fa'
import { useEffect } from 'react'

const Task = ({ task, onDelete, onToggle }) => {

  useEffect(() => {
    console.log("TASK:", task);
  }, []);
  
  return (
    <div className={`task ${task.reminder ? 'reminder' : ''}`} onDoubleClick={() => onToggle(task.id)}>
        <h3>{task.task} <FaTimes style={{ color: 'red',
        cursor: 'pointer' }} onClick={() => onDelete(task.id)}/></h3>
        <p>{task.date_time}</p> 
    </div>
  )
}

export default Task