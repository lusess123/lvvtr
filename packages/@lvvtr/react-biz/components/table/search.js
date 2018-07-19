
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import styles from './search.scss';

class Search extends Component {
    constructor(props) {
        super(props);
        // binding this
        [
          "handleOnChange",
          "compositionStart",
          "compositionEnd"
        ].forEach(fn => this[fn] = this[fn].bind(this));
        this.state = {
            value: '',
            isChinese: false
        }
    }
    componentWillReceiveProps(nextProps) {
        // let value = this.props.value || '';
        // if(value != nextProps.value){
        //     this.setState({value: nextProps.value});
        // }
    }
    componentDidMount() {
        let value = this.props.value || '';
        if(value){
            this.setState({value: value});
            let searchInput = this.refs.searchInput;
            searchInput.style.background = 'none';
        }
    }

    handleOnChange(){

        let handleOnChange = this.props.handleOnChange;
        let searchInput = this.refs.searchInput;
        let value = searchInput.value;
        this.setState({
            value
        });
        if(searchInput && value){
            searchInput.style.background = 'none';
        }else {
            searchInput.style.background =  'url(' + require('./img/search.png')+ ')  no-repeat 7px 7px';
            searchInput.style.backgroundSize =  '12px 12px';
        }
        if (this.state.isChinese) {
            return
        }
        handleOnChange(value);
    }

    compositionStart() {
        this.setState({
            isChinese: true
        })
    }

    compositionEnd() {
        let handleOnChange = this.props.handleOnChange;
        let searchInput = this.refs.searchInput;
        let value = searchInput.value;

        this.setState({
            isChinese: false
        })
        handleOnChange(value);
    }


    render() {
        return (
            <div className={styles.contentWrap}>
                <span className={styles.leftSpan}>搜索</span>
                <input ref='searchInput' type='text' onCompositionStart={this.compositionStart} onCompositionEnd={this.compositionEnd} onChange={this.handleOnChange} value={this.state.value}/>
            </div>
        )
    }
}

module.exports = Search;
