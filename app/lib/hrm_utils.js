/*jslint white:true plusplus:true nomen:true vars:true sloppy:true undef:false bitwise:true*/
/*globals Alloy */
var
	BluetoothLE = Alloy.Globals.BluetoothLE,
	BLEUtils = Alloy.Globals.BLEUtils,
	HR_SERVICE_UUID = '0000180d-0000-1000-8000-00805f9b34fb',
	BATTERY_SERVICE_UUID = '180f',
	HR_CHAR_UUID = '00002a37-0000-1000-8000-00805f9b34fb',
	BATTERY_LEVEL_CHAR_UUID = '2a19',
	connectedPeripheral, batteryChar
;

function digestServices(e) {
	var services;
	
	// e.source is the peripheral sending the discoveredServices event
	services = e.source.services;
	
	services.forEach(function(service) {
		Ti.API.info('Discovered service ' + service.UUID);
		if (BLEUtils.uuidMatch(service.UUID, HR_SERVICE_UUID)) {
			Ti.API.info('Found heart rate service!');
			e.source.discoverCharacteristics({
				service: service
			});
		}
		if (BLEUtils.uuidMatch(service.UUID, BATTERY_SERVICE_UUID)) {
			Ti.API.info('Found battery service!');
			e.source.discoverCharacteristics({
				service: service
			});
		}
	});
}

function digestCharacteristics(e) {
	var characteristics;
	
	if (e.errorCode !== undefined) {
		Ti.API.error('Error while discovering characteristics: ' +
					e.errorCode + '/' + e.errorDomain + '/' +
					e.errorDescription);
		return;
	}
	characteristics = e.service.characteristics;
	characteristics.forEach(function(characteristic) {
		Ti.API.info('characteristic.UUID: '  + characteristic.UUID);
		if (BLEUtils.uuidMatch(characteristic.UUID, HR_CHAR_UUID)) {
			if (BLEUtils.canSubscribeTo(characteristic)) {
				Ti.API.info('Found heart rate characteristic, will subscribe...');
				connectedPeripheral.subscribeToCharacteristic(characteristic);
			} else {
				Ti.API.error('Found heart rate characterisic but can\'t subscribe...');
			}
		}
		
		if (BLEUtils.uuidMatch(characteristic.UUID, BATTERY_LEVEL_CHAR_UUID)) {
			batteryChar = characteristic;
		}
	});	
}

function digestNewCharValue(e) {
	Ti.API.info('Received updatedValueForCharacteristic event');
}

exports.getServiceUuid = function() {
	return HR_SERVICE_UUID;
};

exports.getConnectedPeripheral = function() {
	return connectedPeripheral;
};

exports.setConnectedPeripheral = function(newConnectedPeripheral) {
	if (connectedPeripheral) {
		BluetoothLE.cancelPeripheralConnection(connectedPeripheral);

		connectedPeripheral.removeEventListener(
				'discoveredServices', digestServices);
			connectedPeripheral.removeEventListener(
				'discoveredCharacteristics', digestCharacteristics);
			connectedPeripheral.removeEventListener(
				'updatedValueForCharacteristic', digestNewCharValue);
	}
	connectedPeripheral = newConnectedPeripheral;
	if (connectedPeripheral) {
		connectedPeripheral.addEventListener('discoveredServices', digestServices);
		connectedPeripheral.addEventListener('discoveredCharacteristics', digestCharacteristics);
		connectedPeripheral.addEventListener('updatedValueForCharacteristic', digestNewCharValue);
		connectedPeripheral.discoverServices();
	}
};
