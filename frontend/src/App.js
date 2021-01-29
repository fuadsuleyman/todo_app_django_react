import React from 'react';
import './App.css';

class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      todoLIST:[],
      activeItem:{
        id: null,
        title:'',
        completed:false,
      },
      editing:false,
    }
    this.fetchTasks = this.fetchTasks.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.deleteItem = this.deleteItem.bind(this)
    this.startEdit = this.startEdit.bind(this)
    this.strikeToggle = this.strikeToggle.bind(this)
    this.getCookie = this.getCookie.bind(this)
  };

getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}

  componentDidMount(){
  this.fetchTasks()
}

fetchTasks(){
  console.log('Fetching...')

  fetch('http://127.0.0.1:8000/api/task')
  .then(response => response.json())
  .then(data => this.setState({
    todoLIST: data
  })
  )
}

handleChange(e){
  const name = e.target.name
  const value = e.target.value
  console.log(`name: ${name}`)
  console.log(`value: ${value}`)

this.setState({
  activeItem:{
    ...this.state.activeItem,
    title:value
  }
})
}

handleSubmit(e){
  e.preventDefault()
  console.log('ITEM', this.state.activeItem)

  const csrftoken = this.getCookie('csrftoken')

  let url = 'http://127.0.0.1:8000/api/task/' 
  let methodName = 'POST'

  if (this.state.editing){
    url = `http://127.0.0.1:8000/api/task/${this.state.activeItem.id}/`;
    methodName = 'PUT';
    this.setState({
      editing:false
    })
  }

  fetch(url, {
        method: methodName,
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
         },
        body: JSON.stringify(this.state.activeItem)
    }).then((response) => {
        console.log('new task added')
        this.fetchTasks()
        this.setState({
          activeItem:{
            id:null,
            title:'',
            completed:false,
          }
        })
    }).catch((error) => console.log('Error:', error))
}

startEdit(task){
  this.setState({
    activeItem: task,
    editing: true,
  })
}

deleteItem(task){
  const csrftoken = this.getCookie('csrftoken')

  fetch(`http://127.0.0.1:8000/api/task/${task.id}/`, {
    method: 'DELETE',
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
     },
}).then((response) =>{
  this.fetchTasks()
})
}

strikeToggle(task){
  task.completed = !task.completed
  const csrftoken = this.getCookie('csrftoken')

  fetch(`http://127.0.0.1:8000/api/task/${task.id}/`, {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
     },
     body: JSON.stringify({'completed': task.completed, 'title': task.title})
}).then(() =>{
  this.fetchTasks()
})

  console.log('Task:', task.completed)
}


  render(){
    const tasks = this.state.todoLIST;
    let self = this;
    return (
      <div className="container">
        <div id="task-container">
          <div id="form-wrapper">
            <form onSubmit={this.handleSubmit} id="form">
              <div className="flex-wrapper">
                <div style={{flex: 6}}>
                  <input type="text" onChange={this.handleChange} className="form-control" value={this.state.activeItem.title} id="title" name="title" placeholder="Add task"/>
                </div>

                <div style={{flex: 1}}>
                  <input type="submit" className="btn btn-warning" id="submit" name="Add"/>
                </div>
              </div>
            </form>
          </div>
          <div id="list-wrapper">
            {tasks.map(task => (
              <div key={task.id} className="task-wrapper flex-wrapper">
                <div style={{flex:7}} onClick={() => self.strikeToggle(task)}>
                  {task.completed === false ? (
                    <span>{task.title}</span>
                  ) : (
                    <strike>{task.title}</strike>
                  )}
                  
                </div>
                <div style={{flex:1}}>
                  <button onClick={() => self.startEdit(task)} className="btn btn-sm btn-outline-info">Edit</button>
                </div>
                <div style={{flex:1}}>
                  <button onClick={() => self.deleteItem(task)} className="btn btn-sm btn-outline-dark delete">-</button>
                </div>
              </div>
            ))}

          </div>

        </div>

      </div>
    )
  }
}

export default App;
