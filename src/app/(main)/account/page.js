'use client'

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

export default function Account() {
  const router = useRouter();

  function handleLogout() {
    fetch(`/api/logout`, { method: 'DELETE' })
    .then( (res) => {
      console.log(res);
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
    <main className={styles.main}>
      <div>
        <button onClick={handleLogout}>logout</button>
        <button onClick={()=>{}}>change password</button>
        <button onClick={()=>{}}>delete account</button>
      </div>
    </main>
  );
}