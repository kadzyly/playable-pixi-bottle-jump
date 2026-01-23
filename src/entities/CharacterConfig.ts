export const CHARACTER_ANIMATIONS = {
  idle: {
    frames: ['imp_7.png', 'imp_8.png'],
    speed: 0.08,
    loop: true
  },
  jump: {
    frames: Array.from({ length: 19 }, (_, i) => `imp_${i}.png`),
    speed: 0.5,
    loop: true
  }
};
