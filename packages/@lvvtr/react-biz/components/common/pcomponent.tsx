"use catch";
import React, {
    Component
} from 'react';

/**
 *防腐层，隔离官方实现
 *对于底层基础组件的生命周期函数进行重新封装
 *目的: 官方基础组件有做变更的时候能够更好的适配
 * @export
 * @class PComponent
 * @extends {Component}
 */
export default class PComponent extends Component {
    constructor(props) {
        super(props);
    }

    bindFns(...funs) {
        funs && funs.length &&
            funs.forEach(
                fn => {
                    if (typeof(fn) == "string") {
                        this[fn] = this[fn].bind(this)
                    }
                    if (fn instanceof Array) {
                        this.bindFns(...fn);
                    }

                }
            );
    }

    pComponentWillUpdate(nextProps, nextState, nextContext) {

    }
    componentWillUpdate(nextProps, nextState, nextContext) {
        this.pComponentWillUpdate(nextProps, nextState, nextContext);
    }


    pComponentDidUpdate(prevProps, prevState, prevContext) {

    }
    componentDidUpdate(prevProps, prevState, prevContext) {
        this.pComponentDidUpdate(prevProps, prevState, prevContext);
    }


    pShouldComponentUpdate(nextProps, nextState, nextContext) {
        return true;
    }
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return this.pShouldComponentUpdate(nextProps, nextState, nextContext);
    }


    pComponentWillMount() {

    }
    componentWillMount() {
        this.pComponentWillMount();
    }

    pComponentDidMount() {

    }

    componentDidMount() {
        this.pComponentDidMount();
    }
    componentWillReceiveProps(nextProps, nextContext) {
        this.pComponentWillReceiveProps(nextProps, nextContext);
    }
    pComponentWillReceiveProps(nextProps, nextContext) {

    }

    pRender() {
         return <noscript/>;
    }
    render() {
        return this.pRender();
    }

}