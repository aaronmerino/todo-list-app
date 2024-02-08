'use client'

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

export default function Account() {
  const router = useRouter();

  const [loaded, setLoaded] = useState(false);
  const [userInfo, setUserInfo] = useState([]);

  useEffect(() => {
    fetch('/api/users/info', { 
      method: 'GET'      
    })
    .then( (res) => {
      if (!res.ok) {
        throw new Error(`${res.statusText}`);
      }

      return res.json();
    })
    .then( (data) => {
      setUserInfo(data.res[0]);
      setLoaded(true);
    })
    .catch( (err) => {
      router.push('/login');
      console.error(err);
    });   
  }, []);
  

  function handleLogout() {
    fetch(`/api/logout`, { method: 'DELETE' })
    .then( (res) => {
      
      if (res.status !== 302) {
        throw new Error(`${res.statusText}`);
      }

      return res.json();
    })
    .then((body) => {
      router.push(body.riderectTo);
    })
    .catch( (err) => {
      router.push('/login');
      console.error(err);
    }); 
  }

  return (
    loaded && (    
      <main className={styles.main}>
        <div className={styles.userInfo}>
          <div>
            username: {userInfo.username}
          </div>
          <div>
            account created: {`${(new Date(userInfo.register_time)).toDateString()}, ${(new Date(userInfo.register_time)).toLocaleTimeString()}`}
          </div>
          <div>
            uid: {userInfo.uid}
          </div>
        </div>

        <div>
          <button onClick={handleLogout}>logout</button>
          <button onClick={()=>{}}>change password</button>
          <button onClick={()=>{}}>delete account</button>
        </div>
      </main>
    )
    );
}