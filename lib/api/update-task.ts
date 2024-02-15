import { ITask } from "@/interfaces/itask";

const baseUrl: string = process.env.NEXT_PUBLIC_API_HOST + '/v1/task' || '';

class UpdateTask {
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  public put = (params: ITask) => ({
    method: 'PUT',
    params,
    uri: `${this.url}/update`,
  });
}

export default new UpdateTask(baseUrl);
