const { React } = require('powercord/webpack');
const { SwitchItem, Category } = require('powercord/components/settings');

const { tooltips } = require('../tooltips');

// TODO: Rewrite this messy file

module.exports = class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = { opened: { main: true } };
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
                    opened={this.state.opened.main}
                    onChange={() =>
                        this.setState({
                            ...this.state.opened,
                            opened: { main: !this.state.opened.main }
                        })
                    }>
                    {tooltips.map(item => {
                        const id = `tooltip-toggled-${this.toSnake(item.name)}`;
                        return (
                            <SwitchItem
                                value={this.props.getSetting(id, item.default)}
                                onChange={() => {
                                    this.props.toggleSetting(id, item.default);
                                }}
                                note={item.description}>
                                {item.name}
                            </SwitchItem>
                        );
                    })}
                </Category>

                {tooltips.map(item => {
                    if (
                        this.props.getSetting(
                            `tooltip-toggled-${this.toSnake(item.name)}`,
                            item.default
                        ) &&
                        item.options?.length > 0
                    ) {
                        return (
                            <Category
                                name={item.name}
                                opened={
                                    this.state.opened[this.toSnake(item.name)]
                                }
                                description='Additional Options'
                                onChange={() =>
                                    this.setState({
                                        ...this.state.opened,
                                        opened: {
                                            [this.toSnake(item.name)]: !this
                                                .state.opened[
                                                this.toSnake(item.name)
                                            ]
                                        }
                                    })
                                }>
                                {item.options?.map(option => (
                                    <SwitchItem
                                        value={this.props.getSetting(
                                            option.id,
                                            option.default
                                        )}
                                        onChange={() => {
                                            this.props.toggleSetting(
                                                option.id,
                                                option.default
                                            );
                                        }}
                                        note={option.note}>
                                        {option.name}
                                    </SwitchItem>
                                ))}
                            </Category>
                        );
                    }
                })}
            </div>
        );
    }
};
