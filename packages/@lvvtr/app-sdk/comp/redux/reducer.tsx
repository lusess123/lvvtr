import Immutable from 'immutable';
import { combineReducers, createStore } from "redux";
import * as _ from "lodash";

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

function createReducer(initialState, handlers) {
    return function reducer(state = initialState, action) {
        if (handlers.hasOwnProperty(action.type)) {
            return handlers[action.type](state, action)
        } else {
            return state
        }
    }
}

const _pos = [
    { X: 50, Y: 50 },
    { X: 60, Y: 100 },
    { X: 70, Y: 70 },
    { X: 80, Y: 80 },
    { X: 90, Y: 90 },
    { X: 160, Y: 100 },
    { X: 150, Y: 150 },
    { X: 260, Y: 300 }
];

export const posReducer = createReducer(Immutable.fromJS(_pos), {
    "add": (state, action) => {
        // alert("pos");
        const _pos = state.map(a => {
            const _a = a.update('X', x => x + 1);
            return _a.update("Y", y => y + 1);
        });
        return _pos;
    },
    "sub": (state, action) => {
        // alert("pos");
        const _pos = state.map(a => {
            const _a = a.update('X', x => x - 1);
            return _a.update("Y", y => y - 1);
        });
        return _pos;
    },
    "set": (state, action) => {
        //debugger;
        return state.update(action.data.id, a => {
            const _a = a.update('X', x => action.data.X);
            return _a.update("Y", y => action.data.Y);
        });

    }
});


export const midReducer = createReducer({ X: 0, Y: 0, XY: {} }, {
    "add": (state, action) => {
        // alert("mid");
        return state;
    }
})

const _midfun = (state, action) => {
    debugger;
    const _pos = state.pos.toJS();
    const xy = getXY(_pos);
    const mid = {
        X: (_pos[xy.beginX].X + _pos[xy.endX].X) / 2,
        Y: (_pos[xy.beginY].Y + _pos[xy.endY].Y) / 2,
        XY: {
            beginX: _pos[xy.beginX].X,
            endX: _pos[xy.endX].X,
            beginY: _pos[xy.beginY].Y,
            endY: _pos[xy.endY].Y,
        }
    }
    console.log(xy);
    // state.mid = mid ;

    return { ...state, mid };
}

export const midAddReducer = createReducer({}, {
    "add": _midfun,
    "sub": _midfun,
    "set": _midfun
})