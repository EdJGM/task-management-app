// src/models/Task.ts

export class Task {
    id: string;
    task: string;
    priority: string;
    deadline: string;
    done: boolean;

    constructor(id: string, task: string, priority: string, deadline: string, done: boolean = false) {
        this.id = id;
        this.task = task;
        this.priority = priority;
        this.deadline = deadline;
        this.done = done;
    }
}
