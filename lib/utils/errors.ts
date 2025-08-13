export class DuplicateEmailError extends Error {
    constructor() {
        super("Email sudah digunakan");
        this.name = "DuplicateEmailError";
    }
}
