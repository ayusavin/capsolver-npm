import axios from 'axios';
import { TaskParameter, TaskParameters, HandlerOptions, TaskResponse, BaseTask } from './types';
import { TaskException } from './Exception';
import parameters from './Validation';

const sleep = (ms: number): Promise<void> => new Promise(r => setTimeout(r, ms));

export class Handler {
  private task: BaseTask;
  private apiKey: string;
  private verbose: number;
  private mustPoll: boolean;
  private parameters: TaskParameters;

  constructor({ task, apiKey, verbose, mustPoll = true }: HandlerOptions) {
    this.task = task;
    this.apiKey = apiKey;
    this.verbose = verbose;
    this.mustPoll = mustPoll;
    this.parameters = parameters;
  }

  validate(task: BaseTask): boolean {
    const parameters: TaskParameters = Object.keys(this.parameters).reduce((acc: TaskParameters, key: string) => {
      acc[key.toLowerCase()] = this.parameters[key];
      return acc;
    }, {});

    const typeParams = parameters[task.type.toLowerCase()];
    if (typeParams) {
      typeParams.forEach((param: TaskParameter) => {
        const value = task[param.name];
        if (param.required && (!value || typeof value !== param.type)) {
          throw new TypeError(`${param.name} must be of type ${param.type} and not empty.`);
        }
      });
    } else if (this.verbose !== 0) {
      console.log(`capsolver-npm: running not recognized task ${task.type}]`);
    }

    return true;
  }

  async execute(rqDelay: number): Promise<any> {
    try {
      if (this.mustPoll) {
        const data = await this.create();
        return await this.pollSolution(data.taskId!, rqDelay);
      } else {
        const response = await this.create();
        return response.solution;
      }
    } catch (error) {
      throw error;
    }
  }

  private async create(): Promise<TaskResponse> {
    this.validate(this.task);
    try {
      const response = await axios({
        url: "https://api.capsolver.com/createTask",
        method: "POST",
        data: { 
          clientKey: this.apiKey, 
          appId: "AF0F28E5-8245-49FD-A3FD-43D576C0E9B3", 
          task: this.task 
        }
      });

      if (response.data.errorId !== 0) {
        throw new TaskException("Failed to create task", response.data);
      }
      return response.data;
    } catch (error: any) {
      throw new TaskException(
        "Failed to create task", 
        error.response ? error.response.data : { errorCode: error.message }
      );
    }
  }

  private async pollSolution(taskId: string, rqDelay: number): Promise<any> {
    const req = { 
      method: "post", 
      url: "https://api.capsolver.com/getTaskResult", 
      data: { clientKey: this.apiKey, taskId } 
    };
    let threshold = 0;

    while (threshold <= 10) {
      await sleep(rqDelay);
      
      try {
        const res = await axios(req);
        if (res.data.errorId !== 0) {
          throw new TaskException("Failed to retrieve task result", res.data);
        }
        if (this.verbose !== 0) {
          console.log(`capsolver-npm: { "id" : "${taskId}", "status": "${res.data.status}" }`);
        }
        if (res.data.status === "ready") {
          return res.data.solution ? res.data.solution : res.data;
        }
      } catch (error) {
        threshold++;
      }
    }

    throw new TaskException("Failed to retrieve task result", {
      code: "unknown",
      description: "Contact at https://github.com/0qwertyy/capsolver-npm/issues"
    });
  }
} 