'use client'

import styles from './page.module.css'
import { TodosContainer } from '../../components/TodosContainer';
import { Calender } from '../../components/Calender';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation'
import { filter } from '../../../../jest.config';


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

  setParent(parent) {
    this.parent = parent;
  }

  setDateCreated(date_created) {
    this.date_created = date_created;
  }

  setPriority(priority) {
    this.priority = priority;
  }

  setDescription(description) {
    this.description = description;
  }

  setCompleted(completed) {
    this.completed = completed;
  }

  getDepthLevel() {
    // start at current level and keep going up its parent and continue to add until parent = null
  }

  addChild(todo) {
    this.children.push(todo);
  }

  getAllTodosList() {
    let res = [];
    res.push({
      tid: this.tid,
      parent: this.parent,
      date_created: this.date_created,
      priority: this.priority,
      description: this.description,
      completed: this.completed
    });

    for (let todo of this.children) {
      res.push(todo);
      res = [todo.getList(), ...res]
    }

    return res;
  }
}

function generateSuperRootTodoTree(todos) {
  // this hashTodos is a one-time use only, and its only used for creating the Todo Tree uising the TodoNode class...
  // we will update the state of this tree, like adding, editing, and deleting nodes and such...
  let hashTodos = new Map();
  let superRootTodo = new TodoNode('superRoot', null, null, null, null, null);

  for (let todo of todos) {
    if (!hashTodos.has(todo.tid)) {
      // tid, parent, date_created, priority, description, completed
      if (todo.parentid !== null) {
        // Check if parentid node is in hash
        if (hashTodos.has(todo.parentid)) {
          const parentTodo = hashTodos.get(todo.parentid);
          const newTodo = new TodoNode(todo.tid, parentTodo, todo.date_created, todo.priority, todo.description, todo.completed);
          
          parentTodo.addChild(newTodo);
        } else {
          const parentTodo = new TodoNode(todo.parentid, null, null, null, null, null);

          hashTodos.set(todo.parentid, {node: parentTodo, visited: false});
  
          parentTodo.addChild(newTodo);
        }
      } else {
        const newTodo = new TodoNode(todo.tid, superRootTodo, todo.date_created, todo.priority, todo.description, todo.completed);

        hashTodos.set(todo.tid, {node: newTodo, visited: true});

        superRootTodo.addChild(newTodo);
      }
    } else {
      if (!hashTodos.get(todo.tid).visited) {
        const todoNode = hashTodos.get(todo.tid).node;
        
        if (todo.parentid !== null) {
          if (hashTodos.has(todo.parentid)) {
            const parentTodo = hashTodos.get(todo.parentid);

            todoNode.setParent(parentTodo);
            todoNode.setDateCreated(todo.date_created);
            todoNode.setPriority(todo.priority);
            todoNode.setDescription(todo.description);
            todoNode.setCompleted(tood.completed);

            parentTodo.addChild(todoNode);

          } else {
            const parentTodo = new TodoNode(todo.parentid, null, null, null, null, null);

            hashTodos.set(todo.parentid, {node: parentTodo, visited: false});
    
            parentTodo.addChild(todoNode);
          }
        } else {
          const newTodo = new TodoNode(todo.tid, superRootTodo, todo.date_created, todo.priority, todo.description, todo.completed);

          hashTodos.set(todo.tid, {node: newTodo, visited: true});

          superRootTodo.addChild(newTodo);
        }
      }
    }


  }

  return superRootTodo;
}


function getDateTime() {
  let now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  let day = now.getDate();
  let hour = now.getHours();
  let minute = now.getMinutes();
  let second = now.getSeconds();
  
  // Pad to two digits
  month = month < 10 ? '0' + month : month;
  day = day < 10 ? '0' + day : day;
  hour = hour < 10 ? '0' + hour : hour;
  minute = minute < 10 ? '0' + minute : minute;
  second = second < 10 ? '0' + second : second;
  
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

export default function Home() {

  const [loaded, setLoaded] = useState(false);
  const [todos, setTodos] = useState([]);
  const [targetTodoId, setTargetTodoId] = useState(null);
  const [isFlat, setIsFlat] = useState(false);
  const [filterDate, setFilterDate] = useState(null);

  const latestTargetTodoId = useRef(null);

  const router = useRouter();
  const rootTodos = todos.filter((t) => t.parentid === null);

  useEffect(() => {
    fetch('/api/users/todos', { 
      method: 'GET'      
    })
    .then( (res) => {
      if (!res.ok) {
        throw new Error(`${res.statusText}`);
      }

      return res.json();
    })
    .then( (data) => {
      setTodos(data.res);
      setLoaded(true);
    })
    .catch( (err) => {
      router.push('/login');
      console.error(err);
    });   
  }, []);


  function handleAddTodo(parentid) {
    const todoData = {
      parentid: parentid,
      priority: 1,
      description: '',
      completed: 0
    };

    // make request to insert blank todo
    fetch('/api/users/todos', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todoData),       
    })
    .then( (res) => {
      if (!res.ok) {
        throw new Error(`${res.statusText}`);
      }

      return res.json();
    })
    .then( (data) => {
      const addedTid = data.res.insertId;

      fetch(`/api/users/todos/${addedTid}`, { 
        method: 'GET'      
      })
      .then( (res) => {
        return res.json();
      })
      .then( (data) => {
        setTodos([data.res[0], ...todos]);
        setTargetTodoId(addedTid);
        latestTargetTodoId.current = addedTid;
      })
      .catch( (err) => {
        console.error(err);
      });  

    })
    .catch( (err) => {
      if (err.message === 'expired session') {
        router.push('/login');
      }
      console.error(err);
    });
  }

  function handleDeleteTodo(tid) {
    const data = {
      tid: tid,
    };

    const data_str = JSON.stringify(data);

    fetch(`/api/users/todos/${tid}`, { method: 'DELETE', body: data_str })
      .then( (res) => {
        if (!res.ok) {
          throw new Error(`${res.statusText}`);
        }

        return res.json();
      })
      .then( () => {
        let todosToDelete = [tid];
        let newTodos = [...todos];
        
        while (todosToDelete.length > 0) {
          let currentid = todosToDelete.pop();
          for (let todo of newTodos) {   
            if (todo.parentid == currentid) {
              todosToDelete.push(todo.tid);
            }
          }

          newTodos = newTodos.filter((t) => t.tid !== currentid);
        }
        
        setTodos(newTodos);
      })
      .catch( (err) => {
        if (err.message === 'expired session') {
          router.push('/login');
        }

        console.error(err);
      });
  }

  function handleEditTodo(todo) {
    const now = getDateTime();

    const data_obj = {
      tid: todo.tid,
      priority: todo.priority,
      description: todo.description,
      completed: todo.completed,
      completion_date: now
    };

    const data_str = JSON.stringify(data_obj);

    fetch('/api/users/todos', { method: 'PUT', body: data_str })
      .then( (res) => {
        if (!res.ok) {
          throw new Error(`${res.statusText}`);
        }

        return res.json();
      })
      .then( () => {

        let newTodos = todos.map((t) => {
          if (t.tid !== todo.tid) {
            return t;
          } else {
            return {
              ...t, 
              priority: todo.priority,
              description: todo.description,
              completed: todo.completed,
              completion_date: !t.completed && todo.completed ? now : (todo.completed ? t.completion_date : null)
            }
          }
        });

        setTodos(newTodos);
        setTargetTodoId(todo.tid);
        latestTargetTodoId.current = todo.tid;
      })
      .catch( (err) => {
        if (err.message === 'expired session') {
          router.push('/login');
        }

        console.error(err);
      });

  }

  function resetTargetTodoId(tid) {
    if (tid === latestTargetTodoId.current) {
      setTargetTodoId(null);
      latestTargetTodoId.current = null;
    }
  }

  function handleCalenderClick(date) {
    setIsFlat(true);
    setFilterDate(date);
  }

  function handleReturnDefault() {
    setIsFlat(false);
    setFilterDate(null);
  }


  return (
    loaded && (
      <main className={styles.main}>
        <Calender handleCalenderClick={handleCalenderClick} selectedDate={filterDate} todos={todos}/>

        <div>
          <button className={isFlat ? styles.disabled : ''} disabled={isFlat} onClick={() => handleAddTodo(null)}>+</button>
        </div>

        <TodosContainer 
          parentid={null}
          subTodos={rootTodos}
          isFlat={isFlat}
          filterDate={filterDate}
          handleReturnDefault={handleReturnDefault}
          handleAddTodo={handleAddTodo}
          handleDeleteTodo={handleDeleteTodo}
          handleEditTodo={handleEditTodo}
          targetTodoId={targetTodoId}
          resetTargetTodoId={resetTargetTodoId}
          todos={todos}
        />
        
      </main>
    ) );
}