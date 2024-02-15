import { ITask } from '@/interfaces/itask';
import styles from '../app/page.module.css';
import { IFetchData } from '@/interfaces/ifetch-data';
import UpdateTask from '@/lib/api/update-task';
import callAPI from '@/utils/call-api';
import { useRouter } from 'next/navigation';

const Card = ({item, index}: any) => {
  const router = useRouter();

  const updateTask = async(params: ITask, isDelete: boolean = false) => {
    const taskData: ITask = {
      ...params,
      taskStatus: isDelete ? 'DELETED' : 'DONE'
    }
    const payload: IFetchData = UpdateTask.put(taskData);

    try {
      const response = await callAPI({ ...payload });
      console.log('response update', response);
    } catch (error) {
      console.log('err', error);
    }
  }

  const statusLabel = (status: string) => {
    switch(status) {
      case 'IN_PLAN':
        return 'TODO';
      default:
        return status;
    }
  }

  const redirectEdit = (id: string) => router.push(`/post?id=${id}`);

  return(
    <div className={styles.detailInfo}>
      <p className={styles.taskTitle}>{item.taskTitle}</p>
      <div className="secondary-details">
        <p className={styles.taskDesc}>
          {item.taskDescription}
        </p>
      </div>
      <p className={item.taskStatus === 'DONE' ? styles.doneStatus : styles.todoStatus}>{statusLabel(item.taskStatus)}</p>
      {item.taskStatus !== 'DONE' && (
        <div className={styles.flex}>
          <button className={styles.actionButton} onClick={() => updateTask(item)}>Move Done</button>
          <button className={styles.actionButton} onClick={() => redirectEdit(item.taskId)}>Edit</button>
          <button className={styles.actionButton} onClick={() => updateTask(item, true)}>Delete</button>
        </div>)}
    </div>
  );
} 

export default Card;