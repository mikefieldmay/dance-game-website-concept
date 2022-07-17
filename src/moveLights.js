export default (target, elapsedTime, multiplier) => {
  target.position.x += Math.cos(elapsedTime) * 0.03 * multiplier;
  //   target.position.y += Math.sin(elapsedTime) * 0.1;
  target.position.z += Math.sin(elapsedTime) * 0.01;
};
