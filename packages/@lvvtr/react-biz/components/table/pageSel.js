
import React, {Component} from 'react';
import SoSelect from '../soSelect';
import RcSelect, { Option, OptGroup }from 'so-select'; 
import styles from './pageSel.scss';
class PageNumberSel extends Component {
    constructor(props) {
        super(props);
        this.options = [5, 10, 15, 20, 50, 100];
        // binding this
        [
          "onItemSelect"
        ].forEach(fn => this[fn] = this[fn].bind(this));
        this.state = {
            value: 5
        }
    }
    onItemSelect(selectedValue){
        let handleSelect = this.props.handleSelect;
        //let selectedValue = this.refs.selNumber.value;
        this.setState({
            value: selectedValue
        });
        handleSelect(selectedValue);
    }
    getOptions(options) {
        return options.map((item, index)=> {
            return <Option value={item} key={index}>{item}</Option>
        });
    }
    componentWillReceiveProps(nextProps) {
        let {value} = this.state;
        if(nextProps.pageSize && value != nextProps.pageSize){
            this.setState({
                value: nextProps.pageSize
            });
        }

    }
    componentDidMount() {
        let pageSize = this.props.pageSize || 5;
        this.setState({
            value: pageSize
        });
    }
    render() { 
        let value = this.state.value;
        let {numLimit, numLarge} = this.props;
        let options = this.options;
        if(numLimit){
            options = [5, 10, 15, 20];
        }else if(numLarge){
            options = [5, 10, 15, 20, 50, 100, 500];
        }
        return (
            <div className={styles.contentWrap}>
                <span className={styles.leftSpan}>每页显示</span>
                {/*<input className={styles.inputStyle} type='number' value={value} ref='selNumber' min='1'  onChange={this.onItemSelect}/>*/}
                <div className={styles.selectWrap}>
                    <SoSelect value={value} style={{width: numLimit ? 50 : 54}}
                        showSearch={false}
                        dropdownMenuStyle={{maxHeight: 200, overflow: 'auto'}}
                        onSelect={this.onItemSelect}
                        >
                        {this.getOptions(options)}
                    </SoSelect>
                </div>
                
            </div>
        )
    }
}
module.exports = PageNumberSel;
