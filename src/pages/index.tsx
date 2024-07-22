// src/pages/index.tsx
import { useState, useEffect, ChangeEvent } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useTasks } from "@/components/useTasks";
import { useRouter } from "next/router";
import { getAuth, signOut } from "firebase/auth";
import { app } from "../firebase";

interface HomePageProps {
    email?: string;
}

function HomePage({ email }: HomePageProps) {
    const router = useRouter();

    async function handleLogout() {
        await signOut(getAuth(app));
        await fetch("/api/logout");
        router.push("/login");
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <h1 className="text-xl mb-4">Super secure home page</h1>
            <p className="mb-8"> Only <strong>{email}</strong> holds the magic key to this kingdom! </p>
            <button onClick={handleLogout} className="text-white bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-primary-800" > Logout </button>
        </main>
    );
}

function TaskScheduler({ tokens }: { tokens: string[] }) {
    const { tasks, completedTasks, addTask, editTask, deleteTask, markDone } = useTasks();
    const [taskName, setTaskName] = useState<string>("");
    const [taskPriority, setTaskPriority] = useState<string>("Top");
    const [taskDeadline, setTaskDeadline] = useState<string>("");
    const [searchKeyword, setSearchKeyword] = useState<string>("");
    const [filterPriority, setFilterPriority] = useState<string>("");

    const handleTaskNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTaskName(e.target.value);
    };

    const handleTaskPriorityChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setTaskPriority(e.target.value);
    };

    const handleTaskDeadlineChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTaskDeadline(e.target.value);
    };

    const handleAddTask = () => {
        addTask(taskName, taskPriority, taskDeadline);
        setTaskName("");
        setTaskPriority("Top");
        setTaskDeadline("");
    };

    const handleEditTask = (id: number) => {
        const taskToEdit = tasks.find((t) => t.id === id);
        if (taskToEdit) {
            setTaskName(taskToEdit.task);
            setTaskPriority(taskToEdit.priority);
            setTaskDeadline(taskToEdit.deadline);
            editTask(id, taskName, taskPriority, taskDeadline);
        }
    };

    const filteredTasks = tasks
        .filter((t) => !t.done)
        .filter((t) => t.task.toLowerCase().includes(searchKeyword.toLowerCase()))
        .filter((t) => (filterPriority ? t.priority === filterPriority : true));

    return (
        <div className={styles.App}>
            <Head>
                <title>Gestión de Tareas</title>
            </Head>
            <header className={styles.taskHeader}>
                <h1>Gestión de Tareas</h1>
            </header>
            <main>
                <div className={styles.taskForm}>
                    <input
                        type="text"
                        className={styles.taskNameInput}
                        placeholder="Introducir tarea..."
                        value={taskName}
                        onChange={handleTaskNameChange}
                    />
                    <select
                        className={styles.taskPrioritySelect}
                        value={taskPriority}
                        onChange={handleTaskPriorityChange}
                    >
                        <option value="Top">Alta Prioridad</option>
                        <option value="Middle">Media Prioridad</option>
                        <option value="Low">Baja Prioridad</option>
                    </select>
                    <input
                        type="date"
                        className={styles.taskDeadlineInput}
                        value={taskDeadline}
                        onChange={handleTaskDeadlineChange}
                    />
                    <button className={styles.addTaskButton} onClick={handleAddTask}>
                        Agregar Tareas
                    </button>
                </div>
                <div className={styles.searchFilter}>
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Buscar tarea/s..."
                        value={searchKeyword}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchKeyword(e.target.value)}
                    />
                    <select
                        className={styles.filterPrioritySelect}
                        value={filterPriority}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilterPriority(e.target.value)}
                    >
                        <option value="">Todo</option>
                        <option value="Top">Alta Prioridad</option>
                        <option value="Middle">Media Prioridad</option>
                        <option value="Low">Baja Prioridad</option>
                    </select>
                </div>
                <h2 className={styles.heading}>Próximas tareas</h2>
                <div className={styles.taskList}>
                    <table className={styles.taskTable}>
                        <thead>
                            <tr>
                                <th>Nombre de la tarea</th>
                                <th>Prioridad</th>
                                <th>Fecha Limite</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTasks.map((t) => (
                                <tr key={t.id}>
                                    <td>{t.task}</td>
                                    <td>{t.priority}</td>
                                    <td>{t.deadline}</td>
                                    <td>
                                        {!t.done && (
                                            <div>
                                                <button
                                                    className={styles.markDoneButton}
                                                    onClick={() => markDone(t.id)}
                                                >
                                                    Marcar como hecho
                                                </button>
                                                <button
                                                    className={styles.editTaskButton}
                                                    onClick={() => handleEditTask(t.id)}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    className={styles.deleteTaskButton}
                                                    onClick={() => deleteTask(t.id)}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className={styles.completedTaskList}>
                    <h2 className={styles.completedHeading}>Tareas completadas</h2>
                    <table className={styles.completedTable}>
                        <thead>
                            <tr>
                                <th>Nombre de la tarea</th>
                                <th>Prioridad</th>
                                <th>Fecha Limite</th>
                            </tr>
                        </thead>
                        <tbody>
                            {completedTasks.map((ct) => (
                                <tr key={ct.id}>
                                    <td>{ct.task}</td>
                                    <td>{ct.priority}</td>
                                    <td>{ct.deadline}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}

export default function Home() {
    const [tokens, setTokens] = useState(null);

    useEffect(() => {
        async function fetchTokens() {
            const res = await fetch("/api/tokens");
            const data = await res.json();
            setTokens(data.tokens);
        }

        fetchTokens();
    }, []);

    if (!tokens) {
        return <div>Loading...</div>;
    }

    return <TaskScheduler tokens={tokens} />;
}
