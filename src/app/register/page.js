'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react';

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
      }).then(data => {
        console.log(data);
        if (data.message === "invalid") {
          throw new Error("Invalid username or password!");
        } else {
          router.push('/login');
        }
      })
      .catch((err) => {
        setValid(false);

      });
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      {!valid && <div>invalid username or password</div>}
      <label>
        username: <input name="username" />
      </label>
      <hr />
      <label>
        password: <input name="password" />
      </label>

      <button type="submit">Register</button>
    </form>
  );
}