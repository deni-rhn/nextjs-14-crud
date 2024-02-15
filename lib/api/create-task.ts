import { ITask } from "@/interfaces/itask";

const baseUrl: string = process.env.NEXT_PUBLIC_API_HOST + '/v1/task' || '';

class CreateTask {
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  public post = (params: ITask) => ({
    method: 'POST',
    params,
    uri: `${this.url}/create`,
  });
}

export default new CreateTask(baseUrl);
