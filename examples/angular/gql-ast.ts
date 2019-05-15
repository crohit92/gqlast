/**
 * Convert a template string to graphql abstract syntax tree
 */
var valueSeperatorInObjectKeys = ',';
function gqlast(literals: TemplateStringsArray, placeholders: any[]) {
    const result = literals.map(l => l.toString());
    for (let index = 0; index < placeholders.length; index++) {
        const parsedPlaceholder = parsePlaceholder(placeholders[index]);
        result[index] += parsedPlaceholder;
    }
    return result.join(' ');
}

function parsePlaceholder(placeholder: any): string | boolean | number {
    return (typeof placeholder === typeof '') ?
        `"${placeholder}"` :
        (typeof placeholder === typeof 0 || typeof placeholder === typeof true ? placeholder :
            (placeholder instanceof Array ? parseArray(placeholder) :
                (placeholder instanceof Date ? `"${placeholder.toISOString()}"` :
                    parseObject(placeholder)
                )
            )
        );
}

function parseArray(array): string {
    let result = '[';
    // for (const value, index} of array) {
    array.forEach((value, index) => {
        result += `${parsePlaceholder(value)} ${index < array.length - 1 ? valueSeperatorInObjectKeys : ''}`;
    });
    result += ']';
    return result;
}

function parseObject(object): string {
    let result = '{';
    const keys = Object.keys(object)
    keys.forEach((key, index) => {
        result += `${key}: ${parsePlaceholder(object[key])} ${index < keys.length - 1 ? valueSeperatorInObjectKeys : ''}`;
    })

    result += '}';
    return result;
}

export default gqlast;