import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const PostCard = ({ post, author = "Nexus Academy" }) => {
  const navigate = useNavigate();

  return (
<Card
    hover
    className="cursor-pointer"
    onClick={() => navigate(`/insight/${post.slug}`)}>
    <div className="overflow-hidden">
        {/* Thumbnail */}
        <div className="aspect-video bg-navy-light rounded-t-xl overflow-hidden">
            {post.thumbnail_url ? <img
                src={post.thumbnail_url}
                alt={post.title}
                className="w-full h-full object-cover" /> : <div
                className="w-full h-full flex items-center justify-center bg-gradient-to-br from-navy-light to-navy-card">
                <ApperIcon name="FileText" size={48} className="text-gray-500" />
            </div>}
        </div>
        <div className="p-6">
            {/* Title */}
            <h3 className="text-xl font-semibold text-white mb-3 line-clamp-2">
                {post.title}
            </h3>
            {/* Summary - exactly 160 characters */}
            <p className="text-gray-300 mb-4 line-clamp-3">
                {(post.summary || post.content || "").substring(0, 160)}
                {(post.summary || post.content || "").length > 160 ? "..." : ""}
                {post.content.substring(0, 180)}...
                        </p>
            <div className="flex items-center justify-between">
                {/* Author and Date */}
                <div className="flex items-center space-x-4">
                    <div
                        className="w-8 h-8 bg-electric rounded-full flex items-center justify-center">
                        <ApperIcon name="User" size={16} className="text-white" />
                    </div>
                    <div>
                        <div className="text-sm font-medium text-white">
{post.author_id?.Name || author}
                        </div>
                        <div className="text-xs text-gray-400">
                            {format(new Date(post.created_at), "yyyy년 MM월 dd일")}
                        </div>
                    </div>
                </div>
                <div className="flex items-center text-sm text-gray-400">
                    <span>더 보기</span>
                    <ApperIcon name="ArrowRight" size={16} className="ml-1" />
                </div>
            </div>
        </div>
    </div></Card>
  );
};

export default PostCard;