// src/controllers/TaskController.ts

import { Task } from "../models/Task";

export class TaskController {
    tasks: Task[] = [];
    completedTasks: Task[] = [];

    addTask(taskName: string, taskPriority: string, taskDeadline: string) {
        if (taskName.trim() === "" || taskDeadline === "") {
            alert("Please enter a task and select a valid deadline.");
            return;
        }

        const selectedDate = new Date(taskDeadline);
        const currentDate = new Date();

        if (selectedDate <= currentDate) {
            alert("Please select a future date for the deadline.");
            return;
        }

        const newTask = new Task(
            this.tasks.length + 1,
            taskName,
            taskPriority,
            taskDeadline
        );

        this.tasks.push(newTask);
    }

    editTask(id: number, taskName: string, taskPriority: string, taskDeadline: string) {
        const taskToEdit = this.tasks.find((t) => t.id === id);
        if (taskToEdit) {
            taskToEdit.task = taskName;
            taskToEdit.priority = taskPriority;
            taskToEdit.deadline = taskDeadline;
            this.tasks = this.tasks.filter((t) => t.id !== id);
        }
    }

    deleteTask(id: number) {
        this.tasks = this.tasks.filter((t) => t.id !== id);
    }

    markDone(id: number) {
        const taskToMark = this.tasks.find((t) => t.id === id);
        if (taskToMark) {
            taskToMark.done = true;
            this.completedTasks.push(taskToMark);
            this.tasks = this.tasks.filter((t) => t.id !== id);
        }
    }
}
