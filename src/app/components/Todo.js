'use client'

import { useState } from 'react';

export function Todo({ tid, uid, date_created, priority, description, completed = false }) {

  const [editing, setEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [priorityValue, setPriorityValue] = useState(priority);
  const [descriptionValue, setDescriptionValue] = useState(description);
  const [completedValue, setCompletedValue] = useState(completed);


  function handleSubmit(e) {
    // if done editing, request API to save results to database
    // show errors if there were errors in saving

    e.preventDefault();

    setIsLoading(true);

    // Read the form data
    const data_obj = {
      tid: tid,
      uid: uid, //we want uid so we can check user_sessions is valid in server
      priority: priorityValue,
      description: descriptionValue,
      completed: completedValue
    };

    const data_str = JOSN.stringify(data_obj);


    fetch('/some-api', { method: form.method, body: data_str })
      .then( (res) => {
        // if fetch has no errors, setEditing(!editing); 
        return res.json();
      })
      .then( (data) => {

        setIsLoading(false);
        setEditing(false);
      })
      .catch( (err) => {
        // if there are errors, say there was an error saving but dont setEditing

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

  if (editing) {
    return (
      <form method="post" onSubmit={handleSubmit}>
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
      </div>
    );

  }


}