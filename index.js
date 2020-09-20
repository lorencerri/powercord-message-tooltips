const { Plugin } = require('powercord/entities');
const { inject, uninject } = require('powercord/injector');
const { getModule } = require('powercord/webpack');

const { ContextMenu } = require('powercord/components');
const { getOwnerInstance } = require('powercord/util');
const { name, shorthand } = require('./manifest.json');

const Settings = require('./Settings.jsx');

module.exports = class MyPlugin extends Plugin {
    async startPlugin() {
        powercord.api.settings.registerSettings(shorthand, {
            category: this.entityID,
            label: name,
            render: Settings
        });

        // TODO: Process Messages
        // TODO: Regex Detection
    }

    pluginWillUnload() {
        powercord.api.settings.unregisterSettings(shorthand);
    }
};
