// src/pages/index.tsx
import { useState, useEffect, ChangeEvent } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useTasks } from "@/components/useTasks";
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firebase/config'
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';


function TaskScheduler() {

    const [user] = useAuthState(auth);
    const router = useRouter()
    const [userSession, setUserSession] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const session = sessionStorage.getItem('user');
            setUserSession(session);
        }
    }, []);

    useEffect(() => {
        if (!user && !userSession) {
            router.push('/sign-up');
        }
    }, [user, userSession, router]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            sessionStorage.removeItem('user');
            router.push('/sign-in');
        } catch (error) {
            console.error('Error signing out: ', error);
        }
    };

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
            <header className={`${styles.taskHeader} shadow-md`}>
                <h1 className="text-3xl font-bold text-white text-center p-6 bg-gray-800">
                    Gestión de Tareas
                </h1>
            </header>
            <main className="p-4 bg-gray-100 min-h-screen">
                <div className={`${styles.taskForm} flex flex-col space-y-4`}>
                    <input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring focus:ring-indigo-500 transition duration-300"
                        placeholder="Introducir tarea..."
                        value={taskName}
                        onChange={handleTaskNameChange}
                    />
                    <select
                        className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring focus:ring-indigo-500 transition duration-300"
                        value={taskPriority}
                        onChange={handleTaskPriorityChange}
                    >
                        <option value="Top">Alta Prioridad</option>
                        <option value="Middle">Media Prioridad</option>
                        <option value="Low">Baja Prioridad</option>
                    </select>
                    <input
                        type="date"
                        className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring focus:ring-indigo-500 transition duration-300"
                        value={taskDeadline}
                        onChange={handleTaskDeadlineChange}
                    />
                    <button
                        className="w-full p-3 bg-indigo-600 rounded-lg text-white hover:bg-indigo-500 transition duration-300 font-medium"
                        onClick={handleAddTask}
                    >
                        Agregar Tareas
                    </button>
                </div>
                <div className={`${styles.searchFilter} flex space-x-4 mt-6`}>
                    <input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring focus:ring-indigo-500 transition duration-300"
                        placeholder="Buscar tarea/s..."
                        value={searchKeyword}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setSearchKeyword(e.target.value)
                        }
                    />
                    <select
                        className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring focus:ring-indigo-500 transition duration-300"
                        value={filterPriority}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                            setFilterPriority(e.target.value)
                        }
                    >
                        <option value="">Todo</option>
                        <option value="Top">Alta Prioridad</option>
                        <option value="Middle">Media Prioridad</option>
                        <option value="Low">Baja Prioridad</option>
                    </select>
                </div>
                <h2 className="text-2xl font-semibold mt-8">Próximas tareas</h2>
                <div className="overflow-x-auto mt-4">
                    <table className="w-full bg-white shadow-md rounded-lg">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="p-3">Nombre de la tarea</th>
                                <th className="p-3">Prioridad</th>
                                <th className="p-3">Fecha Limite</th>
                                <th className="p-3">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTasks.map((t) => (
                                <tr key={t.id} className="border-b hover:bg-gray-100">
                                    <td className="p-3">{t.task}</td>
                                    <td className="p-3">{t.priority}</td>
                                    <td className="p-3">{t.deadline}</td>
                                    <td className="p-3">
                                        {!t.done && (
                                            <div className="flex space-x-2">
                                                <button
                                                    className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-400 transition duration-300"
                                                    onClick={() => markDone(t.id)}
                                                >
                                                    Marcar como hecho
                                                </button>
                                                <button
                                                    className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-400 transition duration-300"
                                                    onClick={() => handleEditTask(t.id)}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-400 transition duration-300"
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
                <div className="mt-10">
                    <h2 className="text-2xl font-semibold">Tareas completadas</h2>
                    <div className="overflow-x-auto mt-4">
                        <table className="w-full bg-white shadow-md rounded-lg">
                            <thead className="bg-gray-800 text-white">
                                <tr>
                                    <th className="p-3">Nombre de la tarea</th>
                                    <th className="p-3">Prioridad</th>
                                    <th className="p-3">Fecha Limite</th>
                                </tr>
                            </thead>
                            <tbody>
                                {completedTasks.map((ct) => (
                                    <tr key={ct.id} className="border-b hover:bg-gray-100">
                                        <td className="p-3">{ct.task}</td>
                                        <td className="p-3">{ct.priority}</td>
                                        <td className="p-3">{ct.deadline}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
            <div className="flex justify-center mt-6">
                <button
                    className="p-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition duration-300"
                    onClick={handleLogout}
                >
                    Log out
                </button>
            </div>
        </div>
    );
}

export default TaskScheduler;


