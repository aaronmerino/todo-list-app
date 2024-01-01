'use client'

import { useEffect, useState } from 'react';

async function getDataPost() {
  const myInit = {
    method: "GET", //change to POST or GET
    headers: {
      Accept: "application/json",
    },
  };
  
  const response = await fetch("/api", myInit);
  return response;
}

export default function Page() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getDataPost()
      .then(response => response.json())
      .then(data => setData(data));
  }, []);

  return (
    <div>
      {data ? data["rows"].map(item => <div key={item.sid}>{item.sid}, {item.bid}</div>) : 'Loading...'}
    </div>
  );
}