export function formatString(template: string, values: Record<string, any>): string {
    return template.replace(/\{(\w+)\}/g, (_, key) => values[key] !== undefined ? values[key] : _);
}

export const capitalize = (str: string | any) => str?.charAt(0).toUpperCase() + str?.slice(1);
