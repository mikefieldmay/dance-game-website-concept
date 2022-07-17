export default (cameraPosition, distanceChange, initialZoom) => {
  let cameraCoordinateArray = [];

  const midValues = {
    x: -1.95,
    y: -0.19,
    z: 1.95
  };

  for (let i = 0; i <= 100; i++) {
    let coordinate = {
      position: {
        x: -Math.min(cameraPosition.z + distanceChange * i, 2.63),
        y: cameraPosition.y - distanceChange * i * 0.1,
        z: Math.min(cameraPosition.z + distanceChange * i, 2.2)
      },
      target: {
        x: 0.01,
        y: 0.95 - distanceChange * i * 0.1,
        z: 0
      },
      zoom: Math.max(initialZoom - (initialZoom / 20) * i, 1),
      spotLightAngle: Math.PI * 0.03
    };

    if (i >= 40) {
      coordinate = {
        position: {
          ...midValues
        },
        zoom: 1,
        target: {
          x: 0.01,
          y: 0.7599999999999999,
          z: 0
        },
        spotLightAngle: Math.PI * 0.03
      };
    }

    if (i >= 50) {
      coordinate = {
        position: {
          x: midValues.x * 1.1 - distanceChange * (50 - i),
          y: midValues.y,
          z: midValues.z - distanceChange * (50 - i)
        },
        target: {
          x: 0.03 * (50 - i),
          y: 0.7599999999999999,
          z: 0
        },
        zoom: 1,
        spotLightAngle: Math.PI * (0.03 + 0.005 * (i - 50))
      };
    }
    cameraCoordinateArray.push(coordinate);
  }
  return cameraCoordinateArray;
};
