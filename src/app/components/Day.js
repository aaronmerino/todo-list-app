'use client'

import { useState, useRef, useEffect } from 'react';
import { TodosContainer } from './TodosContainer';
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
        className={`${styles.day} ${lightBackground ? styles.lightBackground : ''} ${isToday ? styles.currentDay : ''}`} title={date}
        style={ totalTodosDone != 0 ? {backgroundColor : `hsl(${lightBackground ? '250' : '80'}, ${Math.min(totalTodosDone*6, 100)}%, ${lightBackground ? '50%' : '25%'})`} : {} }
        > 
        
        {/* {totalTodosDone == 0 ? '' : totalTodosDone}  */}
        
    </div>
  );
}