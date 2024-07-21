import { useState, useEffect, useRef } from "react";
import { TaskController } from "../controllers/TaskController";
import { Task } from "../models/Task";

export const useTasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
    const taskControllerRef = useRef(new TaskController());

    useEffect(() => {
        setTasks(taskControllerRef.current.tasks);
        setCompletedTasks(taskControllerRef.current.completedTasks);
    }, []);

    const addTask = (taskName: string, taskPriority: string, taskDeadline: string) => {
        taskControllerRef.current.addTask(taskName, taskPriority, taskDeadline);
        setTasks([...taskControllerRef.current.tasks]);
    };

    const editTask = (id: number, taskName: string, taskPriority: string, taskDeadline: string) => {
        taskControllerRef.current.editTask(id, taskName, taskPriority, taskDeadline);
        setTasks([...taskControllerRef.current.tasks]);
    };

    const deleteTask = (id: number) => {
        taskControllerRef.current.deleteTask(id);
        setTasks([...taskControllerRef.current.tasks]);
    };

    const markDone = (id: number) => {
        taskControllerRef.current.markDone(id);
        setTasks([...taskControllerRef.current.tasks]);
        setCompletedTasks([...taskControllerRef.current.completedTasks]);
    };

    return {
        tasks,
        completedTasks,
        addTask,
        editTask,
        deleteTask,
        markDone,
    };
};