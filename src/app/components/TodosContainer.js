'use client'

import { Todo } from './Todo';
import { useState } from 'react';
import styles from './styles.module.css'


export function TodosContainer({ parentid, subTodos, ascending, handleAddTodo, handleDeleteTodo, handleEditTodo, targetTodoId, todos }) {

  const [sortBy, setSortBy] = useState('DATE_NEWEST');

  let sortedTodos = null;

  if (sortBy === "DATE_NEWEST") {
    sortedTodos = subTodos.sort((a, b) => (new Date(b.date_created)) - (new Date(a.date_created)));
  } else if (sortBy === "PRIORITY_HIGHEST") {
    sortedTodos = subTodos.sort((a, b) => b.priority - a.priority);
  } else if (sortBy === "DATE_OLDEST") {
    sortedTodos = subTodos.sort((a, b) => (new Date(a.date_created)) - (new Date(b.date_created)));
  } else if (sortBy === "PRIORITY_LOWEST") {
    sortedTodos = subTodos.sort((a, b) => a.priority - b.priority);
  } 

  function handleInputSortChange(e) {
    setSortBy(e.target.value);
  }

  
  return subTodos.length > 0 && 
    (<div className={styles.todoscontainer}>
      <div>
        <label>
          sort:
          <select name='sort' value={sortBy} onChange={handleInputSortChange}>
            <option value="DATE_OLDEST">oldest date</option>
            <option value="DATE_NEWEST">newest date</option>
            <option value="PRIORITY_LOWEST">lowest priority</option>
            <option value="PRIORITY_HIGHEST">highest priority</option>
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
                                completion_date={todo.completion_date}
                                handleAddTodo={handleAddTodo}
                                handleDeleteTodo={handleDeleteTodo} 
                                handleEditTodo={handleEditTodo}
                                targetTodoId={targetTodoId}
                                todos={todos} />
                      })}  
      </div>
    </div>);
}