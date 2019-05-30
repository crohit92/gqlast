/**
 * Convert a template string to graphql abstract syntax tree
 */
var valueSeperatorInObjectKeys = ',';
function gqlast(literals, ...placeholders) {
    const result = [...literals];
    for (let index = 0; index < placeholders.length; index++) {
        parsedPlaceholder = parsePlaceholder(placeholders[index]);
        result[index] += parsedPlaceholder;
    }
    return result.join(' ');
}

function parsePlaceholder(placeholder) {
    return (typeof placeholder === typeof '') ?
        `"${placeholder}"` :
        (placeholder === undefined || placeholder === null || typeof placeholder === typeof 0 || typeof placeholder === typeof true ? placeholder :
            (placeholder instanceof Array ? parseArray(placeholder) :
                (placeholder instanceof Date ? `"${placeholder.toISOString()}"` :
                    parseObject(placeholder)
                )
            )
        );

}

function parseArray(array) {
    let result = '[';
    // for (const value, index} of array) {
    array.forEach((value, index) => {
        result += `${parsePlaceholder(value)} ${index < array.length - 1 ? valueSeperatorInObjectKeys : ''}`;
    });
    result += ']';
    return result;
}

function parseObject(object) {
    let result = '{';
    const keys = Object.keys(object)
    keys.forEach((key, index) => {
        result += `${key}: ${parsePlaceholder(object[key])} ${index < keys.length - 1 ? valueSeperatorInObjectKeys : ''}`;
    })

    result += '}';
    return result;
}

export default gqlast;