export class AppError<T = unknown> extends Error {
    constructor(
        message: string,
        public statusCode: number,
        public data?: T
    ) {
        super(message);
    }
}