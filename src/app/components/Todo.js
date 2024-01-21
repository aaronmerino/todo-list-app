'use client'

import { useState, useRef, useEffect } from 'react';
import { TodosContainer } from './TodosContainer';
import styles from './styles.module.css'

export function Todo({ tid, parentid, date_created, priority, description, completed, completion_date, handleAddTodo, handleDeleteTodo, handleEditTodo, targetTodoId, todos }) {

  const containerRef = useRef(null);

  const [editing, setEditing] = useState(false);
  const [showSubTodos, setShowSubTodos] = useState(false);

  const [priorityValue, setPriorityValue] = useState(priority);
  const [descriptionValue, setDescriptionValue] = useState(description);
  const [completedValue, setCompletedValue] = useState(completed);

  const subTodos = todos.filter((t) => t.parentid === tid);

  useEffect(() => {
    if (targetTodoId !== null) {
      if (targetTodoId === tid) {
        containerRef.current.scrollIntoView({ behavior: 'smooth', block: "center" });
      }
    }
  }, [todos]);  

  // const router = useRouter();

  /*
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
              parentid: tid,
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

  */

  function handleOnShowSubTodos(e) {
    setShowSubTodos(!showSubTodos);
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

  if (completedValue) {
    console.log(completion_date);
  }
  if (editing) {
    return (
      <div ref={containerRef}  className={   `${targetTodoId === tid ? styles.selectedTodo : ``} ${parentid !== null ? `${styles.todo} ${styles.subtodo}` : styles.todo}`   }>
        <form method="post" onSubmit={(e) => {
          e.preventDefault();
          const newTodo = {
              tid: tid,
              priority: priorityValue,
              description: descriptionValue,
              completed: completedValue
            };

          handleEditTodo(newTodo);
          
          setEditing(false);

        }}>
          <div>
            <label>
              priority:
              <select name='priority' value={priorityValue} onChange={handleInputPriorityChange}>
                <option value="1" className={`${styles.green}`}>low</option>
                <option value="2" className={`${styles.yellow}`}>mid</option>
                <option value="3" className={`${styles.red}`}>high</option>
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
            
            <textarea name='description' type="text" value={descriptionValue} placeholder="description" maxLength={255} onChange={handleInputDescriptionChange}/>
            
          </div>

          <hr />

          <div>
            <button type="submit">return</button>
          </div>
          
        </form>

        
        { showSubTodos && <TodosContainer 
                              parentid={tid}
                              subTodos={subTodos}
                              ascending={true} 
                              handleAddTodo={handleAddTodo}
                              handleDeleteTodo={handleDeleteTodo}
                              handleEditTodo={handleEditTodo}
                              targetTodoId={targetTodoId}
                              todos={todos}/> }
        
      </div>
      
    );

  } else {

    return (
      <div ref={containerRef} className={ `${targetTodoId === tid ? styles.selectedTodo : ``} ${parentid !== null ? `${styles.todo} ${styles.subtodo}` : styles.todo}` }>
        <div>
          <div>
            priority: { priorityValue == 3 ? <span className={`${styles.circle} ${styles.red}`}/> : ( priorityValue == 2 ? <span className={`${styles.circle} ${styles.yellow}`}/> : <span className={`${styles.circle} ${styles.green}`}/> ) }
          </div>
          
          <div>
            created: {`${(new Date(date_created)).toDateString()}, ${(new Date(date_created)).toLocaleTimeString()}`}
          </div>
          
          <div>
            completed: {completedValue ? "✅" : "❌"} {completed ? `${(new Date(completion_date)).toDateString()}, ${(new Date(completion_date)).toLocaleTimeString()}` : null}
          </div>
          
    
          <hr />
    
          <textarea name='description' type="text" value={descriptionValue} placeholder="description" readOnly/>

          <hr />

          <div>
            <button onClick={() => handleDeleteTodo(tid)}>delete</button>
            <button onClick={handleOnEdit}>edit</button>
            <button onClick={() => {
              handleAddTodo(tid);
              setShowSubTodos(true);
            }}>+</button>
            {subTodos.length !== 0 && (<button onClick={handleOnShowSubTodos}>{showSubTodos ? '▼' : '▶'}</button>)}
            
          </div>
        </div>
        
        
        { showSubTodos && <TodosContainer 
                              parentid={tid}
                              subTodos={subTodos}
                              ascending={true} 
                              handleAddTodo={handleAddTodo}
                              handleDeleteTodo={handleDeleteTodo}
                              handleEditTodo={handleEditTodo}
                              targetTodoId={targetTodoId}
                              todos={todos}/> }
      </div>
    );

  }


}