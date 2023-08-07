type AnimationDurations = {
  [key: `item${number}`]: {
    duration: 1;
    delay: number;
  };
};

export const animationDurations = Array.from({ length: 20 }).reduce(
  (acc: any, _, i) => ({
    ...acc,
    [`item${i + 1}`]: {
      duration: 1,
      delay: (i + 1) * 0.5,
    },
  }),
  {}
) as AnimationDurations;

export const animationProps = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};
