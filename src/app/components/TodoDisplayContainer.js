'use client'

import { TodoDisplay } from './TodoDisplay';
import { useState } from 'react';
import styles from './todos-styles.module.css'

function areDatesEqual(date1, date2) {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
}

export function TodoDisplayContainer({ 
  filterDate=null,
  handleReturnDefault=null,
  todos }) {

  const [sortBy, setSortBy] = useState('DATE_NEWEST');

  let sortedTodos = null;

  if (sortBy === "DATE_NEWEST") {
    sortedTodos = todos.sort((a, b) => (new Date(b.date_created)) - (new Date(a.date_created)));
  } else if (sortBy === "PRIORITY_HIGHEST") {
    sortedTodos = todos.sort((a, b) => b.priority - a.priority);
  } else if (sortBy === "DATE_OLDEST") {
    sortedTodos = todos.sort((a, b) => (new Date(a.date_created)) - (new Date(b.date_created)));
  } else if (sortBy === "PRIORITY_LOWEST") {
    sortedTodos = todos.sort((a, b) => a.priority - b.priority);
  } 

  sortedTodos = sortedTodos.filter((t) => {
    if (!t.completed) {
      return false;
    }

    const filterYear = parseInt(filterDate.split('-')[0]);
    const filterMonth = parseInt(filterDate.split('-')[1]) - 1;
    const filterDay = parseInt(filterDate.split('-')[2]);

    let date1 = new Date(t.completion_date);
    let date2 = new Date(filterYear, filterMonth, filterDay);

    return areDatesEqual(date1, date2);
  });

  function handleInputSortChange(e) {
    setSortBy(e.target.value);
  }

  return (
  <div className={styles.todoscontainer}>
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

      <span className='highlight'>displaying completed on {`${(new Date(filterDate)).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })}`}</span>

     <button onClick={handleReturnDefault}>return</button>

    </div>

    <div>
      {sortedTodos.map((todo) => {
                      return <TodoDisplay 
                              key={todo.tid} 
                              tid={todo.tid} 
                              parentid={todo.parentid} 
                              date_created={todo.date_created} 
                              priority={todo.priority} 
                              description={todo.description} 
                              completed={todo.completed} 
                              completion_date={todo.completion_date}
                              highlighted={true}
                              todos={todos} />
                    })}  
    </div>
  </div>
  );
}