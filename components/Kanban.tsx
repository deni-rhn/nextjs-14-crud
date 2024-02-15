"use client"

import { useEffect } from "react";
import Card from "./Card";
import styles from "../app/page.module.css";
import { ITask } from "@/interfaces/itask";
import { useCustomState } from "@/utils/use-custom-state";
import { removeDuplicateArr } from "../helper/removeDuplicateArr";
import { layoutColumns } from "@/common/constant";

interface IProps {
  taskList: ITask[];
  wsData: any;
}

const Kanban = ({
  taskList,
  wsData
}: IProps) => {
  const [items, updateItems] = useCustomState();

  useEffect(() => {
    if (taskList.length > 0 && !wsData) {
      parseToEachStatus();
    }
    if (wsData) {
      if (wsData?.CREATED) {
        let columnDataLatest: any = items;
        columnDataLatest.IN_PLAN.items = [...columnDataLatest.IN_PLAN.items, wsData?.CREATED];
        updateItems((it: any) => columnDataLatest);
      } else if (wsData?.UPDATED) {
        const updatedTask: ITask = wsData?.UPDATED;
        let columnData: any = items;
        if (updatedTask.taskStatus === 'DONE')  {
          const doneItems: ITask[] = removeDuplicateArr([...columnData.DONE.items, updatedTask]);
          columnData.DONE.items = doneItems;
        }
        const inPlanItems: ITask[] = columnData.IN_PLAN.items.filter((it: ITask) => it.taskId !== updatedTask.taskId);
        columnData.IN_PLAN.items = inPlanItems
        updateItems((it: any) => columnData);
      }
    }
  }, [taskList, wsData]);

  const parseToEachStatus = () => {
    const inPlanTask: ITask[] = taskList.filter(item => item.taskStatus === 'IN_PLAN');
    const resolvedTask: ITask[] = taskList.filter(item => item.taskStatus === 'DONE');
    let columnKanban = layoutColumns;
    columnKanban.IN_PLAN.items = inPlanTask;
    columnKanban.DONE.items = resolvedTask;
    updateItems((it: any) => columnKanban);
  }

  return(
    <div className={styles.flex}>
      <div className={styles.columnStyle}>
        {items && Object.entries(items).map(([columnId, column]: any, idx) => (
          <div className={styles.taskList} key={idx}>
            <h2 className={styles.fontColor}>{column.title}</h2>
            {column.items.map((item: ITask, index: number) => (
              <Card key={item?.taskId} item={item} index={index} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Kanban;