var 
	BluetoothLE = Alloy.Globals.BluetoothLE
;

BluetoothLE.addEventListener('moduleReady', function() {
	$.label.text = 'BLE Module is ready!';
});

$.index.open();
