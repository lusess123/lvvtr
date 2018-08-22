import React, { PureComponent } from 'react'
import { Provider, connect } from 'react-redux'
import { createStore, combineReducers } from 'redux'
import EditorDetail from './editordetail'
import * as _ from "lodash";
import Immutable from 'immutable';
import reduceReducers from 'reduce-reducers'

const _start = {
    counter: 5,
    index: 0,
    past: [],
    future: [],
    mid: {
        X: 0, Y: 0,xy:{}
    },
    pos: Immutable.fromJS([
        { X: 50, Y: 50 },
        { X: 60, Y: 100 },
        { X: 70, Y: 70 },
        { X: 80, Y: 80 },
        { X: 90, Y: 90 },
        { X: 160, Y: 100 },
        { X: 150, Y: 150 },
        { X: 260, Y: 300 }
    ])
};

let ListState = [_start];




const getXY = (list) => {
    const _list = list.map((l, index) => {
        return {
            X: l.X,
            Y: l.Y,
            id: index
        }
    });
    const _res1 = _.sortBy(_list, function (o) { return o.X; });
    const _res2 = _.sortBy(_list, function (o) { return o.Y; });
    return {
        beginX: _res1[0].id,
        endX: _res1[_res1.length - 1].id,
        beginY: _res2[0].id,
        endY: _res2[_res2.length - 1].id,

    }

}

const clone = (obj) => {
    //return JSON.parse(JSON.stringify(obj));
    return _.cloneDeep(obj);
}




const Reduce1 = (state = _start, action) => {
    // debugger;
    switch (action.type) {
        case "add":

           // debugger;
            const _pos = state.pos.map(a => {
                const _a = a.update('X', x => x + 1);
                return _a.update("Y", y => y + 1);
            });
            return {
                ...state,
                pos: _pos
            };

        case "sub":
            return {
                ...state,
                ...{
                    counter: (state.counter - 1),
                    pos: state.pos.map(node => {
                        return {
                            X: (node.X - 1),
                            Y: (node.Y - 1)

                        }
                    })
                }
            }

        case "set":
            // debugger;
            const _state = JSON.parse(JSON.stringify(state));
            _state.pos[action.data.id] = {
                X: action.data.X,
                Y: action.data.Y
            };


            const xy = getXY(_state.pos);
            const mid = {
                X: (_state.pos[xy.beginX].X + _state.pos[xy.endX].X) / 2,
                Y: (_state.pos[xy.beginY].Y + _state.pos[xy.endY].Y) / 2,
            }

            console.log(mid);
            _state.mid = mid;


            _state.index = ListState.length;
            ListState.push(_state);
            return _state;

        case "pre":
            // debugger;
            const _index = state.index;
            if (_index) {
                ListState[_index - 1].index = (_index - 1);
                return ListState[_index - 1];
            }
            else return state;
        case "next":
            const _index1 = state.index;
            if (_index1 <= ListState.length - 1) {
                ListState[_index1 + 1].index = (_index1 + 1);
                return ListState[_index1 + 1];
            }
            else return state;

        default:
            return state;
    }
    return state;
}


import * as  reducers from './redux/reducer'
const appReducer2 = combineReducers({
    mid: reducers.midReducer,
    pos:reducers.posReducer
});


const appReducer1 = (state = _start, action) => {
      //debugger;
      const _state = appReducer2(state,action);
      
     //const pos = reducers.posReducer(state.pos,action);

     return  _state;
}

const appReducer3 = reduceReducers(appReducer2,reducers.midAddReducer);


const store = createStore(appReducer3, window["__REDUX_DEVTOOLS_EXTENSION__"] && window["__REDUX_DEVTOOLS_EXTENSION__"]())
const EditorDetailReact = connect((state,props) => {
    return {
        pos: state.pos,
        mid: state.mid,
        counter:props.counter
    }
}, (dispatch) => {

    return {
        setPos(data) {
            dispatch({
                type: "set",
                data
            });
        },
        pre() {
            dispatch({
                type: "pre"
            });
        },
        next() {
            dispatch({
                type: "next"
            });
        }
    }

})(EditorDetail);
export default class ReduxDemo extends React.Component<any, any>{
    render() {
        return <Provider store={store}>
            <div>
                <div>
                    <h1><p>{store.getState().counter}</p></h1>
                    <div>
                        <h2>
                            <button onClick={
                                () => {
                                    store.dispatch({ type: 'add' })
                                }}>新增</button>
                            &nbsp;&nbsp;&nbsp;
                        <button onClick={
                                () => {
                                    store.dispatch({ type: 'sub' })
                                }
                            }>减少</button>
                        </h2>
                        <h2>
                            <button onClick={
                                () => {
                                    store.dispatch({ type: 'pre' })
                                }}>pre</button>
                            &nbsp;&nbsp;&nbsp;
                        <button onClick={
                                () => {
                                    store.dispatch({ type: 'next' })
                                }
                            }>next</button>
                        </h2>
                    </div>

                </div>
                <EditorDetailReact counter={100}></EditorDetailReact>

            </div>
        </Provider>

    }

    componentDidMount() {
        store.subscribe(() => {
            this.forceUpdate();
        });
    }
}



