'use client'

import styles from './page.module.css'
import { Todo } from './components/Todo';
import { useEffect, useState } from 'react';

export default function Home() {

  const [todos, setTodos] = useState([]);
  
  useEffect(() => {
    fetch('/api/users/todos', { 
      method: 'GET'      
    })
    .then( (res) => {
      return res.json();
    })
    .then( (data) => {
      setTodos(data.res);
    })
    .catch( (err) => {
      console.error(err);
    });   
  }, []);

  function handleAddTodo(tid) {
    
  }

  return (
    <main className={styles.main}>
      {/* tid, parentid, date_created, priority, description, completed */}
      <div>
        {todos.map((todo) => {
          if (todo.parentid === null) {
            return <Todo key={todo.tid} parentid={todo.parentid} date_created={todo.date_created} priority={todo.priority} description={todo.description} completed={todo.completed} todos={todos} handleAddTodo={handleAddTodo} />
          }
        })}
      </div>
    </main>
  );
}