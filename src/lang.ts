//Language
import i18next, { TFunction } from 'i18next';

let instance: AbstractLanguagePlatform | null = null;

/**
 * Set the LanguagePlatform instance for this application. The instance can only be set once and should be initialized by the platform.
 * @param inst Language platform that implements the AbstractLanguagePlatform
 */
export function setInstance(inst: AbstractLanguagePlatform): void {
    if (instance === null) {
        if (!(inst instanceof AbstractLanguagePlatform)) {
            throw new TypeError('Instance must implement AbstractLanguagePlatform class.');
        }

        instance = inst;
    } else {
        throw new Error('LanguagePlatform instance can only be set once.');
    }
}

/**
 * Get the current language platform instance. It can be null if it has not been initialized by the platform yet.
 */
export function getInstance(): AbstractLanguagePlatform | null {
    return instance;
}

/**
 *  Language platform that handles language translations between different modules. It is made to be abstract as the I/O operations in different OS are platform-dependent.
 */
export abstract class AbstractLanguagePlatform {
    private tFunc: TFunction | null = null;

    /**
     * Returns an string array of available language codes in format ISO 639-1. Various forms can be expressed with hyphens (i.e. zh-HK, en-US)
     */
    abstract getAvailableLanguages(): string[];

    /**
     * Loads translations from files and registers them to i18next resource bundles
     */
    abstract loadTranslations(): void;

    /**
     * Updates the translations of text elements in the UI
     */
    abstract updateUiTranslations(): void;

    /**
     * Returns the user preferred language from the settings
     */
    getUserPreferredLanguage(): string {
        //TODO: read from settings
        throw new Error('Method not implemented');
    }

    /**
     * Returns the user preferred language family (e.g. 'en-US' family is 'en') from the settings
     */
    getUserPreferredLanguageFamily(): string | null {
        const lang = this.getUserPreferredLanguage();

        if (typeof lang !== 'string' || lang === '') {
            return null;
        }

        const splits = lang.split('-');

        if (splits.length === 0) {
            return null;
        }

        return splits[0];
    }

    /**
     * Returns whether the language translation is available in the platform
     * @param lang Language code in ISO 639-1
     */
    isLanguageAvailable(lang: string): boolean {
        const avaLangs = this.getAvailableLanguages();
        for (const avaLang of avaLangs) {
            if (avaLang === lang) {
                return true;
            }
        }
        return false;
    }

    /**
     * Initialize the i18next instance with user's preferred language.
     * Returns a pending Promise<void>.
     */
    init(debug = false): Promise<void> {
        return i18next
            .init({
                fallbackLng: 'en',
                whitelist: this.getAvailableLanguages(),
                nonExplicitWhitelist: true,
                lng: this.getUserPreferredLanguage(),
                debug: debug,
                resources: {},
            })
            .then((t) => {
                this.tFunc = t;
            });
    }

    /**
     * Returns the initialized TFunction. It is null if it has not been initialized.
     */
    getT(): TFunction | null {
        return this.tFunc;
    }

    /**
     * Change the preferred language and update translations in user interface
     * @param lang Language code in ISO 639-1
     */
    changeLanguage(lang: string): Promise<void> | null {
        if (!this.isLanguageAvailable(lang)) {
            return null;
        }

        return i18next.changeLanguage(lang).then(() => {
            this.updateUiTranslations();
        });
    }
}
