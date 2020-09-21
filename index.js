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

    addMessageTooltips(e, res) {
        for (var i = 0; i < res.props.children[1].length; i++) {
            if (
                typeof res.props.children[1][i] !== 'string' ||
                Array.isArray(res.props.children[1][i]) ||
                !res.props.children[1][i]?.trim()
            )
                continue;

            res.props.children[1][i] = React.createElement(MessageLine, {
                text: res.props.children[1][i]
            });
        }

        return res;
    }

    pluginWillUnload() {
        uninject(shorthand);
    }
};
