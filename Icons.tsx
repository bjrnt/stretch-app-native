import Svg, { Circle, Path } from "react-native-svg";

interface IconProps {
  color: string;
  size?: number;
}

export function BackIcon({ color, size = 18 }: IconProps) {
  return (
    <Svg
      fill="none"
      height={size}
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.2}
      viewBox="0 0 24 24"
      width={size}
    >
      <Path d="M15 18l-6-6 6-6" />
    </Svg>
  );
}

export function InfoIcon({ color, size = 18 }: IconProps) {
  return (
    <Svg
      fill="none"
      height={size}
      stroke={color}
      strokeLinecap="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
      width={size}
    >
      <Circle cx={12} cy={12} r={9} />
      <Path d="M12 11v6M12 7.5v.01" />
    </Svg>
  );
}

export function PreviousIcon({ color, size = 18 }: IconProps) {
  return (
    <Svg fill={color} height={size} viewBox="0 0 24 24" width={size}>
      <Path d="M6 5h2v14H6zM20 5v14L9 12z" />
    </Svg>
  );
}

export function NextIcon({ color, size = 18 }: IconProps) {
  return (
    <Svg fill={color} height={size} viewBox="0 0 24 24" width={size}>
      <Path d="M16 5h2v14h-2zM4 5v14l11-7z" />
    </Svg>
  );
}

export function PlayIcon({ color, size = 16 }: IconProps) {
  return (
    <Svg fill={color} height={size} viewBox="0 0 24 24" width={size}>
      <Path d="M7 4.5v15l13-7.5z" />
    </Svg>
  );
}

export function PauseIcon({ color, size = 16 }: IconProps) {
  return (
    <Svg fill={color} height={size} viewBox="0 0 24 24" width={size}>
      <Path d="M6 4h4.5v16H6zM13.5 4H18v16h-4.5z" />
    </Svg>
  );
}

export function CheckIcon({ color, size = 16 }: IconProps) {
  return (
    <Svg
      fill="none"
      height={size}
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      viewBox="0 0 24 24"
      width={size}
    >
      <Path d="M5 12.5l4.5 4.5L19 7.5" />
    </Svg>
  );
}

export function CloseIcon({ color, size = 18 }: IconProps) {
  return (
    <Svg
      fill="none"
      height={size}
      stroke={color}
      strokeLinecap="round"
      strokeWidth={2.2}
      viewBox="0 0 24 24"
      width={size}
    >
      <Path d="M6 6l12 12M18 6L6 18" />
    </Svg>
  );
}
