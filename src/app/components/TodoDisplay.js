// TodoDisplay will handle if a Todo is not a parent, tehn make it a path from Parent to the completed Todo; 
// else if it is a parent then its just the TodoDisplay with the node.

'use client'

import { useRef } from 'react';
import styles from './todos-styles.module.css'

export function TodoDisplay({ 
  tid, 
  parentid, 
  date_created, 
  priority, 
  description, 
  completed, 
  completion_date,  
  children,
  highlighted=false,
  todos }) {

  const containerRef = useRef(null);

  if (parentid !== null) {
    const displayed = (
      <div ref={containerRef} className={ `${parentid !== null ? `${styles.todo} ${styles.subtodo}` : styles.todo} ${highlighted ? `${styles.subtodoHighlight2}` : `${styles.subtodo}`}` }>
        <div>
          <div>
            priority: { priority == 3 ? <span className={`${styles.circle} ${styles.red}`}/> : ( priority == 2 ? <span className={`${styles.circle} ${styles.yellow}`}/> : <span className={`${styles.circle} ${styles.green}`}/> ) }
          </div>
          
          <div>
            created: {`${(new Date(date_created)).toDateString()}, ${(new Date(date_created)).toLocaleTimeString()}`}
          </div>
          
          <div>
            completed: {completed ? "✅" : "❌"}  {completed ? <span className={`${highlighted ? `${styles.highlight2}` : `${styles.highlight}` }`}> {`${(new Date(completion_date)).toDateString()}, ${(new Date(completion_date)).toLocaleTimeString()}`} </span> : null} 
          </div>
          
    
          <hr />
    
          <textarea name='description' type="text" value={description} placeholder="description" readOnly/>
  
        </div>
  
        <hr />

        <div>
          {children}
        </div>
      </div>
    );

    // recursion?
    // find todo of this parent todo
    let parentTodo = null;
    for (const t of todos) {
      if (t.tid === parentid) {
        parentTodo = t;
        break;
      }
    }

    //
    return (
      <TodoDisplay  
        key={parentTodo.tid} 
        tid={parentTodo.tid}
        parentid={parentTodo.parentid}
        date_created={parentTodo.date_created}
        priority={parentTodo.priority} 
        description={parentTodo.description} 
        completed={parentTodo.completed} 
        completion_date={parentTodo.completion_date} 
        todos={todos}    
      >

      {displayed}

      </TodoDisplay>
    );

  } else {

    return (
      <div ref={containerRef} className={ `${parentid !== null ? `${styles.todo} ${styles.subtodo}` : styles.todo} ${highlighted ? `${styles.subtodoHighlight2}` : `${styles.subtodo}`}` }>
        <div>
          <div>
            priority: { priority == 3 ? <span className={`${styles.circle} ${styles.red}`}/> : ( priority == 2 ? <span className={`${styles.circle} ${styles.yellow}`}/> : <span className={`${styles.circle} ${styles.green}`}/> ) }
          </div>
          
          <div>
            created: {`${(new Date(date_created)).toDateString()}, ${(new Date(date_created)).toLocaleTimeString()}`}
          </div>
          
          <div>
            completed: {completed ? "✅" : "❌"}  {completed ? <span className={`${highlighted ? `${styles.highlight2}` : `${styles.highlight}` }`}> {`${(new Date(completion_date)).toDateString()}, ${(new Date(completion_date)).toLocaleTimeString()}`} </span> : null} 
          </div>
          
    
          <hr />
    
          <textarea name='description' type="text" value={description} placeholder="description" readOnly/>
  
        </div>
  
        <hr />

        <div>
          {children}
        </div>
      </div>
    );
  }

}