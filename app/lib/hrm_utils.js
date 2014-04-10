/*jslint white:true plusplus:true nomen:true vars:true sloppy:true undef:false bitwise:true*/
/*globals Alloy */
var
	BluetoothLE = Alloy.Globals.BluetoothLE,
	BLEUtils = Alloy.Globals.BLEUtils,
	HR_SERVICE_UUID = '0000180d-0000-1000-8000-00805f9b34fb',
	connectedPeripheral
;

exports.getServiceUuid = function() {
	return HR_SERVICE_UUID;
};

exports.setConnectedPeripheral = function(newConnectedPeripheral) {
	connectedPeripheral = newConnectedPeripheral;
};
