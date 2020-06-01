//Lang test
/* eslint-disable @typescript-eslint/no-explicit-any */

import { lang } from '../src';
import { MockLanguagePlatform, mockUiText } from './mock/mock-lang-platform';
import { expect } from 'chai';

describe('lang', function () {
    const inst = new MockLanguagePlatform();

    describe('#setInstance', function () {
        it('should throw type error on invalid instance type provided', function () {
            expect(function () {
                lang.setInstance(<any>'12345678');
            }).to.throw(TypeError);
        });

        it('should set the instance provided without problems', function () {
            lang.setInstance(inst);
        });

        it('should throw error on repeated instance set', function () {
            expect(function () {
                lang.setInstance(new MockLanguagePlatform());
            }).to.throw(Error);
        });
    });

    describe('#getInstance', function () {
        it('should return the previously set instance', function () {
            expect(lang.getInstance()).to.equal(inst);
        });
    });

    describe('AbstractLanguagePlatform', function () {
        describe('#getUserPreferredLanguageFamily', function () {
            before(function () {
                inst.mockLang = 'en-US';
            });

            it('should seperate en-US and return as en', function () {
                expect(inst.getUserPreferredLanguageFamily()).to.equal('en');
            });

            it('should return null on invalid data type of user preferred language', function () {
                inst.mockLang = 12345678;
                expect(inst.getUserPreferredLanguageFamily()).to.equal(null);
            });

            it('should return null on empty user preferred language', function () {
                inst.mockLang = '';
                expect(inst.getUserPreferredLanguageFamily()).to.equal(null);
            });

            after(function () {
                inst.mockLang = 'en-US';
            });
        });

        describe('#isLanguageAvailable', function () {
            it('should return true for en', function () {
                expect(inst.isLanguageAvailable('en')).to.equal(true);
            });

            it('should return false for fe', function () {
                expect(inst.isLanguageAvailable('fe')).to.equal(false);
            });
        });

        describe('#init', function () {
            it('should initialize without any exceptions', async function () {
                await inst.init();
            });

            after(function () {
                //Load mock translations
                inst.loadTranslations();
            });
        });

        describe('#getT', function () {
            it('should return TFunction', function () {
                expect(inst.getT()).to.be.a('function');
            });
        });

        describe('#changeLanguage', function () {
            it('should return en translation on language change', async function () {
                await inst.changeLanguage('en');
                expect(mockUiText).to.equal('Hello World');
            });

            it('should return zh translation on language change', async function () {
                await inst.changeLanguage('zh');
                expect(mockUiText).to.equal('\u4f60\u597d\u4e16\u754c');
            });

            it('should return null for unavailable fe language', function () {
                const val = inst.changeLanguage('fe');
                expect(val).to.equal(null);
            });
        });
    });
});
