import { useState, ChangeEvent } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useTasks } from "@/components/useTasks";

function TaskScheduler() {
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
                <title>Task Management - Geeksforgeeks.org</title>
            </Head>
            <header className={styles.taskHeader}>
                <h1>Task Management</h1>
            </header>
            <main>
                <div className={styles.taskForm}>
                    <input
                        type="text"
                        className={styles.taskNameInput}
                        placeholder="Enter task..."
                        value={taskName}
                        onChange={handleTaskNameChange}
                    />
                    <select
                        className={styles.taskPrioritySelect}
                        value={taskPriority}
                        onChange={handleTaskPriorityChange}
                    >
                        <option value="Top">Top Priority</option>
                        <option value="Middle">Middle Priority</option>
                        <option value="Low">Less Priority</option>
                    </select>
                    <input
                        type="date"
                        className={styles.taskDeadlineInput}
                        value={taskDeadline}
                        onChange={handleTaskDeadlineChange}
                    />
                    <button className={styles.addTaskButton} onClick={handleAddTask}>
                        Add Task
                    </button>
                </div>
                <div className={styles.searchFilter}>
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Search tasks"
                        value={searchKeyword}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchKeyword(e.target.value)}
                    />
                    <select
                        className={styles.filterPrioritySelect}
                        value={filterPriority}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilterPriority(e.target.value)}
                    >
                        <option value="">All Priorities</option>
                        <option value="Top">Top Priority</option>
                        <option value="Middle">Middle Priority</option>
                        <option value="Low">Less Priority</option>
                    </select>
                </div>
                <h2 className={styles.heading}>Upcoming Tasks</h2>
                <div className={styles.taskList}>
                    <table className={styles.taskTable}>
                        <thead>
                            <tr>
                                <th>Task Name</th>
                                <th>Priority</th>
                                <th>Deadline</th>
                                <th>Action</th>
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
                                                    Mark Done
                                                </button>
                                                <button
                                                    className={styles.editTaskButton}
                                                    onClick={() => handleEditTask(t.id)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className={styles.deleteTaskButton}
                                                    onClick={() => deleteTask(t.id)}
                                                >
                                                    Delete
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
                    <h2 className={styles.completedHeading}>Completed Tasks</h2>
                    <table className={styles.completedTable}>
                        <thead>
                            <tr>
                                <th>Task Name</th>
                                <th>Priority</th>
                                <th>Deadline</th>
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

export default TaskScheduler;
