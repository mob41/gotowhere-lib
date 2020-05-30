//Language

//TODO Incomplete, might be deleted

let instance: AbstractLanguage|null = null;

export function setInstance(inst: AbstractLanguage): void {
    if (instance === null) {
        if (!(inst instanceof AbstractLanguage)) {
            throw new TypeError("Instance must implement AbstractLanguage class.");
        }

        instance = inst;
    } else {
        throw new Error("Language instance can only be set once.");
    }
}

export function getInstance(): AbstractLanguage|null {
    return instance;
}

export abstract class AbstractLanguage {

    abstract getAvailableLanguages(): string[];


}