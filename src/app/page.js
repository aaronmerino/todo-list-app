import Image from 'next/image'
import styles from './page.module.css'

import { Todo } from './components/Todo';

export default function Home() {
  return (
    <main className={styles.main}>
      <Todo tid='1' 
            uid='1' 
            date_created='2024-01-01' 
            priority='1' 
            description='random text here' 
            completed={false} />

    </main>
  );
}