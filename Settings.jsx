const { React } = require('powercord/webpack');

const { SwitchItem } = require('powercord/components/settings');

module.exports = class Settings extends React.Component {
    constructor(props) {
        super(props);

        this.getSetting = props.getSetting;
        this.toggleSetting = props.toggleSetting;
    }

    // TODO: Hover Delay

    render() {
        return (
            <div>
                <SwitchItem
                    value={this.getSetting('colorCodes', true)}
                    onChange={() => {
                        this.toggleSetting('colorCodes');
                    }}
                >
                    Display Color Code Previews
                </SwitchItem>
            </div>
        );
    }
};
