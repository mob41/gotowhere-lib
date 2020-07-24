//Location test
/* eslint-disable @typescript-eslint/no-explicit-any */

import { loc } from '../src';
import { MockLocationPlatform } from './mock/mock-loc-platform';
import { expect, assert } from 'chai';

describe('loc', function () {
    const inst = new MockLocationPlatform();

    describe('#setInstance', function () {
        it('should throw type error on invalid instance type provided', function () {
            expect(function () {
                loc.setInstance(<any>'12345678');
            }).to.throw(TypeError);
        });

        it('should set the instance provided without problems', function () {
            loc.setInstance(inst);
        });

        it('should throw error on repeated instance set', function () {
            expect(function () {
                loc.setInstance(new MockLocationPlatform());
            }).to.throw(Error);
        });
    });

    describe('#getInstance', function () {
        it('should return the previously set instance', function () {
            expect(loc.getInstance()).to.equal(inst);
        });
    });
	
	describe('AbstractLocationPlatform', function () {
		describe('#requestLocationAccess', function () {
			before(function () {
				inst.mockLocateSuccess = true;
			});
			
			it('should return a promise that resolves the position (1,2)', async function () {
				expect(await inst.requestLocationAccess()).to.deep.include({
					lat: 1,
					lng: 2
				});
			});
			
			it('should return a promise that throws a location error', async function () {
				inst.mockLocateSuccess = false;
				try {
					await inst.requestLocationAccess();
					assert.fail('does not throw error');
				} catch (err) {
					expect(err).to.deep.include({
						code: 1,
						msg: 'Permission denied by user.'
					});
				}
			});
		});
		
		describe('#getCurrentLocation', function () {
			it('should return last located position', function () {
				expect(inst.getCurrentLocation()).to.deep.include({
					lat: 1,
					lng: 2
				});
			});
		});
		
		describe('#getLastLocatedTime', function () {
			it('should return last located time as a number', function () {
				expect(typeof inst.getLastLocatedTime()).to.equal('number');
			});
		});
		
		describe('#isLocated', function () {
			it('should return last located time as a number', function () {
				expect(typeof inst.getLastLocatedTime()).to.equal('number');
			});
		});
		
	});
});
