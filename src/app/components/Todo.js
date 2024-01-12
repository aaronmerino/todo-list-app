'use client'

import { useEffect, useState } from 'react';

export function Todo({ tid, parentid, date_created, priority, description, completed = false, todos, handleAddTodo }) {

  const [editing, setEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [priorityValue, setPriorityValue] = useState(priority);
  const [descriptionValue, setDescriptionValue] = useState(description);
  const [completedValue, setCompletedValue] = useState(completed);

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

    const data_str = JOSN.stringify(data_obj);


    fetch('/some-api', { method: 'PUT', body: data_str })
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
      <form method="post" onSubmit={handleEditSubmit}>
        <h1>
          <label>
            <b>priority</b> 
            <input name='priority' type="text" value={priorityValue} onChange={handleInputPriorityChange} />   
          </label>
        </h1>

        <h2> <b>created</b> {date_created} </h2>

        <h2> 
          <label>
            <b>completed</b> 

            <input name='completed' type="checkbox" checked={completedValue} onChange={handleInputCompletedChange}/>
          </label>
        </h2>

        <hr />

        <label>
          <b>description</b>

          <input name='description' type="text" value={descriptionValue} onChange={handleInputDescriptionChange}/>
        </label>

        <hr />

        <button onClick={handleSubmit}>{isLoading ? 'loading...' : 'submit'}</button>
      </form>
    );

  } else {

    return (
      <div className="todo">
        <h1> <b>priority</b> {priorityValue} </h1>
        <h2> <b>created</b> {date_created}</h2>
        <h2> <b>completed</b> {completedValue.toString()}</h2>
  
        <hr />
  
        <p> {descriptionValue} </p>

        <hr />
        <button onClick={handleOnEdit}>edit</button>
        <button onClick={handleOnAddSubTodo}>add sub-todo</button>
        <button onClick={handleOnShowSubTodos}>show sub-todo</button>

        <div>
          {todos.map((data, index) => {
                              if (data.parentid === tid) {
                                return data;
                              }
                            })}
        </div>
      </div>
    );

  }


}