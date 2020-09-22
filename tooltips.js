/**
 * How to add a tooltip:
 * 1. Add the detection to the array below
 * 2. Add what should appear in the tooltip in ./Components/StringPart.jsx
 */

exports.tooltips = [
    {
        name: 'Color Codes',
        regex: new RegExp(
            /((?:#|0x)(?:[a-f0-9]{3}|[a-f0-9]{6})\b|(?:rgb|hsl)a?\([^\)]*\))/,
            'gi'
        )
    },
    {
        name: 'Base64',
        regex: new RegExp(
            /(^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$)/,
            'g'
        )
    }
];
