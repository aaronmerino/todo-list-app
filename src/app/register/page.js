'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react';
import styles from './styles.module.css'

export default function Page() {
  const router = useRouter()
  const [valid, setValid] = useState(true);

  function handleSubmit(e) {
    e.preventDefault();

    // Read the form data
    const form = e.target;
    const formData = new FormData(form);

    fetch('/api/register', { method: form.method, body: formData })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not OK");
        }
        
        return response.json();
      }).then(() => {
        router.push('/login');
      })
      .catch(() => {
        setValid(false);
      });
  }

  return (
    <div className={styles.container}>
      <form className={styles.register} method="post" onSubmit={handleSubmit}>
        {!valid && <div className='error'><p>.invalid username or password</p><p>.must not contain spaces</p> <p>.character length must be between 5 and 20</p></div>}
        <label>
          username: <input autoComplete="new-password" name="username" />
        </label>
        
        <label>
          password: <input type="password" autoComplete="new-password" name="password" />
        </label>

        <button type="submit">register</button>

        <button type="button" onClick={() => router.push('/login')}>return</button>
      </form>
    </div>

  );
}