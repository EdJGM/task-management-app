import { useState, useEffect, ChangeEvent } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/config';
import { useRouter } from 'next/router';
import { signOut } from 'firebase/auth';
import { TaskController } from "../controllers/TaskController";
import { Task } from "../models/Task";

function TaskScheduler() {
    const [user] = useAuthState(auth);
    const router = useRouter();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
    const [taskName, setTaskName] = useState<string>("");
    const [taskPriority, setTaskPriority] = useState<string>("Alta");
    const [taskDeadline, setTaskDeadline] = useState<string>("");
    const [searchKeyword, setSearchKeyword] = useState<string>("");
    const [filterPriority, setFilterPriority] = useState<string>("");
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const taskController = new TaskController();

    useEffect(() => {
        if (user) {
            const fetchTasks = async () => {
                await taskController.fetchTasks();
                setTasks(taskController.tasks);
                await taskController.fetchCompletedTasks();
                setCompletedTasks(taskController.completedTasks);
            };
            fetchTasks();
        }
    }, [user]);

    const handleTaskNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTaskName(e.target.value);
    };

    const handleTaskPriorityChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setTaskPriority(e.target.value);
    };

    const handleTaskDeadlineChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTaskDeadline(e.target.value);
    };

    const handleAddTask = async () => {
        if (!isEditing) {
            await taskController.addTask(taskName, taskPriority, taskDeadline);
            // Actualiza el estado de las tareas con una copia del array existente más la nueva tarea
            setTasks([...tasks, ...taskController.tasks.filter(task => !tasks.some(t => t.id === task.id))]);
            setTaskName("");
            setTaskPriority("Alta");
            setTaskDeadline("");
        }
    };

    const handleEditTask = async (id: string) => {
        const taskToEdit = tasks.find((t) => t.id === id);
        if (taskToEdit) {
            setTaskName(taskToEdit.task);
            setTaskPriority(taskToEdit.priority);
            setTaskDeadline(taskToEdit.deadline);
            setIsEditing(true);
            setEditingTaskId(id);
        }
    };

    const handleSaveEditTask = async () => {
        if (editingTaskId) {
            await taskController.editTask(editingTaskId, taskName, taskPriority, taskDeadline);

            // Actualiza el estado de las tareas
            const updatedTasks = tasks.map(task =>
                task.id === editingTaskId
                    ? { ...task, task: taskName, priority: taskPriority, deadline: taskDeadline }
                    : task
            );
            setTasks(updatedTasks);

            // Restablece los campos de entrada y el estado de edición
            setTaskName("");
            setTaskPriority("Alta");
            setTaskDeadline("");
            setIsEditing(false);
            setEditingTaskId(null);
        }
    };

    const handleDeleteTask = async (id: string) => {
        await taskController.deleteTask(id);
        setTasks(tasks.filter(task => task.id !== id));
    };

    const handleMarkDone = async (id: string) => {
        await taskController.markDone(id);
        const updatedTasks = tasks.filter(task => task.id !== id);
        setTasks(updatedTasks);
        const completedTask = tasks.find(task => task.id === id);
        if (completedTask) {
            setCompletedTasks([...completedTasks, completedTask]);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            sessionStorage.removeItem('user');
            router.push('/sign-in');
        } catch (error) {
            console.error('Error signing out: ', error);
        }
    };

    const filteredTasks = tasks
        .filter((t) => t.status !== "completed")
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
                        <option value="Alta">Alta Prioridad</option>
                        <option value="Media">Media Prioridad</option>
                        <option value="Baja">Baja Prioridad</option>
                    </select>
                    <input
                        type="date"
                        className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring focus:ring-indigo-500 transition duration-300"
                        value={taskDeadline}
                        onChange={handleTaskDeadlineChange}
                    />
                    <button
                        className="w-full p-3 bg-indigo-600 rounded-lg text-white hover:bg-indigo-500 transition duration-300 font-medium"
                        onClick={isEditing ? handleSaveEditTask : handleAddTask}
                    >
                        {isEditing ? "Guardar Cambios" : "Agregar Tareas"}
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
                        <option value="Alta">Alta Prioridad</option>
                        <option value="Media">Media Prioridad</option>
                        <option value="Baja">Baja Prioridad</option>
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
                                                    onClick={() => handleMarkDone(t.id)}
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
                                                    onClick={() => handleDeleteTask(t.id)}
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
                    Salir
                </button>
            </div>
        </div>
    );
}

export default TaskScheduler;