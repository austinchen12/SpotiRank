import five from 'johnny-five';


let board = new five.Board();
board.on("ready", async function () {
  board.buttonOne = new five.Button({
    pin: 12,
    isPullup: true,
  });

  board.buttonTwo = new five.Button({
    pin: 11,
    isPullup: true,
  });

  board.buttonThree = new five.Button({
    pin: 10,
    isPullup: true,
  });

  board.buttonFour = new five.Button({
    pin: 9,
    isPullup: true,
  });

  board.led = new five.Led.RGB({
    pins: {
      red: 6,
      green: 3, // actually the blue pin
      blue: 5 // actually the green pin
    }
  });
  
  board.led.intensity(100);
  board.led.off();
});

export default board;
