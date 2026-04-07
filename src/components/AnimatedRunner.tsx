import React, { useEffect } from 'react';
import Svg, { Circle, Line } from 'react-native-svg';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const AnimatedLine = Animated.createAnimatedComponent(Line);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = {
  size?: number;
  color?: string;
};

export default function AnimatedRunner({
  size = 120,
  color = '#ffffff',
}: Props) {
  const armFront = useSharedValue(0);
  const armBack = useSharedValue(0);
  const legFront = useSharedValue(0);
  const legBack = useSharedValue(0);
  const bounce = useSharedValue(0);

  useEffect(() => {
    armFront.value = withRepeat(
      withTiming(1, {
        duration: 500,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    armBack.value = withRepeat(
      withTiming(1, {
        duration: 500,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    legFront.value = withRepeat(
      withTiming(1, {
        duration: 500,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    legBack.value = withRepeat(
      withTiming(1, {
        duration: 500,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    bounce.value = withRepeat(
      withTiming(1, {
        duration: 500,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, [armFront, armBack, legFront, legBack, bounce]);

  const bodyAnimatedProps = useAnimatedProps(() => {
    const offsetY = bounce.value * 3;
    return {
      y1: 35 - offsetY,
      y2: 65 - offsetY,
    };
  });

  const headAnimatedProps = useAnimatedProps(() => {
    const offsetY = bounce.value * 3;
    return {
      cy: 22 - offsetY,
    };
  });

  const armFrontProps = useAnimatedProps(() => {
    const offsetY = bounce.value * 3;
    const swing = armFront.value * 14 - 7;
    return {
      x1: 50,
      y1: 42 - offsetY,
      x2: 68,
      y2: 52 - offsetY + swing,
    };
  });

  const armBackProps = useAnimatedProps(() => {
    const offsetY = bounce.value * 3;
    const swing = armBack.value * 14 - 7;
    return {
      x1: 50,
      y1: 42 - offsetY,
      x2: 34,
      y2: 50 - offsetY - swing,
    };
  });

  const legFrontProps = useAnimatedProps(() => {
    const offsetY = bounce.value * 3;
    const swing = legFront.value * 18 - 9;
    return {
      x1: 50,
      y1: 65 - offsetY,
      x2: 68,
      y2: 90 - offsetY + swing,
    };
  });

  const legBackProps = useAnimatedProps(() => {
    const offsetY = bounce.value * 3;
    const swing = legBack.value * 18 - 9;
    return {
      x1: 50,
      y1: 65 - offsetY,
      x2: 34,
      y2: 88 - offsetY - swing,
    };
  });

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <AnimatedCircle
        animatedProps={headAnimatedProps}
        cx="50"
        cy="22"
        r="8"
        fill={color}
      />

      <AnimatedLine
        animatedProps={bodyAnimatedProps}
        x1="50"
        y1="35"
        x2="50"
        y2="65"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
      />

      <AnimatedLine
        animatedProps={armFrontProps}
        x1="50"
        y1="42"
        x2="68"
        y2="52"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
      />

      <AnimatedLine
        animatedProps={armBackProps}
        x1="50"
        y1="42"
        x2="34"
        y2="50"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
      />

      <AnimatedLine
        animatedProps={legFrontProps}
        x1="50"
        y1="65"
        x2="68"
        y2="90"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
      />

      <AnimatedLine
        animatedProps={legBackProps}
        x1="50"
        y1="65"
        x2="34"
        y2="88"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
      />
    </Svg>
  );
}