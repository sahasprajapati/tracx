export class ResponseDto<T> {
  readonly data: T;

  readonly message: string;

  constructor(message: string, data?: T) {
    this.data = data;
    this.message = message;
  }
}
