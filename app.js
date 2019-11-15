const display = document.querySelector('.value');
const status1 = document.querySelector('.status-1');
const status2 = document.querySelector('.status-2');
const logs = document.querySelector('.logs');
const errorLogs = document.querySelector('.error-logs');
const html = document.documentElement;
document.querySelector('.bt').addEventListener('click', handleClick);

const setBgColor = (temp) => {
  const classList = [];
  if (temp < 60) {
    classList.push('cold');
  }
  if (temp > 110) {
    classList.push('hot');
  }
  html.classList = classList;
};

const setupEventListener = (char, el) => {
  char.addEventListener('characteristicvaluechanged', e => {
    const { value } = e.target;
    const temp = value.getUint16(12, true) / 10;
    if (temp !== 3686.3) {
      el.innerHTML = temp;
      setBgColor(temp);
    } else {
      el.innerHTML = '----';
    }
  });
};

// let customService = '2899fe00-c277-48a8-91cb-b29ab0f01ac4';
let deviceName = '19445458 ThermapenBlue';
// const main = '0x02010617093139343534353829546865726D6170656E426C756503FF7603';
// const main = '0x455449424C5545544845524DB87AD700';
const sensor1 = '0x455449424C5545544845524DB87AD701';
const sensor2 = '0x455449424C5545544845524DB87AD703';

const getSensor = (chars, uuid) => chars.find(c => c.uuid === uuid);
let chars;

function handleClick() {
  console.log('clicked! accept all devices...');
  navigator.bluetooth.requestDevice({
    acceptAllDevices: true,
    optionalServices: ['0000180a-0000-1000-8000-00805f9b34fb']
  })
  .then(device => {
    console.log('connected, have device');
    return device.gatt.connect();
  })

  
  .then(server => {
    //   console.log('primary services reached')
    return server.getPrimaryService('0000180a-0000-1000-8000-00805f9b34fb')
  })
  .then(service => {
    console.log('server reached')
    // console.log(service)
    return service.getCharacteristics()
    .then(characteristics => {
        const characteristic = characteristics[0];
        for (let key in characteristic) {
            console.log(`${key} / ${characteristic[key]}`)
        }
        return characteristic.startNotifications().then(_ => {
            console.log('> Notifications started');
            characteristic.addEventListener('characteristicvaluechanged',
                handleNotifications);
          });
        // let maybe = res[0].addEventListener('characteristicvaluechanged', () => {
        //     return 
        // });
        // console.log(maybe);
    })
    })
  .then(_ => {
    console.log('done');
  })
  .catch(error => { 
    console.error('failed', error);
    alert(error) ;
  });
}

// .then(characteristic => {
//     myCharacteristic = characteristic;
//     return myCharacteristic.startNotifications().then(_ => {
//       log('> Notifications started');
//       myCharacteristic.addEventListener('characteristicvaluechanged',
//           handleNotifications);
//     });
//   })




window.onerror = (message, source, line, col, err) => {
  alert(message);
  console.error(message);
};

console.log = (...args) => {
  args.forEach(arg => logs.innerHTML += `${arg}\n`);
};

console.error = (...args) => {
  args.forEach(arg => errorLogs.innerHTML += `${arg}\n`);
};

function handleNotifications(event) {
    console.log(event.target.value)
    // let value = event.target.value;
    // let a = [];
    // // Convert raw data bytes to hex values just for the sake of showing something.
    // // In the "real" world, you'd use data.getUint8, data.getUint16 or even
    // // TextDecoder to process raw data bytes.
    // for (let i = 0; i < value.byteLength; i++) {
    //   a.push('0x' + ('00' + value.getUint8(i).toString(16)).slice(-2));
    // }
    // log('> ' + a.join(' '));
  }