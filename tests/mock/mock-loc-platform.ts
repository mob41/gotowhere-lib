import { LocationPos, LocationError, AbstractLocationPlatform } from '../../src/loc';

export class MockLocationPlatform extends AbstractLocationPlatform {
	
	mockLoc: LocationPos | null = null;
	
	mockLocateSuccess: boolean = true;

    isLocationSupported(): boolean {
        return true;
    }

    protected nativeRequestLocationAccess(): Promise<LocationPos | null> {
        return new Promise((resolve, reject) => {
			if (this.mockLocateSuccess) {
				resolve(new LocationPos(1, 2));	
			} else {
				reject(new LocationError(1, "Permission denied by user."));
			}
		});
    }
}