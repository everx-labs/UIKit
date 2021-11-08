export class LocalizationString extends String {
    public readonly path: string;

    constructor(value: string, path: string) {
        super(value);

        this.path = path;
    }
}
