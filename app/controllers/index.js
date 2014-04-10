/*jslint white:true plusplus:true nomen:true vars:true sloppy:true undef:false bitwise:true*/
/*global Alloy, $ */

var 
	BluetoothLE = Alloy.Globals.BluetoothLE,
	BLEUtils = Alloy.Globals.BLEUtils,
	HRMUtils = Alloy.Globals.HRMUtils,
	scanRunning = false,
	open = false
;

function cancelConnection() {
	HRMUtils.setConnectedPeripheral(null);
	$.peripheralStatus.update('N/A');
	$.peripheralName.update('N/A');
	$.batteryButton.visible = false;
}

function startScan() {
	if (!scanRunning) {
		scanRunning = true;
		cancelConnection();
		$.peripheralStatus.update('Scanning for it...');
		$.peripheralName.update('N/A');
		$.heartRate.update('N/A');
		$.batteryStatus.update('N/A');
		BluetoothLE.startScan({
			UUIDs: [ HRMUtils.getServiceUuid() ]
		});
		$.scanStatus.update('On');
	}
}

function stopScan() {
	BluetoothLE.stopScan();
	$.scanStatus.update('Off');
	scanRunning = false;
}

BluetoothLE.addEventListener('moduleReady', function() {
	$.moduleStatus.update('BLE Module is ready!');
	BLEUtils.initCentral({
		onCallback: function() {
			startScan();
		},
		offCallback: function() {
			stopScan();
			cancelConnection();
		},
		errorCallback: function(desc) {
			Ti.API.error(desc);
		}
	});
});

BluetoothLE.addEventListener('discoveredPeripheral', function(e) {
	if (!HRMUtils.getConnectedPeripheral()) {
		$.peripheralStatus.update('Discovered');
		$.peripheralName.update(e.peripheral.name);
		stopScan();
		BluetoothLE.connectPeripheral({
			peripheral: e.peripheral,
			autoConnect: false
		});
	} else {
		Ti.API.info('Received discoveredPeripheral event for previously discovered peripheral.');
	}
});

BluetoothLE.addEventListener('connectedPeripheral', function(e) {
	HRMUtils.setConnectedPeripheral(e.peripheral);
	
	$.peripheralStatus.update('Connected');
	$.peripheralName.update(e.peripheral.name);
	Ti.API.info('Connected peripheral: ' +
						e.peripheral.name + '/' + e.peripheral.address);
	
	$.batteryButton.visible = true;
});

function checkBatteryStatus() {
	alert('Check battery status button tapped!');
}

$.index.open();
