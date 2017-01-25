import * as types from '../utils/constants';
import * as api from '../utils/api';
import _ from 'lodash';

/* eslint-disable no-console */

// TODO: Use args to fetch near comments, because right now we are fetching
// all the comments in the DB.
export function fetchNearComments() {
  return (dispatch, getState) => {
    fetch(api.NEAR_COMMENTS(), api.headerToken(getState()))
      .then(res => res.json())
      .then(comments => dispatch({
        type: types.FETCH_COMMENTS,
        comments
      }))
      .catch(err => console.error(err));
  };
}

export function fetchCommentById(commentId) {
  return (dispatch, getState) => {
    fetch(api.COMMENTS_$ID(commentId), api.headerToken(getState()))
      .then(res => res.json())
      .then(comment => dispatch({
        type: types.FETCH_COMMENT,
        comment
      }))
      .catch(err => console.error(err));
  };
}

export function addComment(comment = {}) {
  return (dispatch, getState) => {
    const queryParams = _.merge({}, api.headerToken(getState()), {
      method: "POST",
      body: JSON.stringify(comment),
      headers: {
        "Content-Type": "application/json"
      }
    });

    fetch(api.NEAR_COMMENTS(), queryParams)
    .then(() => {
      fetch(api.COMMENTS_$ID(comment.id))
        .then(res => res.json())
        .then(comment => dispatch({
          type: types.FETCH_COMMENT,
          comment
        }))
        .catch(err => console.error(err));
    })
    .catch(err => console.error(err));
  };
}

/*
  TODO: Note: All this logic should be in server side and doesn't make sense
  in a production app. We have to do this to compile with JSON-SERVER but
  it should be done another way with a real API server.
*/
export function likeComment(commentToUpdate) {
  return (dispatch, getState) => {
    const comment = _.merge({}, commentToUpdate, {
      liked: !commentToUpdate.liked
    });

    const queryParams = _.merge({}, api.headerToken(getState()), {
      method: "PUT",
      body: JSON.stringify(comment),
      headers: {
        "Content-Type": "application/json"
      }
    });

    dispatch({
      type: types.FETCH_COMMENT,
      comment
    });

    fetch(api.COMMENTS_$ID(comment.id), queryParams)
      .then(res => res.json())
      .then(comment => dispatch({
        type: types.FETCH_COMMENT,
        comment
      }))
      .catch(err => console.error(err));
  };
}

/*
  TODO: Note: All this logic should be in server side and doesn't make sense
  in a production app. We have to do this to compile with JSON-SERVER but
  it should be done another way with a real API server.
*/
export function likeReply(replyToUpdate) {
  return (dispatch, getState) => {
    const reply = _.merge({}, replyToUpdate, {
      liked: !replyToUpdate.liked
    });

    const queryParams = _.merge({}, api.headerToken(getState()), {
      method: "PUT",
      body: JSON.stringify(reply),
      headers: {
        "Content-Type": "application/json"
      }
    });

    fetch(api.REPLIES_$ID(reply.id), queryParams)
      .then(() => {
        fetch(api.COMMENTS_$ID(reply.commentId))
          .then(res => res.json())
          .then(comment => dispatch({
            type: types.FETCH_COMMENT,
            comment
          }))
          .catch(err => console.error(err));
      })
      .catch(err => console.error(err));
  };
}

/*
  TODO: Note: All this logic should be in server side and doesn't make sense
  in a production app. We have to do this to compile with JSON-SERVER but
  it should be done another way with a real API server.
*/
export function addReply(reply) {
  return (dispatch, getState) => {
    const queryParams = _.merge({}, api.headerToken(getState()), {
      method: "POST",
      body: JSON.stringify(reply),
      headers: {
        "Content-Type": "application/json"
      }
    });

    fetch(api.REPLIES(), queryParams)
      .then(() => {
        fetch(api.COMMENTS_$ID(reply.commentId))
          .then(res => res.json())
          .then(comment => dispatch({
            type: types.FETCH_COMMENT,
            comment
          }))
          .catch(err => console.error(err));
      })
      .catch(err => console.error(err));
  };
}

export function toggleAddCommentModalVisibility() {
  return {
    type: types.TOGGLE_ADD_COMMENT_MODAL_VISIBILITY
  };
}

export function deleteComment(comment) {
  return {
    type: types.DELETE_COMMENT,
    comment
  };
}
