const { React, getModuleByDisplayName } = require('powercord/webpack');

const Tooltip = getModuleByDisplayName('Tooltip', false);

class StringPart extends React.Component {
    constructor(props) {
        super(props);
        this.parts = this.props.parts;
    }

    render() {
        for (var i = 1; i < this.parts.length; i += 2) {
            if (typeof this.parts[i] !== 'string') continue;
            const text = this.parts[i];
            this.parts[i] = (
                <Tooltip
                    postion='top'
                    text={this.selectTooltip(this.props.name, this.parts[i])}>
                    {props => <span {...props}>{text}</span>}
                </Tooltip>
            );
        }

        return this.parts;
    }

    selectTooltip(name, part) {
        /**
         * Add tooltip content here.
         * Return either a string or a React element.
         */
        switch (name) {
            case 'Color Codes':
                return (
                    <span
                        style={{
                            display: 'inline-block',
                            backgroundColor: part,
                            width: 15,
                            height: 15,
                            marginRight: 0,
                            borderRadius: 3
                        }}
                    />
                );
            case 'Base64':
                console.log(part);
                return Buffer.from(part, 'base64').toString();
            default:
                return part;
        }
    }
}

module.exports = StringPart;
