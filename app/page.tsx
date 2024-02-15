"use client"

import { useEffect, useState } from "react";
import Kanban from "../components/Kanban";
import { ITask } from "@/interfaces/itask";
import { useRouter } from "next/navigation";
import styles from './page.module.css';

export default function Home() {
  const [taskList, setTaskList] = useState<ITask[]>([]);
  const [wsData, setWsData] = useState();
  const router = useRouter();

  useEffect(() => {
    getAllTask();
  }, []);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080/task/ws");
    ws.onopen = () => {
      console.log("Connected to WebSocket server");
    };
    ws.onmessage = (event) => {
      // Handle incoming messages
      setWsData(JSON.parse(event.data));
      console.log("Received:", event.data);
    };
    ws.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };
    // return () => {
    //   ws.close();
    // };
  }, []);

  const getAllTask = () => {
    const urls: string = process.env.NEXT_PUBLIC_API_HOST + '/v1/task/list' || '';
    fetch(urls).then(resp => resp.json())
      .then((respData: ITask[]) => {
        setTaskList(respData);
      })
      .catch(err => console.log('err', err));
  }

  const kanbanProps = {
    taskList,
    wsData
  }

  return (
    <div className="todo-app">
      <button className={styles.createButton} onClick={() => router.push('/post')}>Create Task</button>
      <Kanban {...kanbanProps} />
    </div>
  );
}