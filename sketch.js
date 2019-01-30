const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');


const settings = {
  suffix: random.getSeed(),
  dimensions: [ 2048, 2048 ],
  orientation: 'landscape',
  pixelsPerInch: 300
};


const sketch = () => {
  const colorCount = random.rangeFloor(3, 6);
  const palette = random.shuffle(random.pick(palettes))
    .slice(0, colorCount);

  const createGrid = () => {
    const points = [];
    const count = 40;
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = count<= 1 ? 0.5 : x / (count-1);
        const v = count<= 1 ? 0.5 : y /(count-1);
        const radius = Math.abs(random.noise2D(u, v)) * 0.1;
        points.push({
          color: random.pick(palette),
          radius,
          rotation: random.noise2D(u, v),
          // radius: Math.abs(0.01 + random.gaussian () * 0.01),
          position: [ u, v ]
        });
      }
    }
    return points;
  };

  // random.setSeed(45);
  const points = createGrid().filter(() => random.value() > 0.5);
  const margin = 400;

  return ({ context, width, height  }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    points.forEach((data) => {
      const {
        color,
        radius,
        position,
        rotation
      } = data;

      const [ u, v ] = position;

      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);


      // context.beginPath();
      // context.arc(x, y, radius * width, 0, Math.PI * 2, false);
      // context.fillStyle = color;
      // context.lineWidth = 10;
      // context.fill();
      context.save();
      context.fillStyle = color;
      context.font = `${radius*width}px "Arial"`;
      context.translate(x, y);
      context.rotate(rotation);
      context.fillText('/', 0, 0);

      context.restore();
    });
  };
};






// const sketch = () => {
//   return ({ context, width, height  }) => {
//     context.fillStyle = 'blue';
//     context.fillRect(0, 0, width, height);

//     //Circle
//     context.beginPath();
//     context.arc(width / 2, height / 2, 200, 0, Math.PI * 2, false);
//     context.fillStyle = 'red';
//     context.fill();
//     context.lineWidth = 20;
//     context.strokeStyle = 'yellow';
//     context.stroke();
//   };
// };



canvasSketch(sketch, settings);
