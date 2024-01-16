'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'

import styles from './styles.module.css'

export function Todo({ tid, parentid, date_created, priority, description, completed = false, handleDelete, handleSubmit, todos }) {

  const [editing, setEditing] = useState(false);
  const [showSubTodos, setShowSubTodos] = useState(false);
  const [priorityValue, setPriorityValue] = useState(priority);
  const [descriptionValue, setDescriptionValue] = useState(description);
  const [completedValue, setCompletedValue] = useState(completed);
  const [subTodos, setSubTodos] = useState(todos.filter((t) => t.parentid === tid));
  const router = useRouter();

  function handleOnAddSubTodo(e) {
    e.preventDefault();

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
      if (!res.ok) {
        throw new Error(`${res.statusText}`);
      }

      return res.json();
    })
    .then( (data) => {
      const addedTid = data.res.insertId;

      fetch(`/api/users/todos/${addedTid}`, { 
        method: 'GET'      
      })
      .then( (res) => {
        return res.json();
      })
      .then( (data) => {
        setSubTodos([data.res[0], ...subTodos]);
        setShowSubTodos(true);
      })
      .catch( (err) => {
        console.error(err);
      });  

    })
    .catch( (err) => {
      if (err.message === 'expired session') {
        router.push('/login');
      }

      console.error(err);
    });    
  }

  function handleOnDeleteSubTodo(e, subtid) {
    e.preventDefault();

    const data_obj = {
      tid: subtid,
    };

    const data_str = JSON.stringify(data_obj);

    fetch(`/api/users/todos/${subtid}`, { method: 'DELETE', body: data_str })
      .then( (res) => {
        if (!res.ok) {
          throw new Error(`${res.statusText}`);
        }

        return res.json();
      })
      .then( () => {
        setSubTodos(subTodos.filter((t) => t.tid !== subtid));
      })
      .catch( (err) => {
        if (err.message === 'expired session') {
          router.push('/login');
        }

        console.error(err);
      });    
  }

  function handleEditSubmit(e, subtid) {
    e.preventDefault();

    const data_obj = {
      tid: subtid,
      priority: e.target.priority.value,
      description: e.target.description.value,
      completed: e.target.completed.checked
    };

    const data_str = JSON.stringify(data_obj);

    fetch('/api/users/todos', { method: 'PUT', body: data_str })
      .then( (res) => {
        if (!res.ok) {
          throw new Error(`${res.statusText}`);
        }

        return res.json();
      })
      .then( () => {

        const newSubTodos = subTodos.map((todo) => {
          if (todo.tid !== subtid) {
            return todo;
          } else {
            return {
              tid: todo.tid,
              date_created: todo.date_created,
              priority: e.target.priority.value,
              description: e.target.description.value,
              completed: e.target.completed.checked
            };
          }
        });

        setSubTodos(newSubTodos);
      })
      .catch( (err) => {
        if (err.message === 'expired session') {
          router.push('/login');
        }

        console.error(err);
      });

  }

  function handleOnShowSubTodos(e) {
    setShowSubTodos(!showSubTodos);
  }

  function handleOnEdit() {
    setEditing(true);
    setShowSubTodos(false);
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
      <div className={parentid !== null ? `${styles.todo} ${styles.subtodo}` : styles.todo}>
        <form method="post" onSubmit={(e) => {
          handleSubmit(e, tid);
          setEditing(false);
        }}>
          <div>
            <label>
              priority:
              <select name='priority' value={priorityValue} onChange={handleInputPriorityChange}>
                <option value="1">🟢</option>
                <option value="2">🟡</option>
                <option value="3">🔴</option>
              </select>

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
            
            <textarea name='description' type="text" value={descriptionValue} placeholder="description" onChange={handleInputDescriptionChange}/>
            
          </div>

          <hr />

          <div>
            <button type="submit">return</button>
          </div>
          
        </form>
        {/* <div div className={styles.subtodoscontainer}>
          {showSubTodos && (
            
            subTodos.map((todo) => {
                return <Todo 
                        key={todo.tid} 
                        tid={todo.tid} 
                        parentid={tid} 
                        date_created={todo.date_created} 
                        priority={todo.priority} 
                        description={todo.description} 
                        completed={todo.completed} 
                        handleDelete={handleOnDeleteSubTodo} 
                        handleSubmit={handleEditSubmit}
                        todos={todos} />
              })
          
          )}
        </div> */}
        
      </div>
      
    );

  } else {

    return (
      <div className={parentid !== null ? `${styles.todo} ${styles.subtodo}` : styles.todo}>
        <div>
          priority: { priorityValue == 3 ? '🔴' : ( priorityValue == 2 ? '🟡' : '🟢' ) }
        </div>
        
        <div>
          created: {(new Date(date_created)).toLocaleString()}
        </div>
        
        <div>
          completed: {completedValue ? "✅" : "❌"}
        </div>
        
  
        <hr />
  
        <textarea name='description' type="text" value={descriptionValue} placeholder="description" readOnly/>

        <hr />

        <div>
          <button onClick={(e) => handleDelete(e, tid)}>delete</button>
          <button onClick={handleOnEdit}>edit</button>
          <button onClick={handleOnAddSubTodo}>+</button>
          {subTodos.length !== 0 && (<button onClick={handleOnShowSubTodos}>{showSubTodos ? '⯆' : '⯈'}</button>)}
          
        </div>

        <hr />
        <div className={styles.subtodoscontainer}>
          {showSubTodos && (
            subTodos.map((todo) => {
                return <Todo 
                        key={todo.tid} 
                        tid={todo.tid} 
                        parentid={tid} 
                        date_created={todo.date_created} 
                        priority={todo.priority} 
                        description={todo.description} 
                        completed={todo.completed} 
                        handleDelete={handleOnDeleteSubTodo} 
                        handleSubmit={handleEditSubmit}
                        todos={todos} />
              })
          )}
        </div>      
      </div>
    );

  }


}