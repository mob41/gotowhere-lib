import { LocationPos, AbstractLocationPlatform } from '../../src/location';

export class MockLocationPlatform extends AbstractLocationPlatform {

    isLocationSupported(): boolean {
        throw new Error("Method not implemented.");
    }

    protected nativeRequestLocationAccess(): Promise<LocationPos | null> {
        throw new Error("Method not implemented.");
    }
}