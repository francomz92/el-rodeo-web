export class Result<T, E> {
    readonly isSuccess: boolean;
    readonly data: T;
    readonly error: E;

    private constructor(isSuccess: boolean, data: T, error: E) {
        this.isSuccess = isSuccess;
        this.data = data;
        this.error = error;
    }

    static ok(data: any) {
        return new Result(true, data, Object());
    }

    static fail(error: any) {
        return new Result(false, Object(), error);
    }
}
