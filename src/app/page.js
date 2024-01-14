'use client'

import styles from './page.module.css'
import { Todo } from './components/Todo';
import { useEffect, useState } from 'react';

/*
  <tid, parentid>

  <1, null>
  <2, null>
  <3, 1>
  <4, 1>
  <5, 2>

  go through each row and check if parentid has already been created in hashtable
    if created already, 
      get Todo object and make new todo and add it to the parent
      also add new Todo into hash table
    if not created:
      make Todo for parent and add the current Todo to the parent
      add both the parent and current Todo to hash table
*/
	
  
class TodoNode {
  constructor(tid, parent, date_created, priority, description, completed) {
    this.tid = tid;
    this.parent = parent;
    this.date_created = date_created;
    this.priority = priority;
    this.description = description;
    this.completed = completed;

    this.children = [];
  }

  getDepthLevel() {
    // start at current level and keep going up its parent and continue to add until parent = null
  }

  addChild(data) {
    this.children.push(new TodoNode(data));
  }
}

export default function Home() {

  const [todos, setTodos] = useState([]);

  // this hashTodos is a one-time use only, and its only used for creating the Todo Tree uising the TodoNode class...
  // we will update the state of this tree, like adding, editing, and deleting nodes and such...
  let hashTodos = new Map();



  
  useEffect(() => {
    fetch('/api/users/todos', { 
      method: 'GET'      
    })
    .then( (res) => {
      return res.json();
    })
    .then( (data) => {
      console.log(data.res);
      setTodos(data.res);
    })
    .catch( (err) => {
      console.error(err);
    });   
  }, []);

  function handleAddTodo(tid) {
    // get Todo from database using tid
    // add it to list of todos
    fetch(`/api/users/todos/${tid}`, { 
      method: 'GET'      
    })
    .then( (res) => {
      return res.json();
    })
    .then( (data) => {
      setTodos([...todos, data.res[0]]);
    })
    .catch( (err) => {
      console.error(err);
    });       
  }

  return (
    <main className={styles.main}>
      {/* tid, parentid, date_created, priority, description, completed */}
      <div>
        {todos.map((todo) => {
          if (todo.parentid === null) {
            console.log(todo.parentid);
            return <Todo key={todo.tid} tid={todo.tid} parentid={todo.parentid} date_created={todo.date_created} priority={todo.priority} description={todo.description} completed={todo.completed} todos={todos} handleAddTodo={handleAddTodo} />
          }
        })}
      </div>
    </main>
  );
}