import _ from 'lodash';

export default function comments(state = { items: [], hashMap: {} }, action) {
  switch(action.type) {
    case 'FETCH_COMMENTS': {
      const fetchedItems = [];
      const hashMap = {};
      for (const comment of action.comments) {
        fetchedItems.push(comment.id);
        hashMap[comment.id] = comment;
      }
      const items = _.uniq([...state.items, ...fetchedItems]);
      return _.merge({}, state, {
        items,
        hashMap
      });
    }
    case 'FETCH_COMMENT': {
      const items = _.uniq([...state.items, action.comment.id]);
      const hashMap = _.merge({}, state.hashMap, {
        [`${action.comment.id}`]: action.comment
      });

      return _.merge({}, state, {
        items,
        hashMap
      });
    }
    default:
      return state;
  }
}
