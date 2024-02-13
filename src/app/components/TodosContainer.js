'use client'

import { Todo } from './Todo';
import { useState } from 'react';
import styles from './todos-styles.module.css'

function areDatesEqual(date1, date2) {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
}

export function TodosContainer({ 
  parentid, 
  subTodos, 
  handleAddTodo, 
  handleDeleteTodo, 
  handleEditTodo, 
  targetTodoId, 
  resetTargetTodoId, 
  todos }) {

  const [sortBy, setSortBy] = useState('DATE_NEWEST');
  const [showCompleted, setShowCompleted] = useState(true);

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

  if (!showCompleted) {
    sortedTodos = sortedTodos.filter((t) => !t.completed);
  }
  

  function handleInputSortChange(e) {
    setSortBy(e.target.value);
  }

  function handleShowInputChange(e) {
    setShowCompleted(e.target.checked);
  }

  
  return (subTodos.length > 0) && 
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

        <label>
          show completed:
          <input name='showCompleted' type="checkbox" checked={showCompleted} onChange={handleShowInputChange}/>
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
                                resetTargetTodoId={resetTargetTodoId}
                                targetTodoId={targetTodoId}
                                todos={todos} />
                      })}  
      </div>
    </div>);
}