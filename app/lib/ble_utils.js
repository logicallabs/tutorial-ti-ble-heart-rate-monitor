/*jslint white:true plusplus:true nomen:true vars:true sloppy:true undef:false bitwise:true*/
/*globals Alloy */

var
	BluetoothLE = Alloy.Globals.BluetoothLE,
	centralErrorCallback, centralOffCallback, centralOnCallback,
	centralStateChangeCallbackAdded
;

function iosCentralStateChangeCallback(e) {
	switch (e.state) {
		case BluetoothLE.CENTRAL_MANAGER_STATE_UNKNOWN:
			if (centralErrorCallback) {
				centralErrorCallback('Bluetooth LE state is resetting.');				
			}
			break;
		case BluetoothLE.CENTRAL_MANAGER_STATE_RESETTING:
			if (centralErrorCallback) {
				centralErrorCallback('Bluetooth LE is resetting.');				
			}
			break;
		case BluetoothLE.CENTRAL_MANAGER_STATE_UNSUPPORTED:
			if (centralErrorCallback) {
				centralErrorCallback('Bluetooth LE is not supported.');				
			}
			break;
		case BluetoothLE.CENTRAL_MANAGER_STATE_UNAUTHORIZED:
			if (centralErrorCallback) {
				centralErrorCallback('Bluetooth LE is not authorized.');				
			}
			break;
		case BluetoothLE.CENTRAL_MANAGER_STATE_POWERED_OFF:
			if (centralOffCallback) {
				centralOffCallback();				
			}
			break;
		case BluetoothLE.CENTRAL_MANAGER_STATE_POWERED_ON:
			if (centralOnCallback) {
				centralOnCallback();				
			}
			break;			
	}
}

function androidCentralStateChangeCallback(e) {
	switch (e.state) {
		case BluetoothLE.STATE_TURNING_OFF:
			Ti.API.info('Bluetooth is turning off.');
			if (centralOffCallback) {
				centralOffCallback();
			}
			break;
		case BluetoothLE.STATE_OFF:
			break;
		case BluetoothLE.STATE_TURNING_ON:
			break;
		case BluetoothLE.STATE_ON:
			if (centralOnCallback) {
				centralOnCallback();				
			}
			break;
	}
}


exports.initCentral = function(params) {
	centralErrorCallback = params.errorCallback;
	centralOffCallback = params.offCallback;
	centralOnCallback = params.onCallback;

	if (!centralStateChangeCallbackAdded) {
		centralStateChangeCallbackAdded = true;
		if (OS_ANDROID) {
			BluetoothLE.addEventListener(
				'stateChanged', androidCentralStateChangeCallback);
		} else {
			BluetoothLE.addEventListener(
				'centralManagerStateChange', iosCentralStateChangeCallback);
		}
	}
	
	if (OS_ANDROID) {
		if (BluetoothLE.isSupported()) {
			Ti.API.info('Bluetooth is supported!');
			
			if (BluetoothLE.isEnabled()) {
				Ti.API.info('Bluetooth is already enabled!');
				params.onCallback();
			} else {
				Ti.API.info('Bluetooth is disbled; enabling now.');
	
				// This will eventually fire a stateChanged event with state set to
				// STATE_ON, at which point we start the scanning.
				BluetoothLE.enable();
			}
		} else {
			params.errorCallback('Bluetooth LE is not supported.');				
		}
	} else {
		BluetoothLE.initCentralManager();
	}
};

var BASE_UUID = '00000000-0000-1000-8000-00805F9B34FB';
exports.BASE_UUID = BASE_UUID;

function expandUUID(uuid) {
	var result;
	if (uuid.length === 4) {
		result = BASE_UUID.substring(0, 4) + uuid +
				BASE_UUID.substring(8, BASE_UUID.length);
	} else {
		result = uuid;
	}
	
	return result;
}

exports.expandUUID = expandUUID;

function uuidMatch(uuid1, uuid2) {
	return expandUUID(uuid1).toLowerCase() === expandUUID(uuid2).toLowerCase(); 
}
	
exports.uuidMatch = uuidMatch;