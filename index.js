const { Plugin } = require('powercord/entities');
const { inject, uninject } = require('powercord/injector');
const { React, getModule } = require('powercord/webpack');
const { shorthand } = require('./manifest.json');

const StringPart = require('./Components/StringPart');

const MessageContent = getModule(
    m => m.type && m.type.displayName == 'MessageContent',
    false
);

/**
 * How to add a tooltip:
 * 1. Add the detection to the array below
 * 2. Add what should appear in the tooltip in ./Components/StringPart.jsx
 */

const tooltips = [
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

module.exports = class MessageTooltips extends Plugin {
    async startPlugin() {
        inject(shorthand, MessageContent, 'type', this.process.bind(this));
    }

    replace(base, item) {
        return base.map(i => {
            if (typeof i === 'string' && i.trim()) {
                const parts = i.split(item.regex);
                if (parts.length <= 1) return i;
                return React.createElement(StringPart, {
                    parts,
                    regex: item.regex,
                    name: item.name
                });
            } else if (Array.isArray(i?.props?.children))
                return {
                    ...i,
                    props: {
                        ...i.props,
                        children: this.replace(i.props.children, item)
                    }
                };
            else return i;
        });
    }

    process(_, res) {
        for (var i = 0; i < tooltips.length; i++) {
            res.props.children[1] = this.replace(
                res.props.children[1],
                tooltips[i]
            );
        }
        return res;
    }

    pluginWillUnload() {
        uninject(shorthand);
    }
};
