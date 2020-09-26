const { React, getModuleByDisplayName } = require('powercord/webpack');

const Tooltip = getModuleByDisplayName('Tooltip', false);

class StringPart extends React.PureComponent {
    render() {
        const { parts, ops } = this.props;

        /**
         * Iterate through every item in {parts}, knowing that the items that need to
         * be replaced will be on every odd numbered index.
         */
        for (var i = 1; i < parts.length; i += 2) {
            if (typeof parts[i] !== 'string') continue;
            const text = parts[i];
            parts[i] = (
                <Tooltip
                    position={ops?.position || 'top'}
                    text={this.selectTooltip(this.props.name, parts[i])}>
                    {props => <span {...props}>{text}</span>}
                </Tooltip>
            );
        }

        return parts;
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
                return Buffer.from(part, 'base64').toString('binary');
            default:
                return part;
        }
    }
}

module.exports = StringPart;
