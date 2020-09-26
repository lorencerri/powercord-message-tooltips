const { React } = require('powercord/webpack');
const { SwitchItem, Category } = require('powercord/components/settings');

const { tooltips } = require('../tooltips');

module.exports = class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = { categoryOpened: true };
    }

    toSnake(str) {
        return str.split(' ').join('-').toLowerCase();
    }

    render() {
        return (
            <div>
                <Category
                    name='Tooltips'
                    description='Toggle message tooltips'
                    opened={this.state.categoryOpened}
                    onChange={() =>
                        this.setState({
                            categoryOpened: !this.state.categoryOpened
                        })
                    }>
                    {tooltips.map(i => {
                        const id = `tooltip-toggled-${this.toSnake(i.name)}`;
                        return (
                            <SwitchItem
                                value={this.props.getSetting(id, i.default)}
                                onChange={() => {
                                    this.props.toggleSetting(id, i.default);
                                }}
                                note={i.description}>
                                {i.name}
                            </SwitchItem>
                        );
                    })}
                </Category>
            </div>
        );
    }
};
