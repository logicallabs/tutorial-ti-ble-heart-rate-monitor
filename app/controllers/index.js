var 
	BluetoothLE = Alloy.Globals.BluetoothLE
;

BluetoothLE.addEventListener('moduleReady', function() {
	$.moduleStatus.update('BLE Module is ready!');
});

function checkBatteryStatus() {
	alert('Check battery status button tapped!');
}

$.index.open();
