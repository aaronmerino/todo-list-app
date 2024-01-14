'use client'

import { useEffect, useState } from 'react';

import styles from './styles.module.css'

export function Todo({ tid, parentid, date_created, priority, description, completed = false, todos, handleAddTodo }) {

  const [editing, setEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSubTodos, setShowSubTodos] = useState(true);
  const [priorityValue, setPriorityValue] = useState(priority);
  const [descriptionValue, setDescriptionValue] = useState(description);
  const [completedValue, setCompletedValue] = useState(completed);
  
  const subTodos = todos.filter((todo) => todo.parentid === tid);

  function handleOnAddSubTodo(e) {
    e.preventDefault();

    // Read the form data
    const data = {
      parentid: tid,
      priority: 1,
      description: '',
      completed: 0
    };

    // make request to insert blank todo
    fetch('/api/users/todos', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),       
    })
      .then( (res) => {
        // if fetch has no errors, setEditing(!editing); 
        return res.json();
      })
      .then( (data) => {
        const addedTid = data.res.insertId;
        handleAddTodo(addedTid);
      })
      .catch( (err) => {
        // if there are errors, say there was an error saving but dont setEditing
        console.error(err);
      });    
  }

  function handleOnShowSubTodos(e) {
    setShowSubTodos(!showSubTodos);
  }


  function handleEditSubmit(e) {
    // if done editing, request API to save results to database
    // show errors if there were errors in saving

    e.preventDefault();

    setIsLoading(true);

    // Read the form data
    const data_obj = {
      tid: tid,
      priority: priorityValue,
      description: descriptionValue,
      completed: completedValue
    };

    const data_str = JSON.stringify(data_obj);


    fetch('/api/users/todos', { method: 'PUT', body: data_str })
      .then( (res) => {
        return res.json();
      })
      .then( (data) => {

        setIsLoading(false);
        setEditing(false);
      })
      .catch( (err) => {
        // if there are errors, say there was an error saving but dont setEditing
        console.error(err);
      });

  }

  function handleOnEdit() {
    setEditing(true);
  }

  function handleInputPriorityChange(e) {
    setPriorityValue(e.target.value);
  }

  function handleInputCompletedChange(e) {
    setCompletedValue(e.target.checked);
  }

  function handleInputDescriptionChange(e) {
    setDescriptionValue(e.target.value);
  }

  // find all sub todos of this todo



  if (editing) {
    return (
      <div className={parentid !== null ? styles.subtodo : styles.todo}>
        <form method="post" onSubmit={handleEditSubmit}>
          <div>
            <label>
              priority:
              <input name='priority' type="text" value={priorityValue} onChange={handleInputPriorityChange} />   
            </label>
          </div>

          <div>
            <label>
              completed:
              <input name='completed' type="checkbox" checked={completedValue} onChange={handleInputCompletedChange}/>
            </label>
          </div>

          
          <hr />

          <div>
            <label>
              description:

              <input name='description' type="text" value={descriptionValue} onChange={handleInputDescriptionChange}/>
            </label>
          </div>

          <hr />

          <button onClick={handleOnEdit}>{isLoading ? 'loading...' : 'submit'}</button>
        </form>
      </div>
      
    );

  } else {

    return (
      <div className={parentid !== null ? `${styles.todo} ${styles.subtodo}` : styles.todo}>
        <div>
          priority: {priorityValue}
        </div>
        
        <div>
          created: {(new Date(date_created)).toLocaleString()}
        </div>
        
        <div>
          completed: {completedValue.toString()}
        </div>
        
  
        <hr />
  
        <p> {descriptionValue} </p>

        <hr />

        <div>
          <button onClick={handleOnEdit}>edit</button>
          <button onClick={handleOnAddSubTodo}>add sub-todo</button>
          <button onClick={handleOnShowSubTodos}>{subTodos.length !== 0 ? 'show sub-todos' : 'blank'}</button>
        </div>

        <hr />

        {showSubTodos && (
          <div>
          {subTodos.map((todo) => {
              return <Todo key={todo.tid} tid={todo.tid} parentid={tid} date_created={todo.date_created} priority={todo.priority} description={todo.description} completed={todo.completed} todos={todos} handleAddTodo={handleAddTodo} />
            })}
        </div>
        )}

      </div>
    );

  }


}