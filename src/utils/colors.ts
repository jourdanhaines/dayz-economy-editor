import { AREA_FLAG_COLORS } from "src/data/area_flag_colors";

export function alpha(color: string, opacity: number) {
    return `${color}${Math.round(opacity * 255).toString(16)}`;
}

export function getAreaFlagColorFromName(name: string): string {
    const color = AREA_FLAG_COLORS[name.toLowerCase()];

    if (color) {
        return color;
    }

    return AREA_FLAG_COLORS.other;
}
