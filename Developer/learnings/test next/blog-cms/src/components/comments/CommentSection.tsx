"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import CommentForm from "@/components/comments/CommentForm";
import CommentList from "@/components/comments/CommentList";
import { MessageSquare } from "lucide-react";

interface CommentSectionProps {
  postId: string;
  comments: any[];
}

export default function CommentSection({
  postId,
  comments: initialComments,
}: CommentSectionProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState(initialComments);

  const handleCommentAdded = (newComment: any) => {
    setComments((prev) => [newComment, ...prev]);
  };

  return (
    <div className="border-t border-gray-200 pt-8">
      <div className="flex items-center mb-6">
        <MessageSquare className="w-5 h-5 mr-2" />
        <h2 className="text-2xl font-bold">Comments ({comments.length})</h2>
      </div>

      {session ? (
        <CommentForm postId={postId} onCommentAdded={handleCommentAdded} />
      ) : (
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <p className="text-gray-600">Please sign in to leave a comment.</p>
        </div>
      )}

      <CommentList comments={comments} postId={postId} />
    </div>
  );
}
