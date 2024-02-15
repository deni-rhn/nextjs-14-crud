"use client"

import { ITask } from "@/interfaces/itask";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { IFetchData } from "@/interfaces/ifetch-data";
import CreateTask from '@/lib/api/create-task';
import callAPI from "@/utils/call-api";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import DetailTask from '@/lib/api/detail-task';
import updateTask from "@/lib/api/update-task";
import styles from '../page.module.css';

export default function Home() {
  const [taskDetail, setTaskDetail] = useState<ITask>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const postSchema = yup.object().shape({
    taskTitle: yup.string().label("Title").required(),
    taskDescription: yup.string().label("Description").required()
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(postSchema)
  });

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      getDetailTask(id);
    }
  }, []);

  const getDetailTask = async (id: string) => {
    const payload: IFetchData = DetailTask.get(id);

    try {
      const response = await callAPI({ ...payload });
      const taskData: ITask = response?.data;
      if (taskData) {
        setTaskDetail(taskData);
        let defaultValues: any = {};
        defaultValues.taskTitle = taskData.taskTitle;
        defaultValues.taskDescription = taskData.taskDescription;
        reset({ ...defaultValues });
      }
    } catch (error) {
      console.log('ERR', error);
    }
  }

  const onSubmit = async (formValue: any) => {
    let params: ITask = {
      ...formValue,
      taskStatus: taskDetail ? taskDetail.taskStatus : 'IN_PLAN',
      active: true
    }
    if (taskDetail) {
      params.taskId = taskDetail.taskId;
    }
    const payload: IFetchData = taskDetail ? updateTask.put(params) : CreateTask.post(params);
    try {
      const response = await callAPI({ ...payload });
      if (response) {
        router.push('/');
      }
    } catch (error) {
      console.log('ERR', error);
    }
  }

  return (
    <div className={styles.createWrapper}>
      <h3>CREATE TASK</h3><br />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Title</label><br />
          <input className={styles.inputCommon} type="text" {...register("taskTitle")} />
          <div className={styles.errText}>{errors.taskTitle?.message}</div>
        </div><br />
        <div>
          <label>Description</label><br />
          <textarea className={styles.inputCommon} {...register("taskDescription")}></textarea>
          <div className={styles.errText}>{errors.taskDescription?.message}</div>
        </div><br />
        <div>
          <input className={styles.createButton} style={{ width: '50%' }} type="submit" />
        </div>
      </form>
    </div>
  );
}