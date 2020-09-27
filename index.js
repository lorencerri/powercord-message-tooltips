/**
 * powercord-message-tooltips
 * https://github.com/TrueXPixels/powercord-message-tooltips
 */

const { Plugin } = require('powercord/entities');
const { inject, uninject } = require('powercord/injector');
const { React, getModule } = require('powercord/webpack');
const { tooltips } = require('./tooltips.js');

const StringPart = require('./Components/StringPart');
const Settings = require('./Components/Settings');

module.exports = class MessageTooltips extends Plugin {
    async startPlugin() {
        powercord.api.settings.registerSettings(this.entityID, {
            category: this.entityID,
            label: 'Message Tooltips',
            render: Settings
        });

        const parser = await getModule(['parse', 'parseTopic']);
        const process = this.process.bind(this);

        inject(`message-tooltips`, parser, 'parse', process);
        inject(`embed-tooltips`, parser, 'parseAllowLinks', process);
        inject(`topic-tooltips`, parser, 'parseTopic', (a, b) =>
            process(a, b, { position: 'bottom' })
        );
    }

    /**
     * Processes a message component
     * @param {*} args - Arguments, rarely used
     * @param {*} res - The message componenet being passed through the function
     * @param {*} ops - Additional options
     */
    process(args, res, ops = {}) {
        // Iterate through every tooltip
        for (var i = 0; i < tooltips.length; i++) {
            // Continue if the tooltip is not enabled
            const id = `tooltip-toggled-${this.toSnake(tooltips[i].name)}`;
            if (!this.settings.get(id, tooltips[i].default)) continue;

            /**
             * Replace the following property with a version that
             * may have replaced the nested strings with React elements
             */
            if (res?.props?.children[1])
                res.props.children[1] = this.replace(
                    res.props.children[1],
                    tooltips[i],
                    ops
                );
            else if (Array.isArray(res))
                res = this.replace(res, tooltips[i], ops);
        }
        return res;
    }

    /**
     * Recursively replaces the string elements in the nested arrays with custom elements
     * @param {*} base - The .children property of the props
     * @param {*} item - The current regex item being parsed against a string
     * @param {*} ops - Additional options
     */
    replace(base, item, ops) {
        // Return a remapped version of the base
        return base.map(i => {
            if (typeof i === 'string' && i.trim()) {
                /**
                 *  If {i} is a valid, non-whitespace string, parse it against the regex item
                 *  to see if it needs to be replaced with a tooltip element
                 */

                return this.getElement(i, item, ops);
            } else if (Array.isArray(i?.props?.children))
                // Otherwise, if {i} has valid .props.children, reiterate through that instead

                return {
                    ...i,
                    props: {
                        ...i.props,
                        children: this.replace(i.props.children, item, ops)
                    }
                };
            else {
                /**
                 * If none of the previous clauses are true, it's most likely just a design element
                 * such as a block quote or image, which can simply be returned.
                 */

                // Handle Inline Code
                if (
                    i.type === 'code' &&
                    typeof i?.props?.children === 'string' &&
                    i?.props?.children?.trim()
                )
                    i.props.children = this.getElement(
                        i.props.children,
                        item,
                        ops
                    );

                return i;
            }
        });
    }

    getElement(i, item, ops) {
        const parts = i.split(item.regex);

        /**
         * If the regex does not match the string, {parts} will contain an array of
         * either one or zero length. Therefore, we can just return the string as we
         * don't need to do anything to it.
         */
        if (parts.length <= 1) return i;

        // Parse & Pass Options
        for (var x = 0; x < item.options?.length; x++)
            ops[item.options[x].id] = this.settings.get(
                item.options[x].id,
                item.options[x].default
            );

        /**
         * If the regex matched the string, {parts} will now contain an array of elements
         * that need to be replaced with tooltips at every odd number index. Return the
         * replacement tooltip element instead of the string.
         */

        return React.createElement(StringPart, {
            parts,
            ops,
            regex: item.regex,
            name: item.name
        });
    }

    pluginWillUnload() {
        powercord.api.settings.unregisterSettings(this.entityID);
        uninject('message-tooltips');
        uninject('embed-tooltips');
        uninject('topic-tooltips');
    }

    /**
     * Helper Functions
     */
    toSnake(str) {
        return str.split(' ').join('-').toLowerCase();
    }
};
