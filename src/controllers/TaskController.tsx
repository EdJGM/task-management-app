import { db, auth } from "../firebase/config";
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { Task } from "../models/Task";

export class TaskController {
    tasks: Task[] = [];
    completedTasks: Task[] = [];

    async addTask(taskName: string, taskPriority: string, taskDeadline: string) {
        if (taskName.trim() === "" || taskDeadline === "") {
            alert("Introduzca una tarea y seleccione una fecha límite válida.");
            return;
        }

        const selectedDate = new Date(taskDeadline);
        const currentDate = new Date();

        if (selectedDate <= currentDate) {
            alert("Seleccione una fecha futura para la fecha límite.");
            return;
        }

        const user = auth.currentUser;
        if (user) {
            try {
                const newTaskRef = await addDoc(collection(db, "tasks"), {
                    uid: user.uid,
                    task: taskName,
                    priority: taskPriority,
                    deadline: taskDeadline,
                    status: "pending",
                    createdAt: new Date()
                });
                this.tasks.push(new Task(
                    newTaskRef.id,
                    taskName,
                    taskPriority,
                    taskDeadline
                ));
            } catch (error) {
                console.error("Error adding task: ", error);
            }
        }
    }

    async editTask(taskId: string, taskName: string, taskPriority: string, taskDeadline: string) {
        const taskRef = doc(db, "tasks", taskId);
        try {
            await updateDoc(taskRef, {
                task: taskName,
                priority: taskPriority,
                deadline: taskDeadline,
                updatedAt: new Date()
            });
            const taskIndex = this.tasks.findIndex(task => task.id === taskId);
            if (taskIndex !== -1) {
                this.tasks[taskIndex] = {
                    ...this.tasks[taskIndex],
                    task: taskName,
                    priority: taskPriority,
                    deadline: taskDeadline
                };
            }
        } catch (error) {
            console.error("Error editing task: ", error);
        }
    }

    async deleteTask(id: string) {
        const user = auth.currentUser;
        if (user) {
            const taskDocRef = doc(db, "tasks", id);
            try {
                await deleteDoc(taskDocRef);
                this.tasks = this.tasks.filter((t) => t.id !== id);
            } catch (error) {
                console.error("Error deleting task: ", error);
            }
        }
    }

    async markDone(id: string) {
        const user = auth.currentUser;
        if (user) {
            const taskDocRef = doc(db, "tasks", id);
            try {
                await updateDoc(taskDocRef, {
                    status: "completed"
                });
                this.tasks = this.tasks.map(task =>
                    task.id === id ? { ...task, status: "completed" } : task
                );
            } catch (error) {
                console.error("Error marking task as done: ", error);
            }
        }
    }

    async fetchTasks() {
        const user = auth.currentUser;
        if (user) {
            const tasksQuery = query(collection(db, "tasks"), where("uid", "==", user.uid), where("status", "==", "pending"));
            const querySnapshot = await getDocs(tasksQuery);
            this.tasks = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Task[];
        }
    }

    async fetchCompletedTasks() {
        const user = auth.currentUser;
        if (user) {
            const tasksQuery = query(collection(db, "tasks"), where("uid", "==", user.uid), where("status", "==", "completed"));
            const querySnapshot = await getDocs(tasksQuery);
            this.completedTasks = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Task[];
        }
    }
}