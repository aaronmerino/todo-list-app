'use client'

import { Todo } from './Todo';
import { useState } from 'react';
import styles from './styles.module.css'


export function TodosContainer({ parentid, subTodos, ascending, handleAddTodo, handleDeleteTodo, handleEditTodo, todos }) {

  const [sortBy, setSortBy] = useState('DATE');

  let sortedTodos = null;

  if (sortBy === "DATE") {
    sortedTodos = subTodos.sort((a, b) => (new Date(b.date_created)) - (new Date(a.date_created)));

  } else if (sortBy === "PRIORITY") {
    sortedTodos = subTodos.sort((a, b) => b.priority - a.priority);
  }

  function handleInputSortChange(e) {
    setSortBy(e.target.value);
  }

  
  return (

    <div className={styles.todoscontainer}>
      <div>
        <label>
          sort:
          <select name='sort' value={sortBy} onChange={handleInputSortChange}>
            <option value="DATE">date</option>
            <option value="PRIORITY">priority</option>
          </select>
        </label>
      </div>

      <div>
        {sortedTodos.map((todo) => {
                        return <Todo 
                                key={todo.tid} 
                                tid={todo.tid} 
                                parentid={parentid} 
                                date_created={todo.date_created} 
                                priority={todo.priority} 
                                description={todo.description} 
                                completed={todo.completed} 
                                handleAddTodo={handleAddTodo}
                                handleDeleteTodo={handleDeleteTodo} 
                                handleEditTodo={handleEditTodo}
                                todos={todos} />
                      })}  
      </div>
    </div>

  );
}