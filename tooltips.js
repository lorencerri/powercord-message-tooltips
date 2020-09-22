/**
 * How to add a tooltip:
 * 1. Add the detection to the array below
 * 2. Add what should appear in the tooltip in ./Components/StringPart.jsx
 */

exports.tooltips = [
    {
        name: 'Color Codes',
        description: 'Displays a previews of color codes.',
        regex: new RegExp(
            /((?:#|0x)(?:[a-f0-9]{3}|[a-f0-9]{6})\b|(?:rgb|hsl)a?\([^\)]*\))/,
            'gi'
        ),
        default: true
    },
    {
        name: 'Base64',
        description: 'Displays Base64 strings decoded into normal text.',
        regex: new RegExp(
            /(^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$)/,
            'g'
        ),
        default: true
    }
];
