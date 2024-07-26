// src/models/Task.ts

import { stat } from "fs";

export class Task {
    id: string;
    task: string;
    priority: string;
    deadline: string;
    done: boolean;
    status: string;

    constructor(id: string, task: string, priority: string, deadline: string, done: boolean = false, status: string = "pending") {
        this.id = id;
        this.task = task;
        this.priority = priority;
        this.deadline = deadline;
        this.status = status;
        this.done = done;
    }
}