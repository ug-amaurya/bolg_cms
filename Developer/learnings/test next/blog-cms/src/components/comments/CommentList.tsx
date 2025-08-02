import React from "react";

const CommentList = ({ comments, postId }: { comments: any; postId: any }) => {
  if (!comments || comments.length === 0) {
    return <p>No comments yet.</p>;
  }

  return (
    <div className="comment-list">
      {comments.map((comment: any) => (
        <div key={comment.id} className="comment">
          <div className="comment-header">
            <span className="author">
              {comment.author?.name || "Anonymous"}
            </span>
            <span className="date">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="comment-content">{comment.content}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
