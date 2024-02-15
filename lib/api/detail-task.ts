const baseUrl: string = process.env.NEXT_PUBLIC_API_HOST + '/v1/task' || '';

class DetailTask {
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  public get = (id: string) => ({
    method: 'GET',
    uri: `${this.url}/${id}`,
  });
}

export default new DetailTask(baseUrl);
