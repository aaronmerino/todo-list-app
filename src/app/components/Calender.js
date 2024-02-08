'use client'

import { useState, useRef, useEffect } from 'react';
import { Day } from './Day';
import styles from './calender-styles.module.css'

export function Calender({
  handleCalenderClick,
  todos}) {
  
  // find all todos that are completed on this date
  // the more todos completed, the more saturated the color becomes?

  // a year is a leap year iff (the year is divisible by 4) AND (the year is not divisible by 100 OR the year is divisible by 400)

  /*
  Jan: 31 days
  Feb: 28 days or 29 days in a leap year
  Mar: 31 days
  Apr: 30
  May: 31
  Jun: 30
  Jul: 31
  Aug: 31
  Sep: 30
  Oct: 31
  Nov: 30
  Dec: 31
  */
  const now = new Date();
  const currYear = now.getFullYear();
  const isLeapYear = ((currYear % 4) === 0) && ( !((currYear % 100) === 0) || ((currYear % 400) === 0) );

  const daysInAMonth = {
    1 : 31,
    2 : isLeapYear ? 29 : 28,
    3 : 31,
    4 : 30,
    5 : 31,
    6 : 30,
    7 : 31,
    8 : 31,
    9 : 30,
    10 : 31,
    11 : 30,
    12 : 31
  }

  let days = [];
  let lightBackground = true;
  let dayId = 1;

  const offset = (new Date(`${currYear}-01-01`)).getDay();
  for (let i = 0; i <= offset; i++) {
    days.push(<div key={`${i} offset`}></div>)
  }

  for (let month = 1; month <= 12; month++) {
    for (let day = 1; day <= daysInAMonth[month]; day++) {
      const m = month < 10 ? '0' + month : month;
      const d = day < 10 ? '0' + day : day;
      const currDate = `${currYear}-${m}-${d}`;

      days.push(<Day key={dayId} date={currDate} handleCalenderClick={handleCalenderClick} todos={todos} lightBackground={lightBackground} />)
      dayId += 1;  
    }
    lightBackground = !lightBackground;
  }

  return (
    <div className={styles.daysContainer}>
      {days}
    </div>
  );
}