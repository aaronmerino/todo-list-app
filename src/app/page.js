'use client'

import styles from './page.module.css'
import { Todo } from './components/Todo';
import { TodosContainer } from './components/TodosContainer';
import { useEffect, useState, useReducer } from 'react';
import { useRouter } from 'next/navigation'

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

export default function Home() {

  const [todos, setTodos] = useState([]);
  const [targetTodoId, setTargetTodoId] = useState(null);

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
    })
    .catch( (err) => {

      if (err.message === 'expired session') {
        router.push('/login');
      }
      
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

          for (let todo in newTodos) {
            if (todo.parentid === currentid) {
              todoStack.push(todo.tid);
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

    const data_obj = {
      tid: todo.tid,
      priority: todo.priority,
      description: todo.description,
      completed: todo.completed
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
              completed: todo.completed
            }
          }

        });

        setTodos(newTodos);
        setTargetTodoId(todo.tid);
      })
      .catch( (err) => {
        if (err.message === 'expired session') {
          router.push('/login');
        }

        console.error(err);
      });

  }

  ///IGNORE THE FUNCTIONS BELOW

  /*
  function handleAddRootTodo(e) {
    e.preventDefault();

    const data = {
      parentid: null,
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
      body: JSON.stringify(data),       
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
        setRootTodos([data.res[0], ...rootTodos]);
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

  function handleDeleteRootTodo(e, tid) {
    e.preventDefault();

    const data_obj = {
      tid: tid,
    };

    const data_str = JSON.stringify(data_obj);

    fetch(`/api/users/todos/${tid}`, { method: 'DELETE', body: data_str })
      .then( (res) => {
        if (!res.ok) {
          throw new Error(`${res.statusText}`);
        }

        return res.json();
      })
      .then( (data) => {
        setRootTodos(rootTodos.filter((t) => t.tid !== tid));
      })
      .catch( (err) => {
        if (err.message === 'expired session') {
          router.push('/login');
        }

        console.error(err);
      });   
  }

  function handleEditSubmit(e, subtid) {
    e.preventDefault();

    const data_obj = {
      tid: subtid,
      priority: e.target.priority.value,
      description: e.target.description.value,
      completed: e.target.completed.checked
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

        const newSubTodos = rootTodos.map((todo) => {
          if (todo.tid !== subtid) {
            return todo;
          } else {
            return {
              tid: todo.tid,
              parentid: null,
              date_created: todo.date_created,
              priority: e.target.priority.value,
              description: e.target.description.value,
              completed: e.target.completed.checked
            };
          }
        });

        setRootTodos(newSubTodos);
      })
      .catch( (err) => {
        if (err.message === 'expired session') {
          router.push('/login');
        }

        console.error(err);
      });

  }
  */

  return (
    <main className={styles.main}>

      <div>
        <button onClick={() => handleAddTodo(null)}>+</button>
      </div>

      <TodosContainer 
        parentid={null}
        subTodos={rootTodos}
        ascending={true} 
        handleAddTodo={handleAddTodo}
        handleDeleteTodo={handleDeleteTodo}
        handleEditTodo={handleEditTodo}
        targetTodoId={targetTodoId}
        todos={todos}
      />
      {/* <div>
        {rootTodos.map((todo) => {
          console.log(todo.parentid);
          return <Todo 
                  key={todo.tid} 
                  tid={todo.tid} 
                  parentid={todo.parentid} 
                  date_created={todo.date_created} 
                  priority={todo.priority} 
                  description={todo.description} 
                  completed={todo.completed} 
                  handleAddTodo={handleAddTodo}
                  handleDeleteTodo={handleDeleteTodo} 
                  handleEditTodo={handleEditTodo}
                  todos={todos} />
        })}
      </div> */}
    </main>
  );
}