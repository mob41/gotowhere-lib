/* eslint-disable @typescript-eslint/no-explicit-any */

import { AbstractLanguagePlatform } from '../../src/lang';
import i18next from 'i18next';

export let mockUiText = 'World Hello';

export class MockLanguagePlatform extends AbstractLanguagePlatform {
    mockLang: any = 'en-US';

    getAvailableLanguages(): string[] {
        return ['en', 'zh'];
    }

    loadTranslations(): void {
        i18next.addResourceBundle(
            'en',
            'translation',
            {
                'mock-ui-text': 'Hello World',
            },
            true,
            true,
        );

        i18next.addResourceBundle(
            'zh',
            'translation',
            {
                'mock-ui-text': '\u4f60\u597d\u4e16\u754c',
            },
            true,
            true,
        );
    }

    updateUiTranslations(): void {
        mockUiText = i18next.t('mock-ui-text');
    }

    getUserPreferredLanguage(): string {
        return this.mockLang;
    }
}
