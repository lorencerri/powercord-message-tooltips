const { React, getModuleByDisplayName } = require('powercord/webpack');

const Tooltip = getModuleByDisplayName('Tooltip', false);

class StringPart extends React.Component {
    constructor(props) {
        super(props);
        this.parts = props.text.split(
            /((?:#|0x)(?:[a-f0-9]{3}|[a-f0-9]{6})\b|(?:rgb|hsl)a?\([^\)]*\))/gi
        );
    }

    render() {
        for (var i = 1; i < this.parts.length; i += 2) {
            if (typeof this.parts[i] !== 'string') continue;
            const text = this.parts[i];
            this.parts[i] = (
                <Tooltip
                    postion='top'
                    text={
                        <>
                            <span
                                style={{
                                    display: 'inline-block',
                                    backgroundColor: text,
                                    width: 15,
                                    height: 15,
                                    marginRight: 0,
                                    borderRadius: 3
                                }}
                            />
                        </>
                    }>
                    {({ onMouseLeave, onMouseEnter }) => (
                        <span
                            onMouseEnter={onMouseEnter}
                            onMouseLeave={onMouseLeave}>
                            {text}
                        </span>
                    )}
                </Tooltip>
            );
        }

        return this.parts;
    }
}

module.exports = StringPart;
