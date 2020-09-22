const { Plugin } = require('powercord/entities');
const { inject, uninject } = require('powercord/injector');
const { React, getModule } = require('powercord/webpack');
const { shorthand } = require('./manifest.json');

const MessageLine = require('./Components/MessageLine');

const MessageContent = getModule(
    m => m.type && m.type.displayName == 'MessageContent',
    false
);

module.exports = class MessageTooltips extends Plugin {
    async startPlugin() {
        inject(shorthand, MessageContent, 'type', this.addMessageTooltips);
    }

    addMessageTooltips(_, res) {
        const cb = base => {
            return base.map(i => {
                if (typeof i === 'string' && i.trim())
                    return React.createElement(MessageLine, { text: i });
                else if (Array.isArray(i?.props?.children))
                    return {
                        ...i,
                        props: { ...i.props, children: cb(i.props.children) }
                    };
                else return i;
            });
        };

        res.props.children[1] = cb(res.props.children[1]);
        return res;
    }

    pluginWillUnload() {
        uninject(shorthand);
    }
};
