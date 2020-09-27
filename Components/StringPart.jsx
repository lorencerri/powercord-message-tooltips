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
            const display = this.selectTooltip(this.props.name, parts[i], ops);

            if (display)
                parts[i] = (
                    <Tooltip position={ops?.position || 'top'} text={display}>
                        {props => <span {...props}>{text}</span>}
                    </Tooltip>
                );
        }

        return parts;
    }

    selectTooltip(name, part, ops) {
        /**
         * Add tooltip content here.
         * Return either a string, react element, or NULL to cancel.
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
                const parsed = Buffer.from(part, 'base64').toString('binary');
                // Honestly the base64-majority-text option confused me and I only got it correct via trial and error.
                // prettier-ignore
                if (ops['base64-majority-text'] && parsed.replace(/[a-zA-Z0-9\t\n .\/<>?;:"'`!@#$%^&*()\[\]{}_+=|\\-]/g, '').length > parsed.length * .25) return null;
                else return parsed;
            default:
                return part;
        }
    }
}

module.exports = StringPart;
