/**
 * powercord-message-tooltips
 * https://github.com/TrueXPixels/powercord-message-tooltips
 */

const { Plugin } = require('powercord/entities');
const { inject, uninject } = require('powercord/injector');
const { React, getModule } = require('powercord/webpack');
const { shorthand } = require('./manifest.json');
const { tooltips } = require('./tooltips.js');

const StringPart = require('./Components/StringPart');
const Settings = require('./Components/Settings');

const MessageContent = getModule(
    m => m.type && m.type.displayName == 'MessageContent',
    false
);

module.exports = class MessageTooltips extends Plugin {
    async startPlugin() {
        powercord.api.settings.registerSettings(`${shorthand}-settings`, {
            category: this.entityID,
            label: 'Message Tooltips',
            render: Settings
        });
        inject(shorthand, MessageContent, 'type', this.process.bind(this));
    }

    /**
     * Processes a message component
     * @param {*} _
     * @param {*} res - The message componenet being passed through the function
     */
    process(_, res) {
        // Iterate through every tooltip
        for (var i = 0; i < tooltips.length; i++) {
            // Continue if the tooltip is not enabled
            const id = `tooltip-toggled-${this.toSnake(tooltips[i].name)}`;
            if (!this.settings.get(id, tooltips[i].default)) continue;

            /**
             * Replace the following property with a version that
             * may have replaced the nested strings with React elements
             */
            res.props.children[1] = this.replace(
                res.props.children[1],
                tooltips[i]
            );
        }
        return res;
    }

    /**
     * Recursively replaces the string elements in the nested arrays with custom elements
     * @param {*} base - The .children property of the props
     * @param {*} item - The current regex item being parsed against a string
     */
    replace(base, item) {
        // Return a remapped version of the base
        return base.map(i => {
            if (typeof i === 'string' && i.trim()) {
                /**
                 *  If {i} is a valid, non-whitespace string, parse it against the regex item
                 *  to see if it needs to be replaced with a tooltip element
                 */

                const parts = i.split(item.regex);

                /**
                 * If the regex does not match the string, {parts} will contain an array of
                 * either one or zero length. Therefore, we can just return the string as we
                 * don't need to do anything to it.
                 */
                if (parts.length <= 1) return i;

                /**
                 * If the regex matched the string, {parts} will now contain an array of elements
                 * that need to be replaced with tooltips at every odd number index. Return the
                 * replacement tooltip element instead of the string.
                 */

                return React.createElement(StringPart, {
                    parts,
                    regex: item.regex,
                    name: item.name
                });
            } else if (Array.isArray(i?.props?.children))
                // Otherwise, if {i} has valid .props.children, reiterate through that instead

                return {
                    ...i,
                    props: {
                        ...i.props,
                        children: this.replace(i.props.children, item)
                    }
                };
            else {
                /**
                 * If none of the previous clauses are true, it's most likely just a design element
                 * such as a block quote or image, which can simply be returned.
                 */

                return i;
            }
        });
    }

    pluginWillUnload() {
        powercord.api.settings.unregisterSettings(`${shorthand}-settings`);
        uninject(shorthand);
    }

    /**
     * Helper Functions
     */
    toSnake(str) {
        return str.split(' ').join('-').toLowerCase();
    }
};
