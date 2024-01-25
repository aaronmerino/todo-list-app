'use client'

import { useRef } from 'react';
import styles from './calender-styles.module.css'

function getCurrentDate() {
  let now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  let day = now.getDate();
  
  // Pad to two digits
  month = month < 10 ? '0' + month : month;
  day = day < 10 ? '0' + day : day;

  return `${year}-${month}-${day}`;
}

export function Day({ 
  date,  // year-month-day
  lightBackground,
  todos }) {

  const dayRef = useRef(null);
  const isToday = date == getCurrentDate();


  let totalTodosDone = 0;
  for (let todo of todos) {
    if (todo.completed) {
      const todoDate = new Date(todo.completion_date);

      let year = todoDate.getFullYear();
      let month = todoDate.getMonth() + 1;
      let day = todoDate.getDate();
      
      month = month < 10 ? '0' + month : month;
      day = day < 10 ? '0' + day : day;
      
      const completionDate = `${year}-${month}-${day}`;
  
      if (date == completionDate) {
        totalTodosDone += 1;
      }
    }

  } 


  return (
    <div ref={dayRef} 
        className={`${styles.day} ${lightBackground ? styles.lightBackground : ''} ${isToday ? styles.currentDay : ''}`} 
        title={`${(new Date(date)).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })}`}
        style={ totalTodosDone != 0 ? {backgroundColor : `hsl(${lightBackground ? '260' : '80'}, ${Math.min(10 + totalTodosDone*totalTodosDone, 100)}%, ${Math.min(40 + totalTodosDone*1.25, 50)}%)`} : {} }
        > 
        
        {/* {totalTodosDone == 0 ? '' : totalTodosDone}  */}
        
    </div>
  );
}