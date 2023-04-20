export function alpha(color: string, opacity: number) {
    return `${color}${Math.round(opacity * 255).toString(16)}`;
}
