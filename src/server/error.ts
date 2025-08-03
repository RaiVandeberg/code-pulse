type ServerErrorProps = {
    message: string;
    code: string;
}

export class ServerError extends Error {
    constructor({ message, code }: ServerErrorProps) {
        super(message);
        this.name = code

        Object.setPrototypeOf(this, ServerError.prototype);
    }
}

