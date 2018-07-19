
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import ReactDOM from 'react-dom';
import styles from './tableSort.scss';
import classnames from 'classnames';
class TableSort extends Component {
    constructor(props) {
        super(props);
        [
            'sortClick'
        ].forEach(fn => this[fn] = this[fn].bind(this));
        this.sortType = 'Desc';
        this.state = {
            selItem: 'none'
        };
    }
    
    stopBubble(event){
        event.stopPropagation();
    }
    sortClick(event) {
        this.pageX = event.pageX;
        this.pageY = event.pageY;
        let sortClick = this.props.sortClick;
        let colIndex = this.props.colIndex;
        if(this.sortType == 'Desc'){
            this.sortType = 'Asc';
            this.setState({
                selItem: 'up'
            });
        }else {
            this.sortType = 'Desc';
            this.setState({
                selItem: 'down'
            });
        }
        if(sortClick){
            sortClick(this.sortType, colIndex); 
        }
    }
    componentDidMount() {
        window.addEventListener('click', (event)=>{
            if(!this.pageX){return;}
            if(!(event.pageX == this.pageX && event.pageY == this.pageY) && event.target && event.target.className.indexOf('tableSort') > -1) {
                this.setState({
                    selItem: 'none'
                });
            }
        })
    }
    render() { 
        let {selItem} = this.state;
        let upClassname = classnames({
            [styles.up]: true,
            [styles.upSel]: selItem == 'up' ? true : false
        });
        let downClassname = classnames({
            [styles.down]: true,
            [styles.downSel]: selItem == 'down' ? true : false
        });

        return (
            <div className={styles.contentWrap} onClick={this.sortClick.bind(this)}>
                <span className={upClassname}></span>
                <span className={downClassname}></span>
            </div>
        )
    }
}
module.exports = TableSort;