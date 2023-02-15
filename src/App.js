import React from 'react'
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'
import About from './components/About'


const App = () => {
  const [showAddTask, setShowAddTask] = useState (true)

  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const getTasks = async () => {
      const tasksfromserver = await fetchTasks()
      setTasks(tasksfromserver)
    }
      getTasks()
  }, [])
     

    // fetch tasks
    const fetchTasks = async () => {
      const res = await fetch('https://rest-api-ebmc.onrender.com/tasks')
      const data =await res.json() 

      return data
    }

     // fetch tasks
     const fetchTask = async (id) => {
      const res = await fetch(`https://rest-api-ebmc.onrender.com/tasks/${id}`)
      const data = await res.json()

      return data
    }
  // Add task
    const addTask = async (task) =>{
      const res = await fetch ('https://rest-api-ebmc.onrender.com/tasks', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(task),
      })
      const data = await res.json()

      setTasks([...tasks, data])
    
     
      // const id = Math.floor(Math.random() *
      // 10000) + 1
      // const newTask = {id, ...task }
      // setTasks([...tasks, newTask])
    }

  // delete task.........
    const deleteTask = async (id) => {
      await fetch(`https://rest-api-ebmc.onrender.com/tasks/${id}`,{
        method: 'DELETE',
      })

      setTasks(tasks.filter((task) => task.id !== id
      ))
    }

    // Toggle reminder.......
    const toggleReminder = async (id) => {

      const taskToToggle = await fetchTask(id)
      const updTask = {...taskToToggle, reminder: 
      !taskToToggle.reminder}

      const res = await fetch(`https://rest-api-ebmc.onrender.com/tasks/${id}`, {
        method:`PUT`,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(updTask)
      })

      const data = await res.json()

      setTasks(
        tasks.map((task) => 
        task.id === id ? {...task, reminder: data.reminder} : task)
      )
    }
     
  return (
    <Router>
    <div className="container">
      <Header onAdd={() => setShowAddTask(!showAddTask)}
      showAdd={showAddTask} />

     {showAddTask && <AddTask onAdd={addTask} />}
     
      {tasks.length> 0 ? ( <Tasks  tasks={tasks} onDelete={deleteTask}
      onToggle={toggleReminder}  /> ) : ( 'No Task to show for now.')}

     <Routes>  <Route path='/about' component={About} /></Routes>
      <Footer />
    
    </div>
     </Router>
  );
}

export default App;
